import assert from 'node:assert/strict';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const root=process.cwd();
const mime={
  '.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8',
  '.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8',
  '.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.svg':'image/svg+xml'
};
const server=http.createServer((req,res)=>{
  const pathname=decodeURIComponent(new URL(req.url,'http://127.0.0.1').pathname);
  const relative=pathname.replace(/^\/+/, '')||'index.html';
  const file=path.resolve(root,relative);
  if(!file.startsWith(root)){res.writeHead(403).end();return;}
  fs.readFile(file,(error,buffer)=>{
    if(error){res.writeHead(404).end('Not found');return;}
    res.writeHead(200,{'content-type':mime[path.extname(file)]||'application/octet-stream'});
    res.end(buffer);
  });
});
await new Promise(resolve=>server.listen(4173,'127.0.0.1',resolve));
const browser=await chromium.launch({headless:true,args:['--no-sandbox','--enable-webgl','--use-gl=angle','--use-angle=swiftshader','--ignore-gpu-blocklist']});
const base='http://127.0.0.1:4173';
async function inspect(page,url,width,height=900){
  await page.setViewportSize({width,height});
  const pageErrors=[];
  const onError=error=>pageErrors.push(error.message);
  page.on('pageerror',onError);
  await page.goto(base+url,{waitUntil:'domcontentloaded',timeout:30000});
  await page.waitForTimeout(250);
  if(url.startsWith('/simulations/')){
    await page.waitForSelector('.model-knowledge',{timeout:10000});
  }
  const metrics=await page.evaluate(()=>({
    width:innerWidth,scrollWidth:document.documentElement.scrollWidth,
    knowledge:Boolean(document.querySelector('.model-knowledge')),
    accessibilityStyle:Boolean(document.querySelector('link[data-sciaverse-accessibility]')),
    title:document.title
  }));
  assert.ok(metrics.scrollWidth<=metrics.width+1,url+' horizontal overflow at '+width+'px: '+JSON.stringify(metrics));
  assert.equal(pageErrors.length,0,url+' page errors: '+pageErrors.join(' | '));
  page.off('pageerror',onError);
  return metrics;
}
try{
  const modelRegistry=JSON.parse(fs.readFileSync(path.join(root,'data/model-registry.json'),'utf8')).filter(item=>item.implementationPath);
  const modelPage=await browser.newPage({viewport:{width:390,height:844}});
  for(const model of modelRegistry){
    for(const width of [320,360,390,430]){
      const metrics=await inspect(modelPage,'/'+model.implementationPath,width,844);
      assert.ok(metrics.knowledge,'missing knowledge-level switch: '+model.id);
      assert.ok(metrics.accessibilityStyle,'missing accessibility stylesheet: '+model.id);
    }
    await modelPage.locator('.model-knowledge-switch button').nth(1).click();
    await modelPage.waitForFunction(()=>document.querySelector('.model-knowledge-panel')?.dataset.loaded==='true',{timeout:10000});
    const advancedText=await modelPage.locator('.model-knowledge-panel').textContent();
    assert.ok(advancedText.trim().length>20,'empty advanced knowledge content: '+model.id);
    await modelPage.locator('.model-knowledge-switch button').nth(0).click();
  }
  await modelPage.close();

  const aModelPage=await browser.newPage({viewport:{width:390,height:844}});
  await aModelPage.goto(base+'/simulations/astronomy/solar-system/index.html',{waitUntil:'domcontentloaded'});
  await aModelPage.waitForFunction(()=>document.querySelector('#solarLoading')?.hidden===true,{timeout:30000});
  if(await aModelPage.locator('#solarPlay').getAttribute('aria-pressed')==='true'){
    await aModelPage.locator('#solarPlay').click();
  }
  await aModelPage.locator('#solarReset').click();
  const solarTimeBefore=await aModelPage.locator('#solarTime').textContent();
  await aModelPage.locator('#solarPlay').click();
  await aModelPage.waitForTimeout(450);
  await aModelPage.locator('#solarPlay').click();
  assert.notEqual(await aModelPage.locator('#solarTime').textContent(),solarTimeBefore,'planetary time must advance');
  await aModelPage.locator('[data-body="venus"]').click();
  assert.match(await aModelPage.locator('#solarDirection').textContent(),/nghịch hành/);

  await aModelPage.goto(base+'/simulations/astronomy/daylight-duration/index.html',{waitUntil:'domcontentloaded'});
  await aModelPage.waitForFunction(()=>document.querySelector('#daylightStatus')?.dataset.state==='ready',{timeout:30000});
  await aModelPage.locator('#daylightSeason').selectOption('june');
  await aModelPage.locator('#daylightLatitude').evaluate(element=>{
    element.value='90';element.dispatchEvent(new Event('input',{bubbles:true}));
  });
  assert.equal(await aModelPage.locator('#dayHours').textContent(),'24,00 giờ');
  await aModelPage.locator('#daylightSeason').selectOption('december');
  assert.equal(await aModelPage.locator('#dayHours').textContent(),'0,00 giờ');

  await aModelPage.goto(base+'/simulations/cartography/compass/index.html',{waitUntil:'domcontentloaded'});
  await aModelPage.waitForFunction(()=>document.querySelector('#compassStatus')?.dataset.state==='ready',{timeout:30000});
  await aModelPage.locator('#declinationRange').evaluate(element=>{
    element.value='0.5';element.dispatchEvent(new Event('input',{bubbles:true}));
  });
  assert.equal(await aModelPage.locator('#trueBearingValue').textContent(),'045.5°');
  await aModelPage.locator('#declinationRange').evaluate(element=>{
    element.value='-0.5';element.dispatchEvent(new Event('input',{bubbles:true}));
  });
  assert.equal(await aModelPage.locator('#trueBearingValue').textContent(),'044.5°');

  await aModelPage.goto(base+'/simulations/cartography/contour-terrain/index.html',{waitUntil:'domcontentloaded'});
  await aModelPage.waitForFunction(()=>document.querySelector('#contourStatus')?.dataset.state==='ready',{timeout:30000});
  await aModelPage.locator('#contourInterval').selectOption('50');
  assert.equal(await aModelPage.locator('#contourIntervalValue').textContent(),'50 m');

  await aModelPage.goto(base+'/simulations/cartography/globe-projection/index.html',{waitUntil:'domcontentloaded'});
  await aModelPage.waitForFunction(()=>document.querySelector('#projectionStatus')?.dataset.state==='ready',{timeout:30000});
  await aModelPage.locator('#projectionType').selectOption('mercator');
  assert.equal(await aModelPage.locator('#projectionName').textContent(),'Mercator');
  await aModelPage.locator('#projectionType').selectOption('azimuthal');
  assert.match(await aModelPage.locator('#projectionName').textContent(),/Phương vị cách đều/);

  await aModelPage.goto(base+'/simulations/cartography/map-scale/index.html',{waitUntil:'domcontentloaded'});
  await aModelPage.waitForFunction(()=>document.querySelector('#mapScaleStatus')?.dataset.state==='ready',{timeout:30000});
  await aModelPage.locator('#scaleRatio').selectOption('100000');
  await aModelPage.locator('#mapLength').evaluate(element=>{
    element.value='4';element.dispatchEvent(new Event('input',{bubbles:true}));
  });
  assert.equal(await aModelPage.locator('#groundDistance').textContent(),'4 km');

  await aModelPage.goto(base+'/simulations/cartography/map-distance/index.html',{waitUntil:'domcontentloaded'});
  await aModelPage.waitForFunction(()=>document.querySelector('#distanceStatus')?.dataset.state==='ready',{timeout:30000});
  await aModelPage.locator('#toggleMeasure').click();
  const distanceCanvas=aModelPage.locator('#distanceStage canvas');
  const distanceBounds=await distanceCanvas.boundingBox();
  assert.ok(distanceBounds&&distanceBounds.width>0,'distance map canvas must render');
  await distanceCanvas.click({position:{x:distanceBounds.width*.35,y:distanceBounds.height*.5}});
  await distanceCanvas.click({position:{x:distanceBounds.width*.65,y:distanceBounds.height*.5}});
  assert.notEqual(await aModelPage.locator('#groundLengthOutput').textContent(),'—','two map points must produce a ground distance');

  await aModelPage.goto(base+'/simulations/cartography/route-finding/index.html',{waitUntil:'domcontentloaded'});
  const routeBefore=await aModelPage.locator('#routeSequence').textContent();
  await aModelPage.locator('#routeEdgeList input[data-edge="FG"]').uncheck();
  const routeAfter=await aModelPage.locator('#routeSequence').textContent();
  assert.notEqual(routeAfter,routeBefore,'blocking a route edge must recalculate the shortest path');
  assert.match(await aModelPage.locator('#routeDistance').textContent(),/km/);

  await aModelPage.goto(base+'/simulations/cartography/terrain-profile/index.html',{waitUntil:'domcontentloaded'});
  await aModelPage.waitForFunction(()=>document.querySelector('#profileStatus')?.dataset.state==='ready',{timeout:30000});
  await aModelPage.locator('#profileRoute').selectOption('cd');
  assert.match(await aModelPage.locator('#profileSummary').textContent(),/^Tuyến CD:/);
  await aModelPage.goto(base+'/simulations/earth/rotation/index.html',{waitUntil:'domcontentloaded'});
  await aModelPage.waitForFunction(()=>document.querySelector('#earthModelLoading')?.hidden===true,{timeout:30000});
  const earthCanvasBounds=await aModelPage.locator('#earthRotationCanvas').boundingBox();
  assert.ok(earthCanvasBounds&&earthCanvasBounds.width>0,'Earth rotation canvas must render');
  const worldClockSelect=aModelPage.locator('#worldClockGrid select');
  assert.equal(await worldClockSelect.locator('option').count(),15);
  await worldClockSelect.selectOption('UTC');
  assert.equal(await aModelPage.locator('#worldClockGrid .world-clock-offset').textContent(),'UTC +0');
  const earthRotationSource=await aModelPage.evaluate(async()=>await (await fetch('main.js')).text());
  assert.match(earthRotationSource,/greenwichSiderealAngle\(simulatedJulianDate\)\s*-\s*greenwichSiderealAngle\(simulationStartJulianDate\)/);
  assert.match(earthRotationSource,/TorusGeometry\(3\.55/);

  await aModelPage.goto(base+'/simulations/astronomy/earth-revolution/index.html',{waitUntil:'domcontentloaded'});
  await aModelPage.waitForFunction(()=>document.querySelector('#orbitStatus')?.dataset.state==='ready',{timeout:30000});
  assert.equal(await aModelPage.locator('#orbitDay').getAttribute('max'),'365.2422');
  await aModelPage.locator('#orbitSeason').selectOption('march');
  assert.equal(await aModelPage.locator('#orbitResultTitle').textContent(),'Xuân phân');
  await aModelPage.locator('#orbitSeason').selectOption('september');
  assert.equal(await aModelPage.locator('#orbitResultTitle').textContent(),'Thu phân');
  await aModelPage.locator('#orbitSeason').selectOption('december');
  assert.equal(await aModelPage.locator('#orbitResultTitle').textContent(),'Đông chí');
  await aModelPage.locator('#orbitDay').evaluate(element=>{
    element.value='172';element.dispatchEvent(new Event('input',{bubbles:true}));
  });
  assert.equal(await aModelPage.locator('#orbitResultTitle').textContent(),'Hạ chí');
  const orbitDayBefore=await aModelPage.locator('#orbitDayValue').textContent();
  await aModelPage.locator('#orbitPlay').click();
  await aModelPage.waitForTimeout(350);
  await aModelPage.locator('#orbitPause').click();
  assert.notEqual(await aModelPage.locator('#orbitDayValue').textContent(),orbitDayBefore,'Earth orbit playback must advance');

  await aModelPage.goto(base+'/simulations/tectonics/plate-motion/index.html',{waitUntil:'domcontentloaded'});
  await aModelPage.waitForFunction(()=>document.querySelector('#plateStatus')?.dataset.state==='ready',{timeout:30000});
  assert.equal(await aModelPage.locator('#plateResultTitle').textContent(),'Ranh giới tách giãn');
  await aModelPage.locator('#plateBoundaryChoice [data-boundary="convergent"]').click();
  assert.equal(await aModelPage.locator('#plateResultTitle').textContent(),'Ranh giới hội tụ: đại dương – lục địa');
  await aModelPage.locator('#plateVelocity').evaluate(element=>{
    element.value='20';element.dispatchEvent(new Event('input',{bubbles:true}));
  });
  assert.equal(await aModelPage.locator('#plateVelocityValue').textContent(),'20 cm/năm');
  await aModelPage.locator('#plateBoundaryChoice [data-boundary="transform"]').click();
  assert.equal(await aModelPage.locator('#plateResultTitle').textContent(),'Ranh giới trượt ngang');

  await aModelPage.goto(base+'/simulations/geophysics/seismic-waves/index.html',{waitUntil:'domcontentloaded'});
  await aModelPage.waitForFunction(()=>document.querySelector('#seismicStatus')?.dataset.state==='ready',{timeout:30000});
  await aModelPage.locator('#seismicWaveChoice [data-wave="s"]').click();
  assert.match(await aModelPage.locator('#seismicResultText').textContent(),/không truyền qua chất lỏng/);
  const seismicSource=await aModelPage.evaluate(async()=>await (await fetch('main.js')).text());
  assert.match(seismicSource,/outerCoreBoundary\s*=\s*new THREE\.Vector3\(0,1\.34,0\)/);
  await aModelPage.locator('#seismicWaveChoice [data-wave="p"]').click();
  assert.match(await aModelPage.locator('#seismicResultText').textContent(),/chất rắn và chất lỏng/);

  await aModelPage.goto(base+'/simulations/geomorphology/weathering-erosion-deposition/index.html',{waitUntil:'domcontentloaded'});
  await aModelPage.waitForFunction(()=>document.querySelector('#surfaceStatus')?.dataset.state==='ready',{timeout:30000});
  assert.equal(await aModelPage.locator('#surfaceResultTitle').textContent(),'Phong hóa cơ học');
  await aModelPage.locator('#surfaceProcessChoice [data-process="erosion"]').click();
  assert.equal(await aModelPage.locator('#surfaceResultTitle').textContent(),'Xâm thực do dòng chảy');
  await aModelPage.locator('#surfaceProcessChoice [data-process="deposition"]').click();
  assert.equal(await aModelPage.locator('#surfaceResultTitle').textContent(),'Bồi tụ trầm tích');
  const weatheringSource=await aModelPage.evaluate(async()=>await (await fetch('main.js')).text());
  assert.doesNotMatch(weatheringSource,/delta\.rotation\.x\s*=\s*Math\.PI\s*\/\s*2/);
  assert.match(weatheringSource,/const deltaBaseY\s*=\s*terrainHeight/);
  await aModelPage.goto(base+'/simulations/meteorology/tropical-cyclone/index.html',{waitUntil:'domcontentloaded'});
  assert.match(await aModelPage.locator('#cycloneDirection').textContent(),/Bắc bán cầu/);
  assert.match(await aModelPage.locator('#latitudeState').textContent(),/\+3,77 × 10⁻⁵ s⁻¹/);
  await aModelPage.locator('#hemisphereChoice [data-hemisphere="south"]').click();
  assert.match(await aModelPage.locator('#cycloneDirection').textContent(),/Nam bán cầu/);
  assert.match(await aModelPage.locator('#latitudeState').textContent(),/−3,77 × 10⁻⁵ s⁻¹/);
  await aModelPage.locator('#cycloneLatitude').evaluate(element=>{
    element.value='0';element.dispatchEvent(new Event('input',{bubbles:true}));
  });
  assert.match(await aModelPage.locator('#latitudeState').textContent(),/f = 0 s⁻¹/);
  await aModelPage.locator('#cycloneSst').evaluate(element=>{
    element.value='25';element.dispatchEvent(new Event('input',{bubbles:true}));
  });
  assert.match(await aModelPage.locator('#sstState').textContent(),/Thấp hơn mốc tham khảo/);
  await aModelPage.locator('#cycloneHumidity').evaluate(element=>{
    element.value='40';element.dispatchEvent(new Event('input',{bubbles:true}));
  });
  assert.match(await aModelPage.locator('#humidityState').textContent(),/khô hơn/);
  await aModelPage.locator('#cycloneShear').evaluate(element=>{
    element.value='20';element.dispatchEvent(new Event('input',{bubbles:true}));
  });
  assert.match(await aModelPage.locator('#shearState').textContent(),/Đứt gió lớn hơn/);

  await aModelPage.goto(base+'/simulations/hydrology/flash-flood/index.html',{waitUntil:'domcontentloaded'});
  await aModelPage.locator('#rainDuration').evaluate(element=>{
    element.value='0.5';element.dispatchEvent(new Event('input',{bubbles:true}));
  });
  assert.equal(await aModelPage.locator('#peakDischarge').textContent(),'Không áp dụng');
  await aModelPage.locator('#rainDuration').evaluate(element=>{
    element.value='1';element.dispatchEvent(new Event('input',{bubbles:true}));
  });
  assert.equal(await aModelPage.locator('#peakDischarge').textContent(),'0,19 m³/s');
  await aModelPage.locator('#basinArea').evaluate(element=>{
    element.value='80';element.dispatchEvent(new Event('input',{bubbles:true}));
  });
  assert.equal(await aModelPage.locator('#peakDischarge').textContent(),'Không áp dụng');
  assert.match(await aModelPage.locator('#floodFormula').textContent(),/80 ha/);

  await aModelPage.goto(base+'/simulations/oceanography/tsunami/index.html',{waitUntil:'domcontentloaded'});
  await aModelPage.locator('#waterDepth').evaluate(element=>{
    element.value='1000';element.dispatchEvent(new Event('input',{bubbles:true}));
  });
  await aModelPage.locator('#elapsedTime').evaluate(element=>{
    element.value='2';element.dispatchEvent(new Event('input',{bubbles:true}));
  });
  assert.equal(await aModelPage.locator('#waveSpeed').textContent(),'99,0 m/s');
  assert.equal(await aModelPage.locator('#waveDistance').textContent(),'713,1 km');

  await aModelPage.goto(base+'/simulations/hydrology/saltwater-intrusion/index.html',{waitUntil:'domcontentloaded'});
  const estuaryShapeBefore=await aModelPage.locator('#saltWedge').getAttribute('d');
  await aModelPage.locator('#riverFlow [data-value="low"]').click();
  await aModelPage.locator('#tideStrength [data-value="high"]').click();
  assert.notEqual(await aModelPage.locator('#saltWedge').getAttribute('d'),estuaryShapeBefore);
  assert.match(await aModelPage.locator('#saltTendency').textContent(),/tiến sâu hơn/);
  await aModelPage.locator('#saltMode [data-mode="aquifer"]').click();
  assert.equal(await aModelPage.locator('#aquiferPanel').isVisible(),true);
  const aquiferShapeBefore=await aModelPage.locator('#aquiferTransition').getAttribute('d');
  await aModelPage.locator('#pumpingLevel [data-value="high"]').click();
  await aModelPage.locator('#rechargeLevel [data-value="low"]').click();
  assert.notEqual(await aModelPage.locator('#aquiferTransition').getAttribute('d'),aquiferShapeBefore);
  assert.match(await aModelPage.locator('#saltTendency').textContent(),/dịch chuyển vào đất liền/);

  await aModelPage.goto(base+'/simulations/coastal/sea-level-rise/index.html',{waitUntil:'domcontentloaded'});
  assert.equal(await aModelPage.locator('#floodFill').getAttribute('d'),'');
  await aModelPage.locator('#seaRise').evaluate(element=>{
    element.value='1';element.dispatchEvent(new Event('input',{bubbles:true}));
  });
  assert.notEqual(await aModelPage.locator('#floodFill').getAttribute('d'),'');
  assert.equal(await aModelPage.locator('#seaLevelValue').textContent(),'1,0 m');
  await aModelPage.locator('#seaRise').evaluate(element=>{
    element.value='2';element.dispatchEvent(new Event('input',{bubbles:true}));
  });
  assert.equal(await aModelPage.locator('#seaLevelValue').textContent(),'2,0 m');

  await aModelPage.goto(base+'/simulations/geophysics/earthquake/index.html',{waitUntil:'domcontentloaded'});
  assert.match(await aModelPage.locator('#seismicMoment').textContent(),/1,8/);
  assert.equal(await aModelPage.locator('#momentMagnitude').textContent(),'Mw 6,77');
  await aModelPage.locator('#faultLength').evaluate(element=>{
    element.value='80';element.dispatchEvent(new Event('input',{bubbles:true}));
  });
  assert.match(await aModelPage.locator('#seismicMoment').textContent(),/3,6/);
  assert.equal(await aModelPage.locator('#momentMagnitude').textContent(),'Mw 6,97');
  await aModelPage.locator('#quakeDepth').evaluate(element=>{
    element.value='301';element.dispatchEvent(new Event('input',{bubbles:true}));
  });
  assert.equal(await aModelPage.locator('#depthClass').textContent(),'Sâu');
  await aModelPage.locator('#quakeTrigger').click();
  assert.equal(await aModelPage.locator('.quake-diagram').getAttribute('class').then(value=>value.includes('is-active')),true);
  await aModelPage.locator('#quakeReset').click();
  assert.equal(await aModelPage.locator('#faultLength').inputValue(),'40');

  await aModelPage.goto(base+'/simulations/geophysics/volcano/index.html',{waitUntil:'domcontentloaded'});
  await aModelPage.locator('#magmaChoice [data-magma="andesitic"]').click();
  await aModelPage.locator('#gasChoice [data-gas="high"]').click();
  assert.equal(await aModelPage.locator('#eruptionTendency').textContent(),'Xu hướng phun nổ tăng');
  assert.equal(await aModelPage.locator('#volcanoDiagram').getAttribute('data-style'),'explosive');
  await aModelPage.locator('#magmaChoice [data-magma="basaltic"]').click();
  await aModelPage.locator('#gasChoice [data-gas="low"]').click();
  assert.match(await aModelPage.locator('#eruptionTendency').textContent(),/phun tràn/);
  assert.equal(await aModelPage.locator('#volcanoDiagram').getAttribute('data-style'),'effusive');
  await aModelPage.locator('#magmaChoice [data-magma="andesitic"]').click();
  await aModelPage.locator('#gasChoice [data-gas="medium"]').click();
  assert.match(await aModelPage.locator('#eruptionTendency').textContent(),/Chưa thể phân loại/);

  await aModelPage.goto(base+'/simulations/geotechnical/landslide/index.html',{waitUntil:'domcontentloaded'});
  assert.equal(await aModelPage.locator('#safetyFactor').textContent(),'1,14');
  await aModelPage.locator('#porePressure').evaluate(element=>{
    element.value='20';element.dispatchEvent(new Event('input',{bubbles:true}));
  });
  assert.equal(await aModelPage.locator('#slopeState').textContent(),'Mất ổn định');
  await aModelPage.locator('#porePressure').evaluate(element=>{
    element.value='50';element.dispatchEvent(new Event('input',{bubbles:true}));
  });
  assert.equal(await aModelPage.locator('#safetyFactor').textContent(),'Không xác định');
  assert.equal(await aModelPage.locator('#slopeState').textContent(),'Ngoài miền áp dụng');

  await aModelPage.goto(base+'/simulations/hydrology/water-cycle/index.html',{waitUntil:'domcontentloaded'});
  await aModelPage.waitForFunction(()=>document.querySelector('#waterStatus')?.dataset.state==='ready',{timeout:30000});
  const waterProcesses=[['evaporation','Bốc hơi'],['condensation','Ngưng tụ'],['precipitation','Mưa'],['runoff','Dòng chảy mặt'],['groundwater','Nước ngầm']];
  for(const [key,title] of waterProcesses){
    await aModelPage.locator('[data-process="'+key+'"]').click();
    assert.equal(await aModelPage.locator('#waterResultTitle').textContent(),title);
  }
  await aModelPage.locator('[data-process="evaporation"]').click();
  await aModelPage.locator('#waterSpeed').selectOption('2');
  await aModelPage.locator('#waterPlay').click();
  await aModelPage.waitForTimeout(2800);
  await aModelPage.locator('#waterPause').click();
  assert.equal(await aModelPage.locator('[data-process="condensation"]').getAttribute('aria-pressed'),'true');
  await aModelPage.locator('#waterReset').click();
  assert.equal(await aModelPage.locator('#waterResultTitle').textContent(),'Bốc hơi');

  await aModelPage.close();

  const responsivePages=[
    '/space.html?id=virtual-laboratories',
    '/space.html?id=scientific-data',
    '/space.html?id=learning-library',
    '/labs/simple-pendulum/index.html',
    '/simulations/hydrology/water-cycle/index.html',
    '/simulations/astronomy/earth-revolution/index.html'
  ];
  const page=await browser.newPage();
  for(const width of [320,360,390,430]){
    for(const url of responsivePages)await inspect(page,url,width,width===320?760:844);
  }

  await page.route('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/**',route=>route.fulfill({
    status:200,contentType:'application/json',
    body:JSON.stringify({
      type:'FeatureCollection',
      metadata:{generated:Date.now(),count:1},
      features:[{
        type:'Feature',
        properties:{mag:4.2,magType:'mww',place:'Browser test event',time:Date.now(),url:'https://earthquake.usgs.gov/'},
        geometry:{type:'Point',coordinates:[105,10,12.5]}
      }]
    })
  }));
  await page.goto(base+'/space.html?id=scientific-data',{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>document.querySelector('.space-data-status')?.dataset.state==='ready',{timeout:10000});
  assert.match(await page.locator('.space-data-status').textContent(),/1\/1 sự kiện phù hợp/);
  assert.equal(await page.locator('.space-data-chart-section rect.space-data-bar').count(),6);
  assert.match(await page.locator('.space-data-analysis').textContent(),/độ lớn lớn nhất 4,2/);
  assert.equal(await page.locator('.space-data-table tbody tr td').nth(2).textContent(),'mww');

  await page.goto(base+'/space.html?id=learning-library',{waitUntil:'domcontentloaded'});
  await page.locator('input[type="search"]').fill('Pendulums');
  assert.equal(await page.locator('.space-content-card').count(),1);
  assert.ok(await page.locator('.space-content-card').textContent().then(text=>text.includes('Tài liệu diễn giải')));
  assert.equal(await page.locator('.space-content-card a[href="labs/simple-pendulum/index.html"]').count(),1);
  await page.locator('input[type="search"]').fill('Các quá trình trong mô hình vòng tuần hoàn nước');
  assert.equal(await page.locator('.space-content-card').count(),1);
  assert.match(await page.locator('.space-content-card').textContent(),/SCIAVERSE biên soạn/);
  assert.equal(await page.locator('.space-content-card a[href="simulations/hydrology/water-cycle/index.html"]').count(),1);

  await page.goto(base+'/labs/simple-pendulum/index.html',{waitUntil:'domcontentloaded'});
  const periodBefore=await page.locator('#pendulumPeriod').textContent();
  await page.locator('#pendulumLength').evaluate(element=>{
    element.value='2';element.dispatchEvent(new Event('input',{bubbles:true}));
  });
  const periodAfter=await page.locator('#pendulumPeriod').textContent();
  assert.notEqual(periodBefore,periodAfter,'pendulum period must change with length');
  await page.locator('#pendulumMass').evaluate(element=>{
    element.value='2';element.dispatchEvent(new Event('input',{bubbles:true}));
  });
  assert.equal(await page.locator('#pendulumPeriod').textContent(),periodAfter,'ideal pendulum period must not depend on bob mass');
  await page.locator('#pendulumPlay').click();
  await page.waitForTimeout(120);
  await page.locator('#pendulumPause').click();

  await page.goto(base+'/simulations/hydrology/water-cycle/index.html',{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>document.querySelector('#waterStatus')?.dataset.state==='ready',{timeout:30000});
  assert.ok(await page.evaluate(()=>Boolean(window.THREE&&window.THREE.OrbitControls)),'local Three.js and OrbitControls must initialize');
  await page.locator('#waterSpeed').selectOption('2');
  await page.locator('#waterPlay').click();
  await page.waitForTimeout(2800);
  await page.locator('#waterPause').click();
  assert.equal(await page.locator('[data-process="condensation"]').getAttribute('aria-pressed'),'true','water cycle must advance to condensation');

  await page.goto(base+'/simulations/astronomy/earth-revolution/index.html',{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>document.querySelector('#orbitStatus')?.dataset.state==='ready',{timeout:30000});
  assert.ok(await page.evaluate(()=>Boolean(window.THREE&&window.THREE.OrbitControls)),'local Three.js and OrbitControls must initialize');
  const orbitalDayBefore=await page.locator('#orbitDayValue').textContent();
  await page.locator('#orbitPlay').click();
  await page.waitForTimeout(300);
  await page.locator('#orbitPause').click();
  assert.notEqual(await page.locator('#orbitDayValue').textContent(),orbitalDayBefore,'orbital time must advance continuously');
  await page.locator('#orbitDay').evaluate(element=>{
    element.value='250';element.dispatchEvent(new Event('input',{bubbles:true}));
  });
  assert.match(await page.locator('#orbitDayValue').textContent(),/Ngày mô phỏng/);

  await page.goto(base+'/simulations/astronomy/earth-revolution/index.html',{waitUntil:'domcontentloaded'});
  await page.locator('.model-knowledge-switch button').nth(1).click();
  await page.waitForFunction(()=>document.querySelector('.model-knowledge-panel h3'),{timeout:10000});
  await page.close();

  const touchContext=await browser.newContext({
    viewport:{width:390,height:844},isMobile:true,hasTouch:true,deviceScaleFactor:2
  });
  const touchPage=await touchContext.newPage();
  const touchErrors=[];
  touchPage.on('pageerror',error=>touchErrors.push(error.message));
  await touchPage.goto(base+'/labs/simple-pendulum/index.html',{waitUntil:'domcontentloaded'});
  await touchPage.locator('#pendulumPlay').tap();
  await touchPage.locator('#pendulumPause').tap();
  await touchPage.goto(base+'/simulations/hydrology/water-cycle/index.html',{waitUntil:'domcontentloaded'});
  await touchPage.waitForFunction(()=>document.querySelector('#waterStatus')?.dataset.state==='ready',{timeout:30000});
  await touchPage.locator('#waterPlay').tap();
  await touchPage.locator('#waterPause').tap();
  await touchPage.goto(base+'/simulations/astronomy/earth-revolution/index.html',{waitUntil:'domcontentloaded'});
  await touchPage.waitForFunction(()=>document.querySelector('#orbitStatus')?.dataset.state==='ready',{timeout:30000});
  await touchPage.locator('#orbitPlay').tap();
  await touchPage.locator('#orbitPause').tap();
  await touchPage.emulateMedia({reducedMotion:'reduce'});
  await touchPage.goto(base+'/simulations/astronomy/solar-system/index.html',{waitUntil:'domcontentloaded'});
  await touchPage.waitForSelector('#solarPlay');
  await touchPage.waitForFunction(()=>document.querySelector('#solarLoading')?.hidden===true,{timeout:30000});
  await touchPage.waitForFunction(()=>document.querySelector('#solarPlay')?.getAttribute('aria-pressed')==='false',{timeout:30000});
  assert.equal(touchErrors.length,0,'touch interaction page errors: '+touchErrors.join(' | '));
  await touchContext.close();
  console.log('Browser smoke test passed: 25 model pages at 4 widths with advanced content, 6 key pages at 4 widths, live data analysis, lab and 3D controls, touch input and reduced motion.');
}finally{
  await browser.close();
  await new Promise(resolve=>server.close(resolve));
}
