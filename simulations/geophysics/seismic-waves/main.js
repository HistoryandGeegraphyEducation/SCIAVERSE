(() => {
  'use strict';

  const stage=document.getElementById('seismicStage');
  if(!stage)return;

  const status=document.getElementById('seismicStatus');
  const choice=document.getElementById('seismicWaveChoice');
  const resultTitle=document.getElementById('seismicResultTitle');
  const resultText=document.getElementById('seismicResultText');

  const WAVES={
    p:{
      title:'Sóng P — sóng nén',
      text:'Sóng P là sóng dọc, truyền được qua chất rắn và chất lỏng. Khi đi qua ranh giới vật liệu, vận tốc và hướng truyền thay đổi.'
    },
    s:{
      title:'Sóng S — sóng ngang',
      text:'Sóng S là sóng ngang, không truyền qua chất lỏng. Nhân ngoài lỏng ngăn sóng S truyền trực tiếp xuyên qua lớp này.'
    }
  };

  let THREE,renderer,scene,camera,controls,layerGroup,waveGroup,resizeObserver,destroyed=false,activeWave='p';
  const listeners=[];

  function setStatus(message,state='info'){
    status.textContent=message;
    status.dataset.state=state;
  }

  function listen(target,event,handler,options){
    target.addEventListener(event,handler,options);
    listeners.push([target,event,handler,options]);
  }

  function addSphere(group,radius,color,opacity,segments=48){
    const mesh=new THREE.Mesh(
      new THREE.SphereGeometry(radius,segments,32),
      new THREE.MeshStandardMaterial({color,transparent:opacity<1,opacity,roughness:0.9,depthWrite:opacity>=1})
    );
    group.add(mesh);
    return mesh;
  }

  function makeWavePath(points,color){
    const geometry=new THREE.BufferGeometry().setFromPoints(points);
    const line=new THREE.Line(geometry,new THREE.LineBasicMaterial({color,linewidth:2}));
    waveGroup.add(line);
  }

  function addArrow(origin,direction,length,color){
    waveGroup.add(new THREE.ArrowHelper(direction.clone().normalize(),origin,length,color,0.24,0.16));
  }

  function buildLayers(){
    layerGroup=new THREE.Group();
    addSphere(layerGroup,2.35,0x9d704e,0.22,64);
    addSphere(layerGroup,1.34,0xd47b45,0.48,56);
    addSphere(layerGroup,0.68,0xe3c26e,0.96,48);
    const source=new THREE.Mesh(
      new THREE.SphereGeometry(0.09,16,12),
      new THREE.MeshStandardMaterial({color:0xf4eee0,emissive:0x4a3920})
    );
    source.position.set(0,2.36,0);
    layerGroup.add(source);
    scene.add(layerGroup);
  }

  function buildWave(key){
    if(waveGroup){
      waveGroup.traverse(object=>{
        object.geometry?.dispose?.();
        if(object.material){
          const materials=Array.isArray(object.material)?object.material:[object.material];
          materials.forEach(material=>material.dispose?.());
        }
      });
      scene.remove(waveGroup);
    }
    waveGroup=new THREE.Group();
    const source=new THREE.Vector3(0,2.34,0);
    const outerCoreBoundary=new THREE.Vector3(0,-1.34,0);
    if(key==='p'){
      const points=[
        source,
        new THREE.Vector3(0,1.2,0),
        new THREE.Vector3(0,0.4,0),
        new THREE.Vector3(0,-0.5,0),
        new THREE.Vector3(0,-1.34,0),
        new THREE.Vector3(0,-1.85,0),
        new THREE.Vector3(0,-2.34,0)
      ];
      makeWavePath(points,0xf0c879);
      addArrow(new THREE.Vector3(0,1.15,0),new THREE.Vector3(0,-1,0),0.72,0xf0c879);
      addArrow(new THREE.Vector3(0,-1.55,0),new THREE.Vector3(0,-1,0),0.68,0xf0c879);
    }else{
      const points=[
        source,
        new THREE.Vector3(0,1.2,0),
        new THREE.Vector3(0,0.4,0),
        new THREE.Vector3(0,-0.5,0),
        outerCoreBoundary
      ];
      makeWavePath(points,0x83d5e1);
      addArrow(new THREE.Vector3(0,1.12,0),new THREE.Vector3(0,-1,0),0.72,0x83d5e1);
      const stop=new THREE.Mesh(
        new THREE.SphereGeometry(0.13,16,12),
        new THREE.MeshStandardMaterial({color:0x83d5e1,emissive:0x24515b})
      );
      stop.position.copy(outerCoreBoundary);
      waveGroup.add(stop);
    }
    scene.add(waveGroup);
    resultTitle.textContent=WAVES[key].title;
    resultText.textContent=WAVES[key].text;
    choice.querySelectorAll('button').forEach(button=>{
      const selected=button.dataset.wave===key;
      button.classList.toggle('is-selected',selected);
      button.setAttribute('aria-pressed',String(selected));
    });
    render();
  }

  function render(){
    if(!destroyed&&renderer&&scene&&camera&&!document.hidden)renderer.render(scene,camera);
  }

  function resize(){
    if(!renderer||!camera||destroyed)return;
    const width=Math.max(1,stage.clientWidth);
    const height=Math.max(1,stage.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.5));
    renderer.setSize(width,height,false);
    camera.aspect=width/height;
    camera.position.set(4.6,3.1,width/height<0.9?9.5:7.5);
    camera.lookAt(0,0,0);
    camera.updateProjectionMatrix();
    if(controls)controls.update();
    render();
  }

  function disposeGroup(group){
    if(!group)return;
    group.traverse(object=>{
      object.geometry?.dispose?.();
      if(object.material){
        const materials=Array.isArray(object.material)?object.material:[object.material];
        materials.forEach(material=>material.dispose?.());
      }
    });
    if(group.parent)group.parent.remove(group);
  }

  function destroy(){
    if(destroyed)return;
    destroyed=true;
    if(resizeObserver)resizeObserver.disconnect();
    listeners.forEach(([target,event,handler,options])=>target.removeEventListener(event,handler,options));
    listeners.length=0;
    if(controls)controls.dispose();
    disposeGroup(layerGroup);
    disposeGroup(waveGroup);
    if(scene)scene.clear();
    if(renderer){
      renderer.dispose();
      renderer.forceContextLoss();
      renderer.domElement.remove();
    }
  }

  function initialize(T){
    THREE=T;
    scene=new THREE.Scene();
    scene.background=new THREE.Color(0x10191f);
    camera=new THREE.PerspectiveCamera(38,1,0.1,100);
    renderer=new THREE.WebGLRenderer({antialias:true,alpha:false,powerPreference:'low-power'});
    renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.5));
    renderer.setClearColor(0x10191f,1);
    renderer.domElement.setAttribute('role','img');
    renderer.domElement.setAttribute('aria-label','Mô hình các lớp bên trong Trái Đất và đường truyền sóng địa chấn.');
    renderer.domElement.style.touchAction='none';
    stage.prepend(renderer.domElement);

    scene.add(new THREE.HemisphereLight(0xd9efff,0x263b37,1.2));
    const light=new THREE.DirectionalLight(0xffefd6,1.5);
    light.position.set(4,7,5);
    scene.add(light);

    controls=new THREE.OrbitControls(camera,renderer.domElement);
    controls.enableDamping=false;
    controls.enablePan=false;
    controls.enableZoom=true;
    controls.minDistance=5.2;
    controls.maxDistance=12;
    controls.addEventListener('change',render);

    buildLayers();
    buildWave(activeWave);
    listen(choice,'click',event=>{
      const button=event.target.closest('button[data-wave]');
      if(button){
        activeWave=button.dataset.wave;
        buildWave(activeWave);
      }
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
  ]).then(([T])=>{
    if(!destroyed)initialize(T);
  }).catch(error=>{
    setStatus('Không thể khởi tạo mô hình 3D: '+error.message,'error');
    destroy();
  });
})();
