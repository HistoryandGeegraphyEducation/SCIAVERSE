(() => {
'use strict';
const $=id=>document.getElementById(id);
const fmt=(v,d=1)=>v.toLocaleString('vi-VN',{maximumFractionDigits:d});
function update(){
 const beta=Number($('slopeAngle').value)*Math.PI/180;
 const c=Number($('cohesion').value),phi=Number($('frictionAngle').value)*Math.PI/180;
 const gamma=Number($('unitWeight').value),z=Number($('soilDepth').value),u=Number($('porePressure').value);
 const normal=gamma*z*Math.cos(beta)**2-u;
 const driving=gamma*z*Math.sin(beta)*Math.cos(beta);
 $('slopeAngleOut').textContent=fmt(beta*180/Math.PI,0)+'°';$('cohesionOut').textContent=fmt(c,1)+' kPa';$('frictionAngleOut').textContent=fmt(phi*180/Math.PI,0)+'°';$('unitWeightOut').textContent=fmt(gamma,1)+' kN/m³';$('soilDepthOut').textContent=fmt(z,1)+' m';$('porePressureOut').textContent=fmt(u,0)+' kPa';
 if(normal<=0||driving<=0){
  $('safetyFactor').textContent='Không xác định';$('slopeState').textContent='Ngoài miền áp dụng';$('slopeExplanation').textContent='Ứng suất pháp hữu hiệu không dương hoặc mẫu số không hợp lệ. Bộ tham số này nằm ngoài giả định tiếp xúc của mô hình mái dốc vô hạn.';
  return;
 }
 const fs=(c+normal*Math.tan(phi))/driving;
 $('safetyFactor').textContent=fmt(fs,2);
 if(fs<1){$('slopeState').textContent='Mất ổn định';$('slopeExplanation').textContent='FS nhỏ hơn 1: trong giả định của mô hình, ứng suất gây trượt vượt sức kháng cắt.';}
 else if(fs<1.05){$('slopeState').textContent='Gần giới hạn';$('slopeExplanation').textContent='FS chỉ nhỉnh hơn 1: trạng thái tính toán gần giới hạn cân bằng; sai khác nhỏ của tham số có thể làm đổi kết quả.';}
 else{$('slopeState').textContent='Ổn định';$('slopeExplanation').textContent='FS lớn hơn 1: sức kháng cắt tính toán lớn hơn ứng suất gây trượt trong giả định hiện tại.';}
}
['slopeAngle','cohesion','frictionAngle','unitWeight','soilDepth','porePressure'].forEach(id=>$(id).addEventListener('input',update));
update();
})();