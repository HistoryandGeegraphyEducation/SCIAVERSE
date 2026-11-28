(() => {
  'use strict';

  const stage=document.getElementById('waterStage');
  if(!stage)return;

  const status=document.getElementById('waterStatus');
  const choice=document.getElementById('waterProcessChoice');
  const resultTitle=document.getElementById('waterResultTitle');
  const resultText=document.getElementById('waterResultText');

  const PROCESSES={
    evaporation:{title:'Bốc hơi',text:'Năng lượng từ Mặt Trời làm nước lỏng ở bề mặt chuyển thành hơi nước và đi vào khí quyển.'},
    condensation:{title:'Ngưng tụ',text:'Không khí ẩm lạnh đi; hơi nước chuyển thành các giọt nước nhỏ, góp phần hình thành mây.'},
    precipitation:{title:'Mưa',text:'Các giọt nước trong mây lớn dần và rơi xuống khi không còn được dòng khí nâng đỡ.'},
    runoff:{title:'Dòng chảy mặt',text:'Nước mưa chảy trên bề mặt theo địa hình xuống suối, sông, hồ và đại dương.'},
    groundwater:{title:'Nước ngầm',text:'Một phần nước thấm qua đất, thấm sâu xuống vùng bão hòa và di chuyển trong tầng chứa nước.'}
  };

  let THREE,renderer,scene,camera,controls,processGroups={},resizeObserver,destroyed=false,activeProcess='evaporation';
  let flowParticles=[],playing=false,rafId=0,lastFrame=0,elapsed=0,speed=1,sequenceIndex=0;
  const PROCESS_KEYS=Object.keys(PROCESSES);
  const PHASE_SECONDS=5.2;
  const listeners=[];

  function setStatus(message,state='info'){
    status.textContent=message;
    status.dataset.state=state;
  }

  function listen(target,event,handler,options){
    target.addEventListener(event,handler,options);
    listeners.push([target,event,handler,options]);
  }

  function addBox(group,size,position,color,opacity=1){
    const mesh=new THREE.Mesh(
      new THREE.BoxGeometry(size[0],size[1],size[2]),
      new THREE.MeshStandardMaterial({color,transparent:opacity<1,opacity,roughness:.95,depthWrite:opacity>=1})
    );
    mesh.position.set(position[0],position[1],position[2]);
    group.add(mesh);
    return mesh;
  }

  function addArrow(group,from,to,color=0x7bc6df){
    const a=new THREE.Vector3(from[0],from[1],from[2]);
    const b=new THREE.Vector3(to[0],to[1],to[2]);
    const direction=b.clone().sub(a).normalize();
    group.add(new THREE.ArrowHelper(direction,a,a.distanceTo(b),color,.22,.14));
  }

  function addFlow(key,group,points,color,count=6){
    const curve=new THREE.CatmullRomCurve3(points.map(point=>new THREE.Vector3(point[0],point[1],point[2])));
    const particles=[];
    for(let i=0;i<count;i+=1){
      const particle=new THREE.Mesh(
        new THREE.SphereGeometry(.055,12,10),
        new THREE.MeshStandardMaterial({color,roughness:.5})
      );
      group.add(particle);
      particles.push(particle);
    }
    flowParticles.push({key,curve,particles});
  }

  function updateFlow(time){
    flowParticles.forEach(flow=>{
      if(flow.key!==activeProcess)return;
      flow.particles.forEach((particle,index)=>{
        const position=(time*.24+index/flow.particles.length)%1;
        particle.position.copy(flow.curve.getPointAt(position));
      });
    });
  }

  function setPlaybackState(){
    document.getElementById('waterPlay').disabled=playing;
    document.getElementById('waterPause').disabled=!playing;
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
    elapsed+=delta*speed;
    const nextIndex=Math.floor(elapsed/PHASE_SECONDS)%PROCESS_KEYS.length;
    if(nextIndex!==sequenceIndex){
      sequenceIndex=nextIndex;
      selectProcess(PROCESS_KEYS[sequenceIndex],false);
    }
    updateFlow(elapsed);
    render();
    rafId=requestAnimationFrame(playbackFrame);
  }

  function startPlayback(){
    if(playing||destroyed)return;
    playing=true;lastFrame=0;setPlaybackState();
    rafId=requestAnimationFrame(playbackFrame);
  }

  function resetPlayback(){
    stopPlayback();
    elapsed=0;sequenceIndex=0;
    selectProcess(PROCESS_KEYS[0],false);
    updateFlow(0);render();
  }

  function addCloud(group,x,y,z,scale=1){
    const cloud=new THREE.Group();
    [[0,0,0,.42],[.35,.08,0,.34],[-.35,.04,0,.3],[.12,.22,.02,.28]].forEach(p=>{
      const sphere=new THREE.Mesh(
        new THREE.SphereGeometry(p[3]*scale,20,14),
        new THREE.MeshStandardMaterial({color:0xdbe4e7,roughness:1})
      );
      sphere.position.set(p[0]*scale,p[1]*scale,p[2]*scale);
      cloud.add(sphere);
    });
    cloud.position.set(x,y,z);
    group.add(cloud);
  }

  function terrainHeight(x){
    const hill=1.45*Math.exp(-Math.pow((x-1.15)/.95,2));
    const ridge=.35*Math.exp(-Math.pow((x-.35)/.8,2));
    return hill+ridge-.38;
  }

  function makeTerrain(){
    const geometry=new THREE.PlaneGeometry(4.8,3.8,56,36);
    geometry.rotateX(-Math.PI/2);
    const positions=geometry.attributes.position;
    const colors=[];
    const low=new THREE.Color(0x557a54),high=new THREE.Color(0x8a7556);
    for(let i=0;i<positions.count;i+=1){
      const x=positions.getX(i),y=terrainHeight(x);
      positions.setY(i,y);
      const t=THREE.MathUtils.clamp((y+.38)/1.45,0,1);
      const color=low.clone().lerp(high,t);
      colors.push(color.r,color.g,color.b);
    }
    geometry.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));
    geometry.computeVertexNormals();
    return new THREE.Mesh(geometry,new THREE.MeshStandardMaterial({vertexColors:true,roughness:1,side:THREE.DoubleSide}));
  }

  function buildBase(){
    const base=new THREE.Group();
    addBox(base,[3.0,.38,3.8],[-2.55,-.56,0],0x256b91,.94);
    base.add(makeTerrain());

    const riverCurve=new THREE.CatmullRomCurve3([
      new THREE.Vector3(1.3,terrainHeight(1.3)+.05,.2),
      new THREE.Vector3(.65,terrainHeight(.65)+.05,-.1),
      new THREE.Vector3(-.1,terrainHeight(-.1)+.05,.05),
      new THREE.Vector3(-1.1,-.32,0)
    ]);
    base.add(new THREE.Mesh(
      new THREE.TubeGeometry(riverCurve,80,.105,10,false),
      new THREE.MeshStandardMaterial({color:0x3c9fc3,roughness:.35})
    ));

    const sun=new THREE.Mesh(
      new THREE.SphereGeometry(.36,24,18),
      new THREE.MeshStandardMaterial({color:0xffc75c,emissive:0xffa232,emissiveIntensity:.9})
    );
    sun.position.set(-2.6,2.2,.9);base.add(sun);

    addCloud(base,.15,2.25,0,1);
    addBox(base,[4.8,.25,3.8],[.8,-.5,0],0x6b5747,1);
    addBox(base,[4.0,.3,3.6],[.6,-.82,0],0x477b8c,.92);
    scene.add(base);
  }

  function buildProcessGroups(){
    processGroups.evaporation=new THREE.Group();
    addArrow(processGroups.evaporation,[-2.35,-.28,.1],[-2.1,1.35,.1],0x73c8ed);
    addFlow('evaporation',processGroups.evaporation,[[-2.35,-.28,.1],[-2.3,.3,.1],[-2.1,.9,.1],[-1.9,1.55,.1]],0x73c8ed,5);
    [[-2.3,.05,.08],[-2.23,.42,.07],[-2.17,.82,.06]].forEach(p=>{
      const drop=new THREE.Mesh(new THREE.SphereGeometry(p[2],12,10),new THREE.MeshStandardMaterial({color:0x83d4ef}));
      drop.position.set(p[0],p[1],p[2]===.08?.1:.12);
      processGroups.evaporation.add(drop);
    });
    scene.add(processGroups.evaporation);

    processGroups.condensation=new THREE.Group();
    addArrow(processGroups.condensation,[-.55,1.45,0],[.05,2.05,0],0x9bd9e8);
    addFlow('condensation',processGroups.condensation,[[-.55,1.45,0],[-.25,1.72,0],[.05,2.05,0]],0x9bd9e8,5);
    for(let i=0;i<5;i+=1){
      const droplet=new THREE.Mesh(new THREE.SphereGeometry(.045,10,8),new THREE.MeshStandardMaterial({color:0x83cce0}));
      droplet.position.set(-.1+i*.1,2.05+(i%2)*.12,.12);
      processGroups.condensation.add(droplet);
    }
    scene.add(processGroups.condensation);

    processGroups.precipitation=new THREE.Group();
    for(let i=0;i<9;i+=1){
      const x=-.1+(i%3)*.22,z=-.35+Math.floor(i/3)*.28;
      const drop=new THREE.Mesh(new THREE.SphereGeometry(.045,10,8),new THREE.MeshStandardMaterial({color:0x77c9e8}));
      drop.position.set(x,1.25-(i%3)*.13,z);
      processGroups.precipitation.add(drop);
    }
    addArrow(processGroups.precipitation,[.25,1.7,0],[.45,.35,0],0x77c9e8);
    addFlow('precipitation',processGroups.precipitation,[[.05,2.05,0],[.2,1.5,0],[.45,.35,0]],0x77c9e8,7);
    scene.add(processGroups.precipitation);

    processGroups.runoff=new THREE.Group();
    addArrow(processGroups.runoff,[1.3,terrainHeight(1.3)+.24,.2],[.55,terrainHeight(.55)+.16,-.1],0x77c9e8);
    addArrow(processGroups.runoff,[.55,terrainHeight(.55)+.14,-.1],[-.8,-.28,0],0x77c9e8);
    addFlow('runoff',processGroups.runoff,[[1.3,terrainHeight(1.3)+.24,.2],[.55,terrainHeight(.55)+.14,-.1],[-.8,-.28,0]],0x77c9e8,7);
    scene.add(processGroups.runoff);

    processGroups.groundwater=new THREE.Group();
    addArrow(processGroups.groundwater,[1.55,terrainHeight(1.55)+.03,.8],[1.5,-.68,.8],0x70c1d9);
    addArrow(processGroups.groundwater,[1.45,-.82,.8],[-1.2,-.82,.8],0x70c1d9);
    addArrow(processGroups.groundwater,[-1.0,-.82,.08],[-.75,terrainHeight(-.75)+.08,.08],0x70c1d9);
    const spring=new THREE.Mesh(new THREE.SphereGeometry(.09,14,10),new THREE.MeshStandardMaterial({color:0x75cce4}));
    spring.position.set(-.75,terrainHeight(-.75)+.08,.08);processGroups.groundwater.add(spring);
    addFlow('groundwater',processGroups.groundwater,[[1.55,terrainHeight(1.55)+.03,.8],[1.5,-.68,.8],[.5,-.82,.8],[-.75,terrainHeight(-.75)+.08,.08]],0x70c1d9,6);
    scene.add(processGroups.groundwater);
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

  function render(){
    if(!destroyed&&renderer&&scene&&camera&&!document.hidden)renderer.render(scene,camera);
  }

  function selectProcess(key,syncSequence=true){
    if(!PROCESSES[key])return;
    activeProcess=key;
    if(syncSequence){
      sequenceIndex=PROCESS_KEYS.indexOf(key);
      elapsed=sequenceIndex*PHASE_SECONDS;
    }
    Object.entries(processGroups).forEach(([name,group])=>{group.visible=name===key;});
    resultTitle.textContent=PROCESSES[key].title;
    resultText.textContent=PROCESSES[key].text;
    choice.querySelectorAll('button').forEach(button=>{
      const selected=button.dataset.process===key;
      button.classList.toggle('is-selected',selected);
      button.setAttribute('aria-pressed',String(selected));
    });
    updateFlow(elapsed);
    render();
  }

  function resize(){
    if(!renderer||!camera||destroyed)return;
    const width=Math.max(1,stage.clientWidth),height=Math.max(1,stage.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.5));
    renderer.setSize(width,height,false);
    camera.aspect=width/height;
    camera.position.set(5.2,3.8,width/height<.9?9.5:7.8);
    camera.lookAt(0,.2,0);
    camera.updateProjectionMatrix();
    if(controls)controls.update();
    render();
  }

  function destroy(){
    if(destroyed)return;
    destroyed=true;
    stopPlayback();
    if(resizeObserver)resizeObserver.disconnect();
    listeners.forEach(([target,event,handler,options])=>target.removeEventListener(event,handler,options));
    listeners.length=0;
    if(controls)controls.dispose();
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
    if(renderer){renderer.dispose();renderer.forceContextLoss();renderer.domElement.remove();}
  }

  function initialize(T){
    THREE=T;scene=new THREE.Scene();scene.background=new THREE.Color(0x10191f);
    camera=new THREE.PerspectiveCamera(38,1,.1,100);
    renderer=new THREE.WebGLRenderer({antialias:true,alpha:false,powerPreference:'low-power'});
    renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.5));renderer.setClearColor(0x10191f,1);
    renderer.domElement.setAttribute('role','img');
    renderer.domElement.setAttribute('aria-label','Mô hình đại dương, địa hình lục địa, mây, mưa, dòng chảy mặt và nước ngầm.');
    renderer.domElement.style.touchAction='none';stage.prepend(renderer.domElement);
    scene.add(new THREE.HemisphereLight(0xd9efff,0x263b37,1.15));
    const light=new THREE.DirectionalLight(0xffefd6,1.45);light.position.set(-2,6,4);scene.add(light);
    buildBase();buildProcessGroups();
    controls=new THREE.OrbitControls(camera,renderer.domElement);
    controls.enableDamping=false;controls.enablePan=false;controls.enableZoom=true;
    controls.minDistance=5.5;controls.maxDistance=13;controls.addEventListener('change',render);
    listen(choice,'click',event=>{
      const button=event.target.closest('button[data-process]');
      if(button)selectProcess(button.dataset.process);
    });
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
    listen(document.getElementById('waterPlay'),'click',startPlayback);
    listen(document.getElementById('waterPause'),'click',stopPlayback);
    listen(document.getElementById('waterReset'),'click',resetPlayback);
    listen(document.getElementById('waterSpeed'),'change',event=>{speed=Number(event.target.value)||1;});
    if('ResizeObserver'in window){resizeObserver=new ResizeObserver(resize);resizeObserver.observe(stage);}
    else listen(window,'resize',resize);
    selectProcess(activeProcess);updateFlow(0);setPlaybackState();resize();setStatus('Mô hình đã sẵn sàng.','ready');
  }

  Promise.all([
    window.SCIAVERSE_THREE_READY||Promise.reject(new Error('Không tải được Three.js.')),
    window.SCIAVERSE_ORBIT_CONTROLS_READY||Promise.reject(new Error('Không tải được OrbitControls.'))
  ]).then(([T])=>{if(!destroyed)initialize(T);}).catch(error=>{
    setStatus('Không thể khởi tạo mô hình 3D: '+error.message,'error');destroy();
  });
})();
