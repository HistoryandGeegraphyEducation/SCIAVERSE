(() => {
'use strict';
const $=id=>document.getElementById(id);
const fmt=(v,d=2)=>v.toLocaleString('vi-VN',{maximumFractionDigits:d});
function update(){
 const i=Number($('rainIntensity').value),t=Number($('rainDuration').value),a=Number($('basinArea').value),c=Number($('runoffCoefficient').value);
 const p=i*t,r=c*p,v=r*a*1000;
 $('rainIntensityOut').textContent=fmt(i,0)+' mm/h';$('rainDurationOut').textContent=fmt(t,2)+' giờ';$('basinAreaOut').textContent=fmt(a,1)+' km²';$('runoffCoefficientOut').textContent=fmt(c,2);
 $('rainTotal').textContent=fmt(p,1)+' mm';$('runoffDepth').textContent=fmt(r,1)+' mm';$('runoffVolume').textContent=fmt(v,0)+' m³';
 $('floodFormula').textContent='P = i × t = '+fmt(p,1)+' mm; R = C × P = '+fmt(r,1)+' mm; V = R × A × 1.000 = '+fmt(v,0)+' m³. Kết quả là thể tích nước chảy tràn ước tính.';
}
['rainIntensity','rainDuration','basinArea','runoffCoefficient'].forEach(id=>$(id).addEventListener('input',update));
update();
})();