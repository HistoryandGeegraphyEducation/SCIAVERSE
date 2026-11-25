(() => {
  'use strict';

  const canvases = [...document.querySelectorAll('canvas[data-scene]')];
  if (!canvases.length) return;

  const root = document.documentElement;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const states = new Map();
  const canvasSupported = canvases.every(canvas => {
    try { return Boolean(canvas.getContext('2d')); } catch { return false; }
  });
  if (!canvasSupported) return;
  const TAU = Math.PI * 2;
  let frame = 0;
  let lastFrame = 0;
  let startedAt = performance.now();
  let elapsed = 0;
  let activeCount = 0;

  const palette = () => {
    const light = root.dataset.theme === 'light';
    return light ? {
      line: 'rgba(25,104,91,.30)',
      fine: 'rgba(25,104,91,.16)',
      bright: '#187d6b',
      warm: '#a66d20',
      blue: '#526b96',
      text: 'rgba(23,37,33,.62)',
      ground: 'rgba(255,255,255,.16)'
    } : {
      line: 'rgba(131,216,198,.38)',
      fine: 'rgba(131,216,198,.17)',
      bright: '#83d8c6',
      warm: '#e2bd7c',
      blue: '#a6b5dc',
      text: 'rgba(237,244,241,.62)',
      ground: 'rgba(10,20,24,.12)'
    };
  };

  function fit(canvas) {
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return null;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const width = Math.max(1, Math.round(rect.width * dpr));
    const height = Math.max(1, Math.round(rect.height * dpr));
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }
    const ctx = canvas.getContext('2d', { alpha: true, desynchronized: true });
    if (!ctx) return null;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return { ctx, w: rect.width, h: rect.height };
  }

  function ellipsePoint(a, e, rotation, mean) {
    let E = mean;
    for (let i = 0; i < 7; i += 1) {
      E -= (E - e * Math.sin(E) - mean) / (1 - e * Math.cos(E));
    }
    const b = a * Math.sqrt(1 - e * e);
    const x = a * (Math.cos(E) - e);
    const y = b * Math.sin(E);
    const c = Math.cos(rotation), s = Math.sin(rotation);
    return { x: a * e * c + x * c - y * s, y: a * e * s + x * s + y * c };
  }

  function drawOrbit(ctx, w, h, t, p) {
    const cx = w * .5, cy = h * .5;
    const scale = Math.min(w / 460, (h * .78) / 410);
    const specs = [
      { a: 205 * scale, e: .22, r: -.22, period: 21, phase: .35, color: p.blue, radius: 5.2 },
      { a: 151 * scale, e: .16, r: .48, period: 31, phase: 2.0, color: p.warm, radius: 6.1 },
      { a: 103 * scale, e: .10, r: -.72, period: 43, phase: 4.1, color: p.bright, radius: 4.2 }
    ];
    ctx.save();
    ctx.translate(cx, cy);
    ctx.lineWidth = 1;
    specs.forEach((o, i) => {
      const b = o.a * Math.sqrt(1 - o.e * o.e);
      const ox = o.a * o.e * Math.cos(o.r);
      const oy = o.a * o.e * Math.sin(o.r);
      ctx.save();
      ctx.translate(ox, oy);
      ctx.rotate(o.r);
      ctx.beginPath();
      ctx.ellipse(0, 0, o.a, b, 0, 0, TAU);
      ctx.strokeStyle = i === 0 ? p.line : p.fine;
      ctx.setLineDash([2, 6]);
      ctx.stroke();
      ctx.restore();

      const M = (t / o.period * TAU + o.phase) % TAU;
      const pos = ellipsePoint(o.a, o.e, o.r, M);
      const glow = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, o.radius * 3.2);
      glow.addColorStop(0, o.color);
      glow.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, o.radius * 3.2, 0, TAU);
      ctx.fill();
      ctx.fillStyle = o.color;
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, o.radius, 0, TAU);
      ctx.fill();
    });

    const sunR = Math.max(10, 17 * scale);
    const sunGlow = ctx.createRadialGradient(0, 0, sunR * .25, 0, 0, sunR * 3.4);
    sunGlow.addColorStop(0, 'rgba(226,189,124,.26)');
    sunGlow.addColorStop(1, 'rgba(226,189,124,0)');
    ctx.fillStyle = sunGlow;
    ctx.beginPath(); ctx.arc(0, 0, sunR * 3.4, 0, TAU); ctx.fill();
    ctx.fillStyle = p.warm;
    ctx.beginPath(); ctx.arc(0, 0, sunR, 0, TAU); ctx.fill();
    ctx.strokeStyle = 'rgba(226,189,124,.45)';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(0, 0, sunR + 4, 0, TAU); ctx.stroke();
    ctx.restore();
  }

  function drawTerrain(ctx, w, h, t, p) {
    const step = Math.max(18, Math.min(25, w / 22));
    const phase = t * .00022;
    const cols = Math.ceil(w / step), rows = Math.ceil(h / step);
    const field = (x, y) => Math.sin(x * .014 + phase) +
      .78 * Math.cos(y * .021 - phase * .72) +
      .38 * Math.sin((x + y) * .009 + phase * .42);
    const levels = [-1.55, -1.2, -.85, -.5, -.15, .2, .55, .9, 1.25, 1.6];
    const edgePairs = [[0,1],[1,2],[2,3],[3,0]];
    const point = (edge, x, y, v) => {
      const [a,b] = edgePairs[edge];
      const corners = [[x,y],[x+step,y],[x+step,y+step],[x,y+step]];
      const va = v[a], vb = v[b];
      const f = Math.abs(vb-va) < 1e-6 ? .5 : (0-va)/(vb-va);
      return [corners[a][0] + (corners[b][0]-corners[a][0])*f,
              corners[a][1] + (corners[b][1]-corners[a][1])*f];
    };
    ctx.lineWidth = 1;
    for (let y=0; y<rows; y++) {
      for (let x=0; x<cols; x++) {
        const px=x*step, py=y*step;
        const vals=[field(px,py),field(px+step,py),field(px+step,py+step),field(px,py+step)];
        levels.forEach((level, li) => {
          const v=vals.map(n=>n-level), crossings=[];
          for(let e=0;e<4;e++){
            const a=v[edgePairs[e][0]], b=v[edgePairs[e][1]];
            if((a<0&&b>=0)||(a>=0&&b<0)) crossings.push(point(e,px,py,v));
          }
          if(crossings.length<2) return;
          ctx.strokeStyle = li===4 || li===5 ? p.line : p.fine;
          ctx.beginPath();
          for(let k=0;k+1<crossings.length;k+=2){
            ctx.moveTo(...crossings[k]); ctx.lineTo(...crossings[k+1]);
          }
          ctx.stroke();
        });
      }
    }
    const scanX = ((t * .018) % (w + 120)) - 60;
    const grad = ctx.createLinearGradient(scanX-34,0,scanX+34,0);
    grad.addColorStop(0,'rgba(0,0,0,0)');
    grad.addColorStop(.5,p.bright);
    grad.addColorStop(1,'rgba(0,0,0,0)');
    ctx.globalAlpha=.26;
    ctx.fillStyle=grad;
    ctx.fillRect(scanX-34,0,68,h);
    ctx.globalAlpha=1;
  }

  function drawWaves(ctx, w, h, t, p) {
    const sources=[{x:w*.24,y:h*.52,phase:0},{x:w*.76,y:h*.42,phase:Math.PI*.8}];
    ctx.lineWidth=1.15;
    sources.forEach((s,si)=>{
      for(let n=0;n<8;n++){
        const radius=((t*.035+n*34+si*21)%Math.max(w,h));
        ctx.beginPath();
        ctx.arc(s.x,s.y,radius,0,TAU);
        ctx.strokeStyle=n%3===0?p.line:p.fine;
        ctx.globalAlpha=.75*(1-radius/Math.max(w,h)*.42);
        ctx.stroke();
      }
    });
    ctx.globalAlpha=1;
    for(let i=0;i<9;i++){
      const x=((i/8*w + t*.018)%(w+30))-15;
      const y=h*(.24+.52*(.5+.5*Math.sin(i*1.71+t*.00055)));
      const r=1.6+(i%3)*.6;
      ctx.fillStyle=i%2?p.blue:p.bright;
      ctx.globalAlpha=.7;
      ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fill();
    }
    ctx.globalAlpha=1;
    ctx.strokeStyle=p.line;
    ctx.setLineDash([4,9]);
    ctx.beginPath();
    for(let x=0;x<=w;x+=4){
      const y=h*.72+Math.sin(x*.018-t*.0008)*h*.045+Math.sin(x*.006+t*.0004)*h*.025;
      if(x===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);
    }
    ctx.stroke();ctx.setLineDash([]);
  }

  function drawNetwork(ctx, w, h, t, p) {
    const base=[
      [.50,.48],[.22,.24],[.77,.18],[.88,.58],[.69,.82],[.36,.80],[.12,.57],[.40,.12],[.60,.32],[.29,.43],[.72,.61]
    ];
    const nodes=base.map(([x,y],i)=>({
      x:x*w+Math.sin(t*.00032+i*1.7)*7,
      y:y*h+Math.cos(t*.00028+i*1.31)*6,
      r:i===0?5:2.7+(i%3)*.45
    }));
    const edges=[[0,1],[0,2],[0,3],[0,4],[0,5],[0,6],[1,7],[7,2],[1,9],[9,6],[2,8],[8,3],[8,10],[10,4],[9,5],[5,6],[3,4]];
    ctx.lineWidth=1;
    edges.forEach(([a,b],i)=>{
      const A=nodes[a],B=nodes[b];
      ctx.strokeStyle=i%4===0?p.line:p.fine;
      ctx.beginPath();ctx.moveTo(A.x,A.y);ctx.lineTo(B.x,B.y);ctx.stroke();
      const phase=((t*.00018+i*.137)%1);
      const x=A.x+(B.x-A.x)*phase,y=A.y+(B.y-A.y)*phase;
      ctx.fillStyle=i%3===0?p.warm:p.bright;
      ctx.globalAlpha=.9;
      ctx.beginPath();ctx.arc(x,y,i%4===0?2.2:1.45,0,TAU);ctx.fill();
    });
    ctx.globalAlpha=1;
    nodes.forEach((n,i)=>{
      ctx.fillStyle=i===0?p.warm:p.blue;
      ctx.beginPath();ctx.arc(n.x,n.y,n.r,0,TAU);ctx.fill();
      ctx.strokeStyle=p.fine;ctx.lineWidth=1;
      ctx.beginPath();ctx.arc(n.x,n.y,n.r+4+Math.sin(t*.001+i)*1.5,0,TAU);ctx.stroke();
    });
  }

  function drawBridge(ctx,w,h,t,p) {
    const y=h*.91;
    ctx.save();
    ctx.strokeStyle=p.fine;ctx.lineWidth=1;ctx.setLineDash([2,7]);
    ctx.beginPath();
    ctx.moveTo(0,y);
    ctx.bezierCurveTo(w*.28,y-9,w*.72,y+9,w,y);
    ctx.stroke();ctx.setLineDash([]);
    const phase=(t*.00009)%1;
    const x=phase*w;
    const yy=y+Math.sin(phase*Math.PI*2)*7;
    ctx.fillStyle=p.bright;
    ctx.globalAlpha=.85;
    ctx.beginPath();ctx.arc(x,yy,2.5,0,TAU);ctx.fill();
    ctx.restore();
  }

  function render(t) {
    if (reduced.matches || document.hidden || activeCount===0) { frame=0; return; }
    if (t-lastFrame<32) { frame=requestAnimationFrame(render); return; }
    lastFrame=t;
    const p=palette();
    states.forEach((state,canvas)=>{
      if(!state.active) return;
      const fitted=fit(canvas);
      if(!fitted) return;
      const {ctx,w,h}=fitted;
      ctx.clearRect(0,0,w,h);
      const scene=canvas.dataset.scene;
      if(scene==='orbit') drawOrbit(ctx,w,h,t-startedAt,p);
      else if(scene==='terrain') drawTerrain(ctx,w,h,t-startedAt,p);
      else if(scene==='waves') drawWaves(ctx,w,h,t-startedAt,p);
      else if(scene==='network') drawNetwork(ctx,w,h,t-startedAt,p);
      drawBridge(ctx,w,h,t-startedAt,p);
    });
    frame=requestAnimationFrame(render);
  }

  function updateLoop() {
    activeCount=[...states.values()].filter(s=>s.active).length;
    if(!reduced.matches && !document.hidden && activeCount>0 && !frame) {
      startedAt=performance.now()-elapsed;
      frame=requestAnimationFrame(render);
    } else if((reduced.matches || document.hidden || activeCount===0) && frame) {
      cancelAnimationFrame(frame);frame=0;
      elapsed=performance.now()-startedAt;
    }
  }

  canvases.forEach(canvas=>states.set(canvas,{active:false}));
  if ('IntersectionObserver' in window) {
    const observer=new IntersectionObserver(entries=>{
      entries.forEach(entry=>{
        const state=states.get(entry.target);
        if(state) state.active=entry.isIntersecting;
      });
      updateLoop();
    },{rootMargin:'100px 0px 100px 0px',threshold:0.01});
    canvases.forEach(canvas=>observer.observe(canvas));
  } else {
    states.forEach(state=>{ state.active=true; });
  }

  if ('ResizeObserver' in window) {
    const resizeObserver=new ResizeObserver(entries=>{
      entries.forEach(({target})=>{
        const state=states.get(target);
        if(state) state.needsResize=true;
      });
    });
    canvases.forEach(canvas=>resizeObserver.observe(canvas));
  }

  reduced.addEventListener('change',()=>{
    canvases.forEach(canvas=>{
      canvas.style.display=reduced.matches?'none':'block';
    });
    if(reduced.matches) root.classList.remove('motion-ready');
    else root.classList.add('motion-ready');
    updateLoop();
  });
  document.addEventListener('visibilitychange',updateLoop);
  root.classList.add('motion-ready');
  if(reduced.matches) canvases.forEach(canvas=>canvas.style.display='none');
  else updateLoop();
})();