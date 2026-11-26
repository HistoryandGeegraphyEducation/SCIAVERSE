(() => {
  'use strict';

  const stage = document.getElementById('earthRotationStage');
  const canvas = document.getElementById('earthRotationCanvas');
  if (!stage || !canvas) return;

  const loading = document.getElementById('earthModelLoading');
  const clockGrid = document.getElementById('worldClockGrid');
  const TEXTURE_URLS = [
    'https://assets.science.nasa.gov/content/dam/science/esd/eo/images/bmng/bmng-base/july/world.200407.3x5400x2700.jpg',
    'https://svs.gsfc.nasa.gov/vis/a000000/a002900/a002915/bluemarble-2048.png'
  ];
  const TAU = Math.PI * 2;
  const DEG = Math.PI / 180;
  const CLOCKS = [
    ['Hà Nội', 'VN', 'Asia/Ho_Chi_Minh'],
    ['Tokyo', 'JP', 'Asia/Tokyo'],
    ['Seoul', 'KR', 'Asia/Seoul'],
    ['Bắc Kinh', 'CN', 'Asia/Shanghai'],
    ['Singapore', 'SG', 'Asia/Singapore'],
    ['Bangkok', 'TH', 'Asia/Bangkok'],
    ['New Delhi', 'IN', 'Asia/Kolkata'],
    ['Dubai', 'AE', 'Asia/Dubai'],
    ['Moscow', 'RU', 'Europe/Moscow'],
    ['London', 'GB', 'Europe/London'],
    ['Paris', 'FR', 'Europe/Paris'],
    ['New York', 'US', 'America/New_York'],
    ['Los Angeles', 'US', 'America/Los_Angeles'],
    ['São Paulo', 'BR', 'America/Sao_Paulo'],
    ['Sydney', 'AU', 'Australia/Sydney']
  ];

  let renderer, scene, camera, controls, earth, earthGroup, sunMesh, moonMesh, sunlight;
  let moonTexture = null;
  let resizeObserver = null;
  let clockInterval = 0;
  let frameId = 0;
  let disposed = false;
  const listeners = [];
  const clockNodes = [];

  function loadEarthTexture(THREE) {
    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin('anonymous');
    return new Promise((resolve, reject) => {
      let index = 0;
      const attempt = () => {
        if (index >= TEXTURE_URLS.length) {
          reject(new Error('Không tải được ảnh bề mặt Trái Đất từ các nguồn NASA.'));
          return;
        }
        let finished = false;
        const next = () => {
          if (finished) return;
          finished = true;
          window.clearTimeout(timeout);
          attempt();
        };
        const timeout = window.setTimeout(next, 15000);
        loader.load(TEXTURE_URLS[index++], texture => {
          if (finished) { texture.dispose(); return; }
          finished = true;
          window.clearTimeout(timeout);
          resolve(texture);
        }, undefined, next);
      };
      attempt();
    });
  }

  function addListener(target, eventName, handler, options) {
    if (!target) return;
    target.addEventListener(eventName, handler, options);
    listeners.push([target, eventName, handler, options]);
  }

  function normalizeDegrees(value) {
    return ((value % 360) + 360) % 360;
  }

  function julianDate(date) {
    return date.getTime() / 86400000 + 2440587.5;
  }

  function equatorialVector(rightAscension, declination) {
    const cosDec = Math.cos(declination);
    return new window.THREE.Vector3(
      cosDec * Math.cos(rightAscension),
      Math.sin(declination),
      cosDec * Math.sin(rightAscension)
    ).normalize();
  }

  function solarCoordinates(jd) {
    const t = (jd - 2451545.0) / 36525;
    const meanLongitude = normalizeDegrees(280.46646 + 36000.76983 * t + 0.0003032 * t * t);
    const meanAnomaly = normalizeDegrees(357.52911 + 35999.05029 * t - 0.0001537 * t * t) * DEG;
    const equation = (1.914602 - 0.004817 * t - 0.000014 * t * t) * Math.sin(meanAnomaly)
      + (0.019993 - 0.000101 * t) * Math.sin(2 * meanAnomaly)
      + 0.000289 * Math.sin(3 * meanAnomaly);
    const omega = (125.04 - 1934.136 * t) * DEG;
    const longitude = (meanLongitude + equation - 0.00569 - 0.00478 * Math.sin(omega)) * DEG;
    const obliquity = (23.439291 - 0.0130042 * t + 0.00256 * Math.cos(omega)) * DEG;
    const rightAscension = Math.atan2(Math.cos(obliquity) * Math.sin(longitude), Math.cos(longitude));
    const declination = Math.asin(Math.sin(obliquity) * Math.sin(longitude));
    return equatorialVector(rightAscension, declination);
  }

  function lunarCoordinates(jd) {
    const d = jd - 2451543.5;
    const node = (125.1228 - 0.0529538083 * d) * DEG;
    const inclination = 5.1454 * DEG;
    const periapsis = (318.0634 + 0.1643573223 * d) * DEG;
    const eccentricity = 0.0549;
    const meanAnomaly = normalizeDegrees(115.3654 + 13.0649929509 * d) * DEG;
    let eccentricAnomaly = meanAnomaly;
    for (let i = 0; i < 5; i += 1) {
      eccentricAnomaly -= (eccentricAnomaly - eccentricity * Math.sin(eccentricAnomaly) - meanAnomaly)
        / (1 - eccentricity * Math.cos(eccentricAnomaly));
    }
    const xv = Math.cos(eccentricAnomaly) - eccentricity;
    const yv = Math.sqrt(1 - eccentricity * eccentricity) * Math.sin(eccentricAnomaly);
    const trueAnomaly = Math.atan2(yv, xv);
    const radius = Math.sqrt(xv * xv + yv * yv);
    const argument = trueAnomaly + periapsis;
    const x = radius * (Math.cos(node) * Math.cos(argument) - Math.sin(node) * Math.sin(argument) * Math.cos(inclination));
    const y = radius * (Math.sin(node) * Math.cos(argument) + Math.cos(node) * Math.sin(argument) * Math.cos(inclination));
    const z = radius * Math.sin(argument) * Math.sin(inclination);
    const longitude = Math.atan2(y, x);
    const latitude = Math.atan2(z, Math.sqrt(x * x + y * y));
    const t = (jd - 2451545.0) / 36525;
    const obliquity = (23.439291 - 0.0130042 * t) * DEG;
    const eqX = Math.cos(latitude) * Math.cos(longitude);
    const eqY = Math.cos(latitude) * Math.sin(longitude) * Math.cos(obliquity) - Math.sin(latitude) * Math.sin(obliquity);
    const eqZ = Math.cos(latitude) * Math.sin(longitude) * Math.sin(obliquity) + Math.sin(latitude) * Math.cos(obliquity);
    const rightAscension = Math.atan2(eqZ, eqX);
    const declination = Math.asin(Math.max(-1, Math.min(1, eqY)));
    return equatorialVector(rightAscension, declination);
  }

  function greenwichSiderealAngle(jd) {
    const t = (jd - 2451545.0) / 36525;
    const degrees = 280.46061837 + 360.98564736629 * (jd - 2451545.0)
      + 0.000387933 * t * t - t * t * t / 38710000;
    return normalizeDegrees(degrees) * DEG;
  }

  function createMoonSurface(THREE) {
    const textureCanvas = document.createElement('canvas');
    textureCanvas.width = 1024;
    textureCanvas.height = 512;
    const ctx = textureCanvas.getContext('2d');
    ctx.fillStyle = '#85867f';
    ctx.fillRect(0, 0, 1024, 512);
    let seed = 91371;
    const random = () => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };
    for (let i = 0; i < 1800; i += 1) {
      const x = random() * 1024;
      const y = random() * 512;
      const radius = 0.5 + random() * 2.2;
      ctx.fillStyle = random() > 0.5 ? 'rgba(225,225,215,.10)' : 'rgba(35,37,35,.10)';
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, TAU);
      ctx.fill();
    }
    for (let i = 0; i < 190; i += 1) {
      const x = random() * 1024;
      const y = random() * 512;
      const radius = 3 + random() * 19;
      const shade = Math.floor(92 + random() * 65);
      const gradient = ctx.createRadialGradient(x - radius * 0.22, y - radius * 0.24, radius * 0.08, x, y, radius);
      gradient.addColorStop(0, 'rgba(205,205,194,.85)');
      gradient.addColorStop(0.58, 'rgba(' + shade + ',' + shade + ',' + (shade - 3) + ',.9)');
      gradient.addColorStop(0.78, 'rgba(48,50,48,.8)');
      gradient.addColorStop(1, 'rgba(125,126,118,.15)');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, TAU);
      ctx.fill();
    }
    const texture = new THREE.CanvasTexture(textureCanvas);
    if (THREE.sRGBEncoding) texture.encoding = THREE.sRGBEncoding;
    texture.anisotropy = 4;
    return texture;
  }

  function buildWorldClocks() {
    if (!clockGrid || clockNodes.length) return;
    const locale = document.documentElement.lang.startsWith('en') ? 'en-US' : 'vi-VN';
    let countryNames;
    try { countryNames = new Intl.DisplayNames([locale], { type: 'region' }); } catch (_) { countryNames = null; }
    CLOCKS.forEach(([city, countryCode, timeZone]) => {
      const card = document.createElement('div');
      card.className = 'world-clock';
      const place = document.createElement('div');
      place.className = 'world-clock-place';
      place.textContent = city + ', ' + (countryNames ? countryNames.of(countryCode) : countryCode);
      const time = document.createElement('time');
      time.className = 'world-clock-time';
      const date = document.createElement('div');
      date.className = 'world-clock-date';
      card.append(place, time, date);
      clockGrid.appendChild(card);
      clockNodes.push({ time, date, timeZone });
    });
  }

  function updateWorldClocks(now) {
    const locale = document.documentElement.lang.startsWith('en') ? 'en-US' : 'vi-VN';
    clockNodes.forEach(node => {
      node.time.textContent = new Intl.DateTimeFormat(locale, {
        timeZone: node.timeZone, hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23'
      }).format(now);
      node.time.dateTime = now.toISOString();
      node.date.textContent = new Intl.DateTimeFormat(locale, {
        timeZone: node.timeZone, day: '2-digit', month: 'short', year: 'numeric'
      }).format(now);
    });
  }

  function updateAstronomicalPositions(now) {
    if (!earthGroup || !sunMesh || !moonMesh || !sunlight) return;
    const jd = julianDate(now);
    const sunDirection = solarCoordinates(jd);
    const moonDirection = lunarCoordinates(jd);
    earthGroup.rotation.y = Math.PI / 2 - greenwichSiderealAngle(jd);
    sunMesh.position.copy(sunDirection).multiplyScalar(3.55);
    sunlight.position.copy(sunDirection).multiplyScalar(12);
    moonMesh.position.copy(moonDirection).multiplyScalar(2.25);
    if (renderer && scene && camera) renderer.render(scene, camera);
  }

  function renderFrame() {
    frameId = 0;
    if (disposed || !renderer || !scene || !camera) return;
    const damping = controls ? controls.update() : false;
    renderer.render(scene, camera);
    if (damping) frameId = window.requestAnimationFrame(renderFrame);
  }

  function requestRender() {
    if (!disposed && !frameId) frameId = window.requestAnimationFrame(renderFrame);
  }

  function resize() {
    if (!renderer || !camera) return;
    const width = Math.max(1, stage.clientWidth);
    const height = Math.max(1, stage.clientHeight);
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    requestRender();
  }

  function showError(message) {
    if (loading) {
      loading.hidden = false;
      loading.textContent = message;
      loading.classList.add('is-error');
    }
  }

  function cleanup() {
    if (disposed) return;
    disposed = true;
    if (clockInterval) window.clearInterval(clockInterval);
    if (frameId) window.cancelAnimationFrame(frameId);
    if (resizeObserver) resizeObserver.disconnect();
    listeners.forEach(([target, eventName, handler, options]) => target.removeEventListener(eventName, handler, options));
    listeners.length = 0;
    if (controls) controls.dispose();
    if (scene) {
      scene.traverse(object => {
        object.geometry?.dispose?.();
        if (object.material) {
          const materials = Array.isArray(object.material) ? object.material : [object.material];
          materials.forEach(material => {
            material.map?.dispose?.();
            material.bumpMap?.dispose?.();
            material.dispose?.();
          });
        }
      });
      scene.clear();
    }
    moonTexture?.dispose?.();
    renderer?.dispose?.();
    renderer?.forceContextLoss?.();
  }

  function init(THREE, earthTexture) {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x10171b);
    camera = new THREE.PerspectiveCamera(48, 1, 0.1, 100);
    camera.position.set(0, 2.1, 7.5);

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
      earthTexture.encoding = THREE.sRGBEncoding;
    }

    scene.add(new THREE.AmbientLight(0xffffff, 0.13));
    sunlight = new THREE.DirectionalLight(0xfff1d8, 2.15);
    scene.add(sunlight);
    scene.add(sunlight.target);

    earthGroup = new THREE.Group();
    scene.add(earthGroup);
    earth = new THREE.Mesh(
      new THREE.SphereGeometry(1.18, 72, 56),
      new THREE.MeshPhongMaterial({
        map: earthTexture,
        shininess: 9,
        specular: new THREE.Color(0x25313a)
      })
    );
    earthGroup.add(earth);

    sunMesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.25, 32, 24),
      new THREE.MeshBasicMaterial({ color: 0xffd28a })
    );
    scene.add(sunMesh);

    moonTexture = createMoonSurface(THREE);
    moonMesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.31, 40, 32),
      new THREE.MeshPhongMaterial({
        map: moonTexture,
        bumpMap: moonTexture,
        bumpScale: 0.025,
        shininess: 2,
        specular: new THREE.Color(0x252525)
      })
    );
    scene.add(moonMesh);

    if (THREE.OrbitControls) {
      controls = new THREE.OrbitControls(camera, canvas);
      controls.enableDamping = true;
      controls.dampingFactor = 0.075;
      controls.enablePan = false;
      controls.minDistance = 4.3;
      controls.maxDistance = 11;
      controls.target.set(0, 0, 0);
      controls.addEventListener('change', requestRender);
      controls.update();
    }

    resize();
    if (window.ResizeObserver) {
      resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(stage);
    }
    addListener(window, 'resize', resize, { passive: true });
    if (loading) loading.hidden = true;
    updateAstronomicalPositions(new Date());
    clockInterval = window.setInterval(() => {
      const now = new Date();
      updateWorldClocks(now);
      updateAstronomicalPositions(now);
    }, 1000);
    updateWorldClocks(new Date());
  }

  buildWorldClocks();
  updateWorldClocks(new Date());
  const threeReady = window.SCIAVERSE_THREE_READY || Promise.reject(new Error('Thiếu bộ nạp thư viện 3D.'));
  const controlsReady = window.SCIAVERSE_ORBIT_CONTROLS_READY || Promise.reject(new Error('Thiếu điều khiển mô hình 3D.'));
  Promise.all([threeReady, controlsReady])
    .then(([THREE]) => loadEarthTexture(THREE).then(texture => ({ THREE, texture })))
    .then(({ THREE, texture }) => {
      if (!disposed) init(THREE, texture);
      else texture.dispose();
    })
    .catch(error => {
      if (!disposed) showError(error.message || 'Không thể khởi tạo mô hình không gian.');
    });

  addListener(window, 'sciaverse:languagechange', () => {
    if (clockGrid) {
      clockGrid.replaceChildren();
      clockNodes.length = 0;
      buildWorldClocks();
      updateWorldClocks(new Date());
    }
  });
  addListener(window, 'pagehide', cleanup, { once: true });
})();