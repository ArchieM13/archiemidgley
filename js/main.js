/* ============================================
   PORTFOLIO — Main JavaScript
   Navigation, Transitions, Interactions
   ============================================ */

(function () {
    'use strict';

    // --- DOM Elements ---
    const menuToggle = document.getElementById('menuToggle');
    const menu = document.getElementById('menu');
    const menuLinks = document.querySelectorAll('.menu__link');
    const sections = document.querySelectorAll('.section');
    const sectionLabel = document.getElementById('sectionLabel');
    const progressDots = document.querySelectorAll('.progress__dot');
    const progressFill = document.getElementById('progressFill');

    const sectionNames = ['About', 'Experience', 'Projects', 'Contact'];
    let currentSection = 0;
    let isMenuOpen = false;
    let isTransitioning = false;
    let touchStartY = 0;
    let touchEndY = 0;

    // --- Initialize ---
    function init() {
        setActiveSection(0, false);
        bindEvents();
    }

    // --- Event Binding ---
    function bindEvents() {
        // Menu toggle
        menuToggle.addEventListener('click', toggleMenu);

        // Menu links
        menuLinks.forEach(function (link) {
            link.addEventListener('click', function (e) {
                e.preventDefault();
                var index = parseInt(this.getAttribute('data-index'), 10);
                navigateTo(index);
            });
        });

        // Progress dots
        progressDots.forEach(function (dot) {
            dot.addEventListener('click', function () {
                var index = parseInt(this.getAttribute('data-section'), 10);
                navigateTo(index);
            });
        });

        // Keyboard navigation
        document.addEventListener('keydown', handleKeyboard);

        // Mouse wheel navigation
        document.addEventListener('wheel', handleWheel, { passive: false });

        // Touch navigation
        document.addEventListener('touchstart', function (e) {
            touchStartY = e.changedTouches[0].screenY;
        }, { passive: true });

        document.addEventListener('touchend', function (e) {
            touchEndY = e.changedTouches[0].screenY;
            handleSwipe();
        }, { passive: true });

        // Contact form
        var form = document.getElementById('contactForm');
        if (form) {
            form.addEventListener('submit', handleFormSubmit);
        }
    }

    // --- Menu ---
    function toggleMenu() {
        isMenuOpen = !isMenuOpen;
        menuToggle.classList.toggle('active', isMenuOpen);
        menu.classList.toggle('active', isMenuOpen);

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

        // Small delay to let menu close animation start
        setTimeout(function () {
            setActiveSection(index, true);
        }, isMenuOpen ? 300 : 50);
    }

    function setActiveSection(index, animate) {
        if (index < 0 || index >= sections.length) return;

        isTransitioning = true;

        // Deactivate current section
        sections[currentSection].classList.remove('active');

        // Reset animations on the target section's children
        resetSectionAnimations(sections[index]);

        // Activate new section
        currentSection = index;
        sections[currentSection].classList.add('active');

        // Scroll section to top
        sections[currentSection].scrollTop = 0;

        // Update UI
        updateSectionLabel(index);
        updateProgress(index);

        // Allow next transition
        setTimeout(function () {
            isTransitioning = false;
        }, animate ? 600 : 0);
    }

    function resetSectionAnimations(section) {
        // Force re-trigger CSS animations by removing and re-adding .active
        // The animations are handled via CSS .section.active selectors
    }

    function updateSectionLabel(index) {
        // Fade out, change, fade in
        sectionLabel.style.opacity = '0';
        sectionLabel.style.transform = 'translateY(-5px)';
        setTimeout(function () {
            sectionLabel.textContent = sectionNames[index];
            sectionLabel.style.opacity = '1';
            sectionLabel.style.transform = 'translateY(0)';
        }, 200);
    }

    function updateProgress(index) {
        // Update dots
        progressDots.forEach(function (dot, i) {
            dot.classList.toggle('active', i === index);
        });

        // Update fill bar position
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
    var wheelAccumulator = 0;
    var wheelTimeout = null;
    var WHEEL_THRESHOLD = 80;

    function handleWheel(e) {
        if (isMenuOpen) return;

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
        }, 200);

        if (Math.abs(wheelAccumulator) >= WHEEL_THRESHOLD) {
            if (wheelAccumulator > 0) {
                goNext();
            } else {
                goPrev();
            }
            wheelAccumulator = 0;
        }
    }

    // --- Touch / Swipe ---
    function handleSwipe() {
        if (isMenuOpen) return;

        var diff = touchStartY - touchEndY;
        var SWIPE_THRESHOLD = 60;

        if (Math.abs(diff) < SWIPE_THRESHOLD) return;

        // Check if section is scrollable
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

    // --- Form ---
    function handleFormSubmit(e) {
        e.preventDefault();

        var btn = e.target.querySelector('.form__button span');
        var originalText = btn.textContent;

        btn.textContent = 'Message Sent!';
        e.target.reset();

        setTimeout(function () {
            btn.textContent = originalText;
        }, 3000);
    }

    // --- Section Label Transition Style ---
    sectionLabel.style.transition = 'opacity 0.2s ease, transform 0.2s ease';

    // --- Start ---
    init();

})();
