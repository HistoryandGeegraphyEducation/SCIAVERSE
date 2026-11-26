(() => {
  'use strict';

  const stage=document.getElementById('daylightStage');
  if(!stage)return;

  const status=document.getElementById('daylightStatus');
  const seasonSelect=document.getElementById('daylightSeason');
  const latitudeInput=document.getElementById('daylightLatitude');
  const latitudeValue=document.getElementById('daylightLatitudeValue');
  const dayHoursOutput=document.getElementById('dayHours');
  const nightHoursOutput=document.getElementById('nightHours');
  const resultTitle=document.getElementById('daylightResultTitle');
  const explanation=document.getElementById('daylightExplanation');
  const bar=document.getElementById('daylightBar');
  const dayPart=document.getElementById('daylightPart');
  const nightPart=document.getElementById('nightPart');

  const SEASONS={
    equinox:{declination:0,title:'Xuân phân hoặc thu phân',description:'Vào ngày phân, Mặt Trời ở gần mặt phẳng xích đạo; thời lượng ngày và đêm gần bằng nhau.'},
    june:{declination:23.44,title:'Hạ chí',description:'Bán cầu Bắc nghiêng về phía Mặt Trời. Ngày dài hơn ở phần lớn vĩ độ Bắc; vùng cực Bắc có thể có ngày 24 giờ.'},
    december:{declination:-23.44,title:'Đông chí',description:'Bán cầu Bắc nghiêng xa Mặt Trời. Ngày ngắn hơn ở phần lớn vĩ độ Bắc; vùng cực Bắc có thể có đêm 24 giờ.'}
  };

  let THREE,renderer,scene,camera,controls,earthGroup,earthTexture,latitudeRing,resizeObserver,destroyed=false;
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
        const url=urls[index++],token=++attemptId;
        let settled=false;
        const timer=window.setTimeout(()=>{
          if(finished||settled||token!==attemptId)return;
          settled=true;attempt();
        },15000);
        new T.TextureLoader().load(url,texture=>{
          if(finished||settled||token!==attemptId){texture.dispose();return;}
          settled=true;finished=true;window.clearTimeout(timer);
          if(T.SRGBColorSpace)texture.colorSpace=T.SRGBColorSpace;
          else if(T.sRGBEncoding)texture.encoding=T.sRGBEncoding;
          resolve(texture);
        },undefined,()=>{
          if(finished||settled||token!==attemptId)return;
          settled=true;window.clearTimeout(timer);attempt();
        });
      };
      attempt();
    });
  }

  function calculateDayLength(latitude,declination){
    if(Math.abs(latitude)===90&&declination===0)return 12;
    const phi=latitude*Math.PI/180;
    const delta=declination*Math.PI/180;
    const cosineHourAngle=-Math.tan(phi)*Math.tan(delta);
    if(cosineHourAngle<=-1)return 24;
    if(cosineHourAngle>=1)return 0;
    const hourAngle=Math.acos(cosineHourAngle);
    return 24*hourAngle/Math.PI;
  }

  function formatHours(value){
    return value.toFixed(2).replace('.',',')+' giờ';
  }

  function updateLatitudeRing(latitude){
    if(latitudeRing){
      earthGroup.remove(latitudeRing);
      latitudeRing.geometry.dispose();
      latitudeRing.material.dispose();
    }
    const phi=latitude*Math.PI/180;
    const radius=1.36*Math.cos(phi);
    latitudeRing=new THREE.Mesh(
      new THREE.TorusGeometry(Math.max(.015,radius),.012,8,96),
      new THREE.MeshBasicMaterial({color:0xf0c879})
    );
    latitudeRing.position.y=1.36*Math.sin(phi);
    earthGroup.add(latitudeRing);
  }

  function updateSunlight(declination){
    const delta=declination*Math.PI/180;
    const direction=new THREE.Vector3(Math.cos(delta),Math.sin(delta),0).normalize();
    const light=scene.getObjectByName('seasonalSunLight');
    const sun=scene.getObjectByName('seasonalSun');
    light.position.copy(direction).multiplyScalar(5);
    sun.position.copy(direction).multiplyScalar(3.7);
  }

  function updateModel(){
    const latitude=Number(latitudeInput.value);
    const season=SEASONS[seasonSelect.value];
    const day=calculateDayLength(latitude,season.declination);
    const night=24-day;
    latitudeValue.textContent=Math.abs(latitude)+'° '+(latitude>0?'Bắc':latitude<0?'Nam':'');
    dayHoursOutput.textContent=formatHours(day);
    nightHoursOutput.textContent=formatHours(night);
    dayPart.style.width=(day/24*100)+'%';
    nightPart.style.width=(night/24*100)+'%';
    bar.setAttribute('aria-label','Ngày '+formatHours(day)+', đêm '+formatHours(night));
    resultTitle.textContent=day===24?'Ngày cực':night===24?'Đêm cực':season.title;
    explanation.textContent=season.description;
    updateLatitudeRing(latitude);
    updateSunlight(season.declination);
    render();
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
    camera.position.set(4.7,3.4,width/height<.9?9.5:7.8);
    camera.lookAt(0,0,0);
    camera.updateProjectionMatrix();
    if(controls)controls.update();
    render();
  }

  function destroy(){
    if(destroyed)return;
    destroyed=true;
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
    renderer.domElement.setAttribute('aria-label','Mô hình Trái Đất được chiếu sáng theo xích vĩ Mặt Trời, có vòng vĩ tuyến được chọn.');
    renderer.domElement.style.touchAction='none';stage.prepend(renderer.domElement);

    earthGroup=new THREE.Group();
    const earth=new THREE.Mesh(
      new THREE.SphereGeometry(1.36,64,48),
      new THREE.MeshStandardMaterial({map:texture,roughness:1,metalness:0})
    );
    earthGroup.add(earth);
    const equator=new THREE.Mesh(
      new THREE.TorusGeometry(1.365,.008,8,96),
      new THREE.MeshBasicMaterial({color:0xdce4e8,transparent:true,opacity:.65})
    );
    equator.rotation.x=Math.PI/2;earthGroup.add(equator);
    const axisGeometry=new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0,-1.65,0),new THREE.Vector3(0,1.65,0)]);
    earthGroup.add(new THREE.Line(axisGeometry,new THREE.LineBasicMaterial({color:0xf0c879})));
    scene.add(earthGroup);

    const sunlight=new THREE.DirectionalLight(0xffedc9,2.1);
    sunlight.name='seasonalSunLight';scene.add(sunlight);
    const sun=new THREE.Mesh(
      new THREE.SphereGeometry(.32,24,18),
      new THREE.MeshStandardMaterial({color:0xffc75c,emissive:0xffa232,emissiveIntensity:1})
    );
    sun.name='seasonalSun';scene.add(sun);
    scene.add(new THREE.AmbientLight(0x536070,.38));

    controls=new THREE.OrbitControls(camera,renderer.domElement);
    controls.enableDamping=false;controls.enablePan=false;controls.enableZoom=true;
    controls.minDistance=5;controls.maxDistance=12;controls.addEventListener('change',render);

    listen(seasonSelect,'change',updateModel);
    listen(latitudeInput,'input',updateModel);
    listen(document,'visibilitychange',render);
    listen(window,'pagehide',destroy,{once:true});
    if('ResizeObserver'in window){resizeObserver=new ResizeObserver(resize);resizeObserver.observe(stage);}
    else listen(window,'resize',resize);

    updateModel();resize();setStatus('Mô hình đã sẵn sàng.','ready');
  }

  Promise.all([
    window.SCIAVERSE_THREE_READY||Promise.reject(new Error('Không tải được Three.js.')),
    window.SCIAVERSE_ORBIT_CONTROLS_READY||Promise.reject(new Error('Không tải được OrbitControls.'))
  ]).then(([T])=>loadEarthTexture(T).then(texture=>({T,texture}))).then(({T,texture})=>{
    if(!destroyed)initialize(T,texture);
    else texture.dispose();
  }).catch(error=>{
    setStatus('Không thể khởi tạo mô hình 3D: '+error.message,'error');destroy();
  });
})();
