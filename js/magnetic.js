/* ============================================
   MAGNETIC ELEMENTS
   Elements marked data-magnetic lean towards the cursor as it gets close,
   then spring back. data-magnetic="0.4" sets the pull strength (default
   0.3). Uses the CSS `translate` property, so it layers on top of any
   existing transform or hover effect. Desktop (fine pointer) only.
   ============================================ */

(function () {
    'use strict';

    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    var REACH = 70;      // css px beyond the element's edge where the pull starts
    var LERP = 0.15;

    var items = Array.prototype.map.call(document.querySelectorAll('[data-magnetic]'), function (el) {
        return { el: el, strength: parseFloat(el.getAttribute('data-magnetic')) || 0.3, x: 0, y: 0, tx: 0, ty: 0 };
    });
    if (!items.length) return;

    var running = false;

    function onMove(e) {
        items.forEach(function (it) {
            var r = it.el.getBoundingClientRect();
            if (!r.width) { it.tx = it.ty = 0; return; }   // hidden (e.g. inactive section)
            var cx = r.left + r.width / 2, cy = r.top + r.height / 2;
            var dx = e.clientX - cx, dy = e.clientY - cy;
            var reach = Math.max(r.width, r.height) / 2 + REACH;
            var d = Math.sqrt(dx * dx + dy * dy);
            var f = d < reach ? 1 - d / reach : 0;
            it.tx = dx * it.strength * f;
            it.ty = dy * it.strength * f;
        });
        if (!running) { running = true; requestAnimationFrame(tick); }
    }

    function tick() {
        var moving = false;
        items.forEach(function (it) {
            it.x += (it.tx - it.x) * LERP;
            it.y += (it.ty - it.y) * LERP;
            if (Math.abs(it.tx - it.x) > 0.05 || Math.abs(it.ty - it.y) > 0.05) moving = true;
            it.el.style.translate = it.x.toFixed(2) + 'px ' + it.y.toFixed(2) + 'px';
        });
        if (moving) requestAnimationFrame(tick); else running = false;
    }

    document.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseleave', function () {
        items.forEach(function (it) { it.tx = it.ty = 0; });
        if (!running) { running = true; requestAnimationFrame(tick); }
    });
})();
