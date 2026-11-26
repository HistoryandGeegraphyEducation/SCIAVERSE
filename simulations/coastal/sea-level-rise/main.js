(() => {
'use strict';
const $=id=>document.getElementById(id);
const terrain=[[0,130],[100,150],[200,170],[280,190],[360,215],[420,225],[480,250]];
function update(){
 const rise=Number($('seaRise').value);
 const waterY=250-rise*35;
 let segment=terrain.length-2;
 for(let i=0;i<terrain.length-1;i++){
  if(terrain[i][1]<=waterY&&terrain[i+1][1]>=waterY){segment=i;break;}
 }
 const [x1,y1]=terrain[segment],[x2,y2]=terrain[segment+1];
 const ratio=(waterY-y1)/(y2-y1||1);
 const x=x1+(x2-x1)*Math.max(0,Math.min(1,ratio));
 let d='M '+x.toFixed(1)+' '+waterY.toFixed(1);
 for(let i=segment+1;i<terrain.length;i++)d+=' L '+terrain[i][0]+' '+terrain[i][1];
 d+=' Z';
 $('floodFill').setAttribute('d',rise>0?d:'');
 $('seaSurface').setAttribute('d','M '+x.toFixed(1)+' '+waterY.toFixed(1)+' H640');
 $('seaFill').setAttribute('d','M480 '+waterY.toFixed(1)+' L640 '+waterY.toFixed(1)+' L640 360 L480 310Z');
 $('seaRiseOut').textContent=rise.toLocaleString('vi-VN',{minimumFractionDigits:1,maximumFractionDigits:2})+' m';
 $('seaLevelValue').textContent=rise.toLocaleString('vi-VN',{minimumFractionDigits:1,maximumFractionDigits:2})+' m';
 $('seaExplanation').textContent=rise===0?'Ở mốc nền của sơ đồ, đường nước chạm bờ tại vị trí giả định.':'Mặt nước được nâng '+rise.toLocaleString('vi-VN')+' m so với mốc nền giả định; phần màu xanh trên mặt cắt chỉ vùng địa hình thấp bị nước phủ trong sơ đồ.';
}
$('seaRise').addEventListener('input',update);
update();
})();