/* ============================================
   PORTFOLIO — Main JavaScript
   Navigation, Transitions, Interactions
   ============================================ */

(function () {
    'use strict';

    // --- DOM Elements ---
    var menuToggle = document.getElementById('menuToggle');
    var menu = document.getElementById('menu');
    var menuLinks = document.querySelectorAll('.menu__link');
    var sections = document.querySelectorAll('.section');
    var sectionLabel = document.getElementById('sectionLabel');
    var progressDots = document.querySelectorAll('.progress__dot');
    var progressFill = document.getElementById('progressFill');

    // SVG icon bars
    var barLeft  = document.querySelector('.bar--left');
    var barRight = document.querySelector('.bar--right');
    var barCross = document.querySelector('.bar--cross');

    var sectionNames = ['A.Midgley', 'About', 'Experience', 'Projects', 'Contact'];
    var currentSection = 0;
    var isMenuOpen = false;
    var isTransitioning = false;
    var touchStartY = 0;
    var touchEndY = 0;

    // --- Hamburger ↔ "A" icon coordinates ---
    // Hamburger (three horizontal lines)
    var hamburger = {
        left:  { x1: 8,  y1: 28, x2: 32, y2: 28 },
        right: { x1: 8,  y1: 20, x2: 32, y2: 20 },
        cross: { x1: 8,  y1: 12, x2: 32, y2: 12 }
    };
    // "A" shape: two angled legs + one crossbar
    var letterA = {
        left:  { x1: 10, y1: 30, x2: 20, y2: 8 },   // left leg
        right: { x1: 30, y1: 30, x2: 20, y2: 8 },   // right leg
        cross: { x1: 13, y1: 22, x2: 27, y2: 22 }   // crossbar
    };

    // --- Initialize ---
    function init() {
        setActiveSection(0, false);
        document.body.classList.add('hero-active');
        bindEvents();
    }

    // --- Animate icon between hamburger ↔ "A" ---
    function animateIcon(opening) {
        var target = opening ? letterA : hamburger;
        var duration = 500;
        var easing = function (t) {
            // cubic-bezier(0.16, 1, 0.3, 1) approximation — spring-like
            return 1 - Math.pow(1 - t, 4);
        };

        animateLine(barLeft,  target.left, duration, easing);
        animateLine(barRight, target.right, duration, easing);
        animateLine(barCross, target.cross, duration, easing);
    }

    function animateLine(el, targetCoords, duration, easing) {
        var startCoords = {
            x1: parseFloat(el.getAttribute('x1')),
            y1: parseFloat(el.getAttribute('y1')),
            x2: parseFloat(el.getAttribute('x2')),
            y2: parseFloat(el.getAttribute('y2'))
        };
        var startTime = null;

        function tick(timestamp) {
            if (!startTime) startTime = timestamp;
            var elapsed = timestamp - startTime;
            var progress = Math.min(elapsed / duration, 1);
            var easedProgress = easing(progress);

            el.setAttribute('x1', startCoords.x1 + (targetCoords.x1 - startCoords.x1) * easedProgress);
            el.setAttribute('y1', startCoords.y1 + (targetCoords.y1 - startCoords.y1) * easedProgress);
            el.setAttribute('x2', startCoords.x2 + (targetCoords.x2 - startCoords.x2) * easedProgress);
            el.setAttribute('y2', startCoords.y2 + (targetCoords.y2 - startCoords.y2) * easedProgress);

            if (progress < 1) {
                requestAnimationFrame(tick);
            }
        }

        requestAnimationFrame(tick);
    }

    // --- Event Binding ---
    function bindEvents() {
        menuToggle.addEventListener('click', toggleMenu);

        menuLinks.forEach(function (link) {
            link.addEventListener('click', function (e) {
                e.preventDefault();
                var index = parseInt(this.getAttribute('data-index'), 10);
                navigateTo(index);
            });
        });

        progressDots.forEach(function (dot) {
            dot.addEventListener('click', function () {
                var index = parseInt(this.getAttribute('data-section'), 10);
                navigateTo(index);
            });
        });

        document.addEventListener('keydown', handleKeyboard);
        document.addEventListener('wheel', handleWheel, { passive: false });

        document.addEventListener('touchstart', function (e) {
            touchStartY = e.changedTouches[0].screenY;
        }, { passive: true });

        document.addEventListener('touchend', function (e) {
            touchEndY = e.changedTouches[0].screenY;
            handleSwipe();
        }, { passive: true });
    }

    // --- Menu ---
    function toggleMenu() {
        isMenuOpen = !isMenuOpen;
        menuToggle.classList.toggle('active', isMenuOpen);
        menu.classList.toggle('active', isMenuOpen);
        animateIcon(isMenuOpen);

        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }

    function closeMenu() {
        if (isMenuOpen) {
            isMenuOpen = false;
            menuToggle.classList.remove('active');
            menu.classList.remove('active');
            animateIcon(false);
            document.body.style.overflow = '';
        }
    }

    // --- Navigation ---
    function navigateTo(index) {
        if (isTransitioning || index === currentSection) {
            closeMenu();
            return;
        }

        closeMenu();

        setTimeout(function () {
            setActiveSection(index, true);
        }, isMenuOpen ? 300 : 50);
    }

    function setActiveSection(index, animate) {
        if (index < 0 || index >= sections.length) return;

        isTransitioning = true;

        sections[currentSection].classList.remove('active');

        currentSection = index;
        sections[currentSection].classList.add('active');
        sections[currentSection].scrollTop = 0;

        updateSectionLabel(index);
        updateProgress(index);

        // Show/hide nav and progress on hero section
        if (index === 0) {
            document.body.classList.add('hero-active');
        } else {
            document.body.classList.remove('hero-active');
        }

        setTimeout(function () {
            isTransitioning = false;
        }, animate ? 600 : 0);
    }

    function updateSectionLabel(index) {
        sectionLabel.style.opacity = '0';
        sectionLabel.style.transform = 'translateY(-5px)';
        setTimeout(function () {
            sectionLabel.textContent = sectionNames[index];
            sectionLabel.style.opacity = '1';
            sectionLabel.style.transform = 'translateY(0)';
        }, 200);
    }

    function updateProgress(index) {
        progressDots.forEach(function (dot, i) {
            dot.classList.toggle('active', i === index);
        });

        var percent = (index / (sections.length - 1)) * 100;
        progressFill.style.top = percent + '%';
    }

    // --- Keyboard ---
    function handleKeyboard(e) {
        if (isMenuOpen) {
            if (e.key === 'Escape') {
                closeMenu();
            }
            return;
        }

        switch (e.key) {
            case 'ArrowDown':
            case 'PageDown':
                e.preventDefault();
                goNext();
                break;
            case 'ArrowUp':
            case 'PageUp':
                e.preventDefault();
                goPrev();
                break;
            case 'Home':
                e.preventDefault();
                navigateTo(0);
                break;
            case 'End':
                e.preventDefault();
                navigateTo(sections.length - 1);
                break;
        }
    }

    // --- Scroll / Wheel ---
    // Much higher threshold — requires deliberate, sustained scrolling
    var wheelAccumulator = 0;
    var wheelTimeout = null;
    var WHEEL_THRESHOLD = 400;
    var COOLDOWN_MS = 800;
    var lastSectionChange = 0;

    function handleWheel(e) {
        if (isMenuOpen) return;

        // Enforce cooldown after a section change
        if (Date.now() - lastSectionChange < COOLDOWN_MS) {
            e.preventDefault();
            return;
        }

        // Check if the active section is scrollable and not at boundary
        var activeSection = sections[currentSection];
        var scrollTop = activeSection.scrollTop;
        var scrollHeight = activeSection.scrollHeight;
        var clientHeight = activeSection.clientHeight;
        var isScrollable = scrollHeight > clientHeight + 5;

        if (isScrollable) {
            var atTop = scrollTop <= 1;
            var atBottom = scrollTop + clientHeight >= scrollHeight - 1;

            // Allow natural scroll within section
            if (e.deltaY > 0 && !atBottom) return;
            if (e.deltaY < 0 && !atTop) return;
        }

        e.preventDefault();

        wheelAccumulator += e.deltaY;

        clearTimeout(wheelTimeout);
        wheelTimeout = setTimeout(function () {
            wheelAccumulator = 0;
        }, 300);

        if (Math.abs(wheelAccumulator) >= WHEEL_THRESHOLD) {
            if (wheelAccumulator > 0) {
                goNext();
            } else {
                goPrev();
            }
            wheelAccumulator = 0;
            lastSectionChange = Date.now();
        }
    }

    // --- Touch / Swipe ---
    function handleSwipe() {
        if (isMenuOpen) return;

        var diff = touchStartY - touchEndY;
        var SWIPE_THRESHOLD = 120;

        if (Math.abs(diff) < SWIPE_THRESHOLD) return;

        var activeSection = sections[currentSection];
        var scrollTop = activeSection.scrollTop;
        var scrollHeight = activeSection.scrollHeight;
        var clientHeight = activeSection.clientHeight;
        var isScrollable = scrollHeight > clientHeight + 5;

        if (isScrollable) {
            var atTop = scrollTop <= 1;
            var atBottom = scrollTop + clientHeight >= scrollHeight - 1;
            if (diff > 0 && !atBottom) return;
            if (diff < 0 && !atTop) return;
        }

        if (diff > 0) {
            goNext();
        } else {
            goPrev();
        }
    }

    function goNext() {
        if (currentSection < sections.length - 1) {
            setActiveSection(currentSection + 1, true);
        }
    }

    function goPrev() {
        if (currentSection > 0) {
            setActiveSection(currentSection - 1, true);
        }
    }

    // --- Section Label Transition Style ---
    sectionLabel.style.transition = 'opacity 0.2s ease, transform 0.2s ease';

    // --- Dark Mode ---
    var darkToggle = document.getElementById('darkToggle');
    var darkHint = document.getElementById('darkHint');

    if (darkToggle) {
        // Check saved preference
        if (localStorage.getItem('darkMode') === 'true') {
            document.body.classList.add('dark');
            darkToggle.classList.add('active');
        }

        darkToggle.addEventListener('click', function () {
            document.body.classList.toggle('dark');
            darkToggle.classList.toggle('active');
            var isDark = document.body.classList.contains('dark');
            localStorage.setItem('darkMode', isDark);
        });

        // Hide hint after first click or after 5 seconds
        if (darkHint) {
            var hideHint = function () {
                darkHint.classList.add('hidden');
            };
            darkToggle.addEventListener('click', hideHint, { once: true });
            setTimeout(hideHint, 5000);
        }
    }

    // --- Start ---
    init();

})();
