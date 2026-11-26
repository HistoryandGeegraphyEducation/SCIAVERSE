(() => {
'use strict';
const $=id=>document.getElementById(id);
const controls=['faultLength','faultWidth','faultSlip','shearModulus','quakeDepth'];
const defaults={faultLength:40,faultWidth:15,faultSlip:1,shearModulus:30,quakeDepth:20};
const fmt=(v,d=2)=>v.toLocaleString('vi-VN',{maximumFractionDigits:d});
function update(){
 const L=Number($('faultLength').value),W=Number($('faultWidth').value),D=Number($('faultSlip').value),mu=Number($('shearModulus').value)*1e9,depth=Number($('quakeDepth').value);
 const area=L*1000*W*1000;
 const m0=mu*area*D;
 const mw=(2/3)*(Math.log10(m0)-9.1);
 $('faultLengthOut').textContent=L+' km';$('faultWidthOut').textContent=W+' km';$('faultSlipOut').textContent=fmt(D,1)+' m';$('shearModulusOut').textContent=fmt(mu/1e9,0)+' GPa';$('quakeDepthOut').textContent=depth+' km';
 $('seismicMoment').textContent=fmt(m0/1e19,3)+' × 10¹⁹ N·m';
 $('momentMagnitude').textContent='Mw '+fmt(mw,2);
 $('faultArea').textContent=fmt(L*W,0)+' km²';
 $('depthClass').textContent=depth<=70?'Nông':depth<=300?'Trung gian':'Sâu';
}
controls.forEach(id=>$(id).addEventListener('input',update));
$('quakeTrigger').addEventListener('click',()=>{
 const svg=document.querySelector('.quake-diagram');
 svg.classList.remove('is-active');void svg.getBoundingClientRect();svg.classList.add('is-active');
 $('quakeTrigger').setAttribute('aria-pressed','true');
 $('quakeWaveNote').textContent='Đã bật sơ đồ sóng. Đây là trình tự minh họa; mô hình không tính vận tốc truyền sóng hoặc mức rung lắc thực tế.';
});
$('quakeReset').addEventListener('click',()=>{
 controls.forEach(id=>$(id).value=defaults[id]);
 document.querySelector('.quake-diagram').classList.remove('is-active');
 $('quakeTrigger').setAttribute('aria-pressed','false');
 $('quakeWaveNote').textContent='Sóng P truyền nhanh hơn sóng S; sóng mặt thường truyền chậm hơn và có thể gây rung lắc mạnh ở gần bề mặt.';
 update();
});
update();
})();