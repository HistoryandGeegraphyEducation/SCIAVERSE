(() => {
'use strict';
const $=id=>document.getElementById(id);
let hemisphere='north';
const fmt=(n,d=1)=>n.toLocaleString('vi-VN',{maximumFractionDigits:d});
function setHemisphere(value){
 hemisphere=value;
 document.querySelectorAll('[data-hemisphere]').forEach(button=>{
  const active=button.dataset.hemisphere===value;
  button.classList.toggle('is-selected',active);button.setAttribute('aria-pressed',String(active));
 });
 $('cycloneDiagram').dataset.hemisphere=value;
 update();
}
function update(){
 const sst=Number($('cycloneSst').value),humidity=Number($('cycloneHumidity').value),shear=Number($('cycloneShear').value),lat=Number($('cycloneLatitude').value);
 $('cycloneSstOut').textContent=fmt(sst,1)+'°C';$('cycloneHumidityOut').textContent=humidity+'%';$('cycloneShearOut').textContent=shear+' m/s';$('cycloneLatitudeOut').textContent=lat+'°';
 $('cycloneDirection').textContent=lat===0?'Ngay tại xích đạo: lực Coriolis bằng 0 trong mô hình lý tưởng; không gán chiều xoáy hình thành.':hemisphere==='north'?'Bắc bán cầu: hoàn lưu ngược chiều kim đồng hồ.':'Nam bán cầu: hoàn lưu cùng chiều kim đồng hồ.';
 $('cycloneLatitudeNote').textContent=lat<5?'Vĩ độ nhỏ hơn khoảng 5°: lực Coriolis thường quá yếu để duy trì hoàn lưu bão nhiệt đới.':'Vĩ độ đã xa vùng xích đạo hơn; điều này vẫn không đủ để kết luận bão sẽ hình thành.';
 $('sstState').textContent=sst>=26.5?'Đạt vùng nhiệt độ thường thuận lợi; cần xét độ sâu lớp nước ấm.':'Thấp hơn mốc tham khảo thường dùng; không phải ngưỡng tuyệt đối.';
 $('humidityState').textContent=humidity>=70?'Độ ẩm tầng giữa tương đối cao, thuận lợi hơn cho đối lưu sâu.':humidity>=50?'Độ ẩm trung bình; không thể kết luận chỉ từ giá trị này.':'Không khí tầng giữa khô hơn có thể hạn chế đối lưu sâu.';
 $('shearState').textContent=shear<10?'Đứt gió tương đối yếu theo mốc tham khảo, ít phá vỡ cấu trúc thẳng đứng hơn.':'Đứt gió lớn hơn có thể làm nghiêng hoặc phá vỡ cấu trúc đối lưu.';
 $('latitudeState').textContent=lat<5?'Gần xích đạo, lực Coriolis yếu.': 'Có lực Coriolis đáng kể hơn; vẫn cần nhiễu động ban đầu và các điều kiện khác.';
}
['cycloneSst','cycloneHumidity','cycloneShear','cycloneLatitude'].forEach(id=>$(id).addEventListener('input',update));
$('hemisphereChoice').addEventListener('click',event=>{const b=event.target.closest('[data-hemisphere]');if(b)setHemisphere(b.dataset.hemisphere);});
setHemisphere('north');
})();