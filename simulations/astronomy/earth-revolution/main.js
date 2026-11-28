(() => {
  'use strict';

  const stage=document.getElementById('orbitStage');
  if(!stage)return;

  const status=document.getElementById('orbitStatus');
  const seasonSelect=document.getElementById('orbitSeason');
  const resultTitle=document.getElementById('orbitResultTitle');
  const resultText=document.getElementById('orbitResultText');
  const daySlider=document.getElementById('orbitDay');
  const dayValue=document.getElementById('orbitDayValue');
  const playButton=document.getElementById('orbitPlay');
  const pauseButton=document.getElementById('orbitPause');
  const resetButton=document.getElementById('orbitReset');
  const speedSelect=document.getElementById('orbitSpeed');

  const TILT=23.44*Math.PI/180;
  const ORBIT_RADIUS=4.15;
  const YEAR_DAYS=365.2422;
  const SEASONS={
    march:{title:'Xuân phân',day:79,text:'Khoảng 20–21/3. Trục gần vuông góc với hướng Trái Đất–Mặt Trời; điểm Mặt Trời thiên đỉnh ở gần xích đạo.'},
    june:{title:'Hạ chí',day:172,text:'Khoảng 20–21/6. Bán cầu Bắc nghiêng về phía Mặt Trời và nhận bức xạ trực tiếp hơn.'},
    september:{title:'Thu phân',day:266,text:'Khoảng 22–23/9. Trục gần vuông góc với hướng Trái Đất–Mặt Trời; điểm Mặt Trời thiên đỉnh ở gần xích đạo.'},
    december:{title:'Đông chí',day:355,text:'Khoảng 21–22/12. Bán cầu Bắc nghiêng xa Mặt Trời; mùa ở hai bán cầu trái ngược nhau.'}
  };

  let THREE,renderer,scene,camera,controls,earthGroup,earthTexture,resizeObserver,destroyed=false;
  let dayOfYear=172,playing=false,rafId=0,lastFrame=0,daysPerSecond=5;
  const listeners=[];

  function setStatus(message,state='info'){
    status.textContent=message;
    status.dataset.state=state;
  }

  function listen(target,event,handler,options){
    target.addEventListener(event,handler,options);
    listeners.push([target,event,handler,options]);
  }

  function loadEarthTexture(T){
    const urls=['../../../assets/earth-blue-marble.png','https://assets.science.nasa.gov/content/dam/science/esd/eo/images/bmng/bmng-base/july/world.200407.3x5400x2700.jpg'];
    return new Promise((resolve,reject)=>{
      let index=0,finished=false,attemptId=0;
      const attempt=()=>{
        if(index>=urls.length){reject(new Error('Không tải được ảnh Blue Marble từ các nguồn đã khai báo.'));return;}
        const url=urls[index++];
        const token=++attemptId;
        let settled=false;
        const timer=window.setTimeout(()=>{
          if(finished||settled||token!==attemptId)return;
          settled=true;
          attempt();
        },15000);
        new T.TextureLoader().load(url,texture=>{
          if(finished||settled||token!==attemptId){texture.dispose();return;}
          settled=true;finished=true;window.clearTimeout(timer);
          if(T.SRGBColorSpace)texture.colorSpace=T.SRGBColorSpace;
          else if(T.sRGBEncoding)texture.encoding=T.sRGBEncoding;
          resolve(texture);
        },undefined,()=>{
          if(finished||settled||token!==attemptId)return;
          settled=true;window.clearTimeout(timer);
          attempt();
        });
      };
      attempt();
    });
  }

  function createLine(points,color){
    const geometry=new THREE.BufferGeometry().setFromPoints(points);
    return new THREE.Line(geometry,new THREE.LineBasicMaterial({color}));
  }

  function circularDistance(a,b){
    const difference=Math.abs(a-b);
    return Math.min(difference,YEAR_DAYS-difference);
  }

  function updateEarthPositionForDay(day){
    dayOfYear=((day%YEAR_DAYS)+YEAR_DAYS)%YEAR_DAYS;
    const angle=-2*Math.PI*(dayOfYear-172)/YEAR_DAYS;
    earthGroup.position.set(Math.cos(angle)*ORBIT_RADIUS,0,Math.sin(angle)*ORBIT_RADIUS);
    const nearest=Object.entries(SEASONS).reduce((best,current)=>{
      return circularDistance(dayOfYear,current[1].day)<circularDistance(dayOfYear,best[1].day)?current:best;
    },Object.entries(SEASONS)[0]);
    seasonSelect.value=nearest[0];
    resultTitle.textContent=nearest[1].title;
    resultText.textContent=nearest[1].text;
    daySlider.value=String(dayOfYear);
    dayValue.textContent='Ngày thứ '+Math.floor(dayOfYear+1);
    render();
  }

  function setPlaybackState(){
    playButton.disabled=playing;
    pauseButton.disabled=!playing;
  }

  function stopPlayback(){
    playing=false;
    if(rafId)cancelAnimationFrame(rafId);
    rafId=0;lastFrame=0;
    setPlaybackState();
  }

  function playbackFrame(now){
    if(!playing||destroyed)return;
    if(!lastFrame)lastFrame=now;
    const delta=Math.min(.08,(now-lastFrame)/1000);
    lastFrame=now;
    updateEarthPositionForDay(dayOfYear+delta*daysPerSecond);
    rafId=requestAnimationFrame(playbackFrame);
  }

  function startPlayback(){
    if(playing||destroyed)return;
    playing=true;lastFrame=0;setPlaybackState();
    rafId=requestAnimationFrame(playbackFrame);
  }

  function resetPlayback(){
    stopPlayback();
    updateEarthPositionForDay(SEASONS.june.day);
  }

  function render(){
    if(!destroyed&&renderer&&scene&&camera&&!document.hidden)renderer.render(scene,camera);
  }

  function resize(){
    if(!renderer||!camera||destroyed)return;
    const width=Math.max(1,stage.clientWidth),height=Math.max(1,stage.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.5));
    renderer.setSize(width,height,false);
    camera.aspect=width/height;
    camera.position.set(6.2,5.0,width/height<.9?11.5:9.4);
    camera.lookAt(0,.1,0);
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
    stopPlayback();
    if(resizeObserver)resizeObserver.disconnect();
    listeners.forEach(([target,event,handler,options])=>target.removeEventListener(event,handler,options));
    listeners.length=0;
    if(controls)controls.dispose();
    if(earthTexture)earthTexture.dispose();
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
    if(renderer){renderer.dispose();renderer.forceContextLoss();renderer.domElement.remove();}
  }

  function initialize(T,texture){
    THREE=T;earthTexture=texture;
    scene=new THREE.Scene();scene.background=new THREE.Color(0x10191f);
    camera=new THREE.PerspectiveCamera(38,1,.1,100);
    renderer=new THREE.WebGLRenderer({antialias:true,alpha:false,powerPreference:'low-power'});
    renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.5));renderer.setClearColor(0x10191f,1);
    renderer.domElement.setAttribute('role','img');
    renderer.domElement.setAttribute('aria-label','Mô hình Mặt Trời ở tâm, Trái Đất tại bốn vị trí trên quỹ đạo và trục nghiêng cố định.');
    renderer.domElement.style.touchAction='none';stage.prepend(renderer.domElement);

    const sun=new THREE.Mesh(
      new THREE.SphereGeometry(.88,48,32),
      new THREE.MeshStandardMaterial({color:0xffc75c,emissive:0xff9f32,emissiveIntensity:1.2,roughness:1})
    );
    scene.add(sun);
    const sunlight=new THREE.PointLight(0xffe4b0,2.4,0,1.7);
    sunlight.position.set(0,0,0);scene.add(sunlight);
    scene.add(new THREE.AmbientLight(0x526071,.35));

    const orbit=new THREE.Mesh(
      new THREE.TorusGeometry(ORBIT_RADIUS,.012,8,160),
      new THREE.MeshBasicMaterial({color:0x71808b,transparent:true,opacity:.65})
    );
    orbit.rotation.x=Math.PI/2;scene.add(orbit);

    const markerGroup=new THREE.Group();
    [0,Math.PI/2,Math.PI,Math.PI*1.5].forEach(angle=>{
      const marker=new THREE.Mesh(
        new THREE.SphereGeometry(.075,12,10),
        new THREE.MeshStandardMaterial({color:0x8797a2,roughness:1})
      );
      marker.position.set(Math.cos(angle)*ORBIT_RADIUS,0,Math.sin(angle)*ORBIT_RADIUS);
      markerGroup.add(marker);
    });
    scene.add(markerGroup);

    earthGroup=new THREE.Group();
    const earth=new THREE.Mesh(
      new THREE.SphereGeometry(.58,64,48),
      new THREE.MeshStandardMaterial({map:texture,roughness:1,metalness:0})
    );
    earthGroup.add(earth);

    const axisVector=new THREE.Vector3(-Math.sin(TILT),Math.cos(TILT),0).normalize();
    const axisPoints=[axisVector.clone().multiplyScalar(-.95),axisVector.clone().multiplyScalar(.95)];
    earthGroup.add(createLine(axisPoints,0xf0c879));
    const northPole=new THREE.Mesh(new THREE.SphereGeometry(.065,12,10),new THREE.MeshStandardMaterial({color:0xf0c879}));
    northPole.position.copy(axisVector).multiplyScalar(.62);earthGroup.add(northPole);
    const equator=new THREE.Mesh(
      new THREE.TorusGeometry(.59,.008,8,64),
      new THREE.MeshBasicMaterial({color:0xd8e2e7,transparent:true,opacity:.8})
    );
    equator.rotation.x=Math.PI/2;earthGroup.add(equator);
    earthGroup.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),axisVector);
    scene.add(earthGroup);

    controls=new THREE.OrbitControls(camera,renderer.domElement);
    controls.enableDamping=false;controls.enablePan=false;controls.enableZoom=true;
    controls.minDistance=6;controls.maxDistance=16;controls.addEventListener('change',render);

    listen(seasonSelect,'change',()=>updateEarthPositionForDay(SEASONS[seasonSelect.value].day));
    listen(daySlider,'input',()=>updateEarthPositionForDay(Number(daySlider.value)));
    listen(playButton,'click',startPlayback);
    listen(pauseButton,'click',stopPlayback);
    listen(resetButton,'click',resetPlayback);
    listen(speedSelect,'change',()=>{daysPerSecond=Number(speedSelect.value)||5;});
    listen(document,'visibilitychange',()=>{
      if(document.hidden){
        if(rafId)cancelAnimationFrame(rafId);
        rafId=0;lastFrame=0;
      }else{
        render();
        if(playing)rafId=requestAnimationFrame(playbackFrame);
      }
    });
    listen(window,'pagehide',destroy,{once:true});
    if('ResizeObserver'in window){resizeObserver=new ResizeObserver(resize);resizeObserver.observe(stage);}
    else listen(window,'resize',resize);

    updateEarthPositionForDay(SEASONS[seasonSelect.value].day);
    setPlaybackState();
    resize();
    setStatus('Mô hình đã sẵn sàng.','ready');
  }

  Promise.all([
    window.SCIAVERSE_THREE_READY||Promise.reject(new Error('Không tải được Three.js.')),
    window.SCIAVERSE_ORBIT_CONTROLS_READY||Promise.reject(new Error('Không tải được OrbitControls.'))
  ]).then(([T])=>loadEarthTexture(T).then(texture=>({T,texture}))).then(({T,texture})=>{
    if(!destroyed)initialize(T,texture);
    else texture.dispose();
  }).catch(error=>{
    setStatus('Không thể khởi tạo mô hình 3D: '+error.message,'error');
    destroy();
  });
})();
