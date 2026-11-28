import assert from 'node:assert/strict';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
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
const failures=[];
async function inspect(page,url,width,height=900){
  await page.setViewportSize({width,height});
  const pageErrors=[];
  const onError=error=>pageErrors.push(error.message);
  page.on('pageerror',onError);
  await page.goto(base+url,{waitUntil:'domcontentloaded',timeout:30000});
  await page.waitForTimeout(500);
  const metrics=await page.evaluate(()=>({
    width:innerWidth,scrollWidth:document.documentElement.scrollWidth,
    knowledge:Boolean(document.querySelector('.model-knowledge')),
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
    }
  }
  await modelPage.close();

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
        properties:{mag:4.2,place:'Browser test event',time:Date.now(),url:'https://earthquake.usgs.gov/'},
        geometry:{type:'Point',coordinates:[105,10,12.5]}
      }]
    })
  }));
  await page.goto(base+'/space.html?id=scientific-data',{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>document.querySelector('.space-data-status')?.dataset.state==='ready',{timeout:10000});
  assert.match(await page.locator('.space-data-status').textContent(),/1 sự kiện phù hợp/);

  await page.goto(base+'/space.html?id=learning-library',{waitUntil:'domcontentloaded'});
  await page.locator('input[type="search"]').fill('Pendulums');
  assert.equal(await page.locator('.space-content-card').count(),1);

  await page.goto(base+'/labs/simple-pendulum/index.html',{waitUntil:'domcontentloaded'});
  const periodBefore=await page.locator('#pendulumPeriod').textContent();
  await page.locator('#pendulumLength').evaluate(element=>{
    element.value='2';element.dispatchEvent(new Event('input',{bubbles:true}));
  });
  const periodAfter=await page.locator('#pendulumPeriod').textContent();
  assert.notEqual(periodBefore,periodAfter,'pendulum period must change with length');
  await page.locator('#pendulumPlay').click();
  await page.waitForTimeout(120);
  await page.locator('#pendulumPause').click();

  await page.goto(base+'/simulations/hydrology/water-cycle/index.html',{waitUntil:'domcontentloaded'});
  await page.locator('#waterPlay').click();
  await page.waitForTimeout(120);
  await page.locator('#waterPause').click();

  await page.goto(base+'/simulations/astronomy/earth-revolution/index.html',{waitUntil:'domcontentloaded'});
  await page.locator('#orbitPlay').click();
  await page.waitForTimeout(120);
  await page.locator('#orbitPause').click();
  await page.locator('#orbitDay').evaluate(element=>{
    element.value='250';element.dispatchEvent(new Event('input',{bubbles:true}));
  });
  assert.match(await page.locator('#orbitDayValue').textContent(),/Ngày thứ/);

  await page.goto(base+'/simulations/astronomy/earth-revolution/index.html',{waitUntil:'domcontentloaded'});
  await page.locator('.model-knowledge-switch button').nth(1).click();
  await page.waitForFunction(()=>document.querySelector('.model-knowledge-panel h3'),{timeout:10000});
  await page.close();
  console.log('Browser smoke test passed: 25 model pages, 6 responsive pages at 4 widths, 3 interactive experiences.');
}finally{
  await browser.close();
  await new Promise(resolve=>server.close(resolve));
}
