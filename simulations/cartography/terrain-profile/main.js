(() => {
  'use strict';

  const stage=document.getElementById('profileStage');
  if(!stage)return;

  const status=document.getElementById('profileStatus');
  const routeSelect=document.getElementById('profileRoute');
  const chart=document.getElementById('profileChart');
  const summary=document.getElementById('profileSummary');

  let THREE,renderer,scene,camera,controls,terrain,contourGroup,profileGroup,resizeObserver,destroyed=false;
  const listeners=[];
  const MIN_X=-3.2,MAX_X=3.2,MIN_Z=-2.2,MAX_Z=2.2,HEIGHT_SCALE=0.003;

  function setStatus(message,state='info'){
    status.textContent=message;
    status.dataset.state=state;
  }

  function listen(target,event,handler,options){
    target.addEventListener(event,handler,options);
    listeners.push([target,event,handler,options]);
  }

  function elevationAt(x,z){
    const hillA=760*Math.exp(-(((x+1.35)*(x+1.35))/1.7+((z-.45)*(z-.45))/1.35));
    const hillB=520*Math.exp(-(((x-1.35)*(x-1.35))/1.15+((z+.75)*(z+.75))/1.05));
    const valley=205*Math.exp(-(((x-.05)*(x-.05))/.16+((z-.1)*(z-.1))/1.8));
    const ridge=110*Math.exp(-(((x+.2)*(x+.2))/2.8+((z-1.45)*(z-1.45))/.45));
    return Math.max(20,Math.round(80+hillA+hillB-valley+ridge));
  }

  function createTerrain(){
    const geometry=new THREE.PlaneGeometry(MAX_X-MIN_X,MAX_Z-MIN_Z,84,56);
    geometry.rotateX(-Math.PI/2);
    const positions=geometry.attributes.position;
    const colors=[];
    const low=new THREE.Color(0x3d735d),middle=new THREE.Color(0x8c8a61),high=new THREE.Color(0xb28b62);
    for(let i=0;i<positions.count;i+=1){
      const x=positions.getX(i),z=positions.getZ(i),h=elevationAt(x,z);
      positions.setY(i,h*HEIGHT_SCALE);
      const t=THREE.MathUtils.clamp(h/1000,0,1);
      const color=t<.55?low.clone().lerp(middle,t/.55):middle.clone().lerp(high,(t-.55)/.45);
      colors.push(color.r,color.g,color.b);
    }
    geometry.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));
    geometry.computeVertexNormals();
    return new THREE.Mesh(geometry,new THREE.MeshStandardMaterial({vertexColors:true,roughness:1,side:THREE.DoubleSide}));
  }

  function edgePoint(a,b,level){
    const ratio=(level-a.h)/(b.h-a.h);
    return {x:a.x+(b.x-a.x)*ratio,z:a.z+(b.z-a.z)*ratio};
  }

  function createContours(interval=100){
    const nx=84,nz=56,dx=(MAX_X-MIN_X)/nx,dz=(MAX_Z-MIN_Z)/nz,grid=[];
    let maxHeight=0;
    for(let iz=0;iz<=nz;iz+=1){
      const row=[],z=MAX_Z-iz*dz;
      for(let ix=0;ix<=nx;ix+=1){
        const x=MIN_X+ix*dx,h=elevationAt(x,z);
        row.push({x,z,h});maxHeight=Math.max(maxHeight,h);
      }
      grid.push(row);
    }
    const regular=[],index=[];
    for(let level=interval;level<=maxHeight;level+=interval){
      const target=level%(interval*5)===0?index:regular;
      for(let iz=0;iz<nz;iz+=1)for(let ix=0;ix<nx;ix+=1){
        const a=grid[iz][ix],b=grid[iz][ix+1],c=grid[iz+1][ix+1],d=grid[iz+1][ix];
        const cross=(p,q)=>(p.h<level&&q.h>=level)||(q.h<level&&p.h>=level);
        const addTriangle=triangle=>{
          const pts=[];
          [[0,1],[1,2],[2,0]].forEach(([i,j])=>{
            const p=triangle[i],q=triangle[j];
            if(cross(p,q)){
              const pt=edgePoint(p,q,level);
              if(!pts.some(v=>Math.hypot(v.x-pt.x,v.z-pt.z)<1e-9))pts.push(pt);
            }
          });
          if(pts.length===2)target.push(pts[0].x,level*HEIGHT_SCALE+.018,pts[0].z,pts[1].x,level*HEIGHT_SCALE+.018,pts[1].z);
        };
        addTriangle([a,d,b]);addTriangle([d,c,b]);
      }
    }
    contourGroup=new THREE.Group();
    const add=(positions,color,opacity)=>{
      if(!positions.length)return;
      const geometry=new THREE.BufferGeometry();
      geometry.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));
      contourGroup.add(new THREE.LineSegments(geometry,new THREE.LineBasicMaterial({color,transparent:opacity<1,opacity})));
    };
    add(regular,0x513c2c,.65);add(index,0x35291f,.95);
    scene.add(contourGroup);
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

  function buildProfile(key){
    if(profileGroup)disposeGroup(profileGroup);
    profileGroup=new THREE.Group();
    const points=[],count=96;
    for(let i=0;i<=count;i+=1){
      const t=i/count;
      const x=key==='ab'?MIN_X+(MAX_X-MIN_X)*t:0;
      const z=key==='ab'?0:MIN_Z+(MAX_Z-MIN_Z)*t;
      const h=elevationAt(x,z);
      points.push({x,z,h});
    }
    const linePoints=points.map(p=>new THREE.Vector3(p.x,p.h*HEIGHT_SCALE+.055,p.z));
    const geometry=new THREE.BufferGeometry().setFromPoints(linePoints);
    profileGroup.add(new THREE.Line(geometry,new THREE.LineBasicMaterial({color:0xf0c879,linewidth:3})));
    [points[0],points[points.length-1]].forEach(p=>{
      const marker=new THREE.Mesh(new THREE.SphereGeometry(.085,16,12),new THREE.MeshStandardMaterial({color:0xf0c879}));
      marker.position.set(p.x,p.h*HEIGHT_SCALE+.065,p.z);
      profileGroup.add(marker);
    });
    scene.add(profileGroup);
    drawChart(points,key);
  }

  function drawChart(points,key){
    const left=48,right=400,top=18,bottom=164;
    const min=Math.min(...points.map(p=>p.h)),max=Math.max(...points.map(p=>p.h));
    const low=Math.floor(min/100)*100,high=Math.ceil(max/100)*100||100;
    const range=Math.max(100,high-low);
    const plot=points.map((p,i)=>{
      const x=left+(right-left)*i/(points.length-1);
      const y=bottom-(p.h-low)/range*(bottom-top);
      return [x,y];
    });
    const poly=plot.map(p=>p.join(',')).join(' ');
    const fill=left+','+bottom+' '+poly+' '+right+','+bottom;
    const grid=[];
    const step=Math.max(100,Math.ceil(range/4/100)*100);
    for(let h=low;h<=high;h+=step){
      const y=bottom-(h-low)/range*(bottom-top);
      grid.push('<line class="profile-grid" x1="'+left+'" y1="'+y+'" x2="'+right+'" y2="'+y+'"/><text x="'+(left-7)+'" y="'+(y+3)+'" text-anchor="end">'+h+'</text>');
    }
    const distance=key==='ab'?MAX_X-MIN_X:MAX_Z-MIN_Z;
    chart.innerHTML='<g>'+grid.join('')+'</g><polyline class="profile-fill" points="'+fill+'"/><polyline class="profile-line" points="'+poly+'"/><circle class="profile-marker" cx="'+left+'" cy="'+plot[0][1]+'" r="4"/><circle class="profile-marker" cx="'+right+'" cy="'+plot[plot.length-1][1]+'" r="4"/><text x="'+left+'" y="188" text-anchor="middle">0</text><text x="'+right+'" y="188" text-anchor="middle">'+distance.toFixed(1)+' km</text><text x="210" y="205" text-anchor="middle">Khoảng cách giả định (km)</text><text x="12" y="12">Cao độ (m)</text>';
    chart.setAttribute('aria-label','Lát cắt '+key.toUpperCase()+', cao độ từ '+min+' đến '+max+' mét trên khoảng cách giả định '+distance.toFixed(1)+' kilômét.');
    summary.textContent='Tuyến '+key.toUpperCase()+': '+min+'–'+max+' m';
  }

  function render(){
    if(!destroyed&&renderer&&scene&&camera&&!document.hidden)renderer.render(scene,camera);
  }

  function updateRoute(){
    buildProfile(routeSelect.value);
    render();
  }

  function resize(){
    if(!renderer||!camera||destroyed)return;
    const width=Math.max(1,stage.clientWidth),height=Math.max(1,stage.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.5));
    renderer.setSize(width,height,false);
    camera.aspect=width/height;
    camera.position.set(5.4,4.3,width/height<.9?10.5:8.2);
    camera.lookAt(0,.55,0);
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
    disposeGroup(profileGroup);disposeGroup(contourGroup);disposeGroup(terrain);
    if(scene)scene.clear();
    if(renderer){renderer.dispose();renderer.forceContextLoss();renderer.domElement.remove();}
  }

  function initialize(T){
    THREE=T;scene=new THREE.Scene();scene.background=new THREE.Color(0x10191f);
    camera=new THREE.PerspectiveCamera(38,1,.1,100);
    renderer=new THREE.WebGLRenderer({antialias:true,alpha:false,powerPreference:'low-power'});
    renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.5));renderer.setClearColor(0x10191f,1);
    renderer.domElement.setAttribute('role','img');
    renderer.domElement.setAttribute('aria-label','Bề mặt địa hình giả định, đường đồng mức và tuyến cắt địa hình.');
    renderer.domElement.style.touchAction='none';stage.prepend(renderer.domElement);
    scene.add(new THREE.HemisphereLight(0xd9efff,0x263b37,1.15));
    const light=new THREE.DirectionalLight(0xffefd6,1.45);light.position.set(4,7,5);scene.add(light);
    terrain=createTerrain();scene.add(terrain);createContours(100);
    controls=new THREE.OrbitControls(camera,renderer.domElement);
    controls.enableDamping=false;controls.enablePan=false;controls.enableZoom=true;
    controls.minDistance=5.5;controls.maxDistance=14;controls.addEventListener('change',render);
    listen(routeSelect,'change',updateRoute);
    listen(document,'visibilitychange',render);
    listen(window,'pagehide',destroy,{once:true});
    if('ResizeObserver'in window){resizeObserver=new ResizeObserver(resize);resizeObserver.observe(stage);}
    else listen(window,'resize',resize);
    updateRoute();resize();setStatus('Mô hình đã sẵn sàng.','ready');
  }

  Promise.all([
    window.SCIAVERSE_THREE_READY||Promise.reject(new Error('Không tải được Three.js.')),
    window.SCIAVERSE_ORBIT_CONTROLS_READY||Promise.reject(new Error('Không tải được OrbitControls.'))
  ]).then(([T])=>{if(!destroyed)initialize(T);}).catch(error=>{
    setStatus('Không thể khởi tạo mô hình 3D: '+error.message,'error');destroy();
  });
})();
