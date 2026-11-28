import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
const read=relative=>fs.readFileSync(path.join(root,relative),'utf8');
const json=relative=>JSON.parse(read(relative));
const exists=relative=>fs.existsSync(path.join(root,relative));

test('Registry IDs and implementation paths are unique and present',()=>{
  const registry=json('data/model-registry.json');
  const ids=registry.map(item=>item.id);
  assert.equal(new Set(ids).size,ids.length,'duplicate model IDs');
  const paths=registry.filter(item=>item.implementationPath).map(item=>item.implementationPath);
  assert.equal(new Set(paths).size,paths.length,'duplicate implementation paths');
  for(const relative of paths)assert.ok(exists(relative),'missing implementation: '+relative);
});

test('Every pilot page has the shared knowledge-level module',()=>{
  const registry=json('data/model-registry.json').filter(item=>item.implementationPath);
  const index=json('data/model-knowledge-index.json');
  assert.equal(Object.keys(index).length,registry.length);
  for(const model of registry){
    assert.ok(index[model.id],'missing knowledge index: '+model.id);
    assert.ok(exists(index[model.id]),'missing model audit: '+index[model.id]);
    const html=read(model.implementationPath);
    assert.match(html,/<script src="\.\.\/\.\.\/model-levels\.js\?v=20261128-levels1" defer><\/script>/);

  }
  assert.ok(exists('simulations/model-levels.js'));
  assert.ok(read('space.js').includes('dataset.spatialCoverage'));
  assert.ok(read('space.js').includes('dataset.units'));
  assert.ok(read('space.js').includes('dataset.license'));
  assert.ok(exists('simulations/model-accessibility.css'));
  assert.match(read('simulations/model-levels.js'),/model-accessibility\.css/);
});

test('All four spaces have registered content and required metadata',()=>{
  const spaces=json('data/spaces.json');
  assert.equal(spaces.length,4);
  for(const item of spaces){
    assert.ok(item.implementationStatus,item.id+' missing implementationStatus');
  }
  for(const id of ['virtual-laboratories','scientific-data','learning-library']){
    assert.equal(spaces.find(item=>item.id===id).implementationStatus,'functional-pilot');
  }
  const labs=json('data/virtual-labs.json');
  assert.ok(labs.length>0);
  for(const lab of labs){
    for(const key of ['title','fieldId','experimentQuestion','variables','procedure','safetyNotes','dataModel','sources','implementationPath'])assert.ok(lab[key],lab.id+' missing '+key);
    assert.ok(exists(lab.implementationPath));
  }
  const datasets=json('data/scientific-datasets.json');
  assert.ok(datasets.length>0);
  for(const item of datasets){
    for(const key of ['title','provider','sourceUrl','timeRange','spatialCoverage','units','methodology','license'])assert.ok(item[key],item.id+' missing '+key);
    assert.ok(Object.values(item.feedUrls).every(url=>/^https:\/\//.test(url)));
  }
  const resources=json('data/learning-resources.json');
  assert.ok(resources.length>=3);
  for(const item of resources){
    for(const key of ['title','creator','publisher','sourceUrl','license','relatedFields'])assert.ok(item[key],item.id+' missing '+key);
    assert.ok(/^https:\/\//.test(item.sourceUrl));
  }
});

test('Local Three.js runtime is pinned and does not depend on public CDNs',()=>{
  const loader=read('three-loader.js');
  assert.match(loader,/vendor\/three-r128\.min\.js/);
  assert.match(loader,/vendor\/OrbitControls-r128\.js/);
  assert.doesNotMatch(loader,/cdnjs|jsdelivr|unpkg/i);
  assert.ok(exists('vendor/three-r128.min.js'));
  assert.ok(exists('vendor/OrbitControls-r128.js'));
  assert.ok(exists('vendor/THREE-LICENSE.txt'));
});

test('Model playback and lab controls are present',()=>{
  const water=read('simulations/hydrology/water-cycle/index.html');
  const orbit=read('simulations/astronomy/earth-revolution/index.html');
  const lab=read('labs/simple-pendulum/index.html');
  for(const id of ['waterPlay','waterPause','waterReset','waterSpeed'])assert.ok(water.includes('id="'+id+'"'));
  for(const id of ['orbitDay','orbitPlay','orbitPause','orbitReset','orbitSpeed'])assert.ok(orbit.includes('id="'+id+'"'));
  for(const id of ['pendulumLength','pendulumGravity','pendulumMass','pendulumAngle','pendulumPlay','pendulumPause'])assert.ok(lab.includes('id="'+id+'"'));
});

test('No middle-dot separators in newly introduced space and knowledge files',()=>{
  const paths=[
    'space.js','space.html','spaces.css','simulations/model-levels.js',
    'data/virtual-labs.json','data/scientific-datasets.json',
    'data/learning-resources.json','data/model-knowledge-index.json',
    'labs/simple-pendulum/index.html','labs/simple-pendulum/main.js',
    'labs/simple-pendulum/styles.css'
  ];
  for(const relative of paths){
    const value=read(relative);
    assert.ok(!value.includes('•')&&!value.includes('·'),relative+' contains a middle dot');
  }
});
