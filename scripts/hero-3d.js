/* Homepage-only Five-Path sculpture. No dependencies, textures or external models.
   Front contours come directly from the production SVG already in the DOM.
   Lifecycle/back-buffer guidance: developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices */
(() => {
  'use strict';
  const stage = document.querySelector('[data-hero-sculpture]');
  if (!stage) return;
  const svg = stage.querySelector('svg');
  const explorer = stage.closest('[data-hero-state]');
  const hero = stage.closest('section');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const forced = matchMedia('(forced-colors: active)');
  const pointer = matchMedia('(hover: hover) and (pointer: fine)');
  const limited = navigator.connection?.saveData || navigator.deviceMemory <= 4 || navigator.hardwareConcurrency <= 4;
  const assemblyMs = 1200;
  let sculpture, visible = false, failed = false, away = false, task = null;
  let entered = false, resizeFrame = 0;
  stage.dataset.sculptureState = 'static';

  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  const cross = (a, b, c) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]);
  const midpoint = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  // Adaptive Bezier flattening: maximum contour deviation 0.16 SVG units
  // (under 0.05 CSS px at the maximum 272px stage). The path is never redrawn.
  function curve(points, a, b, c, d, level = 0) {
    const length = Math.hypot(d[0] - a[0], d[1] - a[1]) || 1;
    if (level >= 10 || Math.max(Math.abs(cross(a, d, b)), Math.abs(cross(a, d, c))) / length <= 0.16) {
      points.push(d); return;
    }
    const ab = midpoint(a, b), bc = midpoint(b, c), cd = midpoint(c, d);
    const abc = midpoint(ab, bc), bcd = midpoint(bc, cd), center = midpoint(abc, bcd);
    curve(points, a, ab, abc, center, level + 1);
    curve(points, center, bcd, cd, d, level + 1);
  }
  function contour(path) {
    const points = [];
    if (/[^MLCZ\d\s.,+\-e]/i.test(path)) throw new Error('Unsupported logo contour');
    for (const [, command, raw] of path.matchAll(/([MLCZ])([^MLCZ]*)/g)) {
      const values = (raw.match(/[-+]?(?:\d*\.)?\d+(?:e[-+]?\d+)?/gi) || []).map(Number);
      if (command === 'M' || command === 'L') {
        for (let i = 0; i < values.length; i += 2) points.push([values[i], values[i + 1]]);
      } else if (command === 'C') {
        for (let i = 0; i < values.length; i += 6) curve(points, points[points.length - 1], values.slice(i, i + 2), values.slice(i + 2, i + 4), values.slice(i + 4, i + 6));
      }
    }
    if (points.length < 3 || points.some(p => !p.every(Number.isFinite))) throw new Error('Invalid logo contour');
    const view = svg.viewBox.baseVal;
    const result = points.map(([x, y]) => [(x - view.x - view.width / 2) * 2 / view.width, (view.y + view.height / 2 - y) * 2 / view.height]);
    if (Math.hypot(result[0][0] - result.at(-1)[0], result[0][1] - result.at(-1)[1]) < 1e-8) result.pop();
    const area = result.reduce((sum, p, i) => sum + p[0] * result[(i + 1) % result.length][1] - result[(i + 1) % result.length][0] * p[1], 0);
    return area < 0 ? result.reverse() : result;
  }
  // The five closed production paths have no holes. Ear clipping triangulates
  // their concave fronts once; it is never performed inside the render loop.
  function triangles(points) {
    const remaining = points.map((_, i) => i), result = [];
    let attempts = 0;
    while (remaining.length > 3) {
      let found = false;
      for (let i = 0; i < remaining.length; i++) {
        const a = remaining[(i + remaining.length - 1) % remaining.length], b = remaining[i], c = remaining[(i + 1) % remaining.length];
        if (cross(points[a], points[b], points[c]) <= 1e-10) continue;
        if (remaining.some(v => v !== a && v !== b && v !== c && cross(points[a], points[b], points[v]) >= -1e-10 && cross(points[b], points[c], points[v]) >= -1e-10 && cross(points[c], points[a], points[v]) >= -1e-10)) continue;
        result.push(a, b, c); remaining.splice(i, 1); found = true; break;
      }
      if (!found || ++attempts > points.length) throw new Error('Logo could not be triangulated');
    }
    return result.concat(remaining);
  }
  function mesh(path) {
    const points = contour(path), data = [];
    const vertex = (p, z, normal, side) => data.push(p[0], p[1], z, ...normal, side);
    const indices = triangles(points);
    for (const index of indices) vertex(points[index], 0.045, [0, 0, 1], 0);
    for (const index of indices.toReversed()) vertex(points[index], -0.045, [0, 0, -1], 1);
    points.forEach((a, i) => {
      const b = points[(i + 1) % points.length], length = Math.hypot(b[0] - a[0], b[1] - a[1]);
      if (length < 1e-8) return;
      const normal = [(b[1] - a[1]) / length, (a[0] - b[0]) / length, 0];
      [[a, 0.045], [a, -0.045], [b, 0.045], [b, 0.045], [a, -0.045], [b, -0.045]].forEach(([p, z]) => vertex(p, z, normal, 1));
    });
    return { points, vertices: new Float32Array(data) };
  }
  const vertexSource = `
    attribute vec3 aPosition;
    attribute vec3 aNormal;
    attribute float aSide;
    uniform vec3 uPose;
    uniform vec3 uPlacement;
    uniform mediump float uReveal;
    uniform mediump vec2 uDirection;
    varying mediump vec3 vNormal;
    varying mediump vec2 vLocal;
    varying mediump float vSide;
    void main() {
      vec3 c = cos(uPose), s = sin(uPose);
      mat3 rx = mat3(1.,0.,0., 0.,c.x,s.x, 0.,-s.x,c.x);
      mat3 ry = mat3(c.y,0.,-s.y, 0.,1.,0., s.y,0.,c.y);
      mat3 rz = mat3(c.z,s.z,0., -s.z,c.z,0., 0.,0.,1.);
      mat3 rotation = rz * ry * rx;
      vec3 position = aPosition;
      position.xy -= uDirection * (1. - uReveal) * .018;
      position.z += (1. - uReveal) * .055;
      position = rotation * position;
      // Orthographic campaign-camera framing preserves the original silhouette.
      gl_Position = vec4(position.xy * uPlacement.z + uPlacement.xy, -position.z * .25, 1.);
      vNormal = rotation * aNormal;
      vLocal = aPosition.xy;
      vSide = aSide;
    }
  `;
  const fragmentSource = `
    precision mediump float;
    uniform vec3 uFace;
    uniform vec3 uInk;
    uniform vec3 uPaper;
    uniform mediump vec2 uDirection;
    uniform vec2 uRange;
    uniform mediump float uReveal;
    varying mediump vec3 vNormal;
    varying mediump vec2 vLocal;
    varying mediump float vSide;
    void main() {
      float progress = (dot(vLocal, uDirection) - uRange.x) / uRange.y;
      if (uReveal < .001 || (uReveal < 1. && progress > uReveal)) discard;
      vec3 normal = normalize(vNormal);
      float key = max(dot(normal, normalize(vec3(-.45,.65,1.))), 0.);
      float fill = max(dot(normal, normalize(vec3(.6,-.2,.7))), 0.);
      vec3 material = mix(uFace, uInk, vSide);
      vec3 color = material * (.76 + .23 * key + .08 * fill);
      // A broad, restrained edge highlight, using warm paper rather than new hues.
      float sheen = (key * .06 + pow(max(dot(normal, normalize(vec3(.4,.8,1.))), 0.), 12.) * .025) * vSide;
      gl_FragColor = vec4(mix(color, uPaper, sheen), 1.);
    }
  `;
  function color(value) {
    const hex = value.trim().replace('#', '');
    return [0, 2, 4].map(i => parseInt(hex.slice(i, i + 2), 16) / 255);
  }

  class Sculpture {
    constructor() {
      this.canvas = document.createElement('canvas');
      this.canvas.setAttribute('aria-hidden', 'true');
      this.canvas.setAttribute('role', 'presentation');
      this.buffers = [];
      this.frame = 0; this.elapsed = entered ? assemblyMs : 0; this.last = 0;
      this.target = [0, 0]; this.current = [0, 0]; this.scroll = 0;
      const paths = [...svg.querySelectorAll('path')];
      if (paths.length !== 5) throw new Error('Expected five production paths');
      const geometry = paths.map(path => mesh(path.getAttribute('d')));
      const gl = this.gl = this.canvas.getContext('webgl', { alpha: true, antialias: true, depth: true, stencil: false, powerPreference: 'low-power', preserveDrawingBuffer: false });
      if (!gl) throw new Error('WebGL unavailable');
      try {
        const shaders = [gl.VERTEX_SHADER, gl.FRAGMENT_SHADER].map((type, i) => {
          const shader = gl.createShader(type);
          if (!shader) throw new Error('Shader allocation failed');
          gl.shaderSource(shader, i ? fragmentSource : vertexSource); gl.compileShader(shader); return shader;
        });
        const program = this.program = gl.createProgram();
        if (!program) { shaders.forEach(shader => gl.deleteShader(shader)); throw new Error('Program allocation failed'); }
        shaders.forEach(shader => { gl.attachShader(program, shader); gl.deleteShader(shader); });
        gl.bindAttribLocation(program, 0, 'aPosition'); gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error('Shader link failed');
        gl.useProgram(program);
        this.locations = Object.fromEntries(['uPose', 'uPlacement', 'uReveal', 'uDirection', 'uRange', 'uFace', 'uInk', 'uPaper'].map(name => [name, gl.getUniformLocation(program, name)]));
        this.attributes = ['aPosition', 'aNormal', 'aSide'].map(name => gl.getAttribLocation(program, name));
        const directions = [[0, 1], [-1, 0], [0, -1], [0, -1], [1, 0]];
        geometry.forEach(({ points, vertices }, i) => {
          const buffer = gl.createBuffer();
          if (!buffer) throw new Error('Buffer allocation failed');
          const direction = directions[i], projection = points.map(p => p[0] * direction[0] + p[1] * direction[1]);
          this.buffers.push({ buffer, count: vertices.length / 7, direction, range: [Math.min(...projection), Math.max(...projection) - Math.min(...projection)] });
          gl.bindBuffer(gl.ARRAY_BUFFER, buffer); gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
        });
        if (gl.getError() !== gl.NO_ERROR) throw new Error('Geometry allocation failed');
        const tokens = getComputedStyle(document.documentElement);
        this.ink = color(tokens.getPropertyValue('--htafl-ink'));
        this.paper = color(tokens.getPropertyValue('--htafl-paper'));
        gl.uniform3fv(this.locations.uInk, this.ink); gl.uniform3fv(this.locations.uPaper, this.paper);
        this.material();
        this.attributes.forEach(index => gl.enableVertexAttribArray(index));
        gl.enable(gl.DEPTH_TEST); gl.depthFunc(gl.LEQUAL); gl.clearColor(0, 0, 0, 0);
        this.canvas.addEventListener('webglcontextlost', () => fallback(), { once: true });
        stage.append(this.canvas);
        this.resize();
      } catch (error) { this.dispose(); throw error; }
    }
    material() {
      this.gl.uniform3fv(this.locations.uFace, explorer.dataset.heroState === 'create' ? this.paper : this.ink);
    }
    resize() {
      this.needsResize = false;
      const bounds = stage.getBoundingClientRect();
      this.bounds = hero.getBoundingClientRect();
      this.top = this.bounds.top + scrollY;
      const dpr = Math.min(devicePixelRatio || 1, limited || !pointer.matches ? 1.25 : 1.5);
      const size = Math.max(1, Math.round(bounds.width * dpr));
      if (this.canvas.width !== size || this.canvas.height !== size) {
        this.canvas.width = size; this.canvas.height = size; this.gl.viewport(0, 0, size, size);
      }
      this.scroll = clamp((scrollY - this.top) / this.bounds.height, 0, 1);
    }
    draw(now) {
      if (reduced.matches || forced.matches) { update(); return; }
      if (!canRun()) { this.pause(); return; }
      this.frame = requestAnimationFrame(time => this.draw(time));
      const interval = 1000 / (limited || !pointer.matches ? 20 : 30);
      if (this.last && now - this.last < interval - 1) return;
      const delta = this.last ? Math.min(now - this.last, 100) : interval;
      this.last = now; this.elapsed += delta;
      const ease = 1 - Math.exp(-delta * .006);
      this.current = this.current.map((value, i) => value + (this.target[i] - value) * ease);
      const idleWeight = clamp((this.elapsed - 1040) / 160, 0, 1), seconds = this.elapsed / 1000;
      const pitch = .12 + this.current[1] * .065 + this.scroll * .02 + Math.sin(seconds * .27) * .007 * idleWeight;
      const yaw = -.18 + this.current[0] * .105 + this.scroll * .025 + Math.sin(seconds * .21) * .012 * idleWeight;
      const roll = Math.sin(seconds * .19) * .004 * idleWeight;
      const gl = this.gl;
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.uniform3f(this.locations.uPose, pitch, yaw, roll);
      gl.uniform3f(this.locations.uPlacement, this.current[0] * .012, -this.scroll * .025 + Math.sin(seconds * .24) * .008 * idleWeight, 1 - this.scroll * .02);
      this.buffers.forEach(({ buffer, count, direction, range }, i) => {
        const raw = clamp((this.elapsed - i * 200) / 240, 0, 1);
        gl.uniform1f(this.locations.uReveal, raw * raw * (3 - 2 * raw));
        gl.uniform2fv(this.locations.uDirection, direction); gl.uniform2fv(this.locations.uRange, range);
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        this.attributes.forEach((index, j) => gl.vertexAttribPointer(index, j === 2 ? 1 : 3, gl.FLOAT, false, 28, j === 0 ? 0 : j === 1 ? 12 : 24));
        gl.drawArrays(gl.TRIANGLES, 0, count);
      });
      if (!stage.classList.contains('is-rendered')) stage.classList.add('is-rendered');
      const state = this.elapsed < assemblyMs ? 'assembling' : 'idle';
      if (stage.dataset.sculptureState !== state) stage.dataset.sculptureState = state;
      if (this.elapsed >= assemblyMs) entered = true;
    }
    resume() {
      if (this.frame) return;
      if (this.needsResize) this.resize();
      this.scroll = clamp((scrollY - this.top) / this.bounds.height, 0, 1);
      this.last = 0; this.frame = requestAnimationFrame(now => this.draw(now));
    }
    pause() {
      cancelAnimationFrame(this.frame); this.frame = 0; this.last = 0;
      if (stage.classList.contains('is-rendered')) stage.dataset.sculptureState = 'paused';
    }
    dispose() {
      this.pause();
      this.buffers.forEach(({ buffer }) => this.gl?.deleteBuffer(buffer));
      if (this.program) this.gl.deleteProgram(this.program);
      this.canvas.remove(); stage.classList.remove('is-rendered');
    }
  }

  function canRun() { return visible && !failed && !away && !document.hidden && !reduced.matches && !forced.matches && !document.body.classList.contains('nav-is-open'); }
  function cancelTask() {
    if (task === null) return;
    if ('cancelIdleCallback' in window) cancelIdleCallback(task); else clearTimeout(task);
    task = null;
  }
  function fallback() {
    failed = true; cancelTask(); sculpture?.dispose(); sculpture = null;
    stage.classList.remove('is-rendered'); stage.dataset.sculptureState = 'static';
  }
  function update() {
    if (!canRun() && resizeFrame) { cancelAnimationFrame(resizeFrame); resizeFrame = 0; }
    if (reduced.matches || forced.matches) {
      cancelTask(); sculpture?.pause();
      if (sculpture) sculpture.elapsed = assemblyMs;
      entered = true; stage.classList.remove('is-rendered'); stage.dataset.sculptureState = 'static';
      return;
    }
    if (!canRun()) { cancelTask(); sculpture?.pause(); return; }
    if (sculpture) { sculpture.resume(); return; }
    if (task !== null) return;
    const start = () => {
      task = null;
      if (!canRun()) return;
      try { sculpture = new Sculpture(); sculpture.resume(); } catch { fallback(); }
    };
    task = 'requestIdleCallback' in window ? requestIdleCallback(start, { timeout: 180 }) : setTimeout(start, 32);
  }
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => { visible = entries[0].isIntersecting; update(); }, { threshold: 0 }).observe(stage);
  } else {
    const visibility = () => { const rect = stage.getBoundingClientRect(); visible = rect.bottom > 0 && rect.top < innerHeight; update(); };
    addEventListener('scroll', visibility, { passive: true }); visibility();
  }
  hero.addEventListener('pointermove', event => {
    if (!sculpture || !canRun() || !pointer.matches || event.pointerType !== 'mouse') return;
    const rect = sculpture.bounds;
    sculpture.target = [clamp((event.clientX - rect.left) / rect.width * 2 - 1, -1, 1), clamp((event.clientY - (sculpture.top - scrollY)) / rect.height * 2 - 1, -1, 1)];
  }, { passive: true });
  const rest = () => { if (sculpture) sculpture.target = [0, 0]; };
  hero.addEventListener('pointerleave', rest, { passive: true }); hero.addEventListener('keydown', rest);
  addEventListener('scroll', () => {
    if (sculpture && canRun()) sculpture.scroll = clamp((scrollY - sculpture.top) / sculpture.bounds.height, 0, 1);
  }, { passive: true });
  // Coalesce resize notifications; retain pending dimensions while rendering is paused.
  const resize = () => {
    if (!sculpture) return;
    sculpture.needsResize = true;
    if (!canRun() || resizeFrame) return;
    resizeFrame = requestAnimationFrame(() => {
      resizeFrame = 0;
      if (sculpture?.needsResize && canRun()) sculpture.resize();
    });
  };
  if ('ResizeObserver' in window) {
    const observer = new ResizeObserver(resize);
    observer.observe(stage); observer.observe(hero);
  }
  addEventListener('resize', resize, { passive: true });
  // A display/zoom DPR change need not change the canvas's CSS dimensions.
  let resolution;
  const watchResolution = () => {
    resolution?.removeEventListener('change', watchResolution);
    resolution = matchMedia(`(resolution: ${devicePixelRatio || 1}dppx)`);
    resolution.addEventListener('change', watchResolution);
    resize();
  };
  watchResolution();
  new MutationObserver(() => sculpture?.material()).observe(explorer, { attributes: true, attributeFilter: ['data-hero-state'] });
  new MutationObserver(() => { rest(); resize(); update(); }).observe(document.body, { attributes: true, attributeFilter: ['class'] });
  [reduced, forced, pointer].forEach(media => media.addEventListener('change', () => { rest(); resize(); update(); }));
  document.addEventListener('visibilitychange', () => { rest(); update(); });
  addEventListener('pagehide', () => { away = true; update(); });
  addEventListener('pageshow', () => { away = false; resize(); update(); });
  update();
})();
