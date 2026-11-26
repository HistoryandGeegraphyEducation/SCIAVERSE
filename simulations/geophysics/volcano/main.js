(() => {
'use strict';
const MAGMA={
 basaltic:{name:'Bazơ (basalt)',silica:'45–53%',viscosity:'Thấp',description:'Magma bazan thường có độ nhớt thấp, khí dễ thoát hơn và thường tạo dòng dung nham.'},
 andesitic:{name:'Trung tính (andesite)',silica:'54–62%',viscosity:'Trung bình',description:'Magma andesit có thành phần và độ nhớt trung gian. Kiểu phun thay đổi đáng kể theo lượng khí, nhiệt độ, tinh thể và điều kiện giảm áp.'},
 rhyolitic:{name:'Axit (rhyolite)',silica:'Khoảng 69% trở lên',viscosity:'Cao',description:'Magma rhyolit thường có độ nhớt cao; khí khó thoát hơn và có thể tích tụ áp suất, làm tăng xu hướng phun nổ.'}
};
const GAS={low:'thấp',medium:'trung bình',high:'cao'};
let magma='basaltic',gas='low';
const $=id=>document.getElementById(id);
function update(){
 const m=MAGMA[magma];
 $('silicaValue').textContent=m.silica;
 $('viscosityValue').textContent=m.viscosity;
 let tendency,extra,style='mixed';
 if(magma==='basaltic'&&gas==='low'){
  tendency='Xu hướng thường gặp: phun tràn';
  extra=m.description+' Khí hòa tan đang ở mức thấp trong lựa chọn minh họa.';
  style='effusive';
 }else if(gas==='high'&&(magma==='andesitic'||magma==='rhyolitic')){
  tendency='Xu hướng phun nổ tăng';
  extra=m.description+' Khi khí hòa tan cao, khả năng khí bị giữ lại và giải phóng đột ngột tăng lên; đây không phải dự báo một vụ phun trào cụ thể.';
  style='explosive';
 }else{
  tendency='Chưa thể phân loại chỉ từ hai biến';
  extra=m.description+' Mức khí được chọn là '+GAS[gas]+'. Cần thêm dữ liệu về nhiệt độ, tinh thể, hàm lượng nước, tốc độ giảm áp và tương tác với nước bên ngoài.';
 }
 $('eruptionTendency').textContent=tendency;
 $('eruptionExplanation').textContent=extra;
 $('volcanoDiagram').dataset.style=style;
}
function setGroup(id,attr,value){
 document.querySelectorAll('#'+id+' button').forEach(button=>{
  const active=button.dataset[attr]===value;
  button.classList.toggle('is-selected',active);
  button.setAttribute('aria-pressed',String(active));
 });
}
$('magmaChoice').addEventListener('click',event=>{
 const button=event.target.closest('[data-magma]');
 if(!button)return;
 magma=button.dataset.magma;
 setGroup('magmaChoice','magma',magma);
 update();
});
$('gasChoice').addEventListener('click',event=>{
 const button=event.target.closest('[data-gas]');
 if(!button)return;
 gas=button.dataset.gas;
 setGroup('gasChoice','gas',gas);
 update();
});
update();
})();