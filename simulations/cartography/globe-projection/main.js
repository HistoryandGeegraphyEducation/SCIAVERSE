(() => {
  'use strict';

  const stage = document.getElementById('projectionStage');
  if (!stage) return;

  const status = document.getElementById('projectionStatus');
  const selector = document.getElementById('projectionType');
  const nameOutput = document.getElementById('projectionName');
  const descriptionOutput = document.getElementById('projectionDescription');
  const graticuleToggle = document.getElementById('showGraticule');
  const resetButton = document.getElementById('resetProjectionView');

  const RADIUS = 1.55;
  const MAP_X = 3.65;
  const MAP_SCALE = 1;
  const MAX_MERCATOR_LAT = 85.05112878;
  const TEXTURE_URL = '../../../assets/earth-blue-marble.png';

  const PROJECTIONS = {
    equirectangular: {
      name: 'Hình trụ đứng (Plate Carrée)',
      description: 'Kinh độ và vĩ độ được biểu diễn tuyến tính. Đây là cách biểu diễn đơn giản, không bảo toàn diện tích; biến dạng tăng về phía hai cực.',
      project(longitude, latitude) {
        return { x: longitude, y: latitude };
      },
      latitudeLimit: 90
    },
    mercator: {
      name: 'Mercator',
      description: 'Phép chiếu bảo toàn góc tại phạm vi nhỏ. Vĩ độ được biến đổi bằng hàm logarit; diện tích và khoảng cách tăng rất nhanh khi tiến gần hai cực. Bản đồ này giới hạn ở ±85,0511°.',
      project(longitude, latitude) {
        const safe = Math.max(-MAX_MERCATOR_LAT, Math.min(MAX_MERCATOR_LAT, latitude));
        const phi = safe * Math.PI / 180;
        return { x: longitude, y: Math.log(Math.tan(Math.PI / 4 + phi / 2)) };
      },
      latitudeLimit: MAX_MERCATOR_LAT
    },
    'equal-area': {
      name: 'Hình trụ đồng diện tích',
      description: 'Với vĩ tuyến chuẩn ở xích đạo, phép chiếu giữ diện tích tương đối. Hình dạng bị kéo giãn theo phương Đông–Tây ở vĩ độ cao.',
      project(longitude, latitude) {
        const phi = latitude * Math.PI / 180;
        return { x: longitude, y: Math.sin(phi) };
      },
      latitudeLimit: 90
    },
    azimuthal: {
      name: 'Phương vị cách đều tâm Bắc Cực',
      description: 'Khoảng cách và phương vị tính từ tâm chiếu ở Bắc Cực được giữ đúng. Biến dạng tăng khi đi xa tâm; bản đồ tập trung vào một bán cầu.',
      project(longitude, latitude) {
        const phi = latitude * Math.PI / 180;
        const rho = Math.PI / 2 - phi;
        const lambda = longitude * Math.PI / 180;
        return { x: rho * Math.sin(lambda), y: rho * Math.cos(lambda) };
      },
      latitudeLimit: 90
    }
  };

  let THREE;
  let renderer;
  let scene;
  let camera;
  let controls;
  let globe;
  let mapMesh;
  let globeGrid;
  let mapGrid;
  let texture;
  let resizeObserver;
  let usingResizeListener = false;
  let destroyed = false;
  let renderFrame = 0;
  let activeProjection = 'equirectangular';

  function setStatus(message, state = 'info') {
    status.textContent = message;
    status.dataset.state = state;
  }

  function render() {
    if (destroyed || !renderer || !scene || !camera || document.hidden) return;
    if (renderFrame) cancelAnimationFrame(renderFrame);
    renderFrame = requestAnimationFrame(() => {
      renderFrame = 0;
      if (!destroyed && renderer) renderer.render(scene, camera);
    });
  }

  function line(points, color, opacity = 0.55) {
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({ color, transparent: opacity < 1, opacity });
    return new THREE.Line(geometry, material);
  }

  function globePoint(longitude, latitude, radius) {
    const lambda = longitude * Math.PI / 180;
    const phi = latitude * Math.PI / 180;
    return new THREE.Vector3(
      radius * Math.cos(phi) * Math.cos(lambda),
      radius * Math.sin(phi),
      -radius * Math.cos(phi) * Math.sin(lambda)
    );
  }

  function buildGlobeGrid() {
    const group = new THREE.Group();
    for (let latitude = -75; latitude <= 75; latitude += 15) {
      const points = [];
      for (let longitude = -180; longitude <= 180; longitude += 3) {
        points.push(globePoint(longitude, latitude, RADIUS + 0.012));
      }
      group.add(line(points, latitude === 0 ? 0xf0c36b : 0xd5e0e4, latitude === 0 ? 0.9 : 0.42));
    }
    for (let longitude = -180; longitude < 180; longitude += 15) {
      const points = [];
      for (let latitude = -90; latitude <= 90; latitude += 3) {
        points.push(globePoint(longitude, latitude, RADIUS + 0.012));
      }
      group.add(line(points, longitude === 0 ? 0xef9272 : 0xd5e0e4, longitude === 0 ? 0.9 : 0.42));
    }
    scene.add(group);
    return group;
  }

  function buildMapGeometry(projectionKey) {
    const projection = PROJECTIONS[projectionKey];
    const nx = 144;
    const ny = 72;
    const positions = [];
    const uvs = [];
    const indices = [];
    const latLimit = projection.latitudeLimit;
    const yValues = [];

    for (let row = 0; row <= ny; row += 1) {
      const v = row / ny;
      const latitude = -latLimit + v * latLimit * 2;
      for (let column = 0; column <= nx; column += 1) {
        const u = column / nx;
        const longitude = -180 + u * 360;
        const point = projection.project(longitude, latitude);
        positions.push(point.x * MAP_SCALE, point.y * MAP_SCALE, 0);
        uvs.push(u, v);
        yValues.push(point.y);
      }
    }

    for (let row = 0; row < ny; row += 1) {
      for (let column = 0; column < nx; column += 1) {
        const a = row * (nx + 1) + column;
        const b = a + 1;
        const c = a + nx + 1;
        const d = c + 1;
        indices.push(a, b, c, b, d, c);
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();
    return geometry;
  }

  function buildMapGrid(projectionKey) {
    const projection = PROJECTIONS[projectionKey];
    const group = new THREE.Group();
    const limit = projection.latitudeLimit;
    const latStep = projectionKey === 'azimuthal' ? 15 : 15;
    for (let latitude = -Math.floor(limit / latStep) * latStep; latitude <= limit; latitude += latStep) {
      const points = [];
      for (let longitude = -180; longitude <= 180; longitude += 2) {
        const p = projection.project(longitude, latitude);
        points.push(new THREE.Vector3(p.x, p.y, 0.025));
      }
      group.add(line(points, latitude === 0 ? 0xf0c36b : 0x49616c, latitude === 0 ? 0.95 : 0.68));
    }
    for (let longitude = -180; longitude < 180; longitude += 15) {
      const points = [];
      for (let latitude = -limit; latitude <= limit; latitude += 2) {
        const p = projection.project(longitude, latitude);
        points.push(new THREE.Vector3(p.x, p.y, 0.026));
      }
      group.add(line(points, longitude === 0 ? 0xef9272 : 0x49616c, longitude === 0 ? 0.95 : 0.68));
    }
    return group;
  }

  function disposeObject(object) {
    if (!object) return;
    object.traverse(child => {
      if (child.geometry) child.geometry.dispose();
      if (child.material) {
        const materials = Array.isArray(child.material) ? child.material : [child.material];
        materials.forEach(material => material.dispose());
      }
    });
    if (object.parent) object.parent.remove(object);
  }

  function setProjection(key) {
    if (!PROJECTIONS[key] || !mapMesh) return;
    activeProjection = key;
    const nextGeometry = buildMapGeometry(key);
    mapMesh.geometry.dispose();
    mapMesh.geometry = nextGeometry;
    disposeObject(mapGrid);
    mapGrid = buildMapGrid(key);
    mapGrid.position.set(MAP_X, 0, 0);
    scene.add(mapGrid);
    mapMesh.position.set(MAP_X, 0, 0);
    nameOutput.textContent = PROJECTIONS[key].name;
    descriptionOutput.textContent = PROJECTIONS[key].description;
    render();
  }

  function resize() {
    if (!renderer || !camera || destroyed) return;
    const width = Math.max(1, stage.clientWidth);
    const height = Math.max(1, stage.clientHeight);
    const aspect = width / height;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.setSize(width, height, false);
    camera.aspect = aspect;
    camera.position.set(0, 0, aspect < 0.9 ? 22 : aspect < 1.25 ? 18 : 14);
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
    if (controls) controls.update();
    render();
  }

  function resetView() {
    if (!camera || !controls) return;
    camera.position.set(0, 0, 14);
    controls.target.set(0, 0, 0);
    controls.update();
    resize();
  }

  function destroy() {
    if (destroyed) return;
    destroyed = true;
    if (renderFrame) cancelAnimationFrame(renderFrame);
    if (resizeObserver) resizeObserver.disconnect();
    if (usingResizeListener) window.removeEventListener('resize', resize);
    document.removeEventListener('visibilitychange', render);
    window.removeEventListener('pagehide', destroy);
    if (controls) controls.dispose();
    disposeObject(globeGrid);
    disposeObject(mapGrid);
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
    if (texture) texture.dispose();
    if (renderer) {
      renderer.dispose();
      renderer.domElement.remove();
    }
  }

  function scientificSelfCheck() {
    const eq = PROJECTIONS.equirectangular.project(0, 0);
    const mercatorEquator = PROJECTIONS.mercator.project(0, 0);
    const equalAreaPole = PROJECTIONS['equal-area'].project(0, 90);
    const polarCenter = PROJECTIONS.azimuthal.project(0, 90);
    const polarEquator = PROJECTIONS.azimuthal.project(0, 0);
    const distance = Math.hypot(polarEquator.x - polarCenter.x, polarEquator.y - polarCenter.y);
    console.assert(Math.abs(eq.x) < 1e-10 && Math.abs(eq.y) < 1e-10, 'Plate Carrée origin check failed');
    console.assert(Math.abs(mercatorEquator.y) < 1e-10, 'Mercator equator check failed');
    console.assert(Math.abs(equalAreaPole.y - 1) < 1e-10, 'Equal-area pole check failed');
    console.assert(Math.abs(polarCenter.x) < 1e-10 && Math.abs(polarCenter.y) < 1e-10, 'Azimuthal centre check failed');
    console.assert(Math.abs(distance - Math.PI / 2) < 1e-10, 'Azimuthal equidistance check failed');
  }

  function initialize(THREEValue) {
    THREE = THREEValue;
    scientificSelfCheck();

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x10191f);
    camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(0, 0, 14);

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.domElement.setAttribute('role', 'img');
    renderer.domElement.setAttribute('aria-label', 'Quả Địa Cầu và bề mặt bản đồ phẳng với lưới kinh tuyến, vĩ tuyến.');
    renderer.domElement.style.touchAction = 'none';
    stage.prepend(renderer.domElement);

    scene.add(new THREE.HemisphereLight(0xd9efff, 0x243b36, 1.35));
    const keyLight = new THREE.DirectionalLight(0xfff0d2, 1.8);
    keyLight.position.set(4, 6, 8);
    scene.add(keyLight);

    const loader = new THREE.TextureLoader();
    texture = loader.load(TEXTURE_URL, () => render(), undefined, () => {
      setStatus('Không tải được ảnh bề mặt địa cầu. Kiểm tra tệp assets/earth-blue-marble.png.', 'error');
    });
    texture.encoding = THREE.sRGBEncoding;
    texture.anisotropy = Math.min(renderer.capabilities.getMaxAnisotropy(), 4);

    globe = new THREE.Mesh(
      new THREE.SphereGeometry(RADIUS, 112, 72),
      new THREE.MeshStandardMaterial({ map: texture, roughness: 0.96 })
    );
    globe.position.x = -3.65;
    scene.add(globe);

    globeGrid = buildGlobeGrid();
    globeGrid.position.x = -3.65;

    mapMesh = new THREE.Mesh(
      buildMapGeometry(activeProjection),
      new THREE.MeshStandardMaterial({ map: texture, roughness: 1, side: THREE.DoubleSide })
    );
    mapMesh.position.x = MAP_X;
    scene.add(mapMesh);
    mapGrid = buildMapGrid(activeProjection);
    mapGrid.position.x = MAP_X;
    scene.add(mapGrid);

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = false;
    controls.enablePan = true;
    controls.enableZoom = true;
    controls.minDistance = 8;
    controls.maxDistance = 28;
    controls.addEventListener('change', render);

    selector.addEventListener('change', () => setProjection(selector.value));
    graticuleToggle.addEventListener('change', () => {
      globeGrid.visible = graticuleToggle.checked;
      mapGrid.visible = graticuleToggle.checked;
      render();
    });
    resetButton.addEventListener('click', resetView);
    document.addEventListener('visibilitychange', render);
    window.addEventListener('pagehide', destroy, { once: true });

    if ('ResizeObserver' in window) {
      resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(stage);
    } else {
      usingResizeListener = true;
      window.addEventListener('resize', resize);
    }
    resize();
    setStatus('Mô hình đã sẵn sàng.', 'ready');
  }

  Promise.all([
    window.SCIAVERSE_THREE_READY || Promise.reject(new Error('Không tải được Three.js.')),
    window.SCIAVERSE_ORBIT_CONTROLS_READY || Promise.reject(new Error('Không tải được OrbitControls.'))
  ]).then(([THREEValue]) => {
    if (!destroyed) initialize(THREEValue);
  }).catch(error => {
    setStatus('Không thể khởi tạo mô hình 3D: ' + error.message, 'error');
  });
})();