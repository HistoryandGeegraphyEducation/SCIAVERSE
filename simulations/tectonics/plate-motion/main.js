(() => {
  'use strict';

  const stage = document.getElementById('plateStage');
  if (!stage) return;

  const status = document.getElementById('plateStatus');
  const choice = document.getElementById('plateBoundaryChoice');
  const velocity = document.getElementById('plateVelocity');
  const velocityValue = document.getElementById('plateVelocityValue');
  const resultTitle = document.getElementById('plateResultTitle');
  const resultText = document.getElementById('plateResultText');

  const BOUNDARIES = {
    divergent: {
      title: 'Ranh giới tách giãn',
      text: 'Hai mảng chuyển động ra xa nhau. Vật chất nóng từ manti có thể đi lên; khi nguội và kết tinh, nó tạo vỏ đại dương mới tại sống núi giữa đại dương.',
      arrows: 'apart'
    },
    convergent: {
      title: 'Ranh giới hội tụ: đại dương – lục địa',
      text: 'Mảng đại dương thường có độ đặc lớn hơn chìm xuống dưới mảng lục địa. Rãnh đại dương, động đất và cung núi lửa có thể hình thành dọc đới hút chìm.',
      arrows: 'together'
    },
    transform: {
      title: 'Ranh giới trượt ngang',
      text: 'Hai mảng trượt ngang qua nhau. Vỏ không được tạo mới hoặc tiêu hủy tại ranh giới; biến dạng và ứng suất tích lũy có thể gây động đất.',
      arrows: 'slide'
    }
  };

  let THREE;
  let renderer;
  let scene;
  let camera;
  let controls;
  let boundaryGroup;
  let resizeObserver;
  let usingResizeListener = false;
  let destroyed = false;
  let activeBoundary = 'divergent';
  let activeVelocity = Number(velocity.value);
  const listeners = [];

  function setStatus(message, state = 'info') {
    status.textContent = message;
    status.dataset.state = state;
  }

  function listen(target, eventName, handler, options) {
    target.addEventListener(eventName, handler, options);
    listeners.push([target, eventName, handler, options]);
  }

  function addBox(group, size, position, color, rotationZ = 0) {
    const mesh = new THREE.Mesh(
      new THREE.BoxGeometry(size[0], size[1], size[2]),
      new THREE.MeshStandardMaterial({ color, roughness: 0.92, metalness: 0.02 })
    );
    mesh.position.set(position[0], position[1], position[2]);
    mesh.rotation.z = rotationZ;
    group.add(mesh);
    return mesh;
  }

  function addArrow(group, origin, direction, color, length) {
    const arrow = new THREE.ArrowHelper(
      direction.clone().normalize(),
      new THREE.Vector3(origin[0], origin[1], origin[2]),
      length,
      color,
      Math.min(0.3, length * 0.24),
      Math.min(0.18, length * 0.14)
    );
    group.add(arrow);
  }

  function addMantle(group) {
    addBox(group, [6.5, 0.48, 3.8], [0, -1.12, 0], 0x8a5942);
    const material = new THREE.MeshStandardMaterial({ color: 0xc27a4e, roughness: 1 });
    const base = new THREE.Mesh(new THREE.BoxGeometry(6.5, 0.06, 3.8), material);
    base.position.set(0, -0.86, 0);
    group.add(base);
  }

  function addDivergent(group) {
    addBox(group, [2.9, 0.48, 3.8], [-1.58, -0.35, 0], 0x526e83);
    addBox(group, [2.9, 0.48, 3.8], [1.58, -0.35, 0], 0x71836e);

    const upwelling = new THREE.Mesh(
      new THREE.CylinderGeometry(0.12, 0.42, 1.12, 20),
      new THREE.MeshStandardMaterial({ color: 0xd86c43, roughness: 0.85 })
    );
    upwelling.position.set(0, -0.52, 0);
    group.add(upwelling);

    const ridge = new THREE.Mesh(
      new THREE.ConeGeometry(0.48, 0.55, 6),
      new THREE.MeshStandardMaterial({ color: 0xb66c50, roughness: 0.95 })
    );
    ridge.position.set(0, -0.02, 0);
    group.add(ridge);

    const length = 0.68 + activeVelocity * 0.095;
    addArrow(group, [-0.38, 0.48, 0], new THREE.Vector3(-1, 0, 0), 0xf0c879, length);
    addArrow(group, [0.38, 0.48, 0], new THREE.Vector3(1, 0, 0), 0xf0c879, length);
  }

  function addConvergent(group) {
    addBox(group, [3.1, 0.44, 3.8], [-1.45, -0.28, 0], 0x526e83, -0.31);
    addBox(group, [2.9, 0.5, 3.8], [1.62, -0.28, 0], 0x71836e);

    const trench = new THREE.Mesh(
      new THREE.BoxGeometry(0.16, 0.16, 3.8),
      new THREE.MeshStandardMaterial({ color: 0x263d4c, roughness: 1 })
    );
    trench.position.set(0.03, -0.02, 0);
    group.add(trench);

    const volcano = new THREE.Mesh(
      new THREE.ConeGeometry(0.46, 0.88, 7),
      new THREE.MeshStandardMaterial({ color: 0x9c5d4c, roughness: 1 })
    );
    volcano.position.set(1.58, 0.34, 0.35);
    group.add(volcano);

    const length = 0.68 + activeVelocity * 0.095;
    addArrow(group, [-0.42, 0.48, 0], new THREE.Vector3(1, 0, 0), 0xf0c879, length);
    addArrow(group, [0.55, 0.48, 0], new THREE.Vector3(-1, 0, 0), 0xf0c879, length);
  }

  function addTransform(group) {
    addBox(group, [3.02, 0.48, 3.8], [-1.52, -0.35, 0], 0x526e83);
    addBox(group, [3.02, 0.48, 3.8], [1.52, -0.35, 0], 0x71836e);

    const fault = new THREE.Mesh(
      new THREE.BoxGeometry(0.09, 0.54, 3.9),
      new THREE.MeshStandardMaterial({ color: 0x263d4c, roughness: 1 })
    );
    fault.position.set(0, -0.34, 0);
    group.add(fault);

    const length = 0.68 + activeVelocity * 0.095;
    addArrow(group, [-0.65, 0.48, -0.35], new THREE.Vector3(0, 0, 1), 0xf0c879, length);
    addArrow(group, [0.65, 0.48, 0.35], new THREE.Vector3(0, 0, -1), 0xf0c879, length);
  }

  function disposeGroup(group) {
    if (!group) return;
    group.traverse(object => {
      object.geometry?.dispose?.();
      if (object.material) {
        const materials = Array.isArray(object.material) ? object.material : [object.material];
        materials.forEach(material => material.dispose?.());
      }
    });
    if (group.parent) group.parent.remove(group);
  }

  function render() {
    if (!destroyed && renderer && scene && camera && !document.hidden) {
      renderer.render(scene, camera);
    }
  }

  function rebuildBoundary() {
    if (boundaryGroup) disposeGroup(boundaryGroup);
    boundaryGroup = new THREE.Group();
    addMantle(boundaryGroup);
    if (activeBoundary === 'divergent') addDivergent(boundaryGroup);
    if (activeBoundary === 'convergent') addConvergent(boundaryGroup);
    if (activeBoundary === 'transform') addTransform(boundaryGroup);
    scene.add(boundaryGroup);

    const info = BOUNDARIES[activeBoundary];
    resultTitle.textContent = info.title;
    resultText.textContent = info.text;
    choice.querySelectorAll('button').forEach(button => {
      const selected = button.dataset.boundary === activeBoundary;
      button.classList.toggle('is-selected', selected);
      button.setAttribute('aria-pressed', String(selected));
    });
    render();
  }

  function updateVelocity() {
    activeVelocity = Number(velocity.value);
    velocityValue.textContent = activeVelocity + ' cm/năm';
    rebuildBoundary();
  }

  function resize() {
    if (!renderer || !camera || destroyed) return;
    const width = Math.max(1, stage.clientWidth);
    const height = Math.max(1, stage.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.position.set(5.5, 4.2, width / height < 0.9 ? 9.4 : 7.5);
    camera.lookAt(0, -0.25, 0);
    camera.updateProjectionMatrix();
    if (controls) controls.update();
    render();
  }

  function destroy() {
    if (destroyed) return;
    destroyed = true;
    if (resizeObserver) resizeObserver.disconnect();
    if (usingResizeListener) window.removeEventListener('resize', resize);
    listeners.forEach(([target, eventName, handler, options]) => target.removeEventListener(eventName, handler, options));
    listeners.length = 0;
    if (controls) controls.dispose();
    disposeGroup(boundaryGroup);
    if (scene) scene.clear();
    if (renderer) {
      renderer.dispose();
      renderer.forceContextLoss();
      renderer.domElement.remove();
    }
  }

  function initialize(THREEValue) {
    THREE = THREEValue;
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x10191f);
    camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'low-power' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.setClearColor(0x10191f, 1);
    renderer.domElement.setAttribute('role', 'img');
    renderer.domElement.setAttribute('aria-label', 'Mặt cắt ba chiều minh họa chuyển động tại ranh giới mảng kiến tạo.');
    renderer.domElement.style.touchAction = 'none';
    stage.prepend(renderer.domElement);

    scene.add(new THREE.HemisphereLight(0xd9efff, 0x263b37, 1.25));
    const keyLight = new THREE.DirectionalLight(0xffefd6, 1.6);
    keyLight.position.set(4, 7, 5);
    scene.add(keyLight);

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = false;
    controls.enablePan = false;
    controls.enableZoom = true;
    controls.minDistance = 5.5;
    controls.maxDistance = 13;
    controls.addEventListener('change', render);

    listen(choice, 'click', event => {
      const button = event.target.closest('button[data-boundary]');
      if (!button) return;
      activeBoundary = button.dataset.boundary;
      rebuildBoundary();
    });
    listen(velocity, 'input', updateVelocity);
    listen(document, 'visibilitychange', render);
    listen(window, 'pagehide', destroy, { once: true });

    if ('ResizeObserver' in window) {
      resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(stage);
    } else {
      usingResizeListener = true;
      listen(window, 'resize', resize);
    }

    rebuildBoundary();
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
    destroy();
  });
})();
