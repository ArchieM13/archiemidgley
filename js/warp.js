/* ============================================
   TEXT WARP EFFECT
   Smooth cursor-driven displacement on hero title.
   Each character warps away from the cursor position.
   ============================================ */

(function () {
    'use strict';

    var TITLE_TEXT = 'A.Midgley';
    var heroTitle = document.getElementById('heroTitle');
    var heroArea = document.getElementById('heroArea');
    if (!heroTitle || !heroArea) return;

    // --- Split text into individual character spans ---
    var chars = [];
    for (var i = 0; i < TITLE_TEXT.length; i++) {
        var span = document.createElement('span');
        span.className = 'hero__char';
        span.textContent = TITLE_TEXT[i];
        heroTitle.appendChild(span);
        chars.push({
            el: span,
            currentX: 0,
            currentY: 0,
            targetX: 0,
            targetY: 0
        });
    }

    // --- Warp settings ---
    var RADIUS = 220;       // Influence radius in px
    var STRENGTH = 45;      // Max displacement in px
    var LERP = 0.12;        // Smoothing factor (lower = smoother, slower)
    var RESTORE_LERP = 0.08; // How fast chars return to rest

    var mouseX = -9999;
    var mouseY = -9999;
    var isHovering = false;
    var animId = null;

    // --- Mouse tracking ---
    function onMouseMove(e) {
        var rect = heroArea.getBoundingClientRect();
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;
        isHovering = true;
    }

    function onMouseLeave() {
        isHovering = false;
    }

    heroArea.addEventListener('mousemove', onMouseMove);
    heroArea.addEventListener('mouseleave', onMouseLeave);

    // Touch support
    heroArea.addEventListener('touchmove', function (e) {
        var touch = e.touches[0];
        var rect = heroArea.getBoundingClientRect();
        mouseX = touch.clientX - rect.left;
        mouseY = touch.clientY - rect.top;
        isHovering = true;
    }, { passive: true });

    heroArea.addEventListener('touchend', function () {
        isHovering = false;
    });

    // --- Animation loop ---
    function animate() {
        var allSettled = true;

        for (var i = 0; i < chars.length; i++) {
            var c = chars[i];
            var el = c.el;
            var rect = el.getBoundingClientRect();
            var heroRect = heroArea.getBoundingClientRect();

            // Character center relative to hero
            var cx = rect.left - heroRect.left + rect.width / 2;
            var cy = rect.top - heroRect.top + rect.height / 2;

            if (isHovering) {
                var dx = cx - mouseX;
                var dy = cy - mouseY;
                var dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < RADIUS && dist > 0) {
                    // Displacement falls off smoothly
                    var factor = 1 - (dist / RADIUS);
                    factor = factor * factor; // Quadratic falloff for smoother feel
                    var angle = Math.atan2(dy, dx);
                    c.targetX = Math.cos(angle) * STRENGTH * factor;
                    c.targetY = Math.sin(angle) * STRENGTH * factor;
                } else {
                    c.targetX = 0;
                    c.targetY = 0;
                }

                c.currentX += (c.targetX - c.currentX) * LERP;
                c.currentY += (c.targetY - c.currentY) * LERP;
            } else {
                // Smoothly restore to zero
                c.targetX = 0;
                c.targetY = 0;
                c.currentX += (0 - c.currentX) * RESTORE_LERP;
                c.currentY += (0 - c.currentY) * RESTORE_LERP;
            }

            // Check if still moving
            if (Math.abs(c.currentX) > 0.05 || Math.abs(c.currentY) > 0.05 ||
                Math.abs(c.targetX) > 0.05 || Math.abs(c.targetY) > 0.05) {
                allSettled = false;
            }

            el.style.transform = 'translate(' + c.currentX.toFixed(2) + 'px, ' + c.currentY.toFixed(2) + 'px)';
        }

        if (allSettled && !isHovering) {
            // Everything is at rest — stop the loop
            for (var j = 0; j < chars.length; j++) {
                chars[j].currentX = 0;
                chars[j].currentY = 0;
                chars[j].el.style.transform = '';
            }
            animId = null;
            return;
        }

        animId = requestAnimationFrame(animate);
    }

    // Start animation when mouse enters, keep running until settled
    heroArea.addEventListener('mouseenter', function () {
        if (!animId) {
            animId = requestAnimationFrame(animate);
        }
    });

    heroArea.addEventListener('mousemove', function () {
        if (!animId) {
            animId = requestAnimationFrame(animate);
        }
    });

    heroArea.addEventListener('touchstart', function () {
        if (!animId) {
            animId = requestAnimationFrame(animate);
        }
    }, { passive: true });

})();
