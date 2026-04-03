/* ========================================
   about.js — AKASHIKI Portfolio
   about.html 固有アニメーション
   ======================================== */

(function () {
  'use strict';

  var EASE = 'cubic-bezier(0.16, 1, 0.3, 1)';
  var GSAP_EASE = 'power4.out';

  /* ========================================
     ④ Stroke Expose — FVタイトルホバー
     ======================================== */
  function initStrokeExpose() {
    if (window.innerWidth <= 768) return;

    var title = document.querySelector('.about-fv__title');
    if (!title) return;

    title.addEventListener('mouseenter', function () {
      title.classList.add('is-stroke');
    });
    title.addEventListener('mouseleave', function () {
      title.classList.remove('is-stroke');
    });
  }

  /* ========================================
     ② Weight Shift — セクション見出しホバー
     ======================================== */
  function initWeightShift() {
    if (window.innerWidth <= 768) return;

    var headings = document.querySelectorAll('.about-skill__title');
    if (!headings.length) return;
    // Barlow見出しに適用（SKILL SET等）
  }

  /* ========================================
     ⑦ Grid Line Appearance — 信条ブロックホバー
     ======================================== */
  function initGridAppearance() {
    if (window.innerWidth <= 768) return;

    var items = document.querySelectorAll('.about-belief__item');
    if (!items.length) return;

    items.forEach(function (item) {
      var overlay = document.createElement('div');
      overlay.className = 'about-belief__grid-overlay';
      overlay.setAttribute('aria-hidden', 'true');
      item.style.position = 'relative';
      item.appendChild(overlay);

      item.addEventListener('mouseenter', function () {
        gsap.to(overlay, { opacity: 0.15, duration: 0.5 });
      });
      item.addEventListener('mouseleave', function () {
        gsap.to(overlay, { opacity: 0, duration: 0.5 });
      });
    });
  }

  /* ========================================
     水平流線（墨の筆跡）
     ======================================== */
  function initFlowLines() {
    var fv = document.querySelector('.about-fv');
    if (!fv) return;

    var container = document.createElement('div');
    container.className = 'about-fv__flow-lines';
    container.setAttribute('aria-hidden', 'true');

    var svgNS = 'http://www.w3.org/2000/svg';
    var svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('viewBox', '0 0 4000 1080');
    svg.setAttribute('preserveAspectRatio', 'none');

    var paths = [
      { d: 'M0,120 Q200,125 400,117 T800,122 T1200,119 T1600,123 T2000,120', y: 0, dur: 35, sw: 0.8 },
      { d: 'M0,220 Q200,225 400,213 T800,222 T1200,218 T1600,226 T2000,220', y: 0, dur: 42, sw: 0.5 },
      { d: 'M0,380 Q200,385 400,377 T800,382 T1200,375 T1600,383 T2000,380', y: 0, dur: 30, sw: 1.2 },
      { d: 'M0,500 Q200,505 400,497 T800,502 T1200,495 T1600,503 T2000,500', y: 0, dur: 48, sw: 0.4 },
      { d: 'M0,650 Q200,655 400,643 T800,652 T1200,648 T1600,656 T2000,650', y: 0, dur: 38, sw: 1.0 },
      { d: 'M0,780 Q200,783 400,775 T800,782 T1200,777 T1600,784 T2000,780', y: 0, dur: 45, sw: 0.6 },
      { d: 'M0,900 Q200,905 400,897 T800,902 T1200,895 T1600,903 T2000,900', y: 0, dur: 33, sw: 1.5 }
    ];

    paths.forEach(function (p) {
      var path = document.createElementNS(svgNS, 'path');
      path.setAttribute('d', p.d);
      path.setAttribute('fill', 'none');
      path.setAttribute('stroke', 'rgba(255,255,255,0.15)');
      path.setAttribute('stroke-width', p.sw);
      path.style.willChange = 'transform, opacity';
      svg.appendChild(path);

      // 水平ドリフト
      gsap.fromTo(path,
        { x: 0 },
        { x: -2000, duration: p.dur, ease: 'none', repeat: -1 }
      );

      // opacity sin波変動
      gsap.fromTo(path,
        { opacity: 0.10 },
        { opacity: 0.20, duration: 8, ease: 'sine.inOut', yoyo: true, repeat: -1 }
      );
    });

    container.appendChild(svg);
    fv.appendChild(container);
  }

  /* ========================================
     WebGL 墨流体シミュレーション — FV背景
     Navier-Stokes 簡易実装
     ======================================== */
  function initInkSimulation(onComplete) {
    var canvas = document.getElementById('inkCanvas');
    if (!canvas) { onComplete(); return; }

    // SP: WebGL無効 → フォールバック
    if (window.innerWidth <= 768) {
      canvas.style.display = 'none';
      onComplete();
      return;
    }

    // WebGLコンテキスト取得
    var glOpts = { alpha: false, depth: false, stencil: false, antialias: false, preserveDrawingBuffer: false };
    var gl = canvas.getContext('webgl2', glOpts);
    var isGL2 = !!gl;
    if (!gl) gl = canvas.getContext('webgl', glOpts);
    if (!gl) { canvas.style.display = 'none'; onComplete(); return; }

    // Float texture サポート
    var halfFloat, intFmt;
    if (isGL2) {
      gl.getExtension('EXT_color_buffer_float');
      halfFloat = gl.HALF_FLOAT;
      intFmt = gl.RGBA16F;
    } else {
      var hfExt = gl.getExtension('OES_texture_half_float');
      gl.getExtension('OES_texture_half_float_linear');
      if (!hfExt) { canvas.style.display = 'none'; onComplete(); return; }
      halfFloat = hfExt.HALF_FLOAT_OES;
      intFmt = gl.RGBA;
    }

    // 解像度（50%）
    var W = Math.floor(window.innerWidth * 0.5);
    var H = Math.floor(window.innerHeight * 0.5);
    canvas.width = W;
    canvas.height = H;

    // FBOサポートテスト
    var testTex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, testTex);
    gl.texImage2D(gl.TEXTURE_2D, 0, intFmt, 4, 4, 0, gl.RGBA, halfFloat, null);
    var testFBO = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, testFBO);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, testTex, 0);
    if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) {
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.deleteTexture(testTex);
      gl.deleteFramebuffer(testFBO);
      canvas.style.display = 'none';
      onComplete();
      return;
    }
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.deleteTexture(testTex);
    gl.deleteFramebuffer(testFBO);

    // ---- ユーティリティ ----
    function compile(type, src) {
      var s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    }

    function mkProg(vs, fs) {
      var p = gl.createProgram();
      gl.attachShader(p, compile(gl.VERTEX_SHADER, vs));
      gl.attachShader(p, compile(gl.FRAGMENT_SHADER, fs));
      gl.linkProgram(p);
      return p;
    }

    function ulocs(p, names) {
      var u = {};
      for (var i = 0; i < names.length; i++) u[names[i]] = gl.getUniformLocation(p, names[i]);
      return u;
    }

    // フルスクリーン Quad
    var qBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, qBuf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);

    function use(p) {
      gl.useProgram(p);
      var loc = gl.getAttribLocation(p, 'a_position');
      gl.bindBuffer(gl.ARRAY_BUFFER, qBuf);
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    }

    function tex(unit, t) {
      gl.activeTexture(gl.TEXTURE0 + unit);
      gl.bindTexture(gl.TEXTURE_2D, t);
    }

    function blit(fbo) {
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      gl.viewport(0, 0, W, H);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }

    // FBO生成
    function createFBO() {
      var t = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, t);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D, 0, intFmt, W, H, 0, gl.RGBA, halfFloat, null);
      var f = gl.createFramebuffer();
      gl.bindFramebuffer(gl.FRAMEBUFFER, f);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, t, 0);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      return { fbo: f, tex: t };
    }

    function createDblFBO() {
      var a = createFBO(), b = createFBO();
      return { r: a, w: b, swap: function () { var tmp = this.r; this.r = this.w; this.w = tmp; } };
    }

    // ---- シェーダーソース ----
    var VS = [
      'attribute vec2 a_position;',
      'varying vec2 v_uv;',
      'void main() {',
      '  v_uv = a_position * 0.5 + 0.5;',
      '  gl_Position = vec4(a_position, 0.0, 1.0);',
      '}'
    ].join('\n');

    // 移流（Advection）
    var advFS = [
      'precision highp float;',
      'varying vec2 v_uv;',
      'uniform sampler2D u_vel;',
      'uniform sampler2D u_src;',
      'uniform vec2 u_ts;',
      'uniform float u_dt;',
      'uniform float u_diss;',
      'void main() {',
      '  vec2 coord = v_uv - u_dt * texture2D(u_vel, v_uv).xy * u_ts;',
      '  gl_FragColor = u_diss * texture2D(u_src, coord);',
      '}'
    ].join('\n');

    // スプラット（力・密度注入）
    var splFS = [
      'precision highp float;',
      'varying vec2 v_uv;',
      'uniform sampler2D u_tgt;',
      'uniform float u_ar;',
      'uniform vec2 u_pt;',
      'uniform vec3 u_clr;',
      'uniform float u_rad;',
      'void main() {',
      '  vec2 p = v_uv - u_pt;',
      '  p.x *= u_ar;',
      '  vec3 s = exp(-dot(p, p) / u_rad) * u_clr;',
      '  gl_FragColor = vec4(texture2D(u_tgt, v_uv).xyz + s, 1.0);',
      '}'
    ].join('\n');

    // 渦度（Curl）
    var curFS = [
      'precision highp float;',
      'varying vec2 v_uv;',
      'uniform sampler2D u_vel;',
      'uniform vec2 u_ts;',
      'void main() {',
      '  float L = texture2D(u_vel, v_uv - vec2(u_ts.x, 0.0)).y;',
      '  float R = texture2D(u_vel, v_uv + vec2(u_ts.x, 0.0)).y;',
      '  float T = texture2D(u_vel, v_uv + vec2(0.0, u_ts.y)).x;',
      '  float B = texture2D(u_vel, v_uv - vec2(0.0, u_ts.y)).x;',
      '  gl_FragColor = vec4(R - L - T + B, 0.0, 0.0, 1.0);',
      '}'
    ].join('\n');

    // 渦度閉じ込め（Vorticity Confinement）
    var vorFS = [
      'precision highp float;',
      'varying vec2 v_uv;',
      'uniform sampler2D u_vel;',
      'uniform sampler2D u_curl;',
      'uniform vec2 u_ts;',
      'uniform float u_str;',
      'uniform float u_dt;',
      'void main() {',
      '  float L = texture2D(u_curl, v_uv - vec2(u_ts.x, 0.0)).x;',
      '  float R = texture2D(u_curl, v_uv + vec2(u_ts.x, 0.0)).x;',
      '  float T = texture2D(u_curl, v_uv + vec2(0.0, u_ts.y)).x;',
      '  float B = texture2D(u_curl, v_uv - vec2(0.0, u_ts.y)).x;',
      '  float C = texture2D(u_curl, v_uv).x;',
      '  vec2 f = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));',
      '  f /= length(f) + 1e-4;',
      '  f *= u_str * C;',
      '  f.y *= -1.0;',
      '  vec2 vel = texture2D(u_vel, v_uv).xy;',
      '  gl_FragColor = vec4(vel + f * u_dt, 0.0, 1.0);',
      '}'
    ].join('\n');

    // 発散（Divergence）
    var divFS = [
      'precision highp float;',
      'varying vec2 v_uv;',
      'uniform sampler2D u_vel;',
      'uniform vec2 u_ts;',
      'void main() {',
      '  float L = texture2D(u_vel, v_uv - vec2(u_ts.x, 0.0)).x;',
      '  float R = texture2D(u_vel, v_uv + vec2(u_ts.x, 0.0)).x;',
      '  float T = texture2D(u_vel, v_uv + vec2(0.0, u_ts.y)).y;',
      '  float B = texture2D(u_vel, v_uv - vec2(0.0, u_ts.y)).y;',
      '  gl_FragColor = vec4(0.5 * (R - L + T - B), 0.0, 0.0, 1.0);',
      '}'
    ].join('\n');

    // 圧力（Jacobi反復）
    var preFS = [
      'precision highp float;',
      'varying vec2 v_uv;',
      'uniform sampler2D u_pres;',
      'uniform sampler2D u_div;',
      'uniform vec2 u_ts;',
      'void main() {',
      '  float L = texture2D(u_pres, v_uv - vec2(u_ts.x, 0.0)).x;',
      '  float R = texture2D(u_pres, v_uv + vec2(u_ts.x, 0.0)).x;',
      '  float T = texture2D(u_pres, v_uv + vec2(0.0, u_ts.y)).x;',
      '  float B = texture2D(u_pres, v_uv - vec2(0.0, u_ts.y)).x;',
      '  float D = texture2D(u_div, v_uv).x;',
      '  gl_FragColor = vec4((L + R + B + T - D) * 0.25, 0.0, 0.0, 1.0);',
      '}'
    ].join('\n');

    // 勾配減算（Gradient Subtract）
    var grdFS = [
      'precision highp float;',
      'varying vec2 v_uv;',
      'uniform sampler2D u_pres;',
      'uniform sampler2D u_vel;',
      'uniform vec2 u_ts;',
      'void main() {',
      '  float L = texture2D(u_pres, v_uv - vec2(u_ts.x, 0.0)).x;',
      '  float R = texture2D(u_pres, v_uv + vec2(u_ts.x, 0.0)).x;',
      '  float T = texture2D(u_pres, v_uv + vec2(0.0, u_ts.y)).x;',
      '  float B = texture2D(u_pres, v_uv - vec2(0.0, u_ts.y)).x;',
      '  vec2 vel = texture2D(u_vel, v_uv).xy;',
      '  gl_FragColor = vec4(vel - 0.5 * vec2(R - L, T - B), 0.0, 1.0);',
      '}'
    ].join('\n');

    // 表示（Display）— 背景色#0a0a0a + 墨オーバーレイ
    var dspFS = [
      'precision highp float;',
      'varying vec2 v_uv;',
      'uniform sampler2D u_tex;',
      'uniform float u_bri;',
      'void main() {',
      '  float d = texture2D(u_tex, v_uv).x;',
      '  float ink = clamp(d * u_bri, 0.0, 1.0);',
      '  gl_FragColor = vec4(vec3(0.039 + ink), 1.0);',
      '}'
    ].join('\n');

    // ---- プログラム生成 & Uniform取得 ----
    var pAdv = mkProg(VS, advFS);
    var uAdv = ulocs(pAdv, ['u_vel', 'u_src', 'u_ts', 'u_dt', 'u_diss']);

    var pSpl = mkProg(VS, splFS);
    var uSpl = ulocs(pSpl, ['u_tgt', 'u_ar', 'u_pt', 'u_clr', 'u_rad']);

    var pCur = mkProg(VS, curFS);
    var uCur = ulocs(pCur, ['u_vel', 'u_ts']);

    var pVor = mkProg(VS, vorFS);
    var uVor = ulocs(pVor, ['u_vel', 'u_curl', 'u_ts', 'u_str', 'u_dt']);

    var pDiv = mkProg(VS, divFS);
    var uDiv = ulocs(pDiv, ['u_vel', 'u_ts']);

    var pPre = mkProg(VS, preFS);
    var uPre = ulocs(pPre, ['u_pres', 'u_div', 'u_ts']);

    var pGrd = mkProg(VS, grdFS);
    var uGrd = ulocs(pGrd, ['u_pres', 'u_vel', 'u_ts']);

    var pDsp = mkProg(VS, dspFS);
    var uDsp = ulocs(pDsp, ['u_tex', 'u_bri']);

    // ---- FBO ----
    var velFB = createDblFBO();
    var dyeFB = createDblFBO();
    var curFB = createFBO();
    var divFB = createFBO();
    var preFB = createDblFBO();

    // ---- 定数 ----
    var ts = [1.0 / W, 1.0 / H];
    var ar = W / H;
    var VEL_DISS = 0.985;
    var DYE_DISS = 0.998;
    var VORT = 30.0;
    var PRES_ITER = 20;
    var BRI = 0.25;

    // ---- スプラット関数 ----
    function addSplat(target, x, y, cx, cy, cz, radius) {
      use(pSpl);
      tex(0, target.r.tex);
      gl.uniform1i(uSpl.u_tgt, 0);
      gl.uniform1f(uSpl.u_ar, ar);
      gl.uniform2f(uSpl.u_pt, x, y);
      gl.uniform3f(uSpl.u_clr, cx, cy, cz);
      gl.uniform1f(uSpl.u_rad, radius);
      blit(target.w.fbo);
      target.swap();
    }

    // ---- シミュレーションステップ ----
    function simStep(dt) {
      // 1. Curl
      use(pCur);
      tex(0, velFB.r.tex);
      gl.uniform1i(uCur.u_vel, 0);
      gl.uniform2f(uCur.u_ts, ts[0], ts[1]);
      blit(curFB.fbo);

      // 2. Vorticity Confinement
      use(pVor);
      tex(0, velFB.r.tex);
      tex(1, curFB.tex);
      gl.uniform1i(uVor.u_vel, 0);
      gl.uniform1i(uVor.u_curl, 1);
      gl.uniform2f(uVor.u_ts, ts[0], ts[1]);
      gl.uniform1f(uVor.u_str, VORT);
      gl.uniform1f(uVor.u_dt, dt);
      blit(velFB.w.fbo);
      velFB.swap();

      // 3. Divergence
      use(pDiv);
      tex(0, velFB.r.tex);
      gl.uniform1i(uDiv.u_vel, 0);
      gl.uniform2f(uDiv.u_ts, ts[0], ts[1]);
      blit(divFB.fbo);

      // 4. Pressure Solve (Jacobi反復)
      use(pPre);
      gl.uniform2f(uPre.u_ts, ts[0], ts[1]);
      for (var i = 0; i < PRES_ITER; i++) {
        tex(0, preFB.r.tex);
        tex(1, divFB.tex);
        gl.uniform1i(uPre.u_pres, 0);
        gl.uniform1i(uPre.u_div, 1);
        blit(preFB.w.fbo);
        preFB.swap();
      }

      // 5. Gradient Subtract → 発散除去
      use(pGrd);
      tex(0, preFB.r.tex);
      tex(1, velFB.r.tex);
      gl.uniform1i(uGrd.u_pres, 0);
      gl.uniform1i(uGrd.u_vel, 1);
      gl.uniform2f(uGrd.u_ts, ts[0], ts[1]);
      blit(velFB.w.fbo);
      velFB.swap();

      // 6. Advect Velocity（速度場の自己移流）
      use(pAdv);
      tex(0, velFB.r.tex);
      tex(1, velFB.r.tex);
      gl.uniform1i(uAdv.u_vel, 0);
      gl.uniform1i(uAdv.u_src, 1);
      gl.uniform2f(uAdv.u_ts, ts[0], ts[1]);
      gl.uniform1f(uAdv.u_dt, dt);
      gl.uniform1f(uAdv.u_diss, VEL_DISS);
      blit(velFB.w.fbo);
      velFB.swap();

      // 7. Advect Dye（密度場の移流）
      tex(0, velFB.r.tex);
      tex(1, dyeFB.r.tex);
      gl.uniform1i(uAdv.u_vel, 0);
      gl.uniform1i(uAdv.u_src, 1);
      gl.uniform1f(uAdv.u_diss, DYE_DISS);
      blit(dyeFB.w.fbo);
      dyeFB.swap();
    }

    // ---- 画面出力 ----
    function display() {
      use(pDsp);
      tex(0, dyeFB.r.tex);
      gl.uniform1i(uDsp.u_tex, 0);
      gl.uniform1f(uDsp.u_bri, BRI);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport(0, 0, W, H);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }

    // ---- アニメーションループ ----
    var t0 = -1;
    var tPrev = 0;

    function loop(timestamp) {
      if (t0 < 0) { t0 = timestamp; tPrev = timestamp; }
      var elapsed = (timestamp - t0) * 0.001;
      var dt = Math.min((timestamp - tPrev) * 0.001, 0.033);
      tPrev = timestamp;

      // Phase 1 (0〜0.7秒): 墨の滴下・注入
      if (elapsed < 0.7) {
        var decay = Math.pow(1.0 - elapsed / 0.7, 3);
        var force = 600 * decay;

        // 放射状の速度スプラット（6方向、回転）
        for (var i = 0; i < 6; i++) {
          var angle = (i / 6) * Math.PI * 2 + elapsed * 3.0;
          var dx = Math.cos(angle) * force;
          var dy = Math.sin(angle) * force;
          addSplat(velFB, 0.5, 0.5, dx, dy, 0, 0.006);
        }

        // 中央への墨密度注入
        addSplat(dyeFB, 0.5, 0.5, 0.5 * decay, 0, 0, 0.012);

        // ランダムな二次スプラット（有機的な広がり）
        if (elapsed < 0.5 && Math.random() < 0.6) {
          var ra = Math.random() * Math.PI * 2;
          var rd = 0.05 + Math.random() * 0.10;
          var rx = 0.5 + Math.cos(ra) * rd;
          var ry = 0.5 + Math.sin(ra) * rd;
          var rf = 150 + Math.random() * 300;
          addSplat(velFB, rx, ry, Math.cos(ra) * rf, Math.sin(ra) * rf, 0, 0.003);
          addSplat(dyeFB, rx, ry, 0.25, 0, 0, 0.005);
        }
      }

      // シミュレーション実行
      simStep(dt);

      // 描画
      display();

      // Phase 3完了（3.5秒）まで継続
      if (elapsed < 3.5) {
        requestAnimationFrame(loop);
      } else {
        // 静止 → テキストアニメーション発火
        onComplete();
      }
    }

    requestAnimationFrame(loop);
  }

  /* ========================================
     FV Entrance Animation
     ======================================== */
  function initFVAnimation(delayOverride) {
    var fv = document.querySelector('.about-fv');
    var title = document.querySelector('.about-fv__title');
    var sub = document.querySelector('.about-fv__sub');
    var hr = document.querySelector('.about-fv__hr');
    var edgeBL = document.querySelector('.about-fv__edge--bl');
    var edgeBR = document.querySelector('.about-fv__edge--br');

    if (!title || !fv) return;

    var startDelay;
    if (typeof delayOverride === 'number') {
      startDelay = delayOverride;
    } else {
      var isTransition = sessionStorage.getItem('akashiki-transition') === 'active';
      startDelay = isTransition ? 0.8 : 0.2;
    }

    var tl = gsap.timeline({
      delay: startDelay,
      onComplete: function () {
        // FV入場アニメーション完了後、1秒静止→50vhに縮小
        initFVShrink(fv);
      }
    });

    // 名前: letter-spacing 0.4em→0.2em + opacity 0→1
    tl.fromTo(title,
      { opacity: 0, letterSpacing: '0.4em' },
      { opacity: 1, letterSpacing: '0.2em', duration: 1.2, ease: GSAP_EASE }
    );

    // サブテキスト
    tl.fromTo(sub,
      { opacity: 0 },
      { opacity: 1, duration: 0.8, ease: GSAP_EASE },
      '-=0.8'
    );

    // 水平ライン
    tl.fromTo(hr,
      { scaleX: 0 },
      { scaleX: 1, duration: 0.8, ease: GSAP_EASE },
      '-=0.6'
    );

    // エッジテキスト
    tl.fromTo(edgeBL,
      { opacity: 0 },
      { opacity: 1, duration: 0.6, ease: GSAP_EASE },
      '-=0.4'
    );
    tl.fromTo(edgeBR,
      { opacity: 0 },
      { opacity: 1, duration: 0.6, ease: GSAP_EASE },
      '-=0.5'
    );
  }

  /* ========================================
     FV Shrink Animation (100vh → 50vh)
     ======================================== */
  function initFVShrink(fv) {
    if (!fv) return;

    var shrinkTl = gsap.timeline();

    shrinkTl.to(fv, {
      height: '50vh',
      duration: 0.8,
      ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
      onComplete: function () {
        fv.style.height = '50vh';
        ScrollTrigger.refresh();
      }
    });
  }

  /* ========================================
     経歴ストーリー スクロールアニメーション
     ======================================== */
  function initStoryAnimation() {
    var lead = document.querySelector('.about-story__lead');
    var paragraphs = document.querySelectorAll('.about-story__paragraph');
    var highlight = document.querySelector('.about-story__highlight');

    if (!lead) return;

    // リード文
    gsap.fromTo(lead,
      { opacity: 0, y: 20 },
      {
        opacity: 1, y: 0,
        duration: 1.2,
        ease: GSAP_EASE,
        scrollTrigger: {
          trigger: lead,
          start: 'top 80%',
          toggleActions: 'play none none none'
        }
      }
    );

    // 本文各段落
    paragraphs.forEach(function (p, i) {
      gsap.fromTo(p,
        { opacity: 0, y: 20 },
        {
          opacity: 1, y: 0,
          duration: 1.2,
          delay: i * 0.2,
          ease: GSAP_EASE,
          scrollTrigger: {
            trigger: p,
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        }
      );
    });

    // ハイライト行
    if (highlight) {
      gsap.fromTo(highlight,
        { opacity: 0, y: 15 },
        {
          opacity: 1, y: 0,
          duration: 1.0,
          ease: GSAP_EASE,
          scrollTrigger: {
            trigger: highlight,
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        }
      );
    }
  }

  /* ========================================
     信条・こだわり スクロールアニメーション
     ======================================== */
  function initBeliefAnimation() {
    var items = document.querySelectorAll('.about-belief__item');
    var dividers = document.querySelectorAll('.about-belief__divider');

    if (!items.length) return;

    // 各信条: 左からスライド
    items.forEach(function (item, i) {
      gsap.fromTo(item,
        { opacity: 0, x: -20 },
        {
          opacity: 1, x: 0,
          duration: 1.0,
          delay: i * 0.2,
          ease: GSAP_EASE,
          scrollTrigger: {
            trigger: item,
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        }
      );
    });

    // 区切り線: scaleX 0→1
    dividers.forEach(function (div) {
      gsap.fromTo(div,
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 0.8,
          ease: GSAP_EASE,
          scrollTrigger: {
            trigger: div,
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        }
      );
    });
  }

  /* ========================================
     スキルセット スクロールアニメーション
     ======================================== */
  function initSkillAnimation() {
    var title = document.querySelector('.about-skill__title');
    var hr = document.querySelector('.about-skill__hr');
    var rows = document.querySelectorAll('.about-skill__row');

    if (!title) return;

    // タイトル
    gsap.fromTo(title,
      { opacity: 0, y: 20 },
      {
        opacity: 1, y: 0,
        duration: 1.0,
        ease: GSAP_EASE,
        scrollTrigger: {
          trigger: title,
          start: 'top 80%',
          toggleActions: 'play none none none'
        }
      }
    );

    // 水平ライン
    gsap.fromTo(hr,
      { scaleX: 0 },
      {
        scaleX: 1,
        duration: 0.8,
        ease: GSAP_EASE,
        scrollTrigger: {
          trigger: hr,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      }
    );

    // 各行: stagger 0.1s
    rows.forEach(function (row, i) {
      gsap.fromTo(row,
        { opacity: 0, x: -10 },
        {
          opacity: 1, x: 0,
          duration: 0.8,
          delay: i * 0.1,
          ease: GSAP_EASE,
          scrollTrigger: {
            trigger: row,
            start: 'top 90%',
            toggleActions: 'play none none none'
          }
        }
      );
    });
  }

  /* ========================================
     Init
     ======================================== */
  document.addEventListener('DOMContentLoaded', function () {
    gsap.registerPlugin(ScrollTrigger);
    initFlowLines();

    // ページ遷移ディレイ → 墨シミュレーション → テキスト出現
    var isTransition = sessionStorage.getItem('akashiki-transition') === 'active';
    var inkStartDelay = isTransition ? 800 : 200;

    setTimeout(function () {
      initInkSimulation(function () {
        initFVAnimation(0.3);
      });
    }, inkStartDelay);

    // スクロールアニメーション（FVとは独立）
    initStoryAnimation();
    initBeliefAnimation();
    initSkillAnimation();
    initStrokeExpose();
    initWeightShift();
    initGridAppearance();
  });

})();
