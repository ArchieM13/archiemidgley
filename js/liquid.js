/* ============================================
   LIQUID CURSOR EFFECT
   Ferro-fluid style viscous liquid visible
   only through cut-out title text.
   ============================================ */

(function () {
    'use strict';

    var canvas = document.getElementById('heroCanvas');
    if (!canvas) return;

    var ctx = canvas.getContext('2d');
    var dpr = window.devicePixelRatio || 1;
    var width, height;
    var mouseX = -9999, mouseY = -9999;
    var blobs = [];
    var MAX_BLOBS = 100;
    var animId;

    // --- Font settings ---
    var FONT_FAMILY = "'Space Grotesk', 'Inter', sans-serif";
    var TITLE_TEXT = 'A.Midgley';
    var LETTER_SPACING = 0.18; // em units

    // Text bounding box (canvas coords) — updated on resize
    var textBounds = { x: 0, y: 0, w: 0, h: 0 };

    function getColors() {
        var isDark = document.body.classList.contains('dark');
        return {
            bg: isDark ? '#111111' : '#FAFAFA',
            liquid: isDark ? 'rgba(170,170,175,' : 'rgba(20,20,25,',
            liquidSolid: isDark ? [170, 170, 175] : [20, 20, 25],
            highlight: isDark ? [220, 220, 225] : [60, 60, 65],
            shadow: isDark ? [80, 80, 85] : [5, 5, 10],
            outlineAlpha: isDark ? 0.35 : 0.28,
            shadowAlpha: isDark ? 0.12 : 0.08
        };
    }

    function getFontSize() {
        // Larger text: clamp(5rem, 16vw, 15rem)
        var vw = width / dpr * 0.16;
        var min = 80;   // 5rem
        var max = 240;  // 15rem
        return Math.min(Math.max(vw, min), max) * dpr;
    }

    // Draw text with letter-spacing (canvas doesn't support it natively)
    function drawTextSpaced(context, text, x, y, spacing, method) {
        var fontSize = getFontSize();
        var spacingPx = spacing * fontSize;

        // Measure total width with spacing
        var totalWidth = 0;
        for (var i = 0; i < text.length; i++) {
            totalWidth += context.measureText(text[i]).width;
            if (i < text.length - 1) totalWidth += spacingPx;
        }

        var startX = x - totalWidth / 2;
        for (var j = 0; j < text.length; j++) {
            var charW = context.measureText(text[j]).width;
            if (method === 'fill') {
                context.fillText(text[j], startX + charW / 2, y);
            } else if (method === 'stroke') {
                context.strokeText(text[j], startX + charW / 2, y);
            }
            startX += charW + spacingPx;
        }

        // Return total width for bounding box
        return totalWidth;
    }

    function updateTextBounds() {
        var fontSize = getFontSize();
        ctx.font = '700 ' + fontSize + 'px ' + FONT_FAMILY;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        var spacingPx = LETTER_SPACING * fontSize;
        var totalWidth = 0;
        for (var i = 0; i < TITLE_TEXT.length; i++) {
            totalWidth += ctx.measureText(TITLE_TEXT[i]).width;
            if (i < TITLE_TEXT.length - 1) totalWidth += spacingPx;
        }

        var cx = width / 2;
        var cy = height / 2;
        var margin = fontSize * 0.15;
        textBounds.x = cx - totalWidth / 2 - margin;
        textBounds.y = cy - fontSize * 0.55 - margin;
        textBounds.w = totalWidth + margin * 2;
        textBounds.h = fontSize * 1.1 + margin * 2;
    }

    function isInTextArea(px, py) {
        return px >= textBounds.x && px <= textBounds.x + textBounds.w &&
               py >= textBounds.y && py <= textBounds.y + textBounds.h;
    }

    function resize() {
        width = canvas.offsetWidth * dpr;
        height = canvas.offsetHeight * dpr;
        canvas.width = width;
        canvas.height = height;
        updateTextBounds();
    }

    resize();
    window.addEventListener('resize', resize);

    // --- Blob class (no gravity, stays in place) ---
    function Blob(x, y) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 1.8 * dpr;
        this.vy = (Math.random() - 0.5) * 1.8 * dpr;
        this.radius = (20 + Math.random() * 30) * dpr;
        this.life = 1.0;
        this.decay = 0.003 + Math.random() * 0.004;
    }

    Blob.prototype.update = function () {
        // No gravity — liquid stays where cursor places it
        this.vx *= 0.975;
        this.vy *= 0.975;
        this.x += this.vx;
        this.y += this.vy;
        this.life -= this.decay;
    };

    // --- Mouse tracking ---
    var heroSection = document.getElementById('hero');
    var lastSpawn = 0;
    var prevMouseX = -9999, prevMouseY = -9999;

    function getCanvasCoords(clientX, clientY) {
        var rect = canvas.getBoundingClientRect();
        return {
            x: (clientX - rect.left) * dpr,
            y: (clientY - rect.top) * dpr
        };
    }

    function onMouseMove(e) {
        var coords = getCanvasCoords(e.clientX, e.clientY);
        mouseX = coords.x;
        mouseY = coords.y;

        // Only spawn blobs when cursor is within the text area
        if (!isInTextArea(mouseX, mouseY)) {
            prevMouseX = mouseX;
            prevMouseY = mouseY;
            return;
        }

        var now = Date.now();
        // Check if cursor actually moved enough
        var dx = mouseX - prevMouseX;
        var dy = mouseY - prevMouseY;
        var dist = Math.sqrt(dx * dx + dy * dy);

        if (now - lastSpawn > 18 && dist > 2 * dpr) {
            spawnBlobs(mouseX, mouseY, 3);
            lastSpawn = now;
            prevMouseX = mouseX;
            prevMouseY = mouseY;
        }
    }

    function onTouchMove(e) {
        var touch = e.touches[0];
        var coords = getCanvasCoords(touch.clientX, touch.clientY);
        mouseX = coords.x;
        mouseY = coords.y;

        if (!isInTextArea(mouseX, mouseY)) {
            prevMouseX = mouseX;
            prevMouseY = mouseY;
            return;
        }

        var now = Date.now();
        var dx = mouseX - prevMouseX;
        var dy = mouseY - prevMouseY;
        var dist = Math.sqrt(dx * dx + dy * dy);

        if (now - lastSpawn > 18 && dist > 2 * dpr) {
            spawnBlobs(mouseX, mouseY, 3);
            lastSpawn = now;
            prevMouseX = mouseX;
            prevMouseY = mouseY;
        }
    }

    if (heroSection) {
        heroSection.addEventListener('mousemove', onMouseMove);
        heroSection.addEventListener('touchmove', onTouchMove, { passive: true });
    }

    function spawnBlobs(x, y, count) {
        for (var i = 0; i < count; i++) {
            if (blobs.length >= MAX_BLOBS) {
                var old = blobs.shift();
                old.x = x + (Math.random() - 0.5) * 14 * dpr;
                old.y = y + (Math.random() - 0.5) * 14 * dpr;
                old.vx = (Math.random() - 0.5) * 1.8 * dpr;
                old.vy = (Math.random() - 0.5) * 1.8 * dpr;
                old.radius = (20 + Math.random() * 30) * dpr;
                old.life = 1.0;
                old.decay = 0.003 + Math.random() * 0.004;
                blobs.push(old);
            } else {
                blobs.push(new Blob(
                    x + (Math.random() - 0.5) * 14 * dpr,
                    y + (Math.random() - 0.5) * 14 * dpr
                ));
            }
        }
    }

    // --- Draw ferro-fluid liquid with 3D depth ---
    function drawLiquid(targetCtx, w, h) {
        if (blobs.length === 0) return;

        var scale = 0.5;
        var sw = Math.ceil(w * scale);
        var sh = Math.ceil(h * scale);

        var offCanvas = document.createElement('canvas');
        offCanvas.width = sw;
        offCanvas.height = sh;
        var offCtx = offCanvas.getContext('2d');

        var colors = getColors();
        var c = colors.liquidSolid;

        // Draw blob field
        for (var i = 0; i < blobs.length; i++) {
            var b = blobs[i];
            if (b.life <= 0) continue;
            var alpha = b.life * 0.9;
            var r = b.radius * (0.6 + b.life * 0.4) * scale;
            var bx = b.x * scale;
            var by = b.y * scale;

            var grad = offCtx.createRadialGradient(bx, by, 0, bx, by, r);
            grad.addColorStop(0, 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + (alpha * 0.98) + ')');
            grad.addColorStop(0.3, 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + (alpha * 0.7) + ')');
            grad.addColorStop(0.7, 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + (alpha * 0.3) + ')');
            grad.addColorStop(1, 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',0)');
            offCtx.beginPath();
            offCtx.arc(bx, by, r, 0, Math.PI * 2);
            offCtx.fillStyle = grad;
            offCtx.fill();
        }

        // Threshold pass — sharp blobby edges like ferro fluid
        var imageData = offCtx.getImageData(0, 0, sw, sh);
        var data = imageData.data;
        var threshold = 38;

        var hi = colors.highlight;
        var sh2 = colors.shadow;

        for (var j = 0; j < data.length; j += 4) {
            var a = data[j + 3];
            if (a > threshold) {
                var strength = Math.min((a - threshold) / 50, 1);
                // Ferro fluid 3D effect: lighter towards center, darker at edges
                var coreBlend = Math.pow(strength, 0.6);
                var r2 = Math.floor(c[0] * (1 - coreBlend * 0.15) + hi[0] * coreBlend * 0.15);
                var g2 = Math.floor(c[1] * (1 - coreBlend * 0.15) + hi[1] * coreBlend * 0.15);
                var b2 = Math.floor(c[2] * (1 - coreBlend * 0.15) + hi[2] * coreBlend * 0.15);

                data[j] = r2;
                data[j + 1] = g2;
                data[j + 2] = b2;
                data[j + 3] = Math.floor(strength * 240);
            } else {
                data[j + 3] = 0;
            }
        }
        offCtx.putImageData(imageData, 0, 0);

        // Add highlight pass for 3D glossy ferro-fluid look
        var hlCanvas = document.createElement('canvas');
        hlCanvas.width = sw;
        hlCanvas.height = sh;
        var hlCtx = hlCanvas.getContext('2d');

        for (var k = 0; k < blobs.length; k++) {
            var bl = blobs[k];
            if (bl.life <= 0.2) continue;
            var hlR = bl.radius * 0.35 * scale;
            var hlX = bl.x * scale - bl.radius * 0.12 * scale;
            var hlY = bl.y * scale - bl.radius * 0.15 * scale;
            var hlAlpha = bl.life * 0.25;

            var hlGrad = hlCtx.createRadialGradient(hlX, hlY, 0, hlX, hlY, hlR);
            hlGrad.addColorStop(0, 'rgba(255,255,255,' + hlAlpha + ')');
            hlGrad.addColorStop(1, 'rgba(255,255,255,0)');
            hlCtx.beginPath();
            hlCtx.arc(hlX, hlY, hlR, 0, Math.PI * 2);
            hlCtx.fillStyle = hlGrad;
            hlCtx.fill();
        }

        // Composite highlight onto liquid using destination-atop
        offCtx.globalCompositeOperation = 'source-atop';
        offCtx.drawImage(hlCanvas, 0, 0);

        targetCtx.drawImage(offCanvas, 0, 0, w, h);
    }

    // --- Main animation loop ---
    function animate() {
        var colors = getColors();

        // 1) Clear canvas
        ctx.clearRect(0, 0, width, height);

        // 2) Prepare liquid buffer
        var liquidCanvas = document.createElement('canvas');
        liquidCanvas.width = width;
        liquidCanvas.height = height;
        var liquidCtx = liquidCanvas.getContext('2d');

        // Update blobs
        for (var i = blobs.length - 1; i >= 0; i--) {
            blobs[i].update();
            if (blobs[i].life <= 0) {
                blobs.splice(i, 1);
            }
        }

        drawLiquid(liquidCtx, width, height);

        // 3) Draw text as the clipping mask
        var fontSize = getFontSize();
        ctx.save();
        ctx.font = '700 ' + fontSize + 'px ' + FONT_FAMILY;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Step A: Fill text solid (will be replaced by liquid where liquid exists)
        ctx.fillStyle = colors.bg;
        drawTextSpaced(ctx, TITLE_TEXT, width / 2, height / 2, LETTER_SPACING, 'fill');

        // Step B: Clip liquid to text shape
        ctx.globalCompositeOperation = 'source-in';
        ctx.drawImage(liquidCanvas, 0, 0);
        ctx.restore();

        // 4) Draw 3D cut-out effect — subtle inner shadow
        ctx.save();
        ctx.font = '700 ' + fontSize + 'px ' + FONT_FAMILY;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Outer shadow layer (subtle depth)
        ctx.shadowColor = 'rgba(0,0,0,' + colors.shadowAlpha + ')';
        ctx.shadowBlur = 4 * dpr;
        ctx.shadowOffsetX = 1 * dpr;
        ctx.shadowOffsetY = 2 * dpr;

        // Stroke for outline — more visible
        var c = colors.liquidSolid;
        ctx.strokeStyle = 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + colors.outlineAlpha + ')';
        ctx.lineWidth = 1.8 * dpr;
        drawTextSpaced(ctx, TITLE_TEXT, width / 2, height / 2, LETTER_SPACING, 'stroke');
        ctx.restore();

        // 5) Inner highlight edge (top-left light for 3D inset look)
        ctx.save();
        ctx.font = '700 ' + fontSize + 'px ' + FONT_FAMILY;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.strokeStyle = 'rgba(255,255,255,' + (colors.shadowAlpha * 0.6) + ')';
        ctx.lineWidth = 0.8 * dpr;
        ctx.shadowColor = 'rgba(255,255,255,' + (colors.shadowAlpha * 0.4) + ')';
        ctx.shadowBlur = 2 * dpr;
        ctx.shadowOffsetX = -0.5 * dpr;
        ctx.shadowOffsetY = -0.5 * dpr;
        drawTextSpaced(ctx, TITLE_TEXT, width / 2, height / 2, LETTER_SPACING, 'stroke');
        ctx.restore();

        animId = requestAnimationFrame(animate);
    }

    animate();

})();
