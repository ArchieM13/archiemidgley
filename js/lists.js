/* ============================================
   EXPERIENCE + PROJECTS INTERACTIONS
   - Experience: a preview card follows the cursor over the index list,
     swinging with the cursor's speed. Touch screens expand rows instead.
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
    var preview = document.getElementById('xpPreview');

    if (list && preview) {
        var rows = Array.prototype.slice.call(list.querySelectorAll('.xp__row'));
        var media = document.getElementById('xpPreviewMedia');
        var desc = document.getElementById('xpPreviewDesc');
        var tags = document.getElementById('xpPreviewTags');

        // Sections are transformed, which would trap a fixed element; the
        // preview has to live on <body> to track the viewport.
        document.body.appendChild(preview);

        var imgs = rows.map(function (row) {
            var src = row.querySelector('.xp__thumb');
            var img = document.createElement('img');
            img.src = src.getAttribute('src');
            img.alt = '';
            media.appendChild(img);
            return img;
        });

        var targetX = 0, targetY = 0, x = 0, y = 0, lastX = 0, tilt = 0;
        var active = -1, visible = false, running = false;

        function show(index) {
            var row = rows[index];
            if (index !== active) {
                if (active >= 0) imgs[active].classList.remove('is-active');
                imgs[index].classList.add('is-active');
                desc.textContent = row.querySelector('.xp__desc').textContent;
                tags.innerHTML = row.querySelector('.xp__tags').innerHTML;
                active = index;
            }
            if (!visible) {
                // Appear at the cursor rather than flying in from the last spot.
                x = targetX; y = targetY; lastX = x;
                visible = true;
                preview.classList.add('is-visible');
            }
            if (!running) { running = true; requestAnimationFrame(tick); }
        }

        function hide() {
            visible = false;
            preview.classList.remove('is-visible');
        }

        function tick() {
            x += (targetX - x) * 0.14;
            y += (targetY - y) * 0.14;
            var vx = x - lastX;
            lastX = x;
            tilt += (Math.max(-14, Math.min(14, vx * 0.6)) - tilt) * 0.12;

            var w = preview.offsetWidth, h = preview.offsetHeight;
            // Sit to the right of the cursor; flip left near the right edge.
            var px = x + 32 + w > window.innerWidth - 16 ? x - w - 32 : x + 32;
            var py = Math.max(16, Math.min(window.innerHeight - h - 16, y - h / 2));
            preview.style.transform = 'translate3d(' + px + 'px,' + py + 'px,0) rotate(' + tilt.toFixed(2) + 'deg)';

            if (visible || Math.abs(tilt) > 0.05) {
                requestAnimationFrame(tick);
            } else {
                running = false;
            }
        }

        rows.forEach(function (row, i) {
            row.addEventListener('mouseenter', function () {
                if (usePreview()) show(i);
            });

            // Touch / narrow screens: the first tap opens a row, a second tap
            // on an open link row follows it.
            row.addEventListener('click', function (e) {
                if (usePreview()) return;
                var isOpen = row.classList.contains('is-open');
                if (isOpen && row.tagName === 'A') return;
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

        list.addEventListener('mousemove', function (e) {
            targetX = e.clientX;
            targetY = e.clientY;
        });
        list.addEventListener('mouseleave', hide);

        // Section changes and scrolling move rows out from under the cursor.
        document.addEventListener('wheel', function () {
            if (visible && !list.matches(':hover')) hide();
        }, { passive: true });
        window.addEventListener('blur', hide);
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
