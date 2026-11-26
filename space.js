(() => {
  'use strict';
  const params = new URLSearchParams(window.location.search);
  const spaceId = params.get('id') || '';
  const title = document.getElementById('spaceTitle');
  const purpose = document.getElementById('spacePurpose');
  const content = document.getElementById('spaceContent');
  const metadata = document.getElementById('spaceMetadata');
  const acceptance = document.getElementById('spaceAcceptance');

  const savedTheme = (() => {
    try { return localStorage.getItem('sciaverse-theme') || 'dark'; } catch { return 'dark'; }
  })();
  document.documentElement.dataset.theme = savedTheme === 'light' ? 'light' : 'dark';

  function appendList(target, values) {
    values.forEach(value => {
      const item = document.createElement('li');
      item.textContent = value;
      target.appendChild(item);
    });
  }

  function showEmpty(message) {
    const empty = document.createElement('p');
    empty.className = 'standalone-empty';
    empty.textContent = message;
    content.appendChild(empty);
  }

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
    appendList(metadata, space.requiredMetadata);
    appendList(acceptance, space.acceptance);

    if (spaceId === 'simulations') {
      const accepted = models.filter(model =>
        model.scientificStatus === 'validated' &&
        model.implementationStatus === 'verified-in-build'
      );
      if (accepted.length) {
        accepted.forEach(model => {
          const item = document.createElement('article');
          item.className = 'standalone-item';
          const heading = document.createElement('h3');
          heading.textContent = model.title;
          const field = document.createElement('p');
          field.textContent = model.fieldId;
          item.append(heading, field);
          content.appendChild(item);
        });
      } else {
        showEmpty('Chưa có mô hình nào được nghiệm thu để công bố. Các mô hình đang được thẩm định không được hiển thị như nội dung hoàn chỉnh.');
      }
    } else if (spaceId === 'virtual-laboratories') {
      showEmpty('Chưa có thí nghiệm ảo nào được nghiệm thu. Không gian này sẽ chỉ hiển thị thí nghiệm có quy trình, biến số, dữ liệu và lưu ý an toàn đã được kiểm chứng.');
    } else if (spaceId === 'scientific-data') {
      showEmpty('Chưa có bộ dữ liệu khoa học nào được công bố. Mỗi bộ dữ liệu cần nguồn truy xuất, đơn vị, phạm vi, thời gian và phương pháp thu thập.');
    } else {
      showEmpty('Thư viện đang được thiết lập. Tài liệu sẽ chỉ được đưa vào sau khi xác định nguồn, thông tin xuất bản và quyền sử dụng.');
    }
  }).catch(error => {
    title.textContent = 'Không thể mở không gian';
    purpose.textContent = error.message || 'Đã xảy ra lỗi khi tải nội dung.';
  });
})();
