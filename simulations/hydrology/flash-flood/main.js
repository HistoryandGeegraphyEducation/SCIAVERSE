(() => {
'use strict';
const $=id=>document.getElementById(id);
const fmt=(v,d=2)=>v.toLocaleString('vi-VN',{maximumFractionDigits:d});
function update(){
 const i=Number($('rainIntensity').value),t=Number($('rainDuration').value),a=Number($('basinArea').value),c=Number($('runoffCoefficient').value),tc=Number($('timeConcentration').value);
 const p=i*t,r=c*p,v=r*a*10;
 const rationalApplicable=a<80&&t*60>=tc;
 const peak=rationalApplicable?0.00278*c*i*a:null;
 $('rainIntensityOut').textContent=fmt(i,0)+' mm/h';
 $('rainDurationOut').textContent=fmt(t,2)+' giờ';
 $('basinAreaOut').textContent=fmt(a,0)+' ha';
 $('runoffCoefficientOut').textContent=fmt(c,2);
 $('timeConcentrationOut').textContent=fmt(tc,0)+' phút';
 $('rainTotal').textContent=fmt(p,1)+' mm';
 $('runoffDepth').textContent=fmt(r,1)+' mm';
 $('runoffVolume').textContent=fmt(v,0)+' m³';
 $('peakDischarge').textContent=peak===null?'Không áp dụng':fmt(peak,2)+' m³/s';
 const peakNote=peak===null?(a>=80?' A từ 80 ha trở lên: ngoài phạm vi Rational Method của mô hình này.':' Thời lượng mưa ngắn hơn Tc nên không ước tính Qp theo Rational.'):' Qp = 0,00278 × C × i(Tc) × A = '+fmt(peak,2)+' m³/s theo phương pháp Rational.';
 $('floodFormula').textContent='P = i × t = '+fmt(p,1)+' mm; R = C × P = '+fmt(r,1)+' mm; V = R × A × 10 = '+fmt(v,0)+' m³.'+peakNote;
}
['rainIntensity','rainDuration','basinArea','runoffCoefficient','timeConcentration'].forEach(id=>$(id).addEventListener('input',update));
update();
})();