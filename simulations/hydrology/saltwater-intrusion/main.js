(() => {
'use strict';
const $=id=>document.getElementById(id);
let mode='estuary',flow='medium',tide='medium',pumping='medium',recharge='medium';
const rank={low:0,medium:1,high:2};
function setChoice(id,value){
 document.querySelectorAll('#'+id+' button').forEach(button=>{
  const active=button.dataset.value===value;
  button.classList.toggle('is-selected',active);button.setAttribute('aria-pressed',String(active));
 });
}
function update(){
 if(mode==='estuary'){
  const intrusion=(2-rank[flow])+rank[tide];
  const x=535-intrusion*65;
  $('saltWedge').setAttribute('d',`M640 185 C580 190 ${x+55} 212 ${x} 242 C${x+35} 262 560 275 640 280Z`);
  $('saltTendency').textContent=intrusion>=3?'Nêm mặn có xu hướng tiến sâu hơn trong sơ đồ.':intrusion<=1?'Dòng nước ngọt có xu hướng đẩy nêm mặn ra phía biển.':'Nêm mặn ở mức trung gian trong sơ đồ.';
  $('saltDescription').textContent='Lưu lượng sông đang ở mức '+flow+' và tác động thủy triều ở mức '+tide+'. Hình chỉ diễn tả xu hướng tương đối, không tính khoảng cách xâm nhập.';
 }else{
  const intrusion=rank[pumping]+(2-rank[recharge]);
  const x=intrusion*45;
  $('aquiferTransition').setAttribute('d',`M0 ${170-x*.35} C180 ${165-x*.55} 300 ${190-x*.8} 420 ${235-x} C500 ${270-x} 570 ${280-x} 640 ${280-x}`);
  $('saltTendency').textContent=intrusion>=3?'Vùng chuyển tiếp có xu hướng dịch chuyển vào đất liền và/hoặc dâng gần giếng.':intrusion<=1?'Dòng nước ngọt có xu hướng hạn chế xâm nhập mặn.':'Vị trí vùng chuyển tiếp ở mức trung gian trong sơ đồ.';
  $('saltDescription').textContent='Khai thác nước ngầm đang ở mức '+pumping+', bổ cập nước ngọt ở mức '+recharge+'. Hình không tính vị trí ranh mặn thực tế.';
 }
}
function setMode(value){
 mode=value;
 document.querySelectorAll('[data-mode]').forEach(button=>{
  const active=button.dataset.mode===value;
  button.classList.toggle('is-selected',active);button.setAttribute('aria-pressed',String(active));
 });
 $('estuaryPanel').hidden=value!=='estuary';$('aquiferPanel').hidden=value!=='aquifer';
 $('estuaryControls').hidden=value!=='estuary';$('aquiferControls').hidden=value!=='aquifer';
 $('saltControlsTitle').textContent=value==='estuary'?'Điều kiện cửa sông':'Điều kiện tầng chứa nước';
 update();
}
$('saltMode').addEventListener('click',event=>{const b=event.target.closest('[data-mode]');if(b)setMode(b.dataset.mode);});
[['riverFlow',v=>flow=v],['tideStrength',v=>tide=v],['pumpingLevel',v=>pumping=v],['rechargeLevel',v=>recharge=v]].forEach(([id,set])=>{
 $(id).addEventListener('click',event=>{const b=event.target.closest('[data-value]');if(!b)return;set(b.dataset.value);setChoice(id,b.dataset.value);update();});
});
setChoice('riverFlow',flow);setChoice('tideStrength',tide);setChoice('pumpingLevel',pumping);setChoice('rechargeLevel',recharge);
setMode('estuary');
})();