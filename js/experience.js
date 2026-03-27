/* ============================================
   EXPERIENCE DETAIL PAGE
   Loads experience data and populates the page
   ============================================ */

(function () {
    'use strict';

    // --- Experience Data ---
    // Edit this array to customise each experience's content.
    // Only experiences with detail pages (Shape Shoes & Orthoson) are listed here.
    var experiences = [
        {
            id: 1,
            company: 'Shape Shoes',
            category: 'Footwear Design',
            period: '2024 — Present',
            role: 'Senior Design Engineer',
            location: 'United Kingdom',
            overview: 'Provide a detailed overview of your role at Shape Shoes. Describe the company, the products you work on, and the scope of your responsibilities.',
            responsibilities: 'Describe your key responsibilities and day-to-day work. What do you own? What teams do you collaborate with? What processes have you improved?',
            achievements: 'Describe key achievements and impact made during this role. What have you delivered? What problems have you solved? What recognition have you received?',
            tags: ['CAD', 'Prototyping', 'Product Design', 'Footwear', 'Manufacturing', 'Testing'],
            heroImage: 'images/experience-01.jpg',
            images: [
                'images/experience-01-detail-1.jpg',
                'images/experience-01-detail-2.jpg',
                'images/experience-01-detail-3.jpg',
                'images/experience-01-detail-4.jpg',
                'images/experience-01-detail-5.jpg',
                'images/experience-01-detail-6.jpg'
            ]
        },
        {
            id: 2,
            company: 'Orthoson',
            category: 'Medical Devices',
            period: '2022 — 2024',
            role: 'Design Engineer',
            location: 'United Kingdom',
            overview: 'Provide a detailed overview of your role at Orthoson. Describe the company, the products you work on, and the scope of your responsibilities.',
            responsibilities: 'Describe your key responsibilities and day-to-day work. What do you own? What teams do you collaborate with? What processes have you improved?',
            achievements: 'Describe key achievements and impact made during this role. What have you delivered? What problems have you solved? What recognition have you received?',
            tags: ['SolidWorks', 'Manufacturing', 'DFM', 'Medical Devices', 'Quality', 'Regulation'],
            heroImage: 'images/experience-02.jpg',
            images: [
                'images/experience-02-detail-1.jpg',
                'images/experience-02-detail-2.jpg',
                'images/experience-02-detail-3.jpg',
                'images/experience-02-detail-4.jpg',
                'images/experience-02-detail-5.jpg',
                'images/experience-02-detail-6.jpg'
            ]
        }
    ];

    // --- Get Experience ID from URL ---
    var params = new URLSearchParams(window.location.search);
    var expId = parseInt(params.get('id'), 10) || 1;
    var exp = experiences.find(function (e) { return e.id === expId; });

    if (!exp) {
        exp = experiences[0];
    }

    // --- Populate Page ---
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
    el('expAchievements').textContent = exp.achievements;

    // Hero image
    el('expHeroImg').src = exp.heroImage;
    el('expHeroImg').alt = exp.company;

    // Gallery images
    for (var i = 0; i < 6; i++) {
        var img = el('expImg' + (i + 1));
        if (img && exp.images[i]) {
            img.src = exp.images[i];
            img.alt = exp.company + ' detail ' + (i + 1);
        }
    }

    // Tags
    var tagsContainer = el('expTags');
    tagsContainer.innerHTML = '';
    exp.tags.forEach(function (tag) {
        var span = document.createElement('span');
        span.className = 'tag';
        span.textContent = tag;
        tagsContainer.appendChild(span);
    });

    // --- Prev / Next Navigation ---
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

    // --- Fade-in animations ---
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
        document.body.classList.remove('dark', 'orange');
        if (theme === 'dark') document.body.classList.add('dark');
        if (theme === 'orange') document.body.classList.add('orange');
        themeButtons.forEach(function (btn) {
            btn.classList.toggle('active', btn.getAttribute('data-theme') === theme);
        });
        localStorage.setItem('theme', theme);
    }

    var savedTheme = localStorage.getItem('theme') || 'light';
    if (!localStorage.getItem('theme') && localStorage.getItem('darkMode') === 'true') {
        savedTheme = 'dark';
    }
    setTheme(savedTheme);

    themeButtons.forEach(function (btn) {
        btn.addEventListener('click', function () {
            setTheme(this.getAttribute('data-theme'));
        });
    });

})();
