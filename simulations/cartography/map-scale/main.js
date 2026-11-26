(() => {
'use strict';
const stage=document.getElementById('mapScaleStage');if(!stage)return;
const status=document.getElementById('mapScaleStatus');
const ratio=document.getElementById('scaleRatio');
const length=document.getElementById('mapLength');
const lengthValue=document.getElementById('mapLengthValue');
const groundOutput=document.getElementById('groundDistance');
const equation=document.getElementById('scaleEquation');
const reset=document.getElementById('resetMapScale');
let T,scene,camera,renderer,controls,measureLine,pointB,markerB,observer,raf=0,dead=false;
const listeners=[];
function listen(el,event,fn){el.addEventListener(event,fn);listeners.push([el,event,fn]);}
function draw(){if(dead||!renderer||document.hidden)return;if(raf)cancelAnimationFrame(raf);raf=requestAnimationFrame(()=>{raf=0;if(!dead)renderer.render(scene,camera);});}
function mat(color,roughness=1){return new T.MeshStandardMaterial({color,roughness});}
function setStatus(text,state='info'){status.textContent=text;status.dataset.state=state;}
function formatDistance(cm){const d=cm*Number(ratio.value);const metres=d/100;if(metres>=1000){const km=metres/1000;return km.toLocaleString('vi-VN',{maximumFractionDigits:3})+' km';}return metres.toLocaleString('vi-VN',{maximumFractionDigits:1})+' m';}
function update(){
 const cm=Number(length.value),den=Number(ratio.value),groundCm=cm*den,metres=groundCm/100;
 lengthValue.textContent=cm.toLocaleString('vi-VN')+' cm';
 groundOutput.textContent=formatDistance(cm);
 const km=metres/1000;
 const groundText=km>=1?km.toLocaleString('vi-VN',{maximumFractionDigits:3})+' km':metres.toLocaleString('vi-VN',{maximumFractionDigits:1})+' m';
 equation.textContent=cm.toLocaleString('vi-VN')+' cm × '+den.toLocaleString('vi-VN')+' = '+groundCm.toLocaleString('vi-VN')+' cm = '+groundText;
 if(pointB){pointB.position.x=-3.5+cm*.65;if(markerB)markerB.position.x=pointB.position.x;updateLine();}
 draw();
}
function updateLine(){
 if(!measureLine||!pointB)return;
 const a=new T.Vector3(-3.5,.2,0),b=new T.Vector3(pointB.position.x,.2,0);
 const nextGeometry=new T.BufferGeometry().setFromPoints([a,b]);measureLine.geometry.dispose();measureLine.geometry=nextGeometry;
}
function resize(){
 if(!renderer||!camera||dead)return;
 const w=Math.max(1,stage.clientWidth),h=Math.max(1,stage.clientHeight);
 renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.5));renderer.setSize(w,h,false);camera.aspect=w/h;camera.position.set(0,6.6,9);camera.lookAt(0,0,0);camera.updateProjectionMatrix();draw();
}
function destroy(){
 if(dead)return;dead=true;if(raf)cancelAnimationFrame(raf);if(observer)observer.disconnect();
 listeners.forEach(([el,event,fn])=>el.removeEventListener(event,fn));document.removeEventListener('visibilitychange',draw);window.removeEventListener('pagehide',destroy);
 if(controls)controls.dispose();
 if(scene)scene.traverse(o=>{if(o.geometry)o.geometry.dispose();if(o.material){const ms=Array.isArray(o.material)?o.material:[o.material];ms.forEach(m=>m.dispose());}});
 if(renderer){renderer.dispose();renderer.domElement.remove();}
}
function init(THREE){
 T=THREE;scene=new T.Scene();scene.background=new T.Color(0x111b20);camera=new T.PerspectiveCamera(42,1,.1,80);
 renderer=new T.WebGLRenderer({antialias:true,alpha:false,powerPreference:'low-power'});renderer.domElement.setAttribute('role','img');renderer.domElement.setAttribute('aria-label','Sơ đồ 3D hai địa điểm và đoạn đo trên bản đồ.');renderer.domElement.style.touchAction='pan-y';stage.prepend(renderer.domElement);
 scene.add(new T.HemisphereLight(0xe7eee9,0x35413b,1.35));const light=new T.DirectionalLight(0xffffff,1.5);light.position.set(-4,8,5);scene.add(light);
 const board=new T.Mesh(new T.BoxGeometry(10,.12,6.4),mat(0xc9c5b7));board.position.y=-.12;scene.add(board);
 const road=new T.Mesh(new T.BoxGeometry(9.2,.025,.58),mat(0x7b8586));road.position.set(0,-.04,.7);scene.add(road);
 const crossing=new T.Mesh(new T.BoxGeometry(.55,.03,5.2),mat(0x7b8586));crossing.position.set(-1.8,-.035,-.6);scene.add(crossing);
 const park=new T.Mesh(new T.CircleGeometry(1.1,48),mat(0x81927b));park.rotation.x=-Math.PI/2;park.position.set(2,-.045,-1.3);scene.add(park);
 for(let i=0;i<8;i++){const x=-4+(i%4)*2.6,z=-2.4+Math.floor(i/4)*4.2,b=new T.Mesh(new T.BoxGeometry(.72,.24,.62),mat([0xa88d6a,0x8999a0,0xb0a18a,0x778a83][i%4]));b.position.set(x,.08,z);scene.add(b);}
 const pointA=new T.Mesh(new T.SphereGeometry(.16,24,18),mat(0xc56b58,.4));pointA.position.set(-3.5,.2,0);scene.add(pointA);
 pointB=new T.Mesh(new T.SphereGeometry(.16,24,18),mat(0x5b8ea4,.4));pointB.position.set(-.9,.2,0);scene.add(pointB);
 measureLine=new T.Line(new T.BufferGeometry().setFromPoints([new T.Vector3(-3.5,.2,0),new T.Vector3(-.9,.2,0)]),new T.LineBasicMaterial({color:0xd4a24d}));scene.add(measureLine);
 const markerA=new T.Mesh(new T.CylinderGeometry(.035,.05,.4,12),mat(0xc56b58));markerA.position.set(-3.5,.28,0);scene.add(markerA);
 markerB=new T.Mesh(new T.CylinderGeometry(.035,.05,.4,12),mat(0x5b8ea4));markerB.position.set(-.9,.28,0);scene.add(markerB);
 controls=new T.OrbitControls(camera,renderer.domElement);controls.enableDamping=false;controls.enablePan=false;controls.minDistance=7;controls.maxDistance=18;controls.maxPolarAngle=Math.PI/2.1;controls.addEventListener('change',draw);
 listen(ratio,'change',update);listen(length,'input',update);listen(reset,'click',()=>{ratio.value='50000';length.value='4';update();});
 document.addEventListener('visibilitychange',draw);window.addEventListener('pagehide',destroy,{once:true});
 if('ResizeObserver'in window){observer=new ResizeObserver(resize);observer.observe(stage);}else window.addEventListener('resize',resize);
 resize();update();setStatus('Mô hình đã sẵn sàng.','ready');
}
Promise.all([window.SCIAVERSE_THREE_READY||Promise.reject(new Error('Thiếu Three.js')),window.SCIAVERSE_ORBIT_CONTROLS_READY||Promise.reject(new Error('Thiếu OrbitControls'))])
.then(([THREE])=>{if(!dead)init(THREE);}).catch(e=>setStatus('Không thể khởi tạo mô hình 3D: '+e.message,'error'));
})();