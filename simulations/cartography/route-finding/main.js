(() => {
'use strict';
const $ = (id) => document.getElementById(id);
const svgNS = 'http://www.w3.org/2000/svg';
const nodes = [
  {id:'A',lat:10.9000,lon:106.6100},
  {id:'B',lat:10.9100,lon:106.6900},
  {id:'C',lat:10.8600,lon:106.7700},
  {id:'D',lat:10.8100,lon:106.6300},
  {id:'E',lat:10.7900,lon:106.7100},
  {id:'F',lat:10.8200,lon:106.8400},
  {id:'G',lat:10.7100,lon:106.8800},
  {id:'H',lat:10.7000,lon:106.7600}
];
const edges = [
  {id:'AB',a:'A',b:'B'},{id:'AC',a:'A',b:'C'},{id:'AD',a:'A',b:'D'},
  {id:'BC',a:'B',b:'C'},{id:'BE',a:'B',b:'E'},{id:'CE',a:'C',b:'E'},
  {id:'CF',a:'C',b:'F'},{id:'DE',a:'D',b:'E'},{id:'EH',a:'E',b:'H'},
  {id:'EF',a:'E',b:'F'},{id:'FG',a:'F',b:'G'},{id:'HG',a:'H',b:'G'}
];
const A=6378137,F=1/298.257223563,B=A*(1-F);
const blocked=new Set();
const nodeById=Object.fromEntries(nodes.map(n=>[n.id,n]));
const edgeById=Object.fromEntries(edges.map(e=>[e.id,e]));
const midLat=nodes.reduce((s,n)=>s+n.lat,0)/nodes.length*Math.PI/180;
const cosMid=Math.cos(midLat);
const lonMin=106.59,lonMax=106.90,latMin=10.68,latMax=10.93;
function geodesicWgs84(p1,p2){
 const phi1=p1.lat*Math.PI/180,phi2=p2.lat*Math.PI/180;
 const L=(p2.lon-p1.lon)*Math.PI/180;
 const U1=Math.atan((1-F)*Math.tan(phi1)),U2=Math.atan((1-F)*Math.tan(phi2));
 const sinU1=Math.sin(U1),cosU1=Math.cos(U1),sinU2=Math.sin(U2),cosU2=Math.cos(U2);
 let lambda=L,sigma=0,sinSigma=0,cosSigma=0,sinAlpha=0,cosSqAlpha=0,cos2SigmaM=0;
 let converged=false;
 for(let i=0;i<200;i++){
  const sinLambda=Math.sin(lambda),cosLambda=Math.cos(lambda);
  const t1=cosU2*sinLambda,t2=cosU1*sinU2-sinU1*cosU2*cosLambda;
  sinSigma=Math.hypot(t1,t2);
  if(sinSigma===0)return 0;
  cosSigma=sinU1*sinU2+cosU1*cosU2*cosLambda;
  sigma=Math.atan2(sinSigma,cosSigma);
  sinAlpha=cosU1*cosU2*sinLambda/sinSigma;
  cosSqAlpha=1-sinAlpha*sinAlpha;
  cos2SigmaM=cosSqAlpha===0?0:cosSigma-2*sinU1*sinU2/cosSqAlpha;
  const C=F/16*cosSqAlpha*(4+F*(4-3*cosSqAlpha));
  const next=L+(1-C)*F*sinAlpha*(sigma+C*sinSigma*(cos2SigmaM+C*cosSigma*(-1+2*cos2SigmaM*cos2SigmaM)));
  if(Math.abs(next-lambda)<1e-12){lambda=next;converged=true;break;}
  lambda=next;
 }
 if(!converged)throw new Error('Phép lặp trắc địa WGS 84 không hội tụ cho một cạnh.');
 const uSq=cosSqAlpha*(A*A-B*B)/(B*B);
 const coefA=1+uSq/16384*(4096+uSq*(-768+uSq*(320-175*uSq)));
 const coefB=uSq/1024*(256+uSq*(-128+uSq*(74-47*uSq)));
 const deltaSigma=coefB*sinSigma*(cos2SigmaM+coefB/4*(cosSigma*(-1+2*cos2SigmaM*cos2SigmaM)-coefB/6*cos2SigmaM*(-3+4*sinSigma*sinSigma)*(-3+4*cos2SigmaM*cos2SigmaM)));
 return B*coefA*(sigma-deltaSigma);
}
edges.forEach(e=>{e.metres=geodesicWgs84(nodeById[e.a],nodeById[e.b]);});
function project(n){
 const x=110+(n.lon-lonMin)*Math.cos(midLat)*2900;
 const y=520-(n.lat-latMin)*1950;
 return {x,y};
}
function el(name,attrs,parent){
 const n=document.createElementNS(svgNS,name);
 Object.entries(attrs||{}).forEach(([k,v])=>n.setAttribute(k,String(v)));
 if(parent)parent.appendChild(n);
 return n;
}
function fmtKm(m){return (m/1000).toLocaleString('vi-VN',{minimumFractionDigits:2,maximumFractionDigits:2})+' km';}
function makeGrid(){
 const g=$('routeGrid');
 for(let i=0;i<=6;i++){
  const x=110+i*140;
  el('line',{x1:x,y1:28,x2:x,y2:520,class:'route-grid-line'},g);
  const lon=(lonMin+(lonMax-lonMin)*i/6).toFixed(2)+'°Đ';
  const t=el('text',{x:x+4,y:18,class:'route-grid-label'},g);t.textContent=lon;
 }
 for(let i=0;i<=5;i++){
  const y=40+i*96;
  el('line',{x1:80,y1:y,x2:930,y2:y,class:'route-grid-line'},g);
  const lat=(latMax-(latMax-latMin)*i/5).toFixed(2)+'°B';
  const t=el('text',{x:8,y:y+4,class:'route-grid-label'},g);t.textContent=lat;
 }
}
function fillSelectors(){
 ['routeStart','routeEnd'].forEach(id=>{
  const select=$(id);
  nodes.forEach(n=>{const option=document.createElement('option');option.value=n.id;option.textContent='Nút '+n.id;select.appendChild(option);});
 });
 $('routeStart').value='A';$('routeEnd').value='G';
}
function drawEdgeList(){
 const root=$('routeEdgeList');root.replaceChildren();
 edges.forEach(edge=>{
  const label=document.createElement('label');label.className='route-edge-item';
  const input=document.createElement('input');input.type='checkbox';input.checked=!blocked.has(edge.id);input.dataset.edge=edge.id;input.setAttribute('aria-label','Cho phép kết nối '+edge.a+' đến '+edge.b);
  const text=document.createElement('span');text.textContent=edge.a+' — '+edge.b;
  const small=document.createElement('small');small.textContent=fmtKm(edge.metres);
  text.appendChild(small);label.append(input,text);root.appendChild(label);
  input.addEventListener('change',()=>{if(input.checked)blocked.delete(edge.id);else blocked.add(edge.id);calculate();});
 });
}
function dijkstra(start,end){
 const dist=Object.fromEntries(nodes.map(n=>[n.id,Infinity]));
 const previous=Object.create(null),visited=new Set();
 dist[start]=0;
 while(visited.size<nodes.length){
  let current=null,best=Infinity;
  nodes.forEach(n=>{if(!visited.has(n.id)&&dist[n.id]<best){best=dist[n.id];current=n.id;}});
  if(current===null)break;
  if(current===end)break;
  visited.add(current);
  edges.forEach(edge=>{
   if(blocked.has(edge.id))return;
   let next=null;
   if(edge.a===current)next=edge.b;else if(edge.b===current)next=edge.a;
   if(!next||visited.has(next))return;
   const candidate=dist[current]+edge.metres;
   if(candidate<dist[next]){dist[next]=candidate;previous[next]=current;}
  });
 }
 if(!Number.isFinite(dist[end]))return null;
 const path=[];let at=end;
 while(at){path.unshift(at);if(at===start)break;at=previous[at];}
 if(path[0]!==start)return null;
 return {path,distance:dist[end]};
}
function renderMap(result){
 const edgeRoot=$('routeEdges'),pathRoot=$('routePath'),nodeRoot=$('routeNodes');
 edgeRoot.replaceChildren();pathRoot.replaceChildren();nodeRoot.replaceChildren();
 const activeEdges=new Set();
 if(result)for(let i=1;i<result.path.length;i++)activeEdges.add([result.path[i-1],result.path[i]].sort().join(''));
 edges.forEach(edge=>{
  const p1=project(nodeById[edge.a]),p2=project(nodeById[edge.b]);
  const key=[edge.a,edge.b].sort().join('');
  const cls='route-edge'+(blocked.has(edge.id)?' blocked':'')+(activeEdges.has(key)?' active':'');
  el('line',{x1:p1.x,y1:p1.y,x2:p2.x,y2:p2.y,class:cls},edgeRoot);
 });
 if(result){
  const pts=result.path.map(id=>{const p=project(nodeById[id]);return p.x+','+p.y;}).join(' ');
  el('polyline',{points:pts,fill:'none',stroke:'#e5b65f','stroke-width':8,'stroke-linecap':'round','stroke-linejoin':'round',opacity:.96},pathRoot);
 }
 const start=$('routeStart').value,end=$('routeEnd').value;
 nodes.forEach(n=>{
  const p=project(n),g=el('g',{class:'route-node'+(n.id===start?' start':'')+(n.id===end?' end':'')},nodeRoot);
  el('circle',{cx:p.x,cy:p.y,r:17},g);
  const t=el('text',{x:p.x,y:p.y+5},g);t.textContent=n.id;
 });
}
function calculate(){
 const start=$('routeStart').value,end=$('routeEnd').value;
 const distance=$('routeDistance'),segments=$('routeSegments'),sequence=$('routeSequence');
 if(start===end){
  distance.textContent='0,00 km';segments.textContent='0';sequence.textContent='Điểm xuất phát trùng với điểm đến.';renderMap({path:[start],distance:0});return;
 }
 const result=dijkstra(start,end);
 if(!result){
  distance.textContent='Không có tuyến';segments.textContent='—';sequence.textContent='Mạng lưới hiện không còn kết nối từ nút '+start+' đến nút '+end+'. Hãy mở lại một cạnh.';renderMap(null);return;
 }
 distance.textContent=fmtKm(result.distance);
 segments.textContent=String(result.path.length-1);
 sequence.textContent='Tuyến: '+result.path.join(' → ');
 renderMap(result);
}
function reset(){
 blocked.clear();$('routeStart').value='A';$('routeEnd').value='G';drawEdgeList();calculate();
}
$('routeStart').addEventListener('change',calculate);
$('routeEnd').addEventListener('change',calculate);
$('routeReset').addEventListener('click',reset);
makeGrid();fillSelectors();drawEdgeList();calculate();
window.addEventListener('pagehide',()=>{blocked.clear();});
})();