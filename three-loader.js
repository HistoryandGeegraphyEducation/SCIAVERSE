(() => {
  'use strict';

  const THREE_SOURCES = [
    'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js',
    'https://cdn.jsdelivr.net/npm/three@0.128.0/build/three.min.js',
    'https://unpkg.com/three@0.128.0/build/three.min.js'
  ];
  const CONTROL_SOURCES = [
    'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js',
    'https://unpkg.com/three@0.128.0/examples/js/controls/OrbitControls.js'
  ];

  function loadFrom(sources, ready) {
    if (ready()) return Promise.resolve();
    return new Promise((resolve, reject) => {
      let index = 0;
      const attempt = () => {
        if (ready()) return resolve();
        if (index >= sources.length) return reject(new Error('Không tải được thư viện 3D từ các nguồn dự phòng.'));
        const script = document.createElement('script');
        script.src = sources[index++];
        script.async = true;
        script.crossOrigin = 'anonymous';
        const timeout = window.setTimeout(() => {
          script.remove();
          attempt();
        }, 12000);
        script.onload = () => {
          window.clearTimeout(timeout);
          if (ready()) resolve();
          else attempt();
        };
        script.onerror = () => {
          window.clearTimeout(timeout);
          script.remove();
          attempt();
        };
        document.head.appendChild(script);
      };
      attempt();
    });
  }

  window.SCIAVERSE_THREE_READY = loadFrom(THREE_SOURCES, () => Boolean(window.THREE))
    .then(() => window.THREE);

  window.SCIAVERSE_ORBIT_CONTROLS_READY = window.SCIAVERSE_THREE_READY
    .then(() => loadFrom(CONTROL_SOURCES, () => Boolean(window.THREE?.OrbitControls)))
    .then(() => window.THREE.OrbitControls);
})();