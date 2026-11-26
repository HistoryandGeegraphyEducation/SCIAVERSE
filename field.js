(() => {
  'use strict';
  const params = new URLSearchParams(window.location.search);
  const fieldId = params.get('id') || '';
  const title = document.getElementById('fieldTitle');
  const description = document.getElementById('fieldDescription');
  const list = document.getElementById('fieldModels');

  const savedTheme = (() => {
    try { return localStorage.getItem('sciaverse-theme') || 'dark'; } catch { return 'dark'; }
  })();
  const resolvedTheme = savedTheme === 'light' ? 'light' : 'dark';
  document.documentElement.dataset.theme = resolvedTheme;

  function showError(message) {
    title.textContent = 'Không tìm thấy lĩnh vực';
    description.textContent = message;
    list.textContent = '';
  }

  function renderModels(models) {
    const accepted = models.filter(model =>
      model.fieldId === fieldId &&
      model.scientificStatus === 'validated' &&
      model.implementationStatus === 'verified-in-build'
    );
    if (!accepted.length) {
      const empty = document.createElement('p');
      empty.className = 'standalone-empty';
      empty.textContent = 'Chưa có mô hình nào trong lĩnh vực này được nghiệm thu và công bố. Các mô hình đang thẩm định sẽ chỉ xuất hiện sau khi hoàn tất quy trình.';
      list.appendChild(empty);
      return;
    }
    accepted.forEach(model => {
      const item = document.createElement('article');
      item.className = 'standalone-item';
      const heading = document.createElement('h3');
      heading.textContent = model.title;
      const status = document.createElement('p');
      status.textContent = 'Đã thẩm định khoa học và kiểm thử triển khai';
      item.append(heading, status);
      list.appendChild(item);
    });
  }

  Promise.all([
    fetch('data/fields.json').then(response => {
      if (!response.ok) throw new Error('Không tải được danh mục lĩnh vực.');
      return response.json();
    }),
    fetch('data/model-registry.json').then(response => {
      if (!response.ok) throw new Error('Không tải được danh mục mô hình.');
      return response.json();
    })
  ]).then(([fields, models]) => {
    const field = fields.find(item => item.id === fieldId);
    if (!field) {
      showError('Liên kết lĩnh vực không hợp lệ hoặc lĩnh vực chưa được đăng ký.');
      return;
    }
    title.textContent = field.name;
    description.textContent = field.description;
    document.title = 'SCIAVERSE — ' + field.name;
    renderModels(models);
  }).catch(error => showError(error.message || 'Không thể tải nội dung lĩnh vực.'));
})();
