(() => {
  'use strict';
  const LAYERS = {
    crust: {
      name:'Vỏ Trái Đất', state:'Rắn', depth:'0 đến khoảng 70 km', thickness:'Khoảng 5–70 km',
      material:'Đá silicat', description:'Lớp ngoài cùng, gồm vỏ đại dương và vỏ lục địa. Vỏ đại dương thường mỏng hơn vỏ lục địa; độ dày thay đổi theo vị trí.'
    },
    mantle: {
      name:'Lớp phủ', state:'Chủ yếu rắn; có thể biến dạng chậm', depth:'Từ đáy vỏ đến khoảng 2.900 km', thickness:'Khoảng 2.900 km',
      material:'Đá silicat giàu magiê và sắt', description:'Lớp rất dày nằm giữa vỏ và nhân ngoài. Vật chất chủ yếu ở trạng thái rắn, nhưng có thể biến dạng và dịch chuyển chậm trong thang thời gian địa chất.'
    },
    outer: {
      name:'Nhân ngoài', state:'Lỏng', depth:'Khoảng 2.900–5.150 km', thickness:'Khoảng 2.260 km',
      material:'Chủ yếu sắt và nickel', description:'Lớp kim loại lỏng bao quanh nhân trong. Sóng S không truyền qua lớp này; sóng P vẫn truyền qua nhưng bị khúc xạ.'
    },
    inner: {
      name:'Nhân trong', state:'Rắn', depth:'Khoảng 5.150–6.371 km', thickness:'Bán kính khoảng 1.220 km',
      material:'Chủ yếu sắt và nickel', description:'Phần trung tâm Trái Đất. Dù nhiệt độ rất cao, áp suất cực lớn giữ vật chất ở trạng thái rắn.'
    }
  };
  const WAVES = {
    p:'Sóng P là sóng nén, truyền được qua chất rắn và chất lỏng. Vì vậy, sóng P có thể truyền qua nhân ngoài lỏng, nhưng hướng truyền thay đổi do vận tốc sóng biến đổi giữa các lớp.',
    s:'Sóng S là sóng ngang, chỉ truyền qua chất rắn. Sóng S không truyền qua nhân ngoài lỏng; vùng bóng sóng S là một trong các bằng chứng quan trọng về trạng thái của nhân ngoài.'
  };
  const byId = id => document.getElementById(id);
  function selectLayer(id) {
    const layer = LAYERS[id];
    if (!layer) return;
    document.querySelectorAll('[data-layer]').forEach(button => {
      const active = button.dataset.layer === id;
      button.classList.toggle('is-selected',active);
      button.setAttribute('aria-pressed',String(active));
    });
    document.querySelectorAll('[data-layer-shape]').forEach(shape => {
      shape.classList.toggle('is-highlighted',shape.dataset.layerShape === id);
    });
    byId('layerName').textContent = layer.name;
    byId('layerState').textContent = layer.state;
    byId('layerDepth').textContent = layer.depth;
    byId('layerThickness').textContent = layer.thickness;
    byId('layerMaterial').textContent = layer.material;
    byId('layerDescription').textContent = layer.description;
  }
  function selectWave(id) {
    document.querySelectorAll('[data-wave]').forEach(button => {
      const active = button.dataset.wave === id;
      button.classList.toggle('is-selected',active);
      button.setAttribute('aria-pressed',String(active));
    });
    byId('waveExplanation').textContent = WAVES[id] || WAVES.p;
  }
  byId('layerSelect').addEventListener('click',event => {
    const button = event.target.closest('[data-layer]');
    if (button) selectLayer(button.dataset.layer);
  });
  document.querySelector('.wave-options').addEventListener('click',event => {
    const button = event.target.closest('[data-wave]');
    if (button) selectWave(button.dataset.wave);
  });
  selectLayer('crust');
  selectWave('p');
})();