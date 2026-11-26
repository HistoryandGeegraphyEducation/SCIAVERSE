(() => {
  'use strict';

  const stage=document.getElementById('contourStage');
  if(!stage)return;

  const status=document.getElementById('contourStatus');
  const intervalSelect=document.getElementById('contourInterval');
  const intervalValue=document.getElementById('contourIntervalValue');

  let THREE,renderer,scene,camera,controls,terrain,contourGroup,resizeObserver,destroyed=false;
  const listeners=[];

  const GRID_X=84;
  const GRID_Z=56;
  const MIN_X=-3.2;
  const MAX_X=3.2;
  const MIN_Z=-2.2;
  const MAX_Z=2.2;
  const HEIGHT_SCALE=0.003;

  function setStatus(message,state='info'){
    status.textContent=message;
    status.dataset.state=state;
  }

  function listen(target,event,handler,options){
    target.addEventListener(event,handler,options);
    listeners.push([target,event,handler,options]);
  }

  function elevationAt(x,z){
    const hillA=760*Math.exp(-(((x+1.35)*(x+1.35))/1.7+((z-0.45)*(z-0.45))/1.35));
    const hillB=520*Math.exp(-(((x-1.35)*(x-1.35))/1.15+((z+0.75)*(z+0.75))/1.05));
    const valley=205*Math.exp(-(((x-0.05)*(x-0.05))/0.16+((z-0.1)*(z-0.1))/1.8));
    const ridge=110*Math.exp(-(((x+0.2)*(x+0.2))/2.8+((z-1.45)*(z-1.45))/0.45));
    return Math.max(20,Math.round(80+hillA+hillB-valley+ridge));
  }

  function createTerrain(){
    const geometry=new THREE.PlaneGeometry(MAX_X-MIN_X,MAX_Z-MIN_Z,GRID_X,GRID_Z);
    geometry.rotateX(-Math.PI/2);
    const positions=geometry.attributes.position;
    const colors=[];
    const low=new THREE.Color(0x3d735d);
    const middle=new THREE.Color(0x8c8a61);
    const high=new THREE.Color(0xb28b62);
    for(let i=0;i<positions.count;i+=1){
      const x=positions.getX(i);
      const z=positions.getZ(i);
      const elevation=elevationAt(x,z);
      positions.setY(i,elevation*HEIGHT_SCALE);
      const t=THREE.MathUtils.clamp(elevation/1000,0,1);
      const color=t<0.55?low.clone().lerp(middle,t/0.55):middle.clone().lerp(high,(t-0.55)/0.45);
      colors.push(color.r,color.g,color.b);
    }
    geometry.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));
    geometry.computeVertexNormals();
    return new THREE.Mesh(
      geometry,
      new THREE.MeshStandardMaterial({vertexColors:true,roughness:1,side:THREE.DoubleSide})
    );
  }

  function edgePoint(a,b,level){
    const ratio=(level-a.h)/(b.h-a.h);
    return {
      x:a.x+(b.x-a.x)*ratio,
      z:a.z+(b.z-a.z)*ratio
    };
  }

  function contourSegments(interval){
    const dx=(MAX_X-MIN_X)/GRID_X;
    const dz=(MAX_Z-MIN_Z)/GRID_Z;
    const grid=[];
    let maxHeight=0;
    for(let iz=0;iz<=GRID_Z;iz+=1){
      const row=[];
      const z=MIN_Z+iz*dz;
      for(let ix=0;ix<=GRID_X;ix+=1){
        const x=MIN_X+ix*dx;
        const h=elevationAt(x,z);
        row.push({x,z,h});
        maxHeight=Math.max(maxHeight,h);
      }
      grid.push(row);
    }

    const regular=[];
    const index=[];
    for(let level=interval;level<=maxHeight;level+=interval){
      const target=level% (interval*5)===0?index:regular;
      for(let iz=0;iz<GRID_Z;iz+=1){
        for(let ix=0;ix<GRID_X;ix+=1){
          const a=grid[iz][ix];
          const b=grid[iz][ix+1];
          const c=grid[iz+1][ix+1];
          const d=grid[iz+1][ix];
          const edges=[];
          const cross=(p,q)=>((p.h<level&&q.h>=level)||(q.h<level&&p.h>=level));
          if(cross(a,b))edges.push(edgePoint(a,b,level));
          if(cross(b,c))edges.push(edgePoint(b,c,level));
          if(cross(c,d))edges.push(edgePoint(c,d,level));
          if(cross(d,a))edges.push(edgePoint(d,a,level));
          const add=(p,q)=>{
            target.push(p.x,level*HEIGHT_SCALE+0.018,p.z,q.x,level*HEIGHT_SCALE+0.018,q.z);
          };
          if(edges.length===2)add(edges[0],edges[1]);
          else if(edges.length===4){
            const center=(a.h+b.h+c.h+d.h)/4;
            if(center>=level){add(edges[0],edges[3]);add(edges[1],edges[2]);}
            else{add(edges[0],edges[1]);add(edges[2],edges[3]);}
          }
        }
      }
    }
    return {regular,index};
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

  function rebuildContours(){
    if(contourGroup)disposeGroup(contourGroup);
    contourGroup=new THREE.Group();
    const interval=Number(intervalSelect.value);
    const segments=contourSegments(interval);
    const addSegments=(positions,color,opacity)=>{
      if(!positions.length)return;
      const geometry=new THREE.BufferGeometry();
      geometry.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));
      const line=new THREE.LineSegments(geometry,new THREE.LineBasicMaterial({color,transparent:opacity<1,opacity}));
      contourGroup.add(line);
    };
    addSegments(segments.regular,0x513c2c,0.78);
    addSegments(segments.index,0x35291f,1);
    scene.add(contourGroup);
    intervalValue.textContent=interval+' m';
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
    camera.position.set(5.4,4.3,width/height<0.9?10.5:8.2);
    camera.lookAt(0,0.55,0);
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
    disposeGroup(contourGroup);
    if(terrain)disposeGroup(terrain);
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
    renderer.domElement.setAttribute('aria-label','Bề mặt địa hình ba chiều giả định với các đường đồng mức.');
    renderer.domElement.style.touchAction='none';
    stage.prepend(renderer.domElement);

    scene.add(new THREE.HemisphereLight(0xd9efff,0x263b37,1.15));
    const light=new THREE.DirectionalLight(0xffefd6,1.45);
    light.position.set(4,7,5);
    scene.add(light);

    terrain=createTerrain();
    scene.add(terrain);
    controls=new THREE.OrbitControls(camera,renderer.domElement);
    controls.enableDamping=false;
    controls.enablePan=false;
    controls.enableZoom=true;
    controls.minDistance=5.5;
    controls.maxDistance=14;
    controls.addEventListener('change',render);

    listen(intervalSelect,'change',rebuildContours);
    listen(document,'visibilitychange',render);
    listen(window,'pagehide',destroy,{once:true});
    if('ResizeObserver'in window){
      resizeObserver=new ResizeObserver(resize);
      resizeObserver.observe(stage);
    }else{
      listen(window,'resize',resize);
    }

    rebuildContours();
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
