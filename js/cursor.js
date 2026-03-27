/* ============================================
   CUSTOM CURSOR
   Small circle that enlarges and turns orange
   when hovering over interactive elements.
   ============================================ */

(function () {
    'use strict';

    // Don't init on touch-only devices
    if ('ontouchstart' in window && !window.matchMedia('(pointer: fine)').matches) return;

    // Create cursor element
    var cursor = document.createElement('div');
    cursor.className = 'cursor';
    document.body.appendChild(cursor);

    var mouseX = -100, mouseY = -100;
    var cursorX = -100, cursorY = -100;
    var LERP = 0.18;

    // Selectors for clickable/interactive elements
    var HOVER_SELECTORS = 'a, button, [role="button"], .nav__logo, .menu__link, .progress__dot, .theme-switcher__btn, .project__card, .experience__item--link, input, select, textarea, label';

    function onMouseMove(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
    }

    function onMouseLeave() {
        cursor.classList.add('cursor--hidden');
    }

    function onMouseEnter() {
        cursor.classList.remove('cursor--hidden');
    }

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    // Track hover state via mouseover/mouseout on document
    document.addEventListener('mouseover', function (e) {
        if (e.target.closest(HOVER_SELECTORS)) {
            cursor.classList.add('cursor--hover');
        }
    });

    document.addEventListener('mouseout', function (e) {
        if (e.target.closest(HOVER_SELECTORS)) {
            cursor.classList.remove('cursor--hover');
        }
    });

    // Smooth follow loop
    function animate() {
        cursorX += (mouseX - cursorX) * LERP;
        cursorY += (mouseY - cursorY) * LERP;
        cursor.style.transform = 'translate(' + (cursorX - (cursor.offsetWidth / 2)) + 'px, ' + (cursorY - (cursor.offsetHeight / 2)) + 'px)';
        requestAnimationFrame(animate);
    }

    animate();

})();
