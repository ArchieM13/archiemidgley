/* ============================================
   EXPERIENCE + PROJECTS INTERACTIONS
   - Experience: a small photo glides along the hovered row, following the
     cursor. Touch screens (and entries without a page) expand rows instead.
   - Projects: cards tilt towards the cursor with a glare highlight and
     the image drifting against the tilt.
   ============================================ */

(function () {
    'use strict';

    var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    var wideScreen = window.matchMedia('(min-width: 769px)');
    function usePreview() { return finePointer.matches && wideScreen.matches; }

    // --- Experience index ---
    var list = document.getElementById('xpList');

    if (list) {
        var rows = Array.prototype.slice.call(list.querySelectorAll('.xp__row'));
        var FLOAT_W = 150, GAP = 24;

        rows.forEach(function (row) {
            // Each row gets a small photo that glides through the empty gap
            // between the company name and the role column.
            var float = document.createElement('div');
            float.className = 'xp__float';
            float.setAttribute('aria-hidden', 'true');
            var img = document.createElement('img');
            img.src = row.querySelector('.xp__thumb').getAttribute('src');
            img.alt = '';
            float.appendChild(img);
            row.appendChild(float);

            var company = row.querySelector('.xp__company');
            var role = row.querySelector('.xp__role');
            var date = row.querySelector('.xp__date');
            var x = 0, target = 0, tilt = 0, min = 0, max = 0, hovering = false, running = false;

            function measure() {
                var r = row.getBoundingClientRect();
                var right = role.offsetParent ? role : date;
                var c = company.getBoundingClientRect();
                min = c.right - r.left + GAP;
                // Centre on the title line, not the row (which grows when open).
                float.style.top = (c.top + c.height / 2 - r.top).toFixed(1) + 'px';
                max = right.getBoundingClientRect().left - r.left - FLOAT_W - GAP;
                if (max < min) max = min;
            }

            function tick() {
                var prev = x;
                x += (target - x) * 0.16;
                tilt += (Math.max(-8, Math.min(8, (x - prev) * 0.5)) - tilt) * 0.15;
                float.style.setProperty('--fx', x.toFixed(1) + 'px');
                float.style.setProperty('--fr', tilt.toFixed(2) + 'deg');
                if (hovering || Math.abs(target - x) > 0.5 || Math.abs(tilt) > 0.05) {
                    requestAnimationFrame(tick);
                } else {
                    running = false;
                }
            }

            function follow(clientX) {
                var r = row.getBoundingClientRect();
                target = Math.max(min, Math.min(max, clientX - r.left - FLOAT_W / 2));
                if (!running) { running = true; requestAnimationFrame(tick); }
            }

            row.addEventListener('mouseenter', function (e) {
                if (!usePreview()) return;
                measure();
                hovering = true;
                // Start where the cursor is rather than sliding in from the left.
                follow(e.clientX);
                x = target;
                row.classList.add('is-floating');
            });

            row.addEventListener('mousemove', function (e) {
                if (hovering) follow(e.clientX);
            });

            row.addEventListener('mouseleave', function () {
                hovering = false;
                row.classList.remove('is-floating');
            });

            // Touch / narrow screens: the first tap opens a row, a second tap
            // on an open link row follows it. On desktop, entries without
            // their own page open their description on click.
            row.addEventListener('click', function (e) {
                var isLink = row.tagName === 'A';
                if (usePreview() && isLink) return;
                var isOpen = row.classList.contains('is-open');
                if (isOpen && isLink) return;
                e.preventDefault();
                rows.forEach(function (r) { if (r !== row) r.classList.remove('is-open'); });
                row.classList.toggle('is-open', !isOpen);
            });

            row.addEventListener('keydown', function (e) {
                if (row.tagName !== 'A' && (e.key === 'Enter' || e.key === ' ')) {
                    e.preventDefault();
                    row.classList.toggle('is-open');
                }
            });
        });
    }

    // --- Project tilt cards ---
    var cards = document.querySelectorAll('.project__card');
    Array.prototype.forEach.call(cards, function (card) {
        var inner = card.querySelector('.project__inner');
        if (!inner) return;

        card.addEventListener('mousemove', function (e) {
            if (!finePointer.matches) return;
            var r = card.getBoundingClientRect();
            var px = (e.clientX - r.left) / r.width;
            var py = (e.clientY - r.top) / r.height;
            card.classList.add('is-tilting');
            inner.style.setProperty('--ry', ((px - 0.5) * 9).toFixed(2) + 'deg');
            inner.style.setProperty('--rx', ((0.5 - py) * 7).toFixed(2) + 'deg');
            inner.style.setProperty('--gx', (px * 100).toFixed(1) + '%');
            inner.style.setProperty('--gy', (py * 100).toFixed(1) + '%');
            inner.style.setProperty('--tx', ((0.5 - px) * 14).toFixed(1) + 'px');
            inner.style.setProperty('--ty', ((0.5 - py) * 14).toFixed(1) + 'px');
        });

        card.addEventListener('mouseleave', function () {
            card.classList.remove('is-tilting');
            ['--rx', '--ry', '--tx', '--ty'].forEach(function (p) { inner.style.removeProperty(p); });
        });
    });

})();
