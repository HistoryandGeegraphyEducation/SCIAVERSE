(() => {
  'use strict';

  const root = document.documentElement;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const nodes = [...document.querySelectorAll('[data-orbit-node]')];
  const orbitStart = performance.now();
  let raf = 0;
  let lastDraw = 0;
  let active = !document.hidden;

  const TAU = Math.PI * 2;
  const orbitSpecs = nodes.map(node => ({
    node,
    a: Number(node.dataset.a),
    e: Number(node.dataset.e),
    rotation: Number(node.dataset.rotation) * Math.PI / 180,
    period: ({ a: 82, b: 118, c: 156 })[node.dataset.orbitNode] || 120,
    phase: Number(node.dataset.phase)
  }));

  function orbitalPosition({ a, e, rotation, period, phase }, seconds) {
    const mean = (seconds / period * TAU + phase) % TAU;
    let eccentric = mean;
    for (let i = 0; i < 8; i += 1) {
      eccentric -= (eccentric - e * Math.sin(eccentric) - mean) /
        (1 - e * Math.cos(eccentric));
    }
    const b = a * Math.sqrt(1 - e * e);
    const x = a * (Math.cos(eccentric) - e);
    const y = b * Math.sin(eccentric);
    const c = Math.cos(rotation);
    const s = Math.sin(rotation);
    return {
      x: 210 + x * c - y * s,
      y: 135 + x * s + y * c
    };
  }

  function render(now) {
    raf = 0;
    if (!active || reducedMotion.matches) return;
    if (now - lastDraw < 32) {
      raf = requestAnimationFrame(render);
      return;
    }
    lastDraw = now;
    const seconds = (now - orbitStart) / 1000;
    orbitSpecs.forEach(spec => {
      const point = orbitalPosition(spec, seconds);
      spec.node.setAttribute('cx', point.x.toFixed(2));
      spec.node.setAttribute('cy', point.y.toFixed(2));
    });

    raf = requestAnimationFrame(render);
  }

  function update() {
    active = !document.hidden && !reducedMotion.matches;
    if (active && !raf) raf = requestAnimationFrame(render);
    if (!active && raf) {
      cancelAnimationFrame(raf);
      raf = 0;
    }
  }

  document.addEventListener('visibilitychange', update);
  reducedMotion.addEventListener?.('change', update);
  update();
})();
