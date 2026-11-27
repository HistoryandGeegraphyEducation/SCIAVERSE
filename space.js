(() => {
  'use strict';
  const params = new URLSearchParams(window.location.search);
  const spaceId = params.get('id') || '';
  const title = document.getElementById('spaceTitle');
  const purpose = document.getElementById('spacePurpose');
  const content = document.getElementById('spaceContent');

  const savedTheme = (() => {
    try { return localStorage.getItem('sciaverse-theme') || 'dark'; } catch { return 'dark'; }
  })();
  document.documentElement.dataset.theme = savedTheme === 'light' ? 'light' : 'dark';

  Promise.all([
    fetch('data/spaces.json').then(response => {
      if (!response.ok) throw new Error('Không tải được danh mục không gian.');
      return response.json();
    }),
    fetch('data/model-registry.json').then(response => {
      if (!response.ok) throw new Error('Không tải được danh mục mô hình.');
      return response.json();
    })
  ]).then(([spaces, models]) => {
    const space = spaces.find(item => item.id === spaceId);
    if (!space) throw new Error('Không tìm thấy không gian được yêu cầu.');
    title.textContent = space.name;
    purpose.textContent = space.purpose;
    document.title = 'SCIAVERSE — ' + space.name;

    if (spaceId === 'simulations') {
      const accepted = models.filter(model =>
        model.scientificStatus === 'validated' &&
        model.implementationStatus === 'verified-in-build' &&
        model.implementationPath
      );
      accepted.forEach(model => {
        const item = document.createElement('a');
        item.className = 'standalone-item';
        item.href = model.implementationPath;
        const heading = document.createElement('h3');
        heading.textContent = model.title;
        item.append(heading);
        content.appendChild(item);
      });
    } else if (spaceId === 'virtual-laboratories' || spaceId === 'scientific-data' || spaceId === 'learning-library') {
      content.replaceChildren();
    }
  }).catch(error => {
    title.textContent = 'Không thể mở không gian';
    purpose.textContent = error.message || 'Đã xảy ra lỗi khi tải nội dung.';
  });
})();
