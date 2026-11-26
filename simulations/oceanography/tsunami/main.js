(() => {
'use strict';
const $=id=>document.getElementById(id);
const g=9.81;
const depth=$('waterDepth'),time=$('elapsedTime');
const fmt=(v,d=1)=>v.toLocaleString('vi-VN',{maximumFractionDigits:d});
function update(){
 const h=Number(depth.value),hours=Number(time.value);
 const speed=Math.sqrt(g*h);
 const kmh=speed*3.6;
 const distance=speed*hours*3600/1000;
 $('waterDepthOut').textContent=fmt(h,0)+' m';
 $('elapsedTimeOut').textContent=fmt(hours,2)+' giờ';
 $('waveSpeed').textContent=fmt(speed,1)+' m/s';
 $('waveSpeedKmh').textContent=fmt(kmh,0)+' km/h';
 $('waveDistance').textContent=fmt(distance,1)+' km';
 $('tsunamiFormula').textContent='c = √(g × h) = √(9,81 × '+fmt(h,0)+') = '+fmt(speed,1)+' m/s. Trong '+fmt(hours,2)+' giờ, sóng đi được khoảng '+fmt(distance,1)+' km nếu độ sâu không đổi.';
}
depth.addEventListener('input',update);
time.addEventListener('input',update);
update();
})();