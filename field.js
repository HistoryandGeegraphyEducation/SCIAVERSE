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

  function renderModels(models, labs) {
    const availableModels = models.filter(model =>
      model.fieldId === fieldId && Boolean(model.implementationPath)
    );
    const availableLabs = labs
      .filter(lab => lab.fieldId === fieldId && Boolean(lab.implementationPath))
      .map(lab => ({ title: lab.title, implementationPath: lab.implementationPath }));
    [...availableModels, ...availableLabs].forEach(model => {
      const item = document.createElement('a');
      item.className = 'standalone-item';
      item.href = model.implementationPath;
      const heading = document.createElement('h3');
      heading.textContent = model.title;
      item.append(heading);
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
    }),
    fetch('data/virtual-labs.json').then(response => {
      if (!response.ok) throw new Error('Không tải được danh mục thí nghiệm.');
      return response.json();
    })
  ]).then(([fields, models, labs]) => {
    const field = fields.find(item => item.id === fieldId);
    if (!field) {
      showError('Liên kết lĩnh vực không hợp lệ hoặc lĩnh vực chưa được đăng ký.');
      return;
    }
    title.textContent = field.name;
    description.textContent = field.description;
    document.title = 'SCIAVERSE — ' + field.name;
    renderModels(models, labs);
  }).catch(error => showError(error.message || 'Không thể tải nội dung lĩnh vực.'));
})();
