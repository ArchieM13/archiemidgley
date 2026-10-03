/* ============================================
   LOGO WARP EFFECT
   The hero logo is dissected into its two halves, each
   with its own hover distortion:
     - "archie"  (solid letters) is a traced vector outline (archiePath in
       js/logo-data.js), so it stays crisp at any size, pulled through a
       canvas mesh warp around the cursor.
     - "midgley" (dot matrix) is stored as individual dot positions
       (js/logo-data.js). Each dot is drawn as a crisp vector circle and
       springs away from the cursor on its own.
   Both halves are tinted with the theme's text colour, so dark mode works.
   ============================================ */

(function () {
    'use strict';

    var canvas = document.getElementById('heroCanvas');
    var heroArea = document.getElementById('heroArea');
    if (!canvas || !heroArea) return;

    var ctx = canvas.getContext('2d');
    var dpr = window.devicePixelRatio || 1;
    var width, height;

    var LOGO_WIDTH_VW = 0.86;    // logo width as a fraction of the viewport
    var LOGO_MAX_WIDTH = 1500;   // css px

    // Mesh warp ("archie")
    var COLS = 60;
    var ROWS = 30;
    var RADIUS = 160;            // css px
    var STRENGTH = 40;           // css px

    // Dot field ("midgley")
    var DOT_RADIUS = 170;        // css px reach of the cursor
    var DOT_PUSH = 34;           // css px max push at the cursor
    var DOT_GROW = 0.45;         // extra scale for dots right under the cursor
    var SPRING = 0.14;
    var DAMPING = 0.78;

    var mouseX = -9999, mouseY = -9999;
    var smoothX = -9999, smoothY = -9999;
    var isHovering = false;
    var warpAmount = 0;
    var LERP = 0.12;
    var WARP_LERP = 0.08;

    // Dissected logo, in cropped source-image pixels.
    var logo = window.LOGO_DATA; // { w, h, splitX, r, dots: [x0, y0, x1, y1, ...] }
    var archie = logo && new Path2D(logo.archiePath);

    // Per-layout state, in device pixels.
    var srcCanvas = document.createElement('canvas');
    var srcCtx = srcCanvas.getContext('2d');
    var dots = [];               // { rx, ry, r, x, y, vx, vy, s }

    function getColors() {
        var isDark = document.body.classList.contains('dark');
        if (isDark) {
            return { text: '#F0F0F0', bg: '#111111' };
        }
        return { text: '#1A1A1A', bg: '#FAFAFA' };
    }

    // --- Layout ---
    function layout() {
        if (!logo) return null;
        var vw = width / dpr;
        var drawW = Math.min(vw * LOGO_WIDTH_VW, LOGO_MAX_WIDTH) * dpr;
        var scale = drawW / logo.w;
        var drawH = logo.h * scale;
        return {
            scale: scale,
            x: (width - drawW) / 2,
            y: (height - drawH) / 2
        };
    }

    function renderSource() {
        srcCanvas.width = width;
        srcCanvas.height = height;
        srcCtx.clearRect(0, 0, width, height);

        var L = layout();
        if (!L) return;

        // Fill the traced "archie" outline at device resolution.
        srcCtx.save();
        srcCtx.translate(L.x, L.y);
        srcCtx.scale(L.scale, L.scale);
        srcCtx.fillStyle = getColors().text;
        srcCtx.fill(archie, 'evenodd');
        srcCtx.restore();
    }

    function buildDots() {
        var L = layout();
        dots = [];
        if (!L) return;
        for (var i = 0; i < logo.dots.length; i += 2) {
            var rx = L.x + logo.dots[i] * L.scale;
            var ry = L.y + logo.dots[i + 1] * L.scale;
            dots.push({ rx: rx, ry: ry, r: logo.r * L.scale, x: rx, y: ry, vx: 0, vy: 0, s: 1 });
        }
    }

    function resize() {
        width = canvas.offsetWidth * dpr;
        height = canvas.offsetHeight * dpr;
        canvas.width = width;
        canvas.height = height;
        renderSource();
        buildDots();
    }

    // Watch for theme changes
    var observer = new MutationObserver(function () {
        renderSource();
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });

    // --- Mouse tracking ---
    function onMouseMove(e) {
        var rect = heroArea.getBoundingClientRect();
        mouseX = (e.clientX - rect.left) * dpr;
        mouseY = (e.clientY - rect.top) * dpr;
        isHovering = true;
    }

    function onMouseLeave() {
        isHovering = false;
    }

    heroArea.addEventListener('mousemove', onMouseMove);
    heroArea.addEventListener('mouseleave', onMouseLeave);

    heroArea.addEventListener('touchmove', function (e) {
        var touch = e.touches[0];
        var rect = heroArea.getBoundingClientRect();
        mouseX = (touch.clientX - rect.left) * dpr;
        mouseY = (touch.clientY - rect.top) * dpr;
        isHovering = true;
    }, { passive: true });

    heroArea.addEventListener('touchend', function () {
        isHovering = false;
    });

    // --- Mesh distortion ("archie") ---
    function drawDistorted() {
        var cellW = width / COLS;
        var cellH = height / ROWS;
        var radius = RADIUS * dpr;
        var strength = STRENGTH * dpr * warpAmount;

        for (var row = 0; row < ROWS; row++) {
            for (var col = 0; col < COLS; col++) {
                var destX = col * cellW;
                var destY = row * cellH;

                var cx = destX + cellW / 2;
                var cy = destY + cellH / 2;

                var dx = cx - smoothX;
                var dy = cy - smoothY;
                var dist = Math.sqrt(dx * dx + dy * dy);

                var offsetX = 0, offsetY = 0;
                if (dist < radius && dist > 0) {
                    var factor = 1 - (dist / radius);
                    factor = factor * factor * factor;
                    var angle = Math.atan2(dy, dx);
                    offsetX = -Math.cos(angle) * strength * factor;
                    offsetY = -Math.sin(angle) * strength * factor;
                }

                var srcX = Math.max(0, Math.min(width - cellW, destX + offsetX));
                var srcY = Math.max(0, Math.min(height - cellH, destY + offsetY));

                ctx.drawImage(
                    srcCanvas,
                    srcX, srcY, cellW + 1, cellH + 1,
                    destX, destY, cellW + 1, cellH + 1
                );
            }
        }
    }

    // --- Dot field ("midgley") ---
    // Each dot is pushed out from the cursor and swells slightly, like the
    // mesh bulge, then springs back to its rest position.
    function drawDots() {
        var reach = DOT_RADIUS * dpr;
        var push = DOT_PUSH * dpr * warpAmount;
        ctx.fillStyle = getColors().text;
        ctx.beginPath();
        for (var i = 0; i < dots.length; i++) {
            var d = dots[i];
            var tx = d.rx, ty = d.ry, ts = 1;
            var dx = d.rx - smoothX;
            var dy = d.ry - smoothY;
            var dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < reach && dist > 0) {
                var f = 1 - dist / reach;
                f = f * f;
                tx += (dx / dist) * push * f;
                ty += (dy / dist) * push * f;
                ts += DOT_GROW * warpAmount * f;
            }

            d.vx = (d.vx + (tx - d.x) * SPRING) * DAMPING;
            d.vy = (d.vy + (ty - d.y) * SPRING) * DAMPING;
            d.x += d.vx;
            d.y += d.vy;
            d.s += (ts - d.s) * 0.2;

            var r = d.r * d.s;
            ctx.moveTo(d.x + r, d.y);
            ctx.arc(d.x, d.y, r, 0, Math.PI * 2);
        }
        ctx.fill();
    }

    function animate() {
        requestAnimationFrame(animate);

        // The canvas can be 0x0 for a moment (e.g. a hidden tab at load);
        // re-measure once it has a size instead of drawing nothing.
        if (canvas.offsetWidth * dpr !== width || canvas.offsetHeight * dpr !== height) resize();
        if (!width || !height) return;

        if (isHovering) {
            smoothX += (mouseX - smoothX) * LERP;
            smoothY += (mouseY - smoothY) * LERP;
            warpAmount += (1 - warpAmount) * WARP_LERP;
        } else {
            warpAmount += (0 - warpAmount) * WARP_LERP;
        }

        ctx.clearRect(0, 0, width, height);

        if (warpAmount < 0.005) {
            ctx.drawImage(srcCanvas, 0, 0);
            if (!isHovering && warpAmount < 0.001) {
                warpAmount = 0;
            }
        } else {
            drawDistorted();
        }

        drawDots();
    }

    function start() {
        window.addEventListener('resize', resize);
        resize();
        animate();
    }

    if (!logo) return;
    start();

})();
