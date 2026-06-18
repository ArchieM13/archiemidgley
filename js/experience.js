/* ============================================
   EXPERIENCE DETAIL PAGE
   ============================================ */

(function () {
    'use strict';

    var experiences = [
        {
            id: 1,
            company: 'Shape Shoes',
            category: 'Footwear Design',
            period: '2023 — Present',
            role: 'COO & Design Engineer',
            location: 'United Kingdom',
            overview: 'Provide a detailed overview of your role at Shape Shoes. Describe the company, the products you work on, and the scope of your responsibilities.',
            responsibilities: 'Describe your key responsibilities and day-to-day work. What do you own? What teams do you collaborate with? What processes have you improved?',
            tags: ['CAD', 'DFMA', 'Additive Manufacturing', 'Marketing', 'Product Design'],
            heroImage: 'images/experience-01.jpg',
            images: [
                'images/experience-01-detail-1.jpg',
                'images/experience-01-detail-2.jpg',
                'images/experience-01-detail-3.jpg',
                'images/experience-01-detail-4.jpg',
                'images/experience-01-detail-5.jpg'
            ]
        },
        {
            id: 2,
            company: 'Orthoson',
            category: 'Medical Devices',
            period: 'Mar 2026 — Present',
            role: 'Design Engineer',
            location: 'United Kingdom',
            overview: 'Oxford-backed medical company developing a bio-structural gel to restore intervertebral disc degeneration and treat back pain. Tasked with designing the injection system tray and the user interface of the Pressure Monitoring System.',
            responsibilities: 'Describe your key responsibilities and day-to-day work. What do you own? What teams do you collaborate with? What processes have you improved?',
            tags: ['SolidWorks', 'DFMA', 'JavaScript', 'Medical Devices', 'PCB Design'],
            heroImage: 'images/experience-02.jpg',
            images: [
                'images/experience-02-detail-1.jpg',
                'images/experience-02-detail-2.jpg',
                'images/experience-02-detail-3.jpg',
                'images/experience-02-detail-4.jpg',
                'images/experience-02-detail-5.jpg'
            ]
        }
    ];

    var params = new URLSearchParams(window.location.search);
    var expId = parseInt(params.get('id'), 10) || 1;
    var exp = experiences.find(function (e) { return e.id === expId; }) || experiences[0];

    document.title = exp.company + ' — Archie Midgley';

    var el = function (id) { return document.getElementById(id); };

    el('expLabel').textContent = exp.category;
    el('expCategory').textContent = exp.category;
    el('expTitle').textContent = exp.company;
    el('expPeriod').textContent = exp.period;
    el('expRole').textContent = exp.role;
    el('expLocation').textContent = exp.location;
    el('expOverview').textContent = exp.overview;
    el('expResponsibilities').textContent = exp.responsibilities;

    el('expHeroImg').src = exp.heroImage;
    el('expHeroImg').alt = exp.company;

    // Images 1, 2, 4, 5 (no image 3 / full-width slot)
    var imgSlots = [1, 2, 4, 5];
    imgSlots.forEach(function (slot, i) {
        var img = el('expImg' + slot);
        if (img && exp.images[i]) {
            img.src = exp.images[i];
            img.alt = exp.company + ' detail ' + (i + 1);
        }
    });

    // Tags
    var tagsContainer = el('expTags');
    tagsContainer.innerHTML = '';
    exp.tags.forEach(function (tag) {
        var span = document.createElement('span');
        span.className = 'tag';
        span.textContent = tag;
        tagsContainer.appendChild(span);
    });

    // --- Prev / Next ---
    var currentIndex = experiences.findIndex(function (e) { return e.id === expId; });

    if (currentIndex > 0) {
        var prev = experiences[currentIndex - 1];
        var prevLink = el('prevExp');
        prevLink.href = 'experience.html?id=' + prev.id;
        prevLink.style.visibility = 'visible';
        el('prevExpTitle').textContent = prev.company;
    }

    if (currentIndex < experiences.length - 1) {
        var next = experiences[currentIndex + 1];
        var nextLink = el('nextExp');
        nextLink.href = 'experience.html?id=' + next.id;
        nextLink.style.visibility = 'visible';
        el('nextExpTitle').textContent = next.company;
    }

    // --- Fade-in ---
    var fadeEls = document.querySelectorAll('.project-detail__hero-inner, .project-detail__hero-image, .project-detail__section, .project-detail__gallery, .project-detail__nav-section');
    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    fadeEls.forEach(function (el) {
        el.classList.add('fade-in');
        observer.observe(el);
    });

    // --- Theme Switcher ---
    var themeSwitcher = document.getElementById('themeSwitcher');
    var themeButtons = themeSwitcher ? themeSwitcher.querySelectorAll('.theme-switcher__btn') : [];

    function setTheme(theme) {
        document.body.classList.remove('dark');
        if (theme === 'dark') document.body.classList.add('dark');
        themeButtons.forEach(function (btn) {
            btn.classList.toggle('active', btn.getAttribute('data-theme') === theme);
        });
        localStorage.setItem('theme', theme);
    }

    var savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'orange') savedTheme = 'light';
    setTheme(savedTheme);

    themeButtons.forEach(function (btn) {
        btn.addEventListener('click', function () {
            setTheme(this.getAttribute('data-theme'));
        });
    });

})();
