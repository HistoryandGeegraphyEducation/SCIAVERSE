(() => {
  'use strict';
  if(!document.querySelector('link[data-sciaverse-accessibility]')){
    const stylesheet=document.createElement('link');
    stylesheet.rel='stylesheet';
    stylesheet.href='../../model-accessibility.css?v=20261128-accessibility1';
    stylesheet.dataset.sciaverseAccessibility='true';
    document.head.append(stylesheet);
  }
  const root=document.querySelector('.model-intro, .standalone-title');
  if(!root)return;
  const registryUrl='../../../data/model-registry.json';
  const indexUrl='../../../data/model-knowledge-index.json';
  function make(tag,className,text){
    const element=document.createElement(tag);
    if(className)element.className=className;
    if(text!==undefined)element.textContent=text;
    return element;
  }
  function appendInline(parent,text){
    const pattern=/\[([^\]]+)\]\((https?:\/\/[^)]+)\)|\*\*([^*]+)\*\*|\x60([^\x60]+)\x60/g;
    let cursor=0,match;
    while((match=pattern.exec(text))){
      parent.append(document.createTextNode(text.slice(cursor,match.index)));
      if(match[1]){
        const anchor=make('a','',match[1]);
        anchor.href=match[2];anchor.target='_blank';anchor.rel='noopener noreferrer';
        parent.append(anchor);
      }else if(match[3])parent.append(make('strong','',match[3]));
      else if(match[4])parent.append(make('code','',match[4]));
      cursor=pattern.lastIndex;
    }
    parent.append(document.createTextNode(text.slice(cursor)));
  }
  function renderMarkdown(container,lines){
    let paragraph=[],list=null,listType='';
    const flushParagraph=()=>{
      if(!paragraph.length)return;
      const p=make('p');appendInline(p,paragraph.join(' '));container.append(p);paragraph=[];
    };
    const flushList=()=>{if(list){container.append(list);list=null;listType='';}};
    lines.forEach(line=>{
      const value=line.trim();
      if(!value){flushParagraph();flushList();return;}
      const heading=value.match(/^(#{2,4})\s+(.+)$/);
      if(heading){
        flushParagraph();flushList();
        const h=make('h'+Math.min(4,Number(heading[1].length)+1));
        appendInline(h,heading[2]);container.append(h);return;
      }
      const bullet=value.match(/^[-*]\s+(.+)$/);
      const numbered=value.match(/^\d+[.)]\s+(.+)$/);
      if(bullet||numbered){
        flushParagraph();
        const nextType=bullet?'ul':'ol';
        if(!list||listType!==nextType){flushList();list=make(nextType);listType=nextType;}
        const li=make('li');appendInline(li,(bullet||numbered)[1]);list.append(li);return;
      }
      flushList();paragraph.push(value.replace(/^>\s?/,''));
    });
    flushParagraph();flushList();
  }
  function relevantSections(markdown){
    const sections=[];let current=null,include=false;
    const relevant=/cơ sở khoa học|căn cứ khoa học|cơ chế|giả định|giới hạn|phạm vi|phương pháp|kiểm tra logic|kiểm tra số học|đặc tả khoa học|nguồn tham khảo|^nguồn$/i;
    markdown.split(/\r?\n/).forEach(line=>{
      const heading=line.match(/^##\s+(.+)$/);
      if(heading){
        if(current&&include)sections.push(current);
        current={heading:heading[1],lines:[]};include=relevant.test(heading[1]);
      }else if(current&&include&&!/^---+$/.test(line.trim()))current.lines.push(line);
    });
    if(current&&include)sections.push(current);
    return sections.filter(section=>section.lines.some(line=>line.trim()));
  }
  async function init(){
    try{
      const [registryResponse,indexResponse]=await Promise.all([fetch(registryUrl),fetch(indexUrl)]);
      if(!registryResponse.ok||!indexResponse.ok)throw new Error('Không tải được hồ sơ mức kiến thức.');
      const [registry,index]=await Promise.all([registryResponse.json(),indexResponse.json()]);
      const path=decodeURI(location.pathname);
      const model=registry.find(item=>item.implementationPath&&path.endsWith('/'+item.implementationPath));
      if(!model)return;
      const auditPath=index[model.id];
      if(!auditPath)return;
      const wrapper=make('section','model-knowledge');
      wrapper.setAttribute('aria-label','Mức kiến thức');
      const heading=make('h2','','Mức kiến thức');
      const controls=make('div','model-knowledge-switch');
      controls.setAttribute('role','group');controls.setAttribute('aria-label','Chọn mức kiến thức');
      const basic=make('button','is-selected','Cơ bản');
      const advanced=make('button','','Nâng cao');
      basic.type=advanced.type='button';basic.setAttribute('aria-pressed','true');advanced.setAttribute('aria-pressed','false');
      controls.append(basic,advanced);
      const panel=make('div','model-knowledge-panel');panel.hidden=true;
      wrapper.append(heading,controls,panel);root.insertAdjacentElement('afterend',wrapper);
      let loaded=false;
      async function showAdvanced(){
        basic.classList.remove('is-selected');advanced.classList.add('is-selected');
        basic.setAttribute('aria-pressed','false');advanced.setAttribute('aria-pressed','true');
        panel.hidden=false;if(loaded)return;
        panel.append(make('p','model-knowledge-status','Đang tải nội dung khoa học'));
        try{
          const response=await fetch('../../../'+auditPath);
          if(!response.ok)throw new Error('Không tải được tài liệu thẩm định.');
          const markdown=await response.text();panel.replaceChildren();
          const sections=relevantSections(markdown);
          if(sections.length){
            sections.forEach(section=>{
              panel.append(make('h3','',section.heading));
              const body=make('div','model-knowledge-section');renderMarkdown(body,section.lines);panel.append(body);
            });
          }else panel.append(make('p','',model.notes||'Chưa có nội dung nâng cao cho mô hình này.'));
          loaded=true;
        }catch(error){panel.replaceChildren(make('p','model-knowledge-status',error.message));}
      }
      function showBasic(){
        advanced.classList.remove('is-selected');basic.classList.add('is-selected');
        advanced.setAttribute('aria-pressed','false');basic.setAttribute('aria-pressed','true');panel.hidden=true;
      }
      basic.addEventListener('click',showBasic);advanced.addEventListener('click',showAdvanced);
    }catch(error){console.warn('SCIAVERSE model knowledge:',error.message);}
  }
  init();
})();
