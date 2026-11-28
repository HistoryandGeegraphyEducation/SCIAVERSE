(() => {
'use strict';
const stage=document.getElementById('compassStage');if(!stage)return;
const status=document.getElementById('compassStatus');
const declination=document.getElementById('declinationRange');
const magneticBearing=document.getElementById('magneticBearingRange');
const declinationValue=document.getElementById('declinationValue');
const magneticBearingValue=document.getElementById('magneticBearingValue');
const trueBearingValue=document.getElementById('trueBearingValue');
const reset=document.getElementById('resetCompass');
let T,scene,camera,renderer,controls,needle,bearingArrow,observer,usingResizeListener=false,raf=0,dead=false;
const listeners=[];
function listen(el,event,fn){el.addEventListener(event,fn);listeners.push([el,event,fn]);}
function draw(){if(dead||!renderer||document.hidden)return;if(raf)cancelAnimationFrame(raf);raf=requestAnimationFrame(()=>{raf=0;if(!dead)renderer.render(scene,camera);});}
function material(color,roughness=.6){return new T.MeshStandardMaterial({color,roughness});}
function setStatus(text,state='info'){status.textContent=text;status.dataset.state=state;}
function formatBearing(value){
 const normalized=((value%360)+360)%360;
 const rounded=Math.round(normalized*10)/10;
 const stable=rounded>=360?0:rounded;
 const [degrees,fraction]=stable.toFixed(1).split('.');
 return degrees.padStart(3,'0')+(fraction==='0'?'':'.'+fraction)+'°';
}
function makeNeedle(){
 const group=new T.Group();
 const north=new T.Mesh(new T.ConeGeometry(.14,1.7,4),material(0xc85b4d,.35));
 north.position.z=-.72;north.rotation.x=-Math.PI/2;group.add(north);
 const south=new T.Mesh(new T.ConeGeometry(.14,1.7,4),material(0x7895a6,.4));
 south.position.z=.72;south.rotation.x=Math.PI/2;group.add(south);
 const hub=new T.Mesh(new T.CylinderGeometry(.19,.19,.18,32),material(0xc2a56d,.3));hub.position.y=.08;group.add(hub);
 scene.add(group);return group;
}
function updateValues(){
 const D=Number(declination.value),Bm=Number(magneticBearing.value);
 const Bt=((Bm+D)%360+360)%360;
 declinationValue.textContent=(D>0?'+':'')+D.toFixed(1).replace('.0','')+'°';
 magneticBearingValue.textContent=String(Bm).padStart(3,'0')+'°';
 trueBearingValue.textContent=formatBearing(Bt);
 if(needle)needle.rotation.y=-D*Math.PI/180;
 if(bearingArrow){const rad=Bt*Math.PI/180;bearingArrow.setDirection(new T.Vector3(Math.sin(rad),0,-Math.cos(rad)).normalize());}
 draw();
}
function resize(){
 if(!renderer||!camera||dead)return;
 const w=Math.max(1,stage.clientWidth),h=Math.max(1,stage.clientHeight);
 renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.5));renderer.setSize(w,h,false);
 const aspect=w/h;camera.left=-4.2*aspect;camera.right=4.2*aspect;camera.top=4.2;camera.bottom=-4.2;camera.updateProjectionMatrix();draw();
}
function destroy(){
 if(dead)return;dead=true;if(raf)cancelAnimationFrame(raf);if(observer)observer.disconnect();if(usingResizeListener)window.removeEventListener('resize',resize);
 listeners.forEach(([el,event,fn])=>el.removeEventListener(event,fn));document.removeEventListener('visibilitychange',draw);window.removeEventListener('pagehide',destroy);
 if(controls)controls.dispose();
 if(scene)scene.traverse(o=>{if(o.geometry)o.geometry.dispose();if(o.material){const ms=Array.isArray(o.material)?o.material:[o.material];ms.forEach(m=>m.dispose());}});
 if(renderer){renderer.dispose();renderer.domElement.remove();}
}
function init(THREE){
 T=THREE;scene=new T.Scene();scene.background=new T.Color(0x111b20);
 camera=new T.OrthographicCamera(-4.2,4.2,4.2,-4.2,.1,50);camera.position.set(0,10,0);camera.up.set(0,0,-1);camera.lookAt(0,0,0);
 renderer=new T.WebGLRenderer({antialias:true,alpha:false,powerPreference:'low-power'});renderer.domElement.setAttribute('role','img');renderer.domElement.setAttribute('aria-label','La bàn 3D thể hiện Bắc địa lí, Bắc từ và hướng phương vị.');renderer.domElement.style.touchAction='pan-y';stage.prepend(renderer.domElement);
 scene.add(new T.HemisphereLight(0xe3edf1,0x344047,1.5));
 const light=new T.DirectionalLight(0xffffff,1.4);light.position.set(-3,8,5);scene.add(light);
 const base=new T.Mesh(new T.CylinderGeometry(3.3,3.45,.34,96),material(0x4d5b62,.38));base.position.y=-.22;scene.add(base);
 const face=new T.Mesh(new T.CylinderGeometry(3.18,3.18,.08,96),material(0xdce2df,.65));face.position.y=-.015;scene.add(face);
 const ring=new T.Mesh(new T.TorusGeometry(3.18,.07,12,128),material(0x9b875f,.35));ring.rotation.x=Math.PI/2;ring.position.y=.04;scene.add(ring);
 for(let i=0;i<72;i++){const angle=i*Math.PI/36,major=i%6===0;const tick=new T.Mesh(new T.BoxGeometry(major?.045:.022,major?.22:.11,.025),material(major?0x243944:0x74848a));tick.position.set(Math.sin(angle)*2.96,.06,-Math.cos(angle)*2.96);tick.rotation.y=angle;scene.add(tick);}
 const northLine=new T.ArrowHelper(new T.Vector3(0,0,-1),new T.Vector3(0,.14,0),2.55,0x263c4a,.34,.2);scene.add(northLine);
 needle=makeNeedle();needle.position.y=.16;
 bearingArrow=new T.ArrowHelper(new T.Vector3(Math.sin(Math.PI/4),0,-Math.cos(Math.PI/4)),new T.Vector3(0,.22,0),2.35,0xd29a46,.34,.2);scene.add(bearingArrow);
 controls=new T.OrbitControls(camera,renderer.domElement);controls.enableRotate=false;controls.enablePan=false;controls.enableZoom=false;
 listen(declination,'input',updateValues);listen(magneticBearing,'input',updateValues);
 listen(reset,'click',()=>{declination.value='0';magneticBearing.value='45';updateValues();});
 document.addEventListener('visibilitychange',draw);window.addEventListener('pagehide',destroy,{once:true});
 if('ResizeObserver'in window){observer=new ResizeObserver(resize);observer.observe(stage);}else{usingResizeListener=true;window.addEventListener('resize',resize);}
 resize();updateValues();setStatus('La bàn đã sẵn sàng.','ready');
}
Promise.all([window.SCIAVERSE_THREE_READY||Promise.reject(new Error('Thiếu Three.js')),window.SCIAVERSE_ORBIT_CONTROLS_READY||Promise.reject(new Error('Thiếu OrbitControls'))])
.then(([THREE])=>{if(!dead)init(THREE);}).catch(e=>setStatus('Không thể khởi tạo la bàn 3D: '+e.message,'error'));
})();