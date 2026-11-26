(() => {
  'use strict';

  const stage = document.getElementById('coordinateStage');
  if (!stage) return;

  const status = document.getElementById('textureStatus');
  const hud = document.getElementById('coordinateHud');
  const output = document.getElementById('coordinateOutput');
  const poleNote = document.getElementById('coordinatePoleNote');
  const latitudeRange = document.getElementById('latitudeRange');
  const longitudeRange = document.getElementById('longitudeRange');
  const latitudeNumber = document.getElementById('latitudeNumber');
  const longitudeNumber = document.getElementById('longitudeNumber');
  const resetPointButton = document.getElementById('resetPoint');
  const resetCameraButton = document.getElementById('resetCamera');

  const TEXTURE_URL = 'https://svs.gsfc.nasa.gov/vis/a000000/a002900/a002915/bluemarble-2048.png';
  const RADIUS = 1.8;
  const SELECTED_RADIUS = 1.825;
  const state = { latitude: 0, longitude: 0 };

  let renderer;
  let scene;
  let camera;
  let controls;
  let earth;
  let pin;
  let texture;
  let parallelsGroup;
  let meridiansGroup;
  let equator;
  let primeMeridian;
  let axis;
  let resizeObserver;
  let renderFrame = 0;
  let destroyed = false;
  let pointerStart = null;

  const listeners = [];
  const sceneListeners = [];
  let sceneUnavailable = false;
  const T = window.THREE;

  function listen(target, eventName, handler, options) {
    target.addEventListener(eventName, handler, options);
    listeners.push([target, eventName, handler, options]);
  }

  function listenScene(target, eventName, handler, options) {
    target.addEventListener(eventName, handler, options);
    sceneListeners.push([target, eventName, handler, options]);
  }

  function showStatus(message, stateName) {
    status.textContent = message;
    status.dataset.state = stateName || 'info';
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function round2(value) {
    return Math.round(value * 100) / 100;
  }

  function normalizeLongitude(value) {
    let result = ((value + 180) % 360 + 360) % 360 - 180;
    if (Math.abs(result + 180) < 0.000001 && value > 0) result = 180;
    return round2(result);
  }

  function formatLatitude(value) {
    if (Math.abs(value) < 0.005) return '0.00° (Xích đạo)';
    return Math.abs(value).toFixed(2) + '° ' + (value > 0 ? 'Bắc' : 'Nam');
  }

  function formatLongitude(value, atPole) {
    if (atPole) return 'Kinh độ không xác định tại cực';
    if (Math.abs(value) < 0.005) return '0.00° (kinh tuyến gốc)';
    if (Math.abs(Math.abs(value) - 180) < 0.005) return '180.00° (kinh tuyến đối cực)';
    return Math.abs(value).toFixed(2) + '° ' + (value > 0 ? 'Đông' : 'Tây');
  }

  function updateInterface() {
    const atPole = Math.abs(state.latitude) >= 89.995;
    const latitudeText = formatLatitude(state.latitude);
    const longitudeText = formatLongitude(state.longitude, atPole);
    latitudeRange.value = state.latitude.toFixed(2);
    longitudeRange.value = state.longitude.toFixed(2);
    latitudeNumber.value = state.latitude.toFixed(2);
    longitudeNumber.value = state.longitude.toFixed(2);
    output.textContent = latitudeText + ', ' + longitudeText;
    hud.textContent = latitudeText + ' · ' + longitudeText;
    poleNote.hidden = !atPole;
    longitudeRange.disabled = atPole;
    longitudeNumber.disabled = atPole;
    updatePin();
    requestRender();
  }

  function globePoint(latitude, longitude, radius) {
    const phi = latitude * Math.PI / 180;
    const lambda = longitude * Math.PI / 180;
    return new T.Vector3(
      radius * Math.cos(phi) * Math.cos(lambda),
      radius * Math.sin(phi),
      -radius * Math.cos(phi) * Math.sin(lambda)
    );
  }

  function setCoordinates(latitude, longitude) {
    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return;
    state.latitude = round2(clamp(latitude, -90, 90));
    state.longitude = normalizeLongitude(clamp(longitude, -180, 180));
    updateInterface();
  }

  function updatePin() {
    if (!pin || !T) return;
    const position = globePoint(state.latitude, state.longitude, SELECTED_RADIUS);
    pin.position.copy(position);
    pin.quaternion.setFromUnitVectors(new T.Vector3(0, 1, 0), position.clone().normalize());
  }

  function requestRender() {
    if (destroyed || sceneUnavailable || !renderer || !scene || !camera || renderFrame || document.hidden) return;
    renderFrame = window.requestAnimationFrame(() => {
      renderFrame = 0;
      if (!destroyed && renderer && scene && camera) renderer.render(scene, camera);
    });
  }

  function createLine(points, color, opacity, closed) {
    const geometry = new T.BufferGeometry().setFromPoints(points);
    const material = new T.LineBasicMaterial({
      color,
      transparent: opacity < 1,
      opacity
    });
    return closed ? new T.LineLoop(geometry, material) : new T.Line(geometry, material);
  }

  function createHighlight(points, color, closed) {
    const curve = new T.CatmullRomCurve3(points, closed);
    const geometry = new T.TubeGeometry(curve, 180, 0.0065, 6, closed);
    const material = new T.MeshBasicMaterial({ color });
    return new T.Mesh(geometry, material);
  }

  function buildGrid() {
    parallelsGroup = new T.Group();
    meridiansGroup = new T.Group();
    scene.add(parallelsGroup, meridiansGroup);

    for (let latitude = -75; latitude <= 75; latitude += 15) {
      if (latitude === 0) continue;
      const points = [];
      for (let longitude = -180; longitude < 180; longitude += 3) {
        points.push(globePoint(latitude, longitude, RADIUS + 0.012));
      }
      parallelsGroup.add(createLine(points, 0xa9c1c9, 0.38, true));
    }

    for (let longitude = -180; longitude < 180; longitude += 15) {
      if (longitude === 0) continue;
      const points = [];
      for (let latitude = -90; latitude <= 90; latitude += 3) {
        points.push(globePoint(latitude, longitude, RADIUS + 0.013));
      }
      meridiansGroup.add(createLine(points, 0xa9c1c9, 0.38, false));
    }

    const equatorPoints = [];
    for (let longitude = -180; longitude <= 180; longitude += 3) {
      equatorPoints.push(globePoint(0, longitude, RADIUS + 0.016));
    }
    equator = createHighlight(equatorPoints, 0xf0c36b, true);
    scene.add(equator);

    const primePoints = [];
    for (let latitude = -90; latitude <= 90; latitude += 3) {
      primePoints.push(globePoint(latitude, 0, RADIUS + 0.017));
    }
    primeMeridian = createHighlight(primePoints, 0xef9272, false);
    scene.add(primeMeridian);

    const axisGeometry = new T.BufferGeometry().setFromPoints([
      new T.Vector3(0, -2.15, 0),
      new T.Vector3(0, 2.15, 0)
    ]);
    axis = new T.Line(axisGeometry, new T.LineBasicMaterial({
      color: 0xe9e0bb,
      transparent: true,
      opacity: 0.68
    }));
    scene.add(axis);
  }

  function buildPin() {
    pin = new T.Group();
    const stemMaterial = new T.MeshStandardMaterial({ color: 0xffd36b, roughness: 0.55 });
    const headMaterial = new T.MeshStandardMaterial({ color: 0xf47d63, roughness: 0.5 });
    const stem = new T.Mesh(new T.CylinderGeometry(0.012, 0.02, 0.24, 12), stemMaterial);
    stem.position.y = 0.12;
    const head = new T.Mesh(new T.SphereGeometry(0.065, 20, 16), headMaterial);
    head.position.y = 0.27;
    pin.add(stem, head);
    scene.add(pin);
    updatePin();
  }

  function resize() {
    if (destroyed || sceneUnavailable || !renderer || !camera) return;
    const width = Math.max(1, stage.clientWidth);
    const height = Math.max(1, stage.clientHeight);
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    requestRender();
  }

  function resetCamera() {
    if (!camera || !controls) return;
    camera.position.set(5.4, 3.2, -6.8);
    controls.target.set(0, 0, 0);
    controls.update();
    requestRender();
  }

  function disposeScene() {
    sceneUnavailable = true;
    if (renderFrame) window.cancelAnimationFrame(renderFrame);
    renderFrame = 0;
    if (resizeObserver) {
      resizeObserver.disconnect();
      resizeObserver = null;
    }
    sceneListeners.forEach(([target, eventName, handler, options]) => {
      target.removeEventListener(eventName, handler, options);
    });
    sceneListeners.length = 0;
    if (controls) {
      controls.removeEventListener('change', requestRender);
      controls.dispose();
      controls = null;
    }
    if (scene) {
      scene.traverse(object => {
        if (object.geometry) object.geometry.dispose();
        if (object.material) {
          const materials = Array.isArray(object.material) ? object.material : [object.material];
          materials.forEach(material => {
            if (material.map && material.map !== texture) material.map.dispose();
            material.dispose();
          });
        }
      });
    }
    if (texture) {
      texture.dispose();
      texture = null;
    }
    if (renderer) {
      renderer.dispose();
      if (renderer.domElement.parentNode) renderer.domElement.remove();
      renderer = null;
    }
  }

  function destroy() {
    if (destroyed) return;
    destroyed = true;
    listeners.forEach(([target, eventName, handler, options]) => {
      target.removeEventListener(eventName, handler, options);
    });
    listeners.length = 0;
    disposeScene();
  }

  function initializeScene() {
    if (!T || !T.OrbitControls) {
      showStatus('Không tải được thư viện 3D. Có thể nhập tọa độ bằng các ô số; quả Địa Cầu chưa thể hiển thị.', 'error');
      return;
    }

    scene = new T.Scene();
    scene.background = new T.Color(0x0b1a22);
    camera = new T.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(5.4, 3.2, -6.8);

    renderer = new T.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance'
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.outputEncoding = T.sRGBEncoding;
    renderer.domElement.style.touchAction = 'none';
    renderer.domElement.setAttribute('role', 'img');
    renderer.domElement.setAttribute('aria-label', 'Quả Địa Cầu với lưới kinh tuyến, vĩ tuyến và điểm tọa độ đang chọn.');
    stage.prepend(renderer.domElement);
    listenScene(renderer.domElement, 'webglcontextlost', event => {
      event.preventDefault();
      showStatus('WebGL đã bị gián đoạn. Quả Địa Cầu không thể tiếp tục hiển thị; các ô nhập tọa độ vẫn dùng được.', 'error');
      disposeScene();
    });

    scene.add(new T.HemisphereLight(0xd9efff, 0x243b36, 1.25));
    const keyLight = new T.DirectionalLight(0xfff0d2, 2.1);
    keyLight.position.set(4, 5, 6);
    scene.add(keyLight);
    const fillLight = new T.DirectionalLight(0x6fa4c5, 0.75);
    fillLight.position.set(-5, 1, -4);
    scene.add(fillLight);

    earth = new T.Mesh(
      new T.SphereGeometry(RADIUS, 144, 96),
      new T.MeshStandardMaterial({ color: 0x276b86, roughness: 0.94 })
    );
    scene.add(earth);

    buildGrid();
    buildPin();

    controls = new T.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = false;
    controls.enablePan = false;
    controls.enableRotate = true;
    controls.enableZoom = true;
    controls.minDistance = 3.35;
    controls.maxDistance = 9.2;
    controls.rotateSpeed = 0.62;
    controls.zoomSpeed = 0.78;
    controls.addEventListener('change', requestRender);
    controls.update();

    const raycaster = new T.Raycaster();
    const pointer = new T.Vector2();
    let pointerDownHandler;
    let pointerUpHandler;
    let pointerCancelHandler;

    pointerDownHandler = event => {
      if (event.pointerType === 'mouse' && event.button !== 0) return;
      pointerStart = { id: event.pointerId, x: event.clientX, y: event.clientY };
    };
    pointerUpHandler = event => {
      if (!pointerStart || pointerStart.id !== event.pointerId) return;
      const deltaX = event.clientX - pointerStart.x;
      const deltaY = event.clientY - pointerStart.y;
      pointerStart = null;
      if (deltaX * deltaX + deltaY * deltaY > 36) return;

      const rect = renderer.domElement.getBoundingClientRect();
      pointer.set(
        ((event.clientX - rect.left) / rect.width) * 2 - 1,
        -(((event.clientY - rect.top) / rect.height) * 2 - 1)
      );
      raycaster.setFromCamera(pointer, camera);
      const hit = raycaster.intersectObject(earth, false)[0];
      if (!hit) return;

      const normal = hit.point.normalize();
      const latitude = Math.asin(clamp(normal.y, -1, 1)) * 180 / Math.PI;
      const longitude = Math.atan2(-normal.z, normal.x) * 180 / Math.PI;
      setCoordinates(latitude, longitude);
    };
    pointerCancelHandler = () => { pointerStart = null; };

    listenScene(renderer.domElement, 'pointerdown', pointerDownHandler);
    listenScene(renderer.domElement, 'pointerup', pointerUpHandler);
    listenScene(renderer.domElement, 'pointercancel', pointerCancelHandler);

    const loader = new T.TextureLoader();
    loader.setCrossOrigin('anonymous');
    loader.load(
      TEXTURE_URL,
      loadedTexture => {
        if (destroyed || sceneUnavailable) {
          loadedTexture.dispose();
          return;
        }
        texture = loadedTexture;
        texture.encoding = T.sRGBEncoding;
        texture.anisotropy = Math.min(renderer.capabilities.getMaxAnisotropy(), 8);
        earth.material.map = texture;
        earth.material.color.set(0xffffff);
        earth.material.needsUpdate = true;
        showStatus('Ảnh Blue Marble đã tải. Chọn điểm trên bề mặt hoặc nhập tọa độ.', 'success');
        requestRender();
      },
      undefined,
      () => {
        if (!destroyed && !sceneUnavailable) {
          showStatus('Không tải được ảnh Blue Marble từ NASA. Lưới tọa độ và ô nhập vẫn dùng được; không có bản đồ thay thế giả lập.', 'error');
        }
      }
    );

    if (window.ResizeObserver) {
      resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(stage);
    } else {
      listenScene(window, 'resize', resize);
    }
    listenScene(document, 'visibilitychange', () => {
      if (!document.hidden) requestRender();
      else if (renderFrame) {
        window.cancelAnimationFrame(renderFrame);
        renderFrame = 0;
      }
    });
    listenScene(window, 'pagehide', destroy, { once: true });

    resize();
    updatePin();
    requestRender();
  }

  listen(latitudeRange, 'input', () => setCoordinates(Number(latitudeRange.value), state.longitude));
  listen(longitudeRange, 'input', () => setCoordinates(state.latitude, Number(longitudeRange.value)));
  listen(latitudeNumber, 'change', () => {
    const value = Number(latitudeNumber.value);
    if (latitudeNumber.value.trim() === '' || !Number.isFinite(value)) updateInterface();
    else setCoordinates(value, state.longitude);
  });
  listen(longitudeNumber, 'change', () => {
    const value = Number(longitudeNumber.value);
    if (longitudeNumber.value.trim() === '' || !Number.isFinite(value)) updateInterface();
    else setCoordinates(state.latitude, value);
  });
  listen(resetPointButton, 'click', () => setCoordinates(0, 0));
  listen(resetCameraButton, 'click', resetCamera);

  const layerControls = [
    ['showParallels', group => { if (parallelsGroup) parallelsGroup.visible = group; }],
    ['showMeridians', group => { if (meridiansGroup) meridiansGroup.visible = group; }],
    ['showEquator', visible => { if (equator) equator.visible = visible; }],
    ['showPrime', visible => { if (primeMeridian) primeMeridian.visible = visible; }],
    ['showAxis', visible => { if (axis) axis.visible = visible; }]
  ];
  layerControls.forEach(([id, apply]) => {
    const input = document.getElementById(id);
    listen(input, 'change', () => {
      apply(input.checked);
      requestRender();
    });
  });

  updateInterface();
  try {
    initializeScene();
  } catch (error) {
    showStatus('Không thể khởi tạo mô hình 3D: ' + (error && error.message ? error.message : 'Lỗi không xác định.'), 'error');
    disposeScene();
  }
})();
