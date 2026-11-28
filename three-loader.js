(() => {
  'use strict';
  const scriptUrl = document.currentScript && document.currentScript.src;
  if (!scriptUrl) {
    window.SCIAVERSE_THREE_READY = Promise.reject(new Error('Không xác định được đường dẫn thư viện Three.js.'));
    window.SCIAVERSE_ORBIT_CONTROLS_READY = window.SCIAVERSE_THREE_READY;
    return;
  }
  function loadLocalScript(url, ready) {
    if (ready()) return Promise.resolve();
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = url;
      script.async = true;
      script.onload = () => ready() ? resolve() : reject(new Error('Tệp thư viện đã tải nhưng không khởi tạo được.'));
      script.onerror = () => reject(new Error('Không tải được thư viện cục bộ: ' + url));
      document.head.appendChild(script);
    });
  }
  const threeUrl = new URL('vendor/three-r128.min.js', scriptUrl).href;
  const controlsUrl = new URL('vendor/OrbitControls-r128.js', scriptUrl).href;
  window.SCIAVERSE_THREE_READY = loadLocalScript(threeUrl, () => Boolean(window.THREE)).then(() => window.THREE);
  window.SCIAVERSE_ORBIT_CONTROLS_READY = window.SCIAVERSE_THREE_READY
    .then(() => loadLocalScript(controlsUrl, () => Boolean(window.THREE && window.THREE.OrbitControls)))
    .then(() => window.THREE.OrbitControls);
})();
