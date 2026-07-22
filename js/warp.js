/* ============================================
   TEXT WARP EFFECT
   Canvas-based mesh distortion on hero title.
   Cursor warps the actual shapes of the letters.
   FIX: explicitly loads Bebas Neue before rendering,
   so it's correct on first visit (no refresh needed).
   ============================================ */

(function () {
    'use strict';

    var canvas = document.getElementById('heroCanvas');
    var heroArea = document.getElementById('heroArea');
    if (!canvas || !heroArea) return;

    var ctx = canvas.getContext('2d');
    var dpr = window.devicePixelRatio || 1;
    var width, height;

    var TITLE = 'A.Midgley';
    var FONT_FAMILY = "'Bebas Neue', 'Space Grotesk', sans-serif";
    var LETTER_SPACING = 0.04;
    var STRETCH_Y = 2.0;

    var COLS = 60;
    var ROWS = 30;

    var RADIUS = 160;
    var STRENGTH = 40;

    var mouseX = -9999, mouseY = -9999;
    var smoothX = -9999, smoothY = -9999;
    var isHovering = false;
    var warpAmount = 0;
    var LERP = 0.12;
    var WARP_LERP = 0.08;

    var srcCanvas = document.createElement('canvas');
    var srcCtx = srcCanvas.getContext('2d');

    function getColors() {
        var isDark = document.body.classList.contains('dark');
        if (isDark) {
            return { text: '#F0F0F0', bg: '#111111' };
        }
        return { text: '#1A1A1A', bg: '#FAFAFA' };
    }

    function getFontSize() {
        var vw = width / dpr;
        var size = vw * 0.165;
        var min = 90;
        var max = 230;
        return Math.min(Math.max(size, min), max) * dpr;
    }

    function drawSpacedText(context, text, cx, cy, fontSize) {
        var spacingPx = LETTER_SPACING * fontSize;
        var totalW = 0;
        var charWidths = [];
        for (var i = 0; i < text.length; i++) {
            var w = context.measureText(text[i]).width;
            charWidths.push(w);
            totalW += w;
            if (i < text.length - 1) totalW += spacingPx;
        }

        var x = cx - totalW / 2;
        for (var j = 0; j < text.length; j++) {
            context.fillText(text[j], x + charWidths[j] / 2, cy);
            x += charWidths[j] + spacingPx;
        }
    }

    function renderSource() {
        srcCanvas.width = width;
        srcCanvas.height = height;

        var fontSize = getFontSize();
        var colors = getColors();

        srcCtx.clearRect(0, 0, width, height);
        srcCtx.save();

        srcCtx.translate(width / 2, height / 2);
        srcCtx.scale(1, STRETCH_Y);

        srcCtx.font = '400 ' + fontSize + 'px ' + FONT_FAMILY;
        srcCtx.textAlign = 'center';
        srcCtx.textBaseline = 'middle';

        srcCtx.fillStyle = colors.text;
        srcCtx.strokeStyle = colors.text;
        srcCtx.lineWidth = 3 * dpr;
        srcCtx.lineJoin = 'round';
        drawSpacedText(srcCtx, TITLE, 0, 0, fontSize);

        srcCtx.restore();

        // Keep any damage the user has already inflicted.
        applyDamage();
    }

    function resize() {
        width = canvas.offsetWidth * dpr;
        height = canvas.offsetHeight * dpr;
        canvas.width = width;
        canvas.height = height;
        // The title reflows at a new size, so past damage no longer maps — reset.
        damageRects.length = 0;
        fragments.length = 0;
        renderSource();
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

    // --- Click destruction: break chunks off the word ---
    // Clicking on or near the letters shatters that region: the inked cells
    // there detach as debris that tumbles off across the screen, and the word
    // is permanently gouged where they broke away. A small shockwave ripple
    // gives the hit some punch. Damage is stored so it survives theme changes.
    var ripples = [];        // small shockwave rings driving the mesh
    var fragments = [];      // detached debris tumbling across the screen
    var damageRects = [];    // cleared regions, re-applied after every render
    var lastTime = performance.now();

    var RIPPLE_SPEED = 650;      // css px / second the ring expands
    var RIPPLE_LIFE = 0.55;      // seconds a ripple lives
    var RIPPLE_BAND = 38;        // css px thickness of the shockwave ring
    var RIPPLE_STRENGTH = 26;    // css px peak displacement

    var DAMAGE_RADIUS = 52;      // css px radius of a single hit
    var CHUNK = 15;              // css px size of each debris chunk
    var GRAVITY = 46;            // css px / s^2 pulling debris down
    var MAX_FRAGMENTS = 500;     // hard cap so many clicks stay smooth

    // Re-clear every damaged region on the source canvas. Called after each
    // renderSource() so re-rendering (e.g. on a theme switch) doesn't heal it.
    function applyDamage() {
        for (var i = 0; i < damageRects.length; i++) {
            var r = damageRects[i];
            srcCtx.clearRect(r.x, r.y, r.w, r.h);
        }
    }

    function spawnDestruction(x, y) {
        var R = DAMAGE_RADIUS * dpr;
        var cell = CHUNK * dpr;

        var bx = Math.max(0, Math.floor(x - R));
        var by = Math.max(0, Math.floor(y - R));
        var bx2 = Math.min(width, Math.ceil(x + R));
        var by2 = Math.min(height, Math.ceil(y + R));
        if (bx2 <= bx || by2 <= by) return;

        var img;
        try {
            img = srcCtx.getImageData(bx, by, bx2 - bx, by2 - by);
        } catch (err) {
            return; // getImageData can throw in rare tainted-canvas cases
        }
        var data = img.data, iw = bx2 - bx;
        var spawned = 0;

        for (var cy0 = by; cy0 < by2; cy0 += cell) {
            for (var cx0 = bx; cx0 < bx2; cx0 += cell) {
                var cw = Math.min(cell, bx2 - cx0);
                var ch = Math.min(cell, by2 - cy0);
                var ccx = cx0 + cw / 2, ccy = cy0 + ch / 2;
                var ddx = ccx - x, ddy = ccy - y;
                if (ddx * ddx + ddy * ddy > R * R) continue;

                // Only break chunks that actually contain ink.
                var ink = false;
                for (var yy = cy0; yy < cy0 + ch && !ink; yy += 2) {
                    for (var xx = cx0; xx < cx0 + cw; xx += 2) {
                        if (data[((yy - by) * iw + (xx - bx)) * 4 + 3] > 40) {
                            ink = true;
                            break;
                        }
                    }
                }
                if (!ink) continue;

                // Snapshot the chunk's pixels into its own little canvas.
                var fc = document.createElement('canvas');
                fc.width = cw;
                fc.height = ch;
                fc.getContext('2d').drawImage(srcCanvas, cx0, cy0, cw, ch, 0, 0, cw, ch);

                var ang = Math.atan2(ddy, ddx) + (Math.random() - 0.5) * 0.9;
                var speed = (34 + Math.random() * 66) * dpr;
                fragments.push({
                    canvas: fc, w: cw, h: ch,
                    x: ccx, y: ccy,
                    vx: Math.cos(ang) * speed,
                    vy: Math.sin(ang) * speed - 28 * dpr,   // slight upward kick
                    angle: 0, va: (Math.random() - 0.5) * 4.5,
                    age: 0
                });

                // Gouge the chunk out of the word — permanently.
                damageRects.push({ x: cx0, y: cy0, w: cw, h: ch });
                srcCtx.clearRect(cx0, cy0, cw, ch);
                spawned++;
            }
        }

        if (spawned > 0) ripples.push({ x: x, y: y, age: 0 });
        if (fragments.length > MAX_FRAGMENTS) {
            fragments.splice(0, fragments.length - MAX_FRAGMENTS);
        }
    }

    function onClick(e) {
        var rect = heroArea.getBoundingClientRect();
        spawnDestruction((e.clientX - rect.left) * dpr, (e.clientY - rect.top) * dpr);
    }
    heroArea.addEventListener('click', onClick);

    function updateFragments(dt) {
        var margin = 80 * dpr;
        for (var i = fragments.length - 1; i >= 0; i--) {
            var f = fragments[i];
            f.vy += GRAVITY * dpr * dt;
            f.vx *= (1 - 0.12 * dt);
            f.vy *= (1 - 0.12 * dt);
            f.x += f.vx * dt;
            f.y += f.vy * dt;
            f.angle += f.va * dt;
            f.age += dt;

            if (f.age > 14 ||
                f.x < -margin || f.x > width + margin ||
                f.y > height + margin || f.y < -margin) {
                fragments.splice(i, 1);
                continue;
            }

            var alpha = f.age > 12 ? Math.max(0, 1 - (f.age - 12) / 2) : 1;
            ctx.save();
            ctx.translate(f.x, f.y);
            ctx.rotate(f.angle);
            ctx.globalAlpha = alpha;
            ctx.drawImage(f.canvas, -f.w / 2, -f.h / 2);
            ctx.restore();
        }
        ctx.globalAlpha = 1;
    }

    // --- Mesh distortion ---
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

                // Shockwave rings: cells near an expanding ring get shoved,
                // tearing the letters apart as each ripple sweeps through.
                for (var ri = 0; ri < ripples.length; ri++) {
                    var rp = ripples[ri];
                    var ringR = rp.age * RIPPLE_SPEED * dpr;
                    var rdx = cx - rp.x;
                    var rdy = cy - rp.y;
                    var rdist = Math.sqrt(rdx * rdx + rdy * rdy);
                    if (rdist <= 0) continue;
                    var band = RIPPLE_BAND * dpr;
                    var diff = rdist - ringR;
                    if (Math.abs(diff) >= band) continue;
                    var life = 1 - rp.age / RIPPLE_LIFE;
                    if (life <= 0) continue;
                    var sigma = band / 2.2;
                    var g = Math.exp(-(diff * diff) / (2 * sigma * sigma));
                    var amp = RIPPLE_STRENGTH * dpr * life * g;
                    var ra = Math.atan2(rdy, rdx);
                    offsetX += -Math.cos(ra) * amp;
                    offsetY += -Math.sin(ra) * amp;
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

    function animate() {
        var now = performance.now();
        var dt = Math.min(0.05, (now - lastTime) / 1000);
        lastTime = now;

        if (isHovering) {
            smoothX += (mouseX - smoothX) * LERP;
            smoothY += (mouseY - smoothY) * LERP;
            warpAmount += (1 - warpAmount) * WARP_LERP;
        } else {
            warpAmount += (0 - warpAmount) * WARP_LERP;
        }

        // Advance and retire shockwaves.
        for (var i = ripples.length - 1; i >= 0; i--) {
            ripples[i].age += dt;
            if (ripples[i].age >= RIPPLE_LIFE) ripples.splice(i, 1);
        }

        ctx.clearRect(0, 0, width, height);

        if (warpAmount < 0.005 && ripples.length === 0) {
            ctx.drawImage(srcCanvas, 0, 0);
            if (!isHovering && warpAmount < 0.001) {
                warpAmount = 0;
            }
        } else {
            drawDistorted();
        }

        updateFragments(dt);

        requestAnimationFrame(animate);
    }

    // --- FONT FIX ---
    // document.fonts.ready only waits for fonts that have already STARTED
    // loading. Bebas Neue isn't applied to any visible DOM element (only the
    // canvas uses it), so on a cold first visit the browser hasn't begun
    // fetching it and `ready` resolves against the fallback font — which is
    // why the title looked wrong until a refresh.
    //
    // Explicitly requesting the font with document.fonts.load() forces the
    // fetch and resolves only once the real face is available. We then
    // re-render whenever it finishes, with a guard so the first paint is
    // never left on the fallback.
    function start() {
        window.addEventListener('resize', resize);
        resize();
        lastTime = performance.now();
        animate();

        if (document.fonts && document.fonts.load) {
            var px = Math.round(getFontSize());
            // Kick off an explicit load of Bebas Neue at the size we draw at.
            document.fonts.load('400 ' + px + "px 'Bebas Neue'", TITLE).then(function () {
                // Re-render once the real typeface is guaranteed available.
                renderSource();
            }).catch(function () {
                renderSource();
            });

            // Belt-and-braces: also re-render when all font loading settles.
            document.fonts.ready.then(renderSource);
        }
    }

    if (document.fonts && document.fonts.ready) {
        // Wait for the font system to be ready, then start (start() itself
        // forces the Bebas Neue load and re-renders when it lands).
        document.fonts.ready.then(start);
    } else {
        // Fallback for older browsers
        window.addEventListener('load', start);
    }

})();
