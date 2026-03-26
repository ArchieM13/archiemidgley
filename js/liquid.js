/* ============================================
   LIQUID CURSOR EFFECT
   Dark viscous gel that trails behind the cursor,
   visible only through the cut-out title text.
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
    var MAX_BLOBS = 80;
    var animId;

    // --- Font settings (must match CSS) ---
    var FONT_FAMILY = "'Space Grotesk', 'Inter', sans-serif";
    var TITLE_TEXT = 'A.Midgley';

    function getColors() {
        var isDark = document.body.classList.contains('dark');
        return {
            bg: isDark ? '#111111' : '#FAFAFA',
            liquid: isDark ? 'rgba(170,170,175,' : 'rgba(20,20,25,',
            liquidSolid: isDark ? [170, 170, 175] : [20, 20, 25]
        };
    }

    function getFontSize() {
        // Match clamp(4rem, 14vw, 12rem)
        var vw = width / dpr * 0.14;
        var min = 64;  // 4rem
        var max = 192; // 12rem
        return Math.min(Math.max(vw, min), max) * dpr;
    }

    function resize() {
        width = canvas.offsetWidth * dpr;
        height = canvas.offsetHeight * dpr;
        canvas.width = width;
        canvas.height = height;
    }

    resize();
    window.addEventListener('resize', resize);

    // --- Blob class ---
    function Blob(x, y) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 2.5 * dpr;
        this.vy = (Math.random() - 0.5) * 2.5 * dpr;
        this.radius = (25 + Math.random() * 35) * dpr;
        this.life = 1.0;
        this.decay = 0.002 + Math.random() * 0.003;
    }

    Blob.prototype.update = function () {
        this.vy += 0.03 * dpr; // slight gravity
        this.vx *= 0.988;
        this.vy *= 0.988;
        this.x += this.vx;
        this.y += this.vy;
        this.life -= this.decay;
    };

    // --- Mouse tracking ---
    var heroSection = document.getElementById('hero');
    var lastSpawn = 0;

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

        var now = Date.now();
        if (now - lastSpawn > 20) {
            spawnBlobs(mouseX, mouseY, 2);
            lastSpawn = now;
        }
    }

    function onTouchMove(e) {
        var touch = e.touches[0];
        var coords = getCanvasCoords(touch.clientX, touch.clientY);
        mouseX = coords.x;
        mouseY = coords.y;

        var now = Date.now();
        if (now - lastSpawn > 20) {
            spawnBlobs(mouseX, mouseY, 2);
            lastSpawn = now;
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
                old.x = x + (Math.random() - 0.5) * 16 * dpr;
                old.y = y + (Math.random() - 0.5) * 16 * dpr;
                old.vx = (Math.random() - 0.5) * 2.5 * dpr;
                old.vy = (Math.random() - 0.5) * 2.5 * dpr;
                old.radius = (25 + Math.random() * 35) * dpr;
                old.life = 1.0;
                old.decay = 0.002 + Math.random() * 0.003;
                blobs.push(old);
            } else {
                blobs.push(new Blob(
                    x + (Math.random() - 0.5) * 16 * dpr,
                    y + (Math.random() - 0.5) * 16 * dpr
                ));
            }
        }
    }

    // --- Draw liquid blobs with metaball threshold ---
    function drawLiquid(targetCtx, w, h) {
        if (blobs.length === 0) return;

        // Render at half resolution for performance
        var scale = 0.5;
        var sw = Math.ceil(w * scale);
        var sh = Math.ceil(h * scale);

        var offCanvas = document.createElement('canvas');
        offCanvas.width = sw;
        offCanvas.height = sh;
        var offCtx = offCanvas.getContext('2d');

        var colors = getColors();
        var c = colors.liquidSolid;

        for (var i = 0; i < blobs.length; i++) {
            var b = blobs[i];
            if (b.life <= 0) continue;
            var alpha = b.life * 0.85;
            var r = b.radius * (0.5 + b.life * 0.5) * scale;
            var bx = b.x * scale;
            var by = b.y * scale;

            var grad = offCtx.createRadialGradient(bx, by, 0, bx, by, r);
            grad.addColorStop(0, 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + (alpha * 0.95) + ')');
            grad.addColorStop(0.4, 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + (alpha * 0.6) + ')');
            grad.addColorStop(1, 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',0)');
            offCtx.beginPath();
            offCtx.arc(bx, by, r, 0, Math.PI * 2);
            offCtx.fillStyle = grad;
            offCtx.fill();
        }

        // Threshold pass — create thick gel look
        var imageData = offCtx.getImageData(0, 0, sw, sh);
        var data = imageData.data;
        var threshold = 35;

        for (var j = 0; j < data.length; j += 4) {
            var a = data[j + 3];
            if (a > threshold) {
                var strength = Math.min((a - threshold) / 60, 1);
                data[j] = c[0];
                data[j + 1] = c[1];
                data[j + 2] = c[2];
                data[j + 3] = Math.floor(strength * 230);
            } else {
                data[j + 3] = 0;
            }
        }
        offCtx.putImageData(imageData, 0, 0);

        targetCtx.drawImage(offCanvas, 0, 0, w, h);
    }

    // --- Main animation loop ---
    function animate() {
        var colors = getColors();

        // 1) Clear canvas
        ctx.clearRect(0, 0, width, height);

        // 2) Draw the liquid blobs to an off-screen buffer
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

        // 3) Create text mask — draw text as the clipping shape
        var fontSize = getFontSize();
        ctx.save();

        // Draw text path for clipping
        ctx.font = '700 ' + fontSize + 'px ' + FONT_FAMILY;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Use the text as a clip region
        ctx.beginPath();
        // fillText doesn't create a path, so we use a trick:
        // Draw the liquid only where the text is, using 'source-over' compositing

        // Step A: Draw text filled solid
        ctx.fillStyle = colors.bg;
        ctx.fillText(TITLE_TEXT, width / 2, height / 2);

        // Step B: Draw liquid ONLY inside text using destination-in compositing
        // First draw liquid on top
        ctx.globalCompositeOperation = 'source-in';
        ctx.drawImage(liquidCanvas, 0, 0);

        ctx.restore();

        // 4) Now draw the text outline/stroke on top so letters are always visible
        ctx.save();
        ctx.font = '700 ' + fontSize + 'px ' + FONT_FAMILY;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.strokeStyle = colors.liquidSolid ? 'rgba(' + colors.liquidSolid[0] + ',' + colors.liquidSolid[1] + ',' + colors.liquidSolid[2] + ',0.15)' : 'rgba(20,20,25,0.15)';
        ctx.lineWidth = 1.5 * dpr;
        ctx.strokeText(TITLE_TEXT, width / 2, height / 2);
        ctx.restore();

        animId = requestAnimationFrame(animate);
    }

    animate();

})();
