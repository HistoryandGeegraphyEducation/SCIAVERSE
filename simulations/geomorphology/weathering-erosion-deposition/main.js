(() => {
  'use strict';

  const stage = document.getElementById('surfaceStage');
  if (!stage) return;

  const status = document.getElementById('surfaceStatus');
  const choice = document.getElementById('surfaceProcessChoice');
  const resultTitle = document.getElementById('surfaceResultTitle');
  const resultText = document.getElementById('surfaceResultText');

  const PROCESSES = {
    weathering: {
      title: 'Phong hóa cơ học',
      text: 'Đá bị nứt vỡ tại chỗ do tác động vật lí. Các mảnh vụn vẫn ở gần nơi đá mẹ hình thành.'
    },
    erosion: {
      title: 'Xâm thực do dòng chảy',
      text: 'Dòng nước tách và vận chuyển vật liệu đã bị phong hóa xuống sườn dốc và theo lòng dẫn.'
    },
    deposition: {
      title: 'Bồi tụ trầm tích',
      text: 'Khi dòng vận chuyển giảm năng lượng, vật liệu có thể lắng đọng và tích tụ. Ở cửa sông, trầm tích có thể góp phần hình thành châu thổ.'
    }
  };

  let THREE;
  let renderer;
  let scene;
  let camera;
  let controls;
  let processGroups = {};
  let resizeObserver;
  let destroyed = false;
  let activeProcess = 'weathering';
  const listeners = [];

  function setStatus(message, state = 'info') {
    status.textContent = message;
    status.dataset.state = state;
  }

  function listen(target, eventName, handler, options) {
    target.addEventListener(eventName, handler, options);
    listeners.push([target, eventName, handler, options]);
  }

  function terrainHeight(x, z) {
    const mountain = 1.75 * Math.exp(-Math.pow((x + 2.25) / 1.12, 2));
    const ridge = 0.18 * Math.exp(-Math.pow((x + 0.65) / 0.8, 2));
    const undulation = 0.06 * Math.sin(z * 2.2) * Math.exp(-Math.pow((x + 0.1) / 3.4, 2));
    return mountain + ridge + undulation - 0.42;
  }

  function makeTerrain() {
    const geometry = new THREE.PlaneGeometry(6.8, 4.2, 72, 44);
    geometry.rotateX(-Math.PI / 2);
    const positions = geometry.attributes.position;
    const colors = [];
    const low = new THREE.Color(0x526d55);
    const high = new THREE.Color(0x8c765d);
    for (let i = 0; i < positions.count; i += 1) {
      const x = positions.getX(i);
      const z = positions.getZ(i);
      const y = terrainHeight(x, z);
      positions.setY(i, y);
      const t = THREE.MathUtils.clamp((y + 0.42) / 1.75, 0, 1);
      const color = low.clone().lerp(high, t);
      colors.push(color.r, color.g, color.b);
    }
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    geometry.computeVertexNormals();
    return new THREE.Mesh(
      geometry,
      new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 1, side: THREE.DoubleSide })
    );
  }

  function addRock(group, x, z, scale, color = 0x8d8172) {
    const rock = new THREE.Mesh(
      new THREE.DodecahedronGeometry(scale, 0),
      new THREE.MeshStandardMaterial({ color, roughness: 1 })
    );
    rock.position.set(x, terrainHeight(x, z) + scale * 0.58, z);
    rock.rotation.set(0.22, x * 0.7, 0.18);
    group.add(rock);
    return rock;
  }

  function addRiver(group) {
    const points = [
      new THREE.Vector3(-2.9, terrainHeight(-2.9, -0.25) + 0.07, -0.25),
      new THREE.Vector3(-2.1, terrainHeight(-2.1, -0.2) + 0.07, -0.2),
      new THREE.Vector3(-1.15, terrainHeight(-1.15, 0.12) + 0.06, 0.12),
      new THREE.Vector3(-0.1, terrainHeight(-0.1, -0.05) + 0.06, -0.05),
      new THREE.Vector3(1.15, terrainHeight(1.15, 0.22) + 0.05, 0.22),
      new THREE.Vector3(2.9, terrainHeight(2.9, 0.12) + 0.04, 0.12)
    ];
    const curve = new THREE.CatmullRomCurve3(points);
    const river = new THREE.Mesh(
      new THREE.TubeGeometry(curve, 100, 0.11, 10, false),
      new THREE.MeshStandardMaterial({ color: 0x3b91b0, roughness: 0.28, metalness: 0.04 })
    );
    group.add(river);
  }

  function addArrow(group, from, to, color = 0xe9c27c) {
    const origin = new THREE.Vector3(from[0], from[1], from[2]);
    const target = new THREE.Vector3(to[0], to[1], to[2]);
    const direction = target.clone().sub(origin).normalize();
    const length = origin.distanceTo(target);
    group.add(new THREE.ArrowHelper(direction, origin, length, color, 0.2, 0.12));
  }

  function buildSceneGroups() {
    const base = new THREE.Group();
    base.add(makeTerrain());
    addRiver(base);
    addRock(base, -2.35, -0.7, 0.62);
    addRock(base, -2.7, 0.55, 0.34, 0x7e766c);
    scene.add(base);

    processGroups.weathering = new THREE.Group();
    addRock(processGroups.weathering, -2.15, -0.75, 0.42);
    const crackMaterial = new THREE.LineBasicMaterial({ color: 0x262d31 });
    const crackPoints = [
      new THREE.Vector3(-2.28, terrainHeight(-2.28, -0.75) + 0.52, -0.75),
      new THREE.Vector3(-2.12, terrainHeight(-2.12, -0.75) + 0.34, -0.75),
      new THREE.Vector3(-2.05, terrainHeight(-2.05, -0.75) + 0.18, -0.75)
    ];
    processGroups.weathering.add(new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(crackPoints),
      crackMaterial
    ));
    [[-1.65,-0.72,0.14],[-1.85,-0.3,0.1],[-1.52,-1.0,0.09],[-1.95,0.1,0.08]].forEach(p=>{
      const fragment = new THREE.Mesh(
        new THREE.IcosahedronGeometry(p[2],0),
        new THREE.MeshStandardMaterial({color:0x9a8b79,roughness:1})
      );
      fragment.position.set(p[0],terrainHeight(p[0],p[1])+p[2]*0.6,p[1]);
      processGroups.weathering.add(fragment);
    });
    scene.add(processGroups.weathering);

    processGroups.erosion = new THREE.Group();
    [[-1.8,-0.18],[-1.1,0.12],[-0.45,-0.05],[0.3,0.18],[1.05,0.22]].forEach((p,i)=>{
      const particle = new THREE.Mesh(
        new THREE.SphereGeometry(0.055+(i%2)*0.025,10,8),
        new THREE.MeshStandardMaterial({color:0xb79a73,roughness:1})
      );
      particle.position.set(p[0],terrainHeight(p[0],p[1])+0.13,p[1]);
      processGroups.erosion.add(particle);
    });
    const flowZ=-0.8;
    const flowStartY=terrainHeight(-1.8,flowZ)+0.22;
    const flowMidY=terrainHeight(0.15,flowZ)+0.22;
    const flowEndY=terrainHeight(2.0,flowZ)+0.22;
    addArrow(processGroups.erosion,[-1.8,flowStartY,flowZ],[0.15,flowMidY,flowZ]);
    addArrow(processGroups.erosion,[0.15,flowMidY,flowZ],[2.0,flowEndY,flowZ]);
    scene.add(processGroups.erosion);

    processGroups.deposition = new THREE.Group();
    const delta = new THREE.Mesh(
      new THREE.CylinderGeometry(0.12,1.08,0.22,32,1,false),
      new THREE.MeshStandardMaterial({color:0xb79a73,roughness:1})
    );
    const deltaBaseY = terrainHeight(2.55, 0.12);
    delta.scale.z = 1.35;
    delta.position.set(2.55, deltaBaseY + 0.11, 0.12);
    processGroups.deposition.add(delta);
    for(let i=0;i<26;i+=1){
      const angle=(i/26)*Math.PI*2;
      const radius=0.35+(i%4)*0.16;
      const grain=new THREE.Mesh(
        new THREE.SphereGeometry(0.035+(i%3)*0.012,8,6),
        new THREE.MeshStandardMaterial({color:i%2?0xc5aa7e:0x8d7960,roughness:1})
      );
      const surfaceFraction = THREE.MathUtils.clamp((1.08 - radius) / (1.08 - 0.12), 0, 1);
      const grainY = deltaBaseY + 0.22 * surfaceFraction + 0.03;
      grain.position.set(2.55+Math.cos(angle)*radius,grainY,0.12+Math.sin(angle)*radius*1.35);
      processGroups.deposition.add(grain);
    }
    scene.add(processGroups.deposition);
  }

  function render() {
    if (!destroyed && renderer && scene && camera && !document.hidden) renderer.render(scene,camera);
  }

  function selectProcess(key) {
    if (!PROCESSES[key]) return;
    activeProcess=key;
    Object.entries(processGroups).forEach(([name,group])=>{group.visible=name===key;});
    resultTitle.textContent=PROCESSES[key].title;
    resultText.textContent=PROCESSES[key].text;
    choice.querySelectorAll('button').forEach(button=>{
      const selected=button.dataset.process===key;
      button.classList.toggle('is-selected',selected);
      button.setAttribute('aria-pressed',String(selected));
    });
    render();
  }

  function resize() {
    if (!renderer||!camera||destroyed) return;
    const width=Math.max(1,stage.clientWidth);
    const height=Math.max(1,stage.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.5));
    renderer.setSize(width,height,false);
    camera.aspect=width/height;
    camera.position.set(5.1,3.5,width/height<0.9?9.4:7.8);
    camera.lookAt(-0.1,0.1,0);
    camera.updateProjectionMatrix();
    if(controls) controls.update();
    render();
  }

  function disposeGroup(group) {
    if(!group) return;
    group.traverse(object=>{
      object.geometry?.dispose?.();
      if(object.material){
        const materials=Array.isArray(object.material)?object.material:[object.material];
        materials.forEach(material=>material.dispose?.());
      }
    });
    if(group.parent) group.parent.remove(group);
  }

  function destroy() {
    if(destroyed) return;
    destroyed=true;
    if(resizeObserver) resizeObserver.disconnect();
    listeners.forEach(([target,eventName,handler,options])=>target.removeEventListener(eventName,handler,options));
    listeners.length=0;
    if(controls) controls.dispose();
    Object.values(processGroups).forEach(disposeGroup);
    if(scene){
      scene.traverse(object=>{
        object.geometry?.dispose?.();
        if(object.material){
          const materials=Array.isArray(object.material)?object.material:[object.material];
          materials.forEach(material=>material.dispose?.());
        }
      });
      scene.clear();
    }
    if(renderer){
      renderer.dispose();
      renderer.forceContextLoss();
      renderer.domElement.remove();
    }
  }

  function initialize(THREEValue) {
    THREE=THREEValue;
    scene=new THREE.Scene();
    scene.background=new THREE.Color(0x10191f);
    camera=new THREE.PerspectiveCamera(38,1,0.1,100);
    renderer=new THREE.WebGLRenderer({antialias:true,alpha:false,powerPreference:'low-power'});
    renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.5));
    renderer.setClearColor(0x10191f,1);
    renderer.domElement.setAttribute('role','img');
    renderer.domElement.setAttribute('aria-label','Mô hình ba chiều địa hình sườn núi, dòng sông và trầm tích.');
    renderer.domElement.style.touchAction='none';
    stage.prepend(renderer.domElement);

    scene.add(new THREE.HemisphereLight(0xd9efff,0x263b37,1.2));
    const light=new THREE.DirectionalLight(0xffefd6,1.55);
    light.position.set(4,7,5);
    scene.add(light);

    controls=new THREE.OrbitControls(camera,renderer.domElement);
    controls.enableDamping=false;
    controls.enablePan=false;
    controls.enableZoom=true;
    controls.minDistance=5.5;
    controls.maxDistance=13;
    controls.addEventListener('change',render);

    buildSceneGroups();
    selectProcess(activeProcess);
    listen(choice,'click',event=>{
      const button=event.target.closest('button[data-process]');
      if(button) selectProcess(button.dataset.process);
    });
    listen(document,'visibilitychange',render);
    listen(window,'pagehide',destroy,{once:true});
    if('ResizeObserver'in window){
      resizeObserver=new ResizeObserver(resize);
      resizeObserver.observe(stage);
    }else{
      listen(window,'resize',resize);
    }
    resize();
    setStatus('Mô hình đã sẵn sàng.','ready');
  }

  Promise.all([
    window.SCIAVERSE_THREE_READY||Promise.reject(new Error('Không tải được Three.js.')),
    window.SCIAVERSE_ORBIT_CONTROLS_READY||Promise.reject(new Error('Không tải được OrbitControls.'))
  ]).then(([THREEValue])=>{
    if(!destroyed) initialize(THREEValue);
  }).catch(error=>{
    setStatus('Không thể khởi tạo mô hình 3D: '+error.message,'error');
    destroy();
  });
})();
