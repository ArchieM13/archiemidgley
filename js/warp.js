/* ============================================
   TEXT WARP EFFECT
   Canvas-based mesh distortion on hero title.
   Cursor warps the actual shapes of the letters.
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
    var FONT_FAMILY = "'Space Grotesk', 'Inter', sans-serif";
    var LETTER_SPACING = 0.10; // em — moderate spacing so it fits on screen
    var STRETCH_Y = 1.35;      // Vertical stretch factor for taller characters

    // Mesh grid for distortion
    var COLS = 60;
    var ROWS = 30;

    // Warp parameters
    var RADIUS = 160;
    var STRENGTH = 40;

    // Smooth mouse tracking
    var mouseX = -9999, mouseY = -9999;
    var smoothX = -9999, smoothY = -9999;
    var isHovering = false;
    var warpAmount = 0;  // 0 = no warp, 1 = full warp
    var LERP = 0.12;
    var WARP_LERP = 0.08;

    // Source canvas — holds the undistorted text
    var srcCanvas = document.createElement('canvas');
    var srcCtx = srcCanvas.getContext('2d');

    function getColors() {
        var isDark = document.body.classList.contains('dark');
        return {
            text: isDark ? '#FAFAFA' : '#1A1A1A',
            bg: isDark ? '#111111' : '#FAFAFA'
        };
    }

    function getFontSize() {
        var vw = width / dpr;
        // clamp(3.5rem, 10vw, 9rem) — fits on screen with spacing
        var size = vw * 0.10;
        var min = 56;   // 3.5rem
        var max = 144;  // 9rem
        return Math.min(Math.max(size, min), max) * dpr;
    }

    // Draw text with manual letter-spacing
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
            context.strokeText(text[j], x + charWidths[j] / 2, cy);
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

        // Move to center, then apply vertical stretch
        srcCtx.translate(width / 2, height / 2);
        srcCtx.scale(1, STRETCH_Y);

        srcCtx.font = '700 ' + fontSize + 'px ' + FONT_FAMILY;
        srcCtx.textAlign = 'center';
        srcCtx.textBaseline = 'middle';

        // Fill
        srcCtx.fillStyle = colors.text;
        // Stroke — thicker outline
        srcCtx.strokeStyle = colors.text;
        srcCtx.lineWidth = 2.5 * dpr;
        srcCtx.lineJoin = 'round';

        drawSpacedText(srcCtx, TITLE, 0, 0, fontSize);

        srcCtx.restore();
    }

    function resize() {
        width = canvas.offsetWidth * dpr;
        height = canvas.offsetHeight * dpr;
        canvas.width = width;
        canvas.height = height;
        renderSource();
    }

    resize();
    window.addEventListener('resize', function () {
        resize();
    });

    // Watch for dark mode changes to re-render source
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

    // --- Mesh distortion rendering ---
    function drawDistorted() {
        var cellW = width / COLS;
        var cellH = height / ROWS;
        var radius = RADIUS * dpr;
        var strength = STRENGTH * dpr * warpAmount;

        for (var row = 0; row < ROWS; row++) {
            for (var col = 0; col < COLS; col++) {
                var destX = col * cellW;
                var destY = row * cellH;

                // Center of this cell
                var cx = destX + cellW / 2;
                var cy = destY + cellH / 2;

                // Distance from smoothed cursor
                var dx = cx - smoothX;
                var dy = cy - smoothY;
                var dist = Math.sqrt(dx * dx + dy * dy);

                // Calculate inverse displacement (where to sample from)
                var offsetX = 0, offsetY = 0;
                if (dist < radius && dist > 0) {
                    var factor = 1 - (dist / radius);
                    factor = factor * factor * factor; // Cubic falloff — very smooth
                    var angle = Math.atan2(dy, dx);
                    // Inverse: sample from closer to cursor to make text appear pushed away
                    offsetX = -Math.cos(angle) * strength * factor;
                    offsetY = -Math.sin(angle) * strength * factor;
                }

                var srcX = destX + offsetX;
                var srcY = destY + offsetY;

                // Clamp source coordinates
                srcX = Math.max(0, Math.min(width - cellW, srcX));
                srcY = Math.max(0, Math.min(height - cellH, srcY));

                // Skip if source cell is empty (optimization)
                ctx.drawImage(
                    srcCanvas,
                    srcX, srcY, cellW + 1, cellH + 1,
                    destX, destY, cellW + 1, cellH + 1
                );
            }
        }
    }

    // --- Animation loop ---
    var animId = null;
    var needsRender = true;

    function animate() {
        // Smooth mouse position
        if (isHovering) {
            smoothX += (mouseX - smoothX) * LERP;
            smoothY += (mouseY - smoothY) * LERP;
            warpAmount += (1 - warpAmount) * WARP_LERP;
        } else {
            warpAmount += (0 - warpAmount) * WARP_LERP;
        }

        ctx.clearRect(0, 0, width, height);

        if (warpAmount < 0.005) {
            // No distortion — draw source directly
            ctx.drawImage(srcCanvas, 0, 0);

            if (!isHovering && warpAmount < 0.001) {
                warpAmount = 0;
                animId = requestAnimationFrame(animate);
                return;
            }
        } else {
            drawDistorted();
        }

        animId = requestAnimationFrame(animate);
    }

    // Start the loop
    animate();

})();
