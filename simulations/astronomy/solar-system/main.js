(() => {
  'use strict';

  const DATA = [
    {id:'mercury',name:'Sao Thủy',type:'Hành tinh đất đá',diameter:4878.8,mass:0.330103,au:0.387098,orbit:87.969,rotation:58.6462,tilt:0.034,color:0x9a9995},
    {id:'venus',name:'Sao Kim',type:'Hành tinh đất đá',diameter:12103.6,mass:4.86731,au:0.723332,orbit:224.701,rotation:-243.018,tilt:177.36,color:0xd3a96f},
    {id:'earth',name:'Trái Đất',type:'Hành tinh đất đá',diameter:12742.0168,mass:5.97217,au:1.0000174,orbit:365.25636,rotation:0.99726968,tilt:23.44,color:0x4f9db3},
    {id:'mars',name:'Sao Hỏa',type:'Hành tinh đất đá',diameter:6779,mass:0.641691,au:1.523679,orbit:686.98,rotation:1.02595676,tilt:25.19,color:0xb96c51},
    {id:'jupiter',name:'Sao Mộc',type:'Hành tinh khí khổng lồ',diameter:139822,mass:1898.125,au:5.2028,orbit:4332.820129,rotation:0.41354,tilt:3.13,color:0xc79d78},
    {id:'saturn',name:'Sao Thổ',type:'Hành tinh khí khổng lồ',diameter:116464,mass:568.317,au:9.5388,orbit:10755.698645,rotation:0.44401,tilt:26.73,color:0xc8b58c},
    {id:'uranus',name:'Sao Thiên Vương',type:'Hành tinh băng khổng lồ',diameter:50724,mass:86.8099,au:19.191,orbit:30687.15,rotation:-0.71833,tilt:97.77,color:0x86c6c9},
    {id:'neptune',name:'Sao Hải Vương',type:'Hành tinh băng khổng lồ',diameter:49244,mass:102.4092,au:30.07,orbit:60190,rotation:0.67125,tilt:28.32,color:0x5578c8}
  ];

  const el = id => document.getElementById(id);
  const canvas = el('solarCanvas');
  const stage = el('solarStage');
  const loading = el('solarLoading');
  const play = el('solarPlay');
  const reset = el('solarReset');
  const speed = el('solarSpeed');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let renderer, scene, camera, observer, frame = 0, lastFrame = 0, disposed = false;
  let running = !reducedMotion.matches, selected = 'earth', simulatedDays = 0;
  const bodies = new Map();
  const orbits = new Map();
  const listeners = [];

  const listen = (target, event, handler, options) => {
    if (!target) return;
    target.addEventListener(event, handler, options);
    listeners.push([target,event,handler,options]);
  };

  const format = (n, digits=3) => n.toLocaleString('vi-VN',{maximumFractionDigits:digits});
  const periodText = days => {
    const abs = Math.abs(days);
    if (abs >= 365.25) return format(abs / 365.25,3) + ' năm (' + format(abs,2) + ' ngày)';
    if (abs >= 1) return format(abs,3) + ' ngày';
    const total = Math.round(abs * 24 * 3600);
    const hours = Math.floor(total / 3600), minutes = Math.floor(total % 3600 / 60), seconds = total % 60;
    return hours + ' giờ ' + minutes + ' phút ' + seconds + ' giây';
  };

  function updateDetails(id) {
    const body = DATA.find(item => item.id === id);
    if (!body) return;
    selected = id;
    document.querySelectorAll('[data-body]').forEach(button => {
      const active = button.dataset.body === id;
      button.classList.toggle('is-selected', active);
      button.setAttribute('aria-pressed', String(active));
    });
    el('solarSelectedName').textContent = body.name;
    el('solarSelectedType').textContent = body.type;
    el('solarDiameter').textContent = format(body.diameter,1) + ' km';
    el('solarMass').textContent = format(body.mass,6) + ' × 10²⁴ kg';
    el('solarDistance').textContent = format(body.au,4) + ' AU';
    el('solarYear').textContent = format(body.orbit,3) + ' ngày';
    el('solarDay').textContent = periodText(body.rotation);
    el('solarTilt').textContent = format(body.tilt,2) + '°';
    el('solarDirection').textContent = body.rotation < 0 ? 'Tự quay nghịch hành theo quy ước dấu của dữ liệu NASA/JPL.' : 'Tự quay thuận hành theo quy ước dấu của dữ liệu NASA/JPL.';
    orbits.forEach((line,key) => {
      const active = key === id;
      line.material.opacity = active ? 0.9 : 0.25;
      line.material.color.set(active ? 0x83d8c6 : 0x81928e);
    });
    requestRender();
  }

  function setRunning(value) {
    running = Boolean(value) && !disposed;
    play.textContent = running ? 'Tạm dừng' : 'Tiếp tục';
    play.setAttribute('aria-pressed',String(running));
    lastFrame = 0;
    if (running) requestRender();
    else renderOnce();
  }

  function requestRender() {
    if (!disposed && !document.hidden && !frame && renderer) frame = requestAnimationFrame(animate);
  }

  function renderOnce() {
    if (!disposed && renderer && scene && camera) renderer.render(scene,camera);
  }

  function animate(now) {
    frame = 0;
    if (disposed || !renderer) return;
    const delta = lastFrame ? Math.min((now-lastFrame)/1000,0.05) : 0;
    lastFrame = now;
    if (running) {
      const multiplier = Number(speed.value || 1);
      simulatedDays += delta * multiplier * 365.25 / 120;
      DATA.forEach(body => {
        const object = bodies.get(body.id);
        if (!object) return;
        const radius = 1.15 + Math.sqrt(body.au) * 1.22;
        const phase = DATA.findIndex(item => item.id === body.id) * 0.73;
        const angle = phase + simulatedDays / body.orbit * Math.PI * 2;
        object.position.set(Math.cos(angle)*radius,0,Math.sin(angle)*radius);
      });
      el('solarTime').textContent = 'Ngày ' + format(simulatedDays,1);
    }
    renderer.render(scene,camera);
    if (running) requestRender();
  }

  function createScene() {
    if (!window.THREE) throw new Error('Thư viện 3D chưa sẵn sàng.');
    const T = window.THREE;
    scene = new T.Scene();
    scene.background = new T.Color(0x101b20);
    camera = new T.PerspectiveCamera(42,1,0.1,100);
    camera.position.set(0,13,20);
    camera.lookAt(0,0,0);
    renderer = new T.WebGLRenderer({canvas,antialias:window.devicePixelRatio<=1.5,alpha:false,powerPreference:'low-power'});
    renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.5));
    renderer.setSize(Math.max(1,stage.clientWidth),Math.max(1,stage.clientHeight),false);
    if (T.sRGBEncoding) renderer.outputEncoding = T.sRGBEncoding;
    scene.add(new T.AmbientLight(0xffffff,0.72));
    const light = new T.PointLight(0xffdf9d,2.2,0,2);
    light.position.set(0,0,0);
    scene.add(light);

    const sun = new T.Mesh(new T.SphereGeometry(0.42,32,24),new T.MeshBasicMaterial({color:0xf3c66f}));
    scene.add(sun);

    DATA.forEach(body => {
      const orbitRadius = 1.15 + Math.sqrt(body.au) * 1.22;
      const orbitPoints = [];
      for (let i=0;i<192;i++) {
        const a = i/192*Math.PI*2;
        orbitPoints.push(new T.Vector3(Math.cos(a)*orbitRadius,0,Math.sin(a)*orbitRadius));
      }
      const orbit = new T.LineLoop(new T.BufferGeometry().setFromPoints(orbitPoints),new T.LineBasicMaterial({color:0x81928e,transparent:true,opacity:body.id==='earth'?0.9:0.25}));
      scene.add(orbit);
      orbits.set(body.id,orbit);

      const radius = 0.045 * Math.sqrt(body.diameter / 12742.0168);
      const planet = new T.Mesh(new T.SphereGeometry(radius,32,24),new T.MeshStandardMaterial({color:body.color,roughness:0.88,metalness:0.02}));
      const phase = DATA.findIndex(item => item.id === body.id)*0.73;
      planet.position.set(Math.cos(phase)*orbitRadius,0,Math.sin(phase)*orbitRadius);
      scene.add(planet);
      bodies.set(body.id,planet);

      if (body.id === 'saturn') {
        const ring = new T.Mesh(new T.RingGeometry(radius*1.35,radius*2.15,64),new T.MeshBasicMaterial({color:0xc4b38f,side:T.DoubleSide,transparent:true,opacity:0.68}));
        ring.rotation.x = -Math.PI/2;
        planet.add(ring);
      }
    });

    observer = window.ResizeObserver ? new ResizeObserver(resize) : null;
    if (observer) observer.observe(stage);
    else listen(window,'resize',resize,{passive:true});
    resize();
    loading.hidden = true;
    updateDetails(selected);
    setRunning(running);
  }

  function resize() {
    if (!renderer || !camera || disposed) return;
    const width = Math.max(1,stage.clientWidth), height = Math.max(1,stage.clientHeight);
    renderer.setSize(width,height,false);
    camera.aspect = width/height;
    camera.updateProjectionMatrix();
    requestRender();
  }

  function cleanup() {
    if (disposed) return;
    disposed = true;
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    observer?.disconnect();
    observer = null;
    listeners.forEach(([target,event,handler,options])=>target.removeEventListener(event,handler,options));
    listeners.length = 0;
    if (scene) {
      scene.traverse(object => {
        object.geometry?.dispose?.();
        if (object.material) {
          const mats = Array.isArray(object.material) ? object.material : [object.material];
          mats.forEach(material => material.dispose?.());
        }
      });
      scene.clear();
      scene = null;
    }
    renderer?.dispose?.();
    renderer?.forceContextLoss?.();
    renderer = null;
  }

  function fail(message) {
    cleanup();
    canvas.hidden = true;
    el('solarFallback').hidden = false;
    loading.hidden = false;
    loading.classList.add('is-error');
    loading.textContent = message + ' Danh sách và thông số hành tinh vẫn có thể sử dụng.';
    play.disabled = true;
    speed.disabled = true;
  }

  listen(canvas,'webglcontextlost',event=>{event.preventDefault();fail('WebGL đã bị gián đoạn.');});
  listen(play,'click',()=>setRunning(!running));
  listen(reset,'click',()=>{
    simulatedDays=0;
    el('solarTime').textContent='Ngày 0';
    speed.value='1';
    el('solarSpeedValue').textContent='1×';
    DATA.forEach(body=>{
      const object=bodies.get(body.id);
      if(!object)return;
      const phase=DATA.findIndex(item=>item.id===body.id)*0.73;
      const radius=1.15+Math.sqrt(body.au)*1.22;
      object.position.set(Math.cos(phase)*radius,0,Math.sin(phase)*radius);
    });
    requestRender();
  });
  listen(speed,'input',()=>{el('solarSpeedValue').textContent=Number(speed.value).toLocaleString('vi-VN')+'×';});
  listen(el('solarBodyList'),'click',event=>{
    const button=event.target.closest('[data-body]');
    if(button) updateDetails(button.dataset.body);
  });
  listen(document,'visibilitychange',()=>{
    if(document.hidden){if(frame)cancelAnimationFrame(frame);frame=0;lastFrame=0;}
    else if(running)requestRender();else renderOnce();
  });
  listen(window,'pagehide',cleanup,{once:true});
  listen(reducedMotion,'change',event=>{if(event.matches)setRunning(false);});

  if (reducedMotion.matches) setRunning(false);
  (window.SCIAVERSE_THREE_READY || Promise.reject(new Error('Thiếu bộ nạp thư viện 3D.')))
    .then(() => {
      if (!disposed) createScene();
    })
    .catch(error => {
      if (!disposed) fail(error.message || 'Không thể khởi tạo mô hình.');
    });
})();