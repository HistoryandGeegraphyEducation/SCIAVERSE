(() => {
  'use strict';

  const stage = document.getElementById('earthRotationStage');
  const canvas = document.getElementById('earthRotationCanvas');
  if (!stage || !canvas) return;

  const loading = document.getElementById('earthModelLoading');
  const playButton = document.getElementById('earthModelPlay');
  const resetButton = document.getElementById('earthModelReset');
  const speedInput = document.getElementById('earthModelSpeed');
  const speedOutput = document.getElementById('earthModelSpeedValue');
  const timeOutput = document.getElementById('earthModelTime');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  const TEXTURE_URL = 'https://svs.gsfc.nasa.gov/vis/a000000/a002900/a002915/bluemarble-2048.png';
  const AXIAL_TILT_DEGREES = 23.44;
  const MODEL_SOLAR_DAY_HOURS = 24;
  const TAU = Math.PI * 2;

  let renderer;
  let scene;
  let camera;
  let controls;
  let earth;
  let earthGroup;
  let pendingTexture = null;
  let resizeObserver;
  let frameId = 0;
  let playing = !reducedMotion.matches;
  let lastFrame = 0;
  let simulatedHours = 0;
  let destroyed = false;
  let disposed = false;
  const listeners = [];

  function loadScript(src, ready) {
    if (ready()) return Promise.resolve();
    return new Promise((resolve, reject) => {
      const existing = [...document.scripts].find(script => script.src === src);
      if (existing) {
        if (existing.dataset.sciaverseLoadState === 'loaded') {
          reject(new Error('Thư viện 3D đã tải nhưng không khởi tạo được.'));
          return;
        }
        existing.addEventListener('load', resolve, { once: true });
        existing.addEventListener('error', () => reject(new Error('Không tải được thư viện 3D.')), { once: true });
        return;
      }
      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.dataset.sciaverseLoadState = 'loading';
      script.onload = () => {
        script.dataset.sciaverseLoadState = 'loaded';
        resolve();
      };
      script.onerror = () => {
        script.dataset.sciaverseLoadState = 'error';
        reject(new Error('Không tải được thư viện 3D.'));
      };
      document.head.appendChild(script);
    });
  }

  function listen(target, eventName, handler, options) {
    if (!target) return;
    target.addEventListener(eventName, handler, options);
    listeners.push([target, eventName, handler, options]);
  }

  function cleanupScene() {
    if (disposed) return;
    disposed = true;
    if (frameId) window.cancelAnimationFrame(frameId);
    frameId = 0;
    if (resizeObserver) {
      resizeObserver.disconnect();
      resizeObserver = null;
    }
    listeners.forEach(([target, eventName, handler, options]) => {
      target.removeEventListener(eventName, handler, options);
    });
    listeners.length = 0;
    pendingTexture?.dispose?.();
    pendingTexture = null;
    if (controls) {
      controls.removeEventListener('change', requestFrame);
      controls.dispose();
      controls = null;
    }
    if (scene) {
      scene.traverse(object => {
        object.geometry?.dispose?.();
        if (object.material) {
          const materials = Array.isArray(object.material) ? object.material : [object.material];
          materials.forEach(material => {
            material.map?.dispose?.();
            material.dispose?.();
          });
        }
      });
      scene.clear();
      scene = null;
    }
    renderer?.dispose?.();
    renderer?.forceContextLoss?.();
    renderer = null;
    earth = null;
    earthGroup = null;
  }

  function showError(message) {
    cleanupScene();
    if (loading) {
      loading.hidden = false;
      loading.textContent = message;
      loading.classList.add('is-error');
    }
    if (playButton) playButton.disabled = true;
    if (resetButton) resetButton.disabled = true;
    if (speedInput) speedInput.disabled = true;
  }

  function setPlaying(value) {
    playing = Boolean(value);
    if (playButton) {
      playButton.textContent = document.documentElement.lang === 'en'
        ? (playing ? 'Pause' : 'Resume')
        : (playing ? 'Tạm dừng' : 'Tiếp tục');
      playButton.setAttribute('aria-pressed', String(playing));
    }
    lastFrame = 0;
    if (playing) requestFrame();
    else if (controls) renderOnce();
  }

  function requestFrame() {
    if (!destroyed && !disposed && !document.hidden && !frameId) {
      frameId = window.requestAnimationFrame(renderFrame);
    }
  }

  function renderOnce() {
    if (!renderer || !scene || !camera || destroyed || disposed) return;
    renderer.render(scene, camera);
  }

  function renderFrame(now) {
    frameId = 0;
    if (destroyed || disposed || !renderer) return;

    const delta = lastFrame ? Math.min((now - lastFrame) / 1000, 0.05) : 0;
    lastFrame = now;

    if (playing && earthGroup) {
      const speed = Number(speedInput?.value || 1);
      simulatedHours = (simulatedHours + delta * speed) % MODEL_SOLAR_DAY_HOURS;
      earthGroup.rotation.y = simulatedHours / MODEL_SOLAR_DAY_HOURS * TAU;
      if (timeOutput) {
        const hours = Math.floor(simulatedHours);
        const minutes = Math.floor((simulatedHours - hours) * 60);
        timeOutput.textContent = String(hours).padStart(2, '0') + ':' + String(minutes).padStart(2, '0');
      }
    }

    const dampingActive = controls ? controls.update() : false;
    renderer.render(scene, camera);
    if (playing || dampingActive) requestFrame();
  }

  function addReferenceAxis(THREE) {
    const points = [
      new THREE.Vector3(0, -1.72, 0),
      new THREE.Vector3(0, 1.72, 0)
    ];
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    geometry.computeLineDistances();
    const line = new THREE.Line(geometry, new THREE.LineDashedMaterial({
      color: 0x9eabb0,
      dashSize: 0.075,
      gapSize: 0.06,
      transparent: true,
      opacity: 0.55
    }));
    scene.add(line);
  }

  function addSpinAxis(THREE, group) {
    const axisGeometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, -1.58, 0),
      new THREE.Vector3(0, 1.58, 0)
    ]);
    group.add(new THREE.Line(axisGeometry, new THREE.LineBasicMaterial({
      color: 0xe4c27a,
      transparent: true,
      opacity: 0.95
    })));

    const north = new THREE.Mesh(
      new THREE.SphereGeometry(0.045, 16, 12),
      new THREE.MeshBasicMaterial({ color: 0xd86d68 })
    );
    north.position.y = 1.58;
    group.add(north);

    const south = new THREE.Mesh(
      new THREE.SphereGeometry(0.045, 16, 12),
      new THREE.MeshBasicMaterial({ color: 0x78a9c9 })
    );
    south.position.y = -1.58;
    group.add(south);
  }

  function init(THREE, texture) {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x10171b);

    camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
    camera.position.set(5.7, 1.8, 0.45);

    renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: window.devicePixelRatio <= 1.5,
      alpha: false,
      powerPreference: 'low-power'
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.setClearColor(0x10171b, 1);
    if (THREE.sRGBEncoding) {
      renderer.outputEncoding = THREE.sRGBEncoding;
      texture.encoding = THREE.sRGBEncoding;
    }

    scene.add(new THREE.AmbientLight(0xffffff, 0.19));
    // Fixed sunlight along +Z; the axis orientation is set to an equinox-like configuration.
    const sunlight = new THREE.DirectionalLight(0xfff2d8, 2.15);
    sunlight.position.set(0, 0, 8);
    scene.add(sunlight);


    const tiltGroup = new THREE.Group();
    tiltGroup.rotation.z = -AXIAL_TILT_DEGREES * Math.PI / 180;
    scene.add(tiltGroup);
    addReferenceAxis(THREE);

    earthGroup = new THREE.Group();
    tiltGroup.add(earthGroup);

    earth = new THREE.Mesh(
      new THREE.SphereGeometry(1.18, 72, 56),
      new THREE.MeshPhongMaterial({
        map: texture,
        shininess: 9,
        specular: new THREE.Color(0x25313a)
      })
    );
    earthGroup.add(earth);
    pendingTexture = null;

    const equatorPoints = [];
    for (let index = 0; index < 180; index += 1) {
      const angle = index / 180 * TAU;
      equatorPoints.push(new THREE.Vector3(
        1.188 * Math.cos(angle),
        0,
        1.188 * Math.sin(angle)
      ));
    }
    const equator = new THREE.LineLoop(
      new THREE.BufferGeometry().setFromPoints(equatorPoints),
      new THREE.LineBasicMaterial({ color: 0xe6b96f, transparent: true, opacity: 0.52 })
    );
    earthGroup.add(equator);

    addSpinAxis(THREE, tiltGroup);

    if (THREE.OrbitControls) {
      controls = new THREE.OrbitControls(camera, canvas);
      controls.enableDamping = true;
      controls.dampingFactor = 0.075;
      controls.enablePan = false;
      controls.minDistance = 3.5;
      controls.maxDistance = 8;
      controls.target.set(0, 0, 0);
      controls.addEventListener('change', requestFrame);
      controls.update();
    }

    resize();
    resizeObserver = window.ResizeObserver ? new ResizeObserver(resize) : null;
    if (resizeObserver) resizeObserver.observe(stage);
    listen(window, 'resize', resize, { passive: true });
    if (loading) loading.hidden = true;
    setPlaying(playing);
    renderOnce();
  }

  function resize() {
    if (!renderer || !camera) return;
    const width = Math.max(1, stage.clientWidth);
    const height = Math.max(1, stage.clientHeight);
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    requestFrame();
  }

  function reset() {
    simulatedHours = 0;
    if (earthGroup) earthGroup.rotation.y = 0;
    if (timeOutput) timeOutput.textContent = '00:00';
    if (speedInput) speedInput.value = '1';
    if (speedOutput) speedOutput.textContent = '1×';
    if (camera) camera.position.set(5.7, 1.8, 0.45);
    if (controls) {
      controls.target.set(0, 0, 0);
      controls.update();
    }
    setPlaying(playing);
    renderOnce();
  }

  listen(window, 'sciaverse:languagechange', () => {
    if (playButton) setPlaying(playing);
  });

  listen(playButton, 'click', () => setPlaying(!playing));
  listen(resetButton, 'click', reset);
  listen(speedInput, 'input', () => {
    if (speedOutput) speedOutput.textContent = Number(speedInput.value).toLocaleString('vi-VN') + '×';
  });
  listen(document, 'visibilitychange', () => {
    if (document.hidden) {
      if (frameId) window.cancelAnimationFrame(frameId);
      frameId = 0;
      lastFrame = 0;
    } else if (playing) requestFrame();
    else renderOnce();
  });

  loadScript('https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js', () => Boolean(window.THREE))
    .then(() => {
      if (destroyed || disposed) throw new Error('Mô hình đã được đóng.');
      return loadScript(
      'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js',
      () => Boolean(window.THREE?.OrbitControls)
      );
    })
    .then(() => new Promise((resolve, reject) => {
      const loader = new window.THREE.TextureLoader();
      loader.setCrossOrigin('anonymous');
      loader.load(TEXTURE_URL, resolve, undefined, () => reject(new Error('Không tải được ảnh bản đồ Trái Đất từ NASA.')));
    }))
    .then(texture => {
      if (!destroyed && !disposed) {
        pendingTexture = texture;
        init(window.THREE, texture);
      } else texture.dispose();
    })
    .catch(error => {
      if (!destroyed) showError(error.message || 'Không thể khởi tạo mô hình Trái Đất.');
    });

  function destroy() {
    if (destroyed) return;
    destroyed = true;
    cleanupScene();
  }

  listen(window, 'pagehide', destroy, { once: true });
})();
