(() => {
  'use strict';

  const stage = document.getElementById('earthRotationStage');
  const canvas = document.getElementById('earthRotationCanvas');
  if (!stage || !canvas) return;

  const loading = document.getElementById('earthModelLoading');
  const clockGrid = document.getElementById('worldClockGrid');
  const TEXTURE_URLS = [
    'assets/earth-atmosphere.jpg',
    'assets/earth-blue-marble.png',
    'https://assets.science.nasa.gov/content/dam/science/esd/eo/images/bmng/bmng-base/july/world.200407.3x5400x2700.jpg',
    'https://svs.gsfc.nasa.gov/vis/a000000/a002900/a002915/bluemarble-2048.png'
  ];
  const TAU = Math.PI * 2;
  const DEG = Math.PI / 180;
  const CLOCKS = [
    { city: 'UTC', country: 'UTC', code: 'UTC', flag: '🌐', timeZone: 'UTC', label: 'MÚI GIỜ GỐC' },
    { city: 'Vancouver', country: 'CA', code: 'CAN', flag: '🇨🇦', timeZone: 'America/Vancouver' },
    { city: 'New York', country: 'US', code: 'USA', flag: '🇺🇸', timeZone: 'America/New_York' },
    { city: 'Mexico City', country: 'MX', code: 'MEX', flag: '🇲🇽', timeZone: 'America/Mexico_City' },
    { city: 'São Paulo', country: 'BR', code: 'BRA', flag: '🇧🇷', timeZone: 'America/Sao_Paulo' },
    { city: 'London', country: 'GB', code: 'GBR', flag: '🇬🇧', timeZone: 'Europe/London' },
    { city: 'Paris', country: 'FR', code: 'FRA', flag: '🇫🇷', timeZone: 'Europe/Paris' },
    { city: 'Cairo', country: 'EG', code: 'EGY', flag: '🇪🇬', timeZone: 'Africa/Cairo' },
    { city: 'Nairobi', country: 'KE', code: 'KEN', flag: '🇰🇪', timeZone: 'Africa/Nairobi' },
    { city: 'Dubai', country: 'AE', code: 'ARE', flag: '🇦🇪', timeZone: 'Asia/Dubai' },
    { city: 'Mumbai', country: 'IN', code: 'IND', flag: '🇮🇳', timeZone: 'Asia/Kolkata' },
    { city: 'Hà Nội', country: 'VN', code: 'VIE', flag: '🇻🇳', timeZone: 'Asia/Ho_Chi_Minh' },
    { city: 'Tokyo', country: 'JP', code: 'JPN', flag: '🇯🇵', timeZone: 'Asia/Tokyo' },
    { city: 'Sydney', country: 'AU', code: 'AUS', flag: '🇦🇺', timeZone: 'Australia/Sydney' },
    { city: 'Auckland', country: 'NZ', code: 'NZL', flag: '🇳🇿', timeZone: 'Pacific/Auckland' }
  ];

  let renderer, scene, camera, controls, earth, earthClouds, earthGroup, sunMesh, moonMesh, sunlight;
  let moonTexture = null;
  let earthCloudTexture = null;
  let resizeObserver = null;
  let clockInterval = 0;
  let frameId = 0;
  let lastFrameTime = 0;
  let renderingFrame = false;
  let reducedMotion = false;
  let initialEarthRotation = 0;
  let initialMoonDirection = null;
  let moonOrbitAxis = null;
  let simulationStartTime = 0;
  let disposed = false;
  const listeners = [];
  const clockNodes = [];

  function createEarthFallbackTexture(THREE) {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const context = canvas.getContext('2d');
    if (!context) return null;

    context.fillStyle = '#1f67a7';
    context.fillRect(0, 0, canvas.width, canvas.height);

    const land = [
      [[85, 170], [145, 115], [230, 125], [270, 180], [250, 245], [185, 250], [130, 220]],
      [[235, 260], [290, 278], [310, 360], [282, 425], [245, 392], [224, 320]],
      [[430, 125], [500, 95], [568, 112], [590, 170], [548, 220], [475, 205], [420, 160]],
      [[500, 220], [576, 230], [610, 315], [580, 410], [530, 390], [496, 310]],
      [[560, 120], [650, 105], [735, 135], [790, 195], [735, 235], [650, 220], [590, 175]],
      [[730, 240], [805, 260], [850, 330], [820, 390], [760, 370], [714, 300]],
      [[830, 420], [900, 400], [940, 438], [900, 468], [840, 458]]
    ];

    context.fillStyle = '#7f9f55';
    land.forEach(points => {
      context.beginPath();
      points.forEach((point, index) => {
        if (index === 0) context.moveTo(point[0], point[1]);
        else context.lineTo(point[0], point[1]);
      });
      context.closePath();
      context.fill();
    });

    context.fillStyle = '#d7dfd8';
    context.fillRect(0, 0, canvas.width, 18);
    context.fillRect(0, canvas.height - 24, canvas.width, 24);

    context.globalAlpha = 0.32;
    context.fillStyle = '#ffffff';
    for (let i = 0; i < 22; i += 1) {
      const x = (i * 163) % canvas.width;
      const y = 65 + ((i * 97) % 360);
      context.beginPath();
      context.ellipse(x, y, 34 + (i % 4) * 8, 7 + (i % 3) * 3, 0, 0, TAU);
      context.fill();
    }
    context.globalAlpha = 1;

    const texture = new THREE.CanvasTexture(canvas);
    if (THREE.sRGBEncoding) texture.encoding = THREE.sRGBEncoding;
    texture.needsUpdate = true;
    return texture;
  }

  function loadEarthTexture(THREE) {
    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin('anonymous');
    return new Promise((resolve, reject) => {
      let index = 0;
      const attempt = () => {
        if (index >= TEXTURE_URLS.length) {
          const fallback = createEarthFallbackTexture(THREE);
          if (fallback) resolve(fallback);
          else reject(new Error('Không thể tạo bề mặt Trái Đất dự phòng.'));
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

  function createAnalogClock() {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 100 100');
    svg.setAttribute('class', 'world-clock-face');
    svg.setAttribute('aria-hidden', 'true');

    const face = document.createElementNS(svg.namespaceURI, 'circle');
    face.setAttribute('cx', '50');
    face.setAttribute('cy', '50');
    face.setAttribute('r', '46');
    face.setAttribute('class', 'clock-face-ring');
    svg.appendChild(face);

    for (let i = 0; i < 12; i += 1) {
      const angle = i * 30 * DEG;
      if (i % 3 === 0) {
        const mark = document.createElementNS(svg.namespaceURI, 'line');
        mark.setAttribute('x1', String(50 + Math.sin(angle) * 34));
        mark.setAttribute('y1', String(50 - Math.cos(angle) * 34));
        mark.setAttribute('x2', String(50 + Math.sin(angle) * 40));
        mark.setAttribute('y2', String(50 - Math.cos(angle) * 40));
        mark.setAttribute('class', 'clock-tick clock-tick-major');
        svg.appendChild(mark);
      } else {
        const mark = document.createElementNS(svg.namespaceURI, 'circle');
        mark.setAttribute('cx', String(50 + Math.sin(angle) * 36));
        mark.setAttribute('cy', String(50 - Math.cos(angle) * 36));
        mark.setAttribute('r', '1.7');
        mark.setAttribute('class', 'clock-tick-dot');
        svg.appendChild(mark);
      }
    }

    const hands = {};
    [['hour', 25], ['minute', 35], ['second', 40]].forEach(([name, length]) => {
      const hand = document.createElementNS(svg.namespaceURI, 'line');
      hand.setAttribute('x1', '50');
      hand.setAttribute('y1', '50');
      hand.setAttribute('x2', '50');
      hand.setAttribute('y2', String(50 - length));
      hand.setAttribute('class', 'clock-hand clock-hand-' + name);
      svg.appendChild(hand);
      hands[name] = hand;
    });

    const pin = document.createElementNS(svg.namespaceURI, 'circle');
    pin.setAttribute('cx', '50');
    pin.setAttribute('cy', '50');
    pin.setAttribute('r', '3.4');
    pin.setAttribute('class', 'clock-pin');
    svg.appendChild(pin);
    return { svg, hands };
  }

  function getClockParts(now, timeZone) {
    const parts = new Intl.DateTimeFormat('en-GB', {
      timeZone, year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23'
    }).formatToParts(now).reduce((result, part) => {
      if (part.type !== 'literal') result[part.type] = Number(part.value);
      return result;
    }, {});
    const localAsUtc = Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute, parts.second);
    const utcRounded = Math.floor(now.getTime() / 1000) * 1000;
    const offsetMinutes = Math.round((localAsUtc - utcRounded) / 60000);
    return { ...parts, offsetMinutes };
  }

  function formatUtcOffset(minutes) {
    const sign = minutes < 0 ? '−' : '+';
    const absolute = Math.abs(minutes);
    const hours = Math.floor(absolute / 60);
    const remainder = absolute % 60;
    return 'UTC ' + sign + hours + (remainder ? ':' + String(remainder).padStart(2, '0') : '');
  }

  function buildWorldClocks() {
    if (!clockGrid || clockNodes.length) return;
    const locale = document.documentElement.lang.startsWith('en') ? 'en-US' : 'vi-VN';
    let countryNames;
    try { countryNames = new Intl.DisplayNames([locale], { type: 'region' }); } catch (_) { countryNames = null; }

    const card = document.createElement('article');
    card.className = 'world-clock';

    const header = document.createElement('div');
    header.className = 'world-clock-header';

    const date = document.createElement('time');
    date.className = 'world-clock-date';

    const select = document.createElement('select');
    select.className = 'world-clock-select';
    select.setAttribute('aria-label', locale === 'en-US' ? 'Choose country' : 'Chọn quốc gia');

    CLOCKS.forEach(item => {
      const option = document.createElement('option');
      option.value = item.timeZone;
      option.textContent = item.code;
      const displayName = item.label || (countryNames ? countryNames.of(item.country) : item.city);
      option.dataset.country = displayName.toLocaleUpperCase(locale);
      option.dataset.flag = item.flag;
      option.dataset.code = item.code;
      select.appendChild(option);
    });

    select.value = 'Asia/Ho_Chi_Minh';
    const picker = document.createElement('div');
    picker.className = 'world-clock-country-picker';
    const flag = document.createElement('span');
    flag.className = 'world-clock-flag';
    flag.setAttribute('aria-hidden', 'true');
    flag.textContent = select.options[select.selectedIndex].dataset.flag;
    picker.append(flag, select);
    header.append(date, picker);

    const { svg, hands } = createAnalogClock();
    const footer = document.createElement('div');
    footer.className = 'world-clock-footer';
    const country = document.createElement('div');
    country.className = 'world-clock-country';
    const offset = document.createElement('div');
    offset.className = 'world-clock-offset';
    footer.append(country, offset);

    card.append(header, svg, footer);
    clockGrid.replaceChildren(card);

    const node = { date, offset, hands, timeZone: select.value, country, select, flag };
    clockNodes.push(node);
    select.addEventListener('change', () => {
      const option = select.options[select.selectedIndex];
      node.timeZone = select.value;
      node.flag.textContent = option.dataset.flag;
      node.country.textContent = option.dataset.country;
      updateWorldClocks(new Date());
    });
    const initialOption = select.options[select.selectedIndex];
    country.textContent = initialOption.dataset.country;
  }

  function updateWorldClocks(now) {
    clockNodes.forEach(node => {
      const parts = getClockParts(now, node.timeZone);
      const hour = parts.hour % 12;
      const hourAngle = (hour + parts.minute / 60 + parts.second / 3600) * 30;
      const minuteAngle = (parts.minute + parts.second / 60) * 6;
      const secondAngle = parts.second * 6;
      node.hands.hour.setAttribute('transform', 'rotate(' + hourAngle + ' 50 50)');
      node.hands.minute.setAttribute('transform', 'rotate(' + minuteAngle + ' 50 50)');
      node.hands.second.setAttribute('transform', 'rotate(' + secondAngle + ' 50 50)');
      node.offset.textContent = formatUtcOffset(parts.offsetMinutes);
      const dateParts = new Intl.DateTimeFormat('en-GB', {
        timeZone: node.timeZone, day: '2-digit', month: '2-digit', year: 'numeric'
      }).formatToParts(now).reduce((result, part) => {
        if (part.type !== 'literal') result[part.type] = part.value;
        return result;
      }, {});
      node.date.textContent = dateParts.day + '/' + dateParts.month + '/' + dateParts.year;
      node.date.dateTime = now.toISOString();
    });
  }

  function updateAstronomicalPositions(now, timestamp) {
    if (!earthGroup || !sunMesh || !moonMesh || !sunlight || !simulationStartTime) return;
    const jd = julianDate(now);
    const sunDirection = solarCoordinates(jd);
    const elapsed = Math.max(0, timestamp - simulationStartTime);
    const earthPeriod = reducedMotion ? 180000 : 60000;
    const moonPeriod = reducedMotion ? 90000 : 24000;
    const moonDirection = initialMoonDirection.clone().applyAxisAngle(
      moonOrbitAxis,
      elapsed * TAU / moonPeriod
    );
    earthGroup.rotation.y = initialEarthRotation + elapsed * TAU / earthPeriod;
    sunMesh.position.copy(sunDirection).multiplyScalar(3.55);
    sunlight.position.copy(sunDirection).multiplyScalar(12);
    moonMesh.position.copy(moonDirection).multiplyScalar(2.25);
  }

  function renderFrame(timestamp) {
    frameId = 0;
    if (disposed || !renderer || !scene || !camera) return;
    if (timestamp - lastFrameTime < 1000 / (reducedMotion ? 12 : 30)) {
      frameId = window.requestAnimationFrame(renderFrame);
      return;
    }
    lastFrameTime = timestamp;
    renderingFrame = true;
    const damping = controls ? controls.update() : false;
    updateAstronomicalPositions(new Date(), timestamp);
    renderer.render(scene, camera);
    renderingFrame = false;
    if (!disposed) frameId = window.requestAnimationFrame(renderFrame);
  }

  function requestRender() {
    if (!disposed && !renderingFrame && !frameId) {
      frameId = window.requestAnimationFrame(renderFrame);
    }
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
    earthCloudTexture?.dispose?.();
    renderer?.dispose?.();
    renderer?.forceContextLoss?.();
  }

  function init(THREE, earthTexture) {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x10171b);
    camera = new THREE.PerspectiveCamera(48, 1, 0.1, 100);
    camera.position.set(0, 1.8, 6.6);

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

    scene.add(new THREE.AmbientLight(0xcfe4f5, 0.42));
    scene.add(new THREE.HemisphereLight(0xd8efff, 0x26302a, 0.28));
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

    earthCloudTexture = new THREE.TextureLoader().load('assets/earth-clouds.png', requestRender);
    if (THREE.sRGBEncoding) earthCloudTexture.encoding = THREE.sRGBEncoding;
    earthClouds = new THREE.Mesh(
      new THREE.SphereGeometry(1.205, 72, 56),
      new THREE.MeshPhongMaterial({
        map: earthCloudTexture,
        transparent: true,
        opacity: 0.58,
        depthWrite: false,
        shininess: 2
      })
    );
    earthGroup.add(earthClouds);

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
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
    reducedMotion = motionPreference.matches;
    addListener(motionPreference, 'change', event => {
      reducedMotion = event.matches;
      lastFrameTime = 0;
      requestRender();
    });
    const startDate = new Date();
    initialEarthRotation = Math.PI / 2 - greenwichSiderealAngle(julianDate(startDate));
    initialMoonDirection = lunarCoordinates(julianDate(startDate));
    moonOrbitAxis = new THREE.Vector3(0, 1, 0);
    simulationStartTime = performance.now();
    if (loading) loading.hidden = true;
    updateAstronomicalPositions(startDate, simulationStartTime);
    requestRender();
    clockInterval = window.setInterval(() => {
      updateWorldClocks(new Date());
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