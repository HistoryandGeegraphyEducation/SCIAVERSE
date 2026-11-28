(() => {
  'use strict';

  const params = new URLSearchParams(window.location.search);
  const spaceId = params.get('id') || '';
  const title = document.getElementById('spaceTitle');
  const purpose = document.getElementById('spacePurpose');
  const content = document.getElementById('spaceContent');
  const contentTitle = document.getElementById('spaceContentTitle');

  const savedTheme = (() => {
    try { return localStorage.getItem('sciaverse-theme') || 'dark'; } catch { return 'dark'; }
  })();
  document.documentElement.dataset.theme = savedTheme === 'light' ? 'light' : 'dark';

  const dateFormat = new Intl.DateTimeFormat('vi-VN', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit'
  });

  function node(tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined && text !== null) element.textContent = String(text);
    return element;
  }

  function link(url, text, className = '') {
    const element = node('a', className, text);
    element.href = url;
    element.target = '_blank';
    element.rel = 'noopener noreferrer';
    return element;
  }

  function showError(message) {
    content.replaceChildren(node('p', 'standalone-empty', message));
  }

  async function readJson(path) {
    const response = await fetch(path);
    if (!response.ok) throw new Error('Không tải được ' + path);
    return response.json();
  }

  function renderSimulationList(models) {
    contentTitle.textContent = 'Mô hình đã nghiệm thu';
    const accepted = models.filter(model =>
      model.scientificStatus === 'validated' &&
      model.implementationStatus === 'verified-in-build' &&
      model.implementationPath
    );
    if (!accepted.length) {
      showError('Chưa có mô hình đạt đồng thời điều kiện nghiệm thu khoa học và kiểm thử kỹ thuật.');
      return;
    }
    const list = node('div', 'standalone-list');
    accepted.forEach(model => {
      const item = node('a', 'standalone-item');
      item.href = model.implementationPath;
      item.append(node('h3', '', model.title));
      list.append(item);
    });
    content.replaceChildren(list);
  }

  function renderLaboratories(labs) {
    contentTitle.textContent = 'Thí nghiệm';
    if (!labs.length) {
      showError('Chưa có thí nghiệm được đăng ký.');
      return;
    }
    const list = node('div', 'space-card-list');
    labs.forEach(lab => {
      const card = node('article', 'space-content-card');
      const heading = node('h3');
      const labLink = node('a','space-card-link',lab.title);
      labLink.href = lab.implementationPath;
      heading.append(labLink);
      card.append(heading);
      card.append(node('p', 'space-card-question', lab.experimentQuestion));
      const meta = node('dl', 'space-meta-grid');
      meta.append(node('dt', '', 'Lĩnh vực'), node('dd', '', lab.fieldName));
      meta.append(node('dt', '', 'Biến số'), node('dd', '', lab.variables.map(item => item.symbol + ' (' + item.unit + ')').join(', ')));
      meta.append(node('dt', '', 'Mô hình'), node('dd', '', lab.dataModel));
      card.append(meta);
      const sources = node('p', 'space-source-line');
      sources.append(document.createTextNode('Nguồn: '));
      lab.sources.forEach((source, index) => {
        if (index) sources.append(document.createTextNode('; '));
        sources.append(link(source.url, source.title));
      });
      card.append(sources);
      list.append(card);
    });
    content.replaceChildren(list);
  }

  function renderDatasetExplorer(dataset) {
    contentTitle.textContent = 'Bộ dữ liệu';
    const shell = node('section', 'space-data-explorer');
    shell.append(node('h3','space-data-title',dataset.title));
    const filters = node('div', 'space-filter-row');
    const rangeLabel = node('label', 'space-filter');
    rangeLabel.append(node('span', '', 'Khoảng thời gian'));
    const range = node('select');
    range.id = 'datasetRange';
    [['day','24 giờ'],['week','7 ngày'],['month','30 ngày']].forEach(([value,label]) => {
      const option = node('option','',label); option.value=value; range.append(option);
    });
    rangeLabel.append(range);

    const magnitudeLabel = node('label', 'space-filter');
    magnitudeLabel.append(node('span', '', 'Độ lớn tối thiểu'));
    const magnitude = node('select');
    magnitude.id = 'datasetMagnitude';
    [['0','Tất cả'],['1','1,0'],['2.5','2,5'],['4.5','4,5']].forEach(([value,label]) => {
      const option = node('option','',label); option.value=value; magnitude.append(option);
    });
    magnitudeLabel.append(magnitude);

    const refresh = node('button', 'model-button primary', 'Tải dữ liệu');
    refresh.type = 'button';
    filters.append(rangeLabel, magnitudeLabel, refresh);
    const status = node('p', 'space-data-status', 'Đang tải dữ liệu từ USGS');
    status.setAttribute('role','status');
    const summary = node('div', 'space-data-summary');
    const tableWrap = node('div', 'space-table-wrap');
    shell.append(filters, status, summary, tableWrap);

    const metadata=node('dl','space-meta-grid');
    metadata.append(node('dt','','Phạm vi không gian'),node('dd','',dataset.spatialCoverage));
    metadata.append(node('dt','','Khoảng thời gian'),node('dd','',dataset.timeRange));
    metadata.append(node('dt','','Đơn vị'),node('dd','',dataset.units.join('; ')));
    metadata.append(node('dt','','Điều kiện sử dụng'),node('dd','',dataset.license));
    const sourceLine = node('p', 'space-source-line');
    sourceLine.append(document.createTextNode('Nguồn dữ liệu: '), link(dataset.sourceUrl, dataset.provider + ' ComCat'));
    const method = node('p', 'space-method-note', dataset.methodology);
    shell.append(metadata,sourceLine,method);
    content.replaceChildren(shell);

    let requestToken = 0;
    async function loadFeed() {
      const token = ++requestToken;
      status.textContent = 'Đang tải dữ liệu từ USGS';
      status.dataset.state = 'loading';
      refresh.disabled = true;
      tableWrap.replaceChildren();
      summary.replaceChildren();
      try {
        const feedUrl = dataset.feedUrls[range.value];
        const response = await fetch(feedUrl, { cache: 'no-store' });
        if (!response.ok) throw new Error('USGS trả về mã ' + response.status);
        const feed = await response.json();
        if (token !== requestToken) return;
        const minMagnitude = Number(magnitude.value);
        const filteredEvents = (feed.features || []).filter(feature => {
          const value = feature.properties && feature.properties.mag;
          return value !== null && value !== undefined && Number(value) >= minMagnitude;
        });
        const events = filteredEvents.slice(0, 50);
        const generated = feed.metadata && Number(feed.metadata.generated);
        const updated = generated ? dateFormat.format(new Date(generated)) : 'Không có thời điểm cập nhật';
        status.textContent = 'Cập nhật: ' + updated + ' | Hiển thị ' + events.length + '/' + filteredEvents.length + ' sự kiện phù hợp';
        status.dataset.state = 'ready';
        const countStat=node('div','space-data-stat');
        countStat.append(node('strong','',events.length),node('span','','Sự kiện hiển thị'));
        const updatedStat=node('div','space-data-stat');
        updatedStat.append(node('strong','',updated),node('span','','Thời điểm nguồn cập nhật'));
        summary.append(countStat,updatedStat);

        if (!events.length) {
          tableWrap.append(node('p','standalone-empty','Không có sự kiện phù hợp với bộ lọc.'));
          return;
        }
        const table = node('table','space-data-table');
        const thead = node('thead');
        const headerRow = node('tr');
        ['Thời gian','Độ lớn','Độ sâu (km)','Vị trí'].forEach(label => headerRow.append(node('th','',label)));
        thead.append(headerRow);
        const tbody = node('tbody');
        events.forEach(feature => {
          const properties = feature.properties || {};
          const coordinates = feature.geometry && feature.geometry.coordinates || [];
          const row = node('tr');
          const time = properties.time ? dateFormat.format(new Date(properties.time)) : '—';
          row.append(node('td','',time));
          row.append(node('td','space-number',properties.mag === null ? '—' : Number(properties.mag).toFixed(1).replace('.',',')));
          row.append(node('td','space-number',Number.isFinite(Number(coordinates[2])) ? Number(coordinates[2]).toFixed(1).replace('.',',') : '—'));
          const placeCell = node('td');
          if (properties.url) placeCell.append(link(properties.url, properties.place || 'Chi tiết sự kiện'));
          else placeCell.textContent = properties.place || '—';
          row.append(placeCell);
          tbody.append(row);
        });
        table.append(thead,tbody);
        tableWrap.append(table);
      } catch (error) {
        if (token !== requestToken) return;
        status.textContent = 'Không tải được dữ liệu USGS: ' + error.message;
        status.dataset.state = 'error';
        tableWrap.append(link(dataset.sourceUrl, 'Mở nguồn dữ liệu USGS'));
      } finally {
        if (token === requestToken) refresh.disabled = false;
      }
    }

    refresh.addEventListener('click', loadFeed);
    range.addEventListener('change', loadFeed);
    magnitude.addEventListener('change', loadFeed);
    loadFeed();
  }

  function renderLibrary(resources) {
    contentTitle.textContent = 'Tài liệu và nguồn tham khảo';
    const controls = node('div','space-filter-row');
    const searchLabel = node('label','space-filter');
    searchLabel.append(node('span','','Tìm tài liệu'));
    const search = node('input');
    search.type='search'; searchLabel.append(search);
    const fieldLabel = node('label','space-filter');
    fieldLabel.append(node('span','','Lĩnh vực'));
    const field = node('select');
    [['all','Tất cả'],['earth-environment','Trái Đất và môi trường'],['space-astronomy','Vũ trụ và thiên văn'],['physics','Vật lí']].forEach(([value,label])=>{
      const option=node('option','',label);option.value=value;field.append(option);
    });
    fieldLabel.append(field);
    controls.append(searchLabel,fieldLabel);
    const list=node('div','space-card-list');
    function update() {
      const query=search.value.trim().toLocaleLowerCase('vi');
      const selected=field.value;
      const filtered=resources.filter(resource=>{
        const haystack=[resource.title,resource.creator,resource.publisher].join(' ').toLocaleLowerCase('vi');
        return (!query||haystack.includes(query))&&(selected==='all'||resource.relatedFields.includes(selected));
      });
      list.replaceChildren();
      if(!filtered.length){list.append(node('p','standalone-empty','Không tìm thấy tài liệu phù hợp.'));return;}
      filtered.forEach(resource=>{
        const card=node('article','space-content-card');
        const heading=node('h3');
        heading.append(link(resource.sourceUrl,resource.title,'space-card-link'));
        card.append(heading);
        card.append(node('p','space-card-question',resource.creator+' | '+resource.publisher));
        const meta=node('dl','space-meta-grid');
        meta.append(node('dt','','Ngày xuất bản'),node('dd','',resource.publicationDate||'Không ghi trên trang nguồn'));
        meta.append(node('dt','','Giấy phép'),node('dd','',resource.license));
        meta.append(node('dt','','Lĩnh vực'),node('dd','',resource.relatedFields.map(id=>resource.fieldNames[id]||id).join(', ')));
        card.append(meta);
        list.append(card);
      });
    }
    search.addEventListener('input',update);
    field.addEventListener('change',update);
    content.replaceChildren(controls,list);
    update();
  }

  async function init() {
    try {
      const [spaces,models]=await Promise.all([
        readJson('data/spaces.json'),
        readJson('data/model-registry.json')
      ]);
      const space=spaces.find(item=>item.id===spaceId);
      if(!space)throw new Error('Không tìm thấy không gian được yêu cầu.');
      title.textContent=space.name;
      purpose.textContent=space.purpose;
      document.title='SCIAVERSE — '+space.name;
      const contentSection=content.closest('.standalone-section');
      contentSection.hidden=false;

      if(spaceId==='simulations'){
        renderSimulationList(models);
      }else if(spaceId==='virtual-laboratories'){
        const labs=await readJson('data/virtual-labs.json');
        renderLaboratories(labs);
      }else if(spaceId==='scientific-data'){
        const datasets=await readJson('data/scientific-datasets.json');
        if(!datasets.length)showError('Chưa có bộ dữ liệu được đăng ký.');
        else renderDatasetExplorer(datasets[0]);
      }else if(spaceId==='learning-library'){
        const resources=await readJson('data/learning-resources.json');
        renderLibrary(resources);
      }else{
        throw new Error('Không gian chưa được định nghĩa.');
      }
    }catch(error){
      title.textContent='Không thể mở không gian';
      purpose.textContent=error.message||'Đã xảy ra lỗi khi tải nội dung.';
      showError(error.message||'Không thể tải nội dung.');
    }
  }

  init();
})();
