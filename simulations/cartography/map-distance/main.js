(() => {
'use strict';
const stage=document.getElementById('distanceStage');if(!stage)return;
const status=document.getElementById('distanceStatus');
const scale=document.getElementById('distanceScale');
const toggle=document.getElementById('toggleMeasure');
const clearButton=document.getElementById('clearMeasure');
const mapOutput=document.getElementById('mapLengthOutput');
const groundOutput=document.getElementById('groundLengthOutput');
const straightOutput=document.getElementById('straightLengthOutput');
let T,scene,camera,renderer,controls,observer,usingResizeListener=false,raf=0,dead=false,measuring=false;
let routeLine=null;
const points=[],markers=[],listeners=[];
const mapPlane=new TPlane();
function TPlane(){this.value=null;}
function listen(el,event,fn){el.addEventListener(event,fn);listeners.push([el,event,fn]);}
function draw(){if(dead||!renderer||document.hidden)return;if(raf)cancelAnimationFrame(raf);raf=requestAnimationFrame(()=>{raf=0;if(!dead)renderer.render(scene,camera);});}
function mat(color,roughness=1){return new T.MeshStandardMaterial({color,roughness});}
function setStatus(text,state='info'){status.textContent=text;status.dataset.state=state;}
function formatGround(mapCm){const metres=mapCm*Number(scale.value)/100;return metres>=1000?(metres/1000).toLocaleString('vi-VN',{maximumFractionDigits:3})+' km':metres.toLocaleString('vi-VN',{maximumFractionDigits:1})+' m';}
function disposeRoute(){
 markers.forEach(marker=>{scene.remove(marker);marker.geometry.dispose();marker.material.dispose();});markers.length=0;
 if(routeLine){scene.remove(routeLine);routeLine.geometry.dispose();routeLine.material.dispose();routeLine=null;}
}
function clearPoints(){points.length=0;disposeRoute();mapOutput.textContent='0,00 cm';groundOutput.textContent='—';straightOutput.textContent='—';draw();}
function updateReadouts(){
 if(points.length<2){mapOutput.textContent=points.length?'0,00 cm':'0,00 cm';groundOutput.textContent='—';straightOutput.textContent='—';return;}
 let total=0;for(let i=1;i<points.length;i++)total+=points[i].distanceTo(points[i-1]);
 const straight=points[0].distanceTo(points[points.length-1]);
 mapOutput.textContent=total.toLocaleString('vi-VN',{minimumFractionDigits:2,maximumFractionDigits:2})+' cm';
 groundOutput.textContent=formatGround(total);
 straightOutput.textContent=formatGround(straight);
}
function rebuildRoute(){
 disposeRoute();
 points.forEach((point,index)=>{
  const marker=new T.Mesh(new T.SphereGeometry(.095,18,14),mat(index===0?0xc56b58:0x5f9a9d,.4));
  marker.position.copy(point);marker.position.y=.16;scene.add(marker);markers.push(marker);
 });
 if(points.length>1){
  const positions=points.map(p=>new T.Vector3(p.x,.17,p.z));
  const geometry=new T.BufferGeometry().setFromPoints(positions);
  routeLine=new T.Line(geometry,new T.LineBasicMaterial({color:0xd4a24d,linewidth:2}));scene.add(routeLine);
 }
 updateReadouts();draw();
}
function addPoint(x,z){
 if(points.length>=20){setStatus('Đã đạt giới hạn 20 điểm.','limit');return;}
 points.push(new T.Vector3(x,0,z));rebuildRoute();
}
function setMeasuring(value){
 measuring=value;toggle.setAttribute('aria-pressed',String(value));
 toggle.textContent=value?'Tắt chế độ đo':'Bật chế độ đo';
 if(controls)controls.enabled=!value;
 stage.dataset.measuring=String(value);
}
function pointerDown(event){
 if(!measuring||!renderer)return;
 const rect=renderer.domElement.getBoundingClientRect();
 const pointer=new T.Vector2((event.clientX-rect.left)/rect.width*2-1,-(event.clientY-rect.top)/rect.height*2+1);
 const raycaster=new T.Raycaster();raycaster.setFromCamera(pointer,camera);
 const hit=new T.Vector3();
 if(raycaster.ray.intersectPlane(mapPlane.value,hit)&&Math.abs(hit.x)<=4.9&&Math.abs(hit.z)<=3.05){
  event.preventDefault();addPoint(hit.x,hit.z);
 }
}
function resize(){
 if(!renderer||!camera||dead)return;
 const w=Math.max(1,stage.clientWidth),h=Math.max(1,stage.clientHeight);
 renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.5));renderer.setSize(w,h,false);camera.aspect=w/h;camera.position.set(0,8.5,8.5);camera.lookAt(0,0,0);camera.updateProjectionMatrix();draw();
}
function destroy(){
 if(dead)return;dead=true;if(raf)cancelAnimationFrame(raf);if(observer)observer.disconnect();if(usingResizeListener)window.removeEventListener('resize',resize);
 listeners.forEach(([el,event,fn])=>el.removeEventListener(event,fn));document.removeEventListener('visibilitychange',draw);window.removeEventListener('pagehide',destroy);
 if(renderer)renderer.domElement.removeEventListener('pointerdown',pointerDown);if(controls)controls.dispose();
 if(scene)scene.traverse(o=>{if(o.geometry)o.geometry.dispose();if(o.material){const ms=Array.isArray(o.material)?o.material:[o.material];ms.forEach(m=>m.dispose());}});
 if(renderer){renderer.dispose();renderer.domElement.remove();}
}
function init(THREE){
 T=THREE;scene=new T.Scene();scene.background=new T.Color(0x111b20);camera=new T.PerspectiveCamera(42,1,.1,80);
 renderer=new T.WebGLRenderer({antialias:true,alpha:false,powerPreference:'low-power'});renderer.domElement.setAttribute('role','img');renderer.domElement.setAttribute('aria-label','Sơ đồ 3D dùng để đặt các điểm và đo chiều dài tuyến.');renderer.domElement.style.touchAction='none';stage.prepend(renderer.domElement);
 scene.add(new T.HemisphereLight(0xe6eee9,0x36433c,1.35));const light=new T.DirectionalLight(0xffffff,1.5);light.position.set(-4,8,5);scene.add(light);
 const board=new T.Mesh(new T.BoxGeometry(10,.12,6.4),mat(0xc9c5b7));board.position.y=-.12;scene.add(board);
 const park=new T.Mesh(new T.CircleGeometry(1.05,40),mat(0x81927b));park.rotation.x=-Math.PI/2;park.position.set(-2.6,-.045,-1.2);scene.add(park);
 const water=new T.Mesh(new T.CircleGeometry(.72,40),mat(0x7897a3,.45));water.rotation.x=-Math.PI/2;water.scale.set(1.5,1,1);water.position.set(2.6,-.04,1.35);scene.add(water);
 const roadMat=mat(0x7b8586);
 const road1=new T.Mesh(new T.BoxGeometry(9.4,.025,.42),roadMat);road1.position.set(0,-.04,.4);scene.add(road1);
 const road2=new T.Mesh(new T.BoxGeometry(.42,.025,5.8),roadMat);road2.position.set(.8,-.04,-.1);scene.add(road2);
 for(let i=0;i<10;i++){const x=-4+(i%5)*1.9,z=-2.35+Math.floor(i/5)*4.5,b=new T.Mesh(new T.BoxGeometry(.55,.18,.48),mat([0xa88d6a,0x8999a0,0xb0a18a,0x778a83][i%4]));b.position.set(x,.02,z);scene.add(b);}
 mapPlane.value=new T.Plane(new T.Vector3(0,1,0),0);
 controls=new T.OrbitControls(camera,renderer.domElement);controls.enableDamping=false;controls.enablePan=false;controls.minDistance=7;controls.maxDistance=18;controls.maxPolarAngle=Math.PI/2.05;controls.addEventListener('change',draw);
 renderer.domElement.addEventListener('pointerdown',pointerDown);
 listen(scale,'change',updateReadouts);listen(toggle,'click',()=>setMeasuring(!measuring));listen(clearButton,'click',clearPoints);
 document.addEventListener('visibilitychange',draw);window.addEventListener('pagehide',destroy,{once:true});
 if('ResizeObserver'in window){observer=new ResizeObserver(resize);observer.observe(stage);}else{usingResizeListener=true;window.addEventListener('resize',resize);}
 resize();setMeasuring(false);setStatus('Sơ đồ đã sẵn sàng.','ready');
}
Promise.all([window.SCIAVERSE_THREE_READY||Promise.reject(new Error('Thiếu Three.js')),window.SCIAVERSE_ORBIT_CONTROLS_READY||Promise.reject(new Error('Thiếu OrbitControls'))])
.then(([THREE])=>{if(!dead)init(THREE);}).catch(e=>setStatus('Không thể khởi tạo sơ đồ 3D: '+e.message,'error'));
})();