/* ============================================
   PROJECT DETAIL PAGE
   ============================================ */

(function () {
    'use strict';

    var projects = [
        {
            id: 1,
            title: 'LumaPath',
            category: 'Product Design',
            year: '2025',
            role: 'Lead Designer',
            duration: '6 Months',
            overview: 'Provide a detailed overview of this project. Describe the brief, the client or context, and what you set out to achieve.',
            process: 'Describe your design and engineering process. What research did you conduct? What methods did you use? How did you iterate?',
            tags: ['SolidWorks', 'Keyshot', '3D Printing', 'Prototyping', 'User Testing'],
            heroImage: 'images/project-01.jpg',
            images: ['images/project-01-detail-1.jpg', 'images/project-01-detail-2.jpg', 'images/project-01-detail-3.jpg', 'images/project-01-detail-4.jpg', 'images/project-01-detail-5.jpg'],
            portfolioLink: ''
        },
        {
            id: 2,
            title: 'Byte',
            category: 'Industrial Design',
            year: '2026',
            role: 'Design Engineer',
            duration: '4 Months',
            overview: 'Provide a detailed overview of this project.',
            process: 'Describe your design and engineering process.',
            tags: ['CAD', 'CNC Machining', 'Sheet Metal', 'GD&T'],
            heroImage: 'images/project-02.jpg',
            images: ['images/project-02-detail-1.jpg', 'images/project-02-detail-2.jpg', 'images/project-02-detail-3.jpg', 'images/project-02-detail-4.jpg', 'images/project-02-detail-5.jpg'],
            portfolioLink: ''
        },
        {
            id: 3,
            title: 'AIESEC Hackathon',
            category: 'Engineering',
            year: '2024',
            role: 'Engineer',
            duration: '8 Months',
            overview: 'Provide a detailed overview of this project.',
            process: 'Describe your design and engineering process.',
            tags: ['FEA', 'MATLAB', 'Testing', 'Documentation'],
            heroImage: 'images/project-03.jpg',
            images: ['images/project-03-detail-1.jpg', 'images/project-03-detail-2.jpg', 'images/project-03-detail-3.jpg', 'images/project-03-detail-4.jpg', 'images/project-03-detail-5.jpg'],
            portfolioLink: ''
        },
        {
            id: 4,
            title: 'Ponder',
            category: 'Concept',
            year: '2026',
            role: 'Concept Designer',
            duration: '3 Months',
            overview: 'Provide a detailed overview of this project.',
            process: 'Describe your design and engineering process.',
            tags: ['Sketching', 'Rhino', 'Rendering', 'Concept Development'],
            heroImage: 'images/project-04.jpg',
            images: ['images/project-04-detail-1.jpg', 'images/project-04-detail-2.jpg', 'images/project-04-detail-3.jpg', 'images/project-04-detail-4.jpg', 'images/project-04-detail-5.jpg'],
            portfolioLink: ''
        },
        {
            id: 5,
            title: 'Temporomandibular FEA',
            category: 'Furniture',
            year: '2024',
            role: 'Designer & Maker',
            duration: '5 Months',
            overview: 'Provide a detailed overview of this project.',
            process: 'Describe your design and engineering process.',
            tags: ['Woodworking', 'Joinery', 'CNC', 'Finishing'],
            heroImage: 'images/project-05.jpg',
            images: ['images/project-05-detail-1.jpg', 'images/project-05-detail-2.jpg', 'images/project-05-detail-3.jpg', 'images/project-05-detail-4.jpg', 'images/project-05-detail-5.jpg'],
            portfolioLink: ''
        },
        {
            id: 6,
            title: 'The HighLighter',
            category: 'Prototype',
            year: '2024',
            role: 'Prototyper',
            duration: '2 Months',
            overview: 'Provide a detailed overview of this project.',
            process: 'Describe your design and engineering process.',
            tags: ['Arduino', 'Electronics', '3D Printing', 'Laser Cutting'],
            heroImage: 'images/project-06.jpg',
            images: ['images/project-06-detail-1.jpg', 'images/project-06-detail-2.jpg', 'images/project-06-detail-3.jpg', 'images/project-06-detail-4.jpg', 'images/project-06-detail-5.jpg'],
            portfolioLink: ''
        },
        {
            id: 7,
            title: 'Thermofluids Design',
            category: 'Packaging',
            year: '2024',
            role: 'Designer',
            duration: '3 Months',
            overview: 'Provide a detailed overview of this project.',
            process: 'Describe your design and engineering process.',
            tags: ['Dieline', 'Illustrator', 'Material Selection', 'Sustainability'],
            heroImage: 'images/project-07.jpg',
            images: ['images/project-07-detail-1.jpg', 'images/project-07-detail-2.jpg', 'images/project-07-detail-3.jpg', 'images/project-07-detail-4.jpg', 'images/project-07-detail-5.jpg'],
            portfolioLink: ''
        },
        {
            id: 8,
            title: 'Leap Pen',
            category: 'Sustainable Design',
            year: '2023',
            role: 'Design Engineer',
            duration: '7 Months',
            overview: 'Provide a detailed overview of this project.',
            process: 'Describe your design and engineering process.',
            tags: ['LCA', 'Bio-materials', 'Circular Design', 'Research'],
            heroImage: 'images/project-08.jpg',
            images: ['images/project-08-detail-1.jpg', 'images/project-08-detail-2.jpg', 'images/project-08-detail-3.jpg', 'images/project-08-detail-4.jpg', 'images/project-08-detail-5.jpg'],
            portfolioLink: ''
        }
    ];

    var params = new URLSearchParams(window.location.search);
    var projectId = parseInt(params.get('id'), 10) || 1;
    var project = projects.find(function (p) { return p.id === projectId; }) || projects[0];

    document.title = project.title + ' — Archie Midgley';

    var el = function (id) { return document.getElementById(id); };

    el('projectLabel').textContent = project.category;
    el('detailCategory').textContent = project.category;
    el('detailTitle').textContent = project.title;
    el('detailYear').textContent = project.year;
    el('detailRole').textContent = project.role;
    el('detailDuration').textContent = project.duration;
    el('detailOverview').innerHTML = project.overview.split('\n\n').map(function(p){ return '<p class="project-detail__text">' + p + '</p>'; }).join('');
    el('detailProcess').innerHTML = project.process.split('\n\n').map(function(p){ return '<p class="project-detail__text">' + p + '</p>'; }).join('');

    el('detailHeroImg').src = project.heroImage;
    el('detailHeroImg').alt = project.title;

    // Images 1, 2, 4, 5 (no image 3 / full-width slot)
    var imgSlots = [1, 2, 4, 5];
    imgSlots.forEach(function (slot, i) {
        var img = el('detailImg' + slot);
        if (img && project.images[i]) {
            img.src = project.images[i];
            img.alt = project.title + ' detail ' + (i + 1);
        }
    });

    // Tags
    var tagsContainer = el('detailTags');
    tagsContainer.innerHTML = '';
    project.tags.forEach(function (tag) {
        var span = document.createElement('span');
        span.className = 'tag';
        span.textContent = tag;
        tagsContainer.appendChild(span);
    });

    // Portfolio link
    var portfolioLink = el('detailPortfolioLink');
    if (project.portfolioLink) {
        portfolioLink.href = project.portfolioLink;
        portfolioLink.style.display = '';
    } else {
        portfolioLink.style.display = 'none';
    }

    // --- Prev / Next ---
    var currentIndex = projects.findIndex(function (p) { return p.id === projectId; });
    var prevIndex = currentIndex > 0 ? currentIndex - 1 : projects.length - 1;
    var nextIndex = currentIndex < projects.length - 1 ? currentIndex + 1 : 0;

    el('prevProject').href = 'project.html?id=' + projects[prevIndex].id;
    el('prevTitle').textContent = projects[prevIndex].title;
    el('nextProject').href = 'project.html?id=' + projects[nextIndex].id;
    el('nextTitle').textContent = projects[nextIndex].title;

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
