/* ============================================
   PROJECT DETAIL PAGE
   Loads project data and populates the page
   ============================================ */

(function () {
    'use strict';

    // --- Project Data ---
    // Edit this array to customise each project's content.
    // Image paths are relative to the root (images/ folder).
    var projects = [
        {
            id: 1,
            title: 'Project Title One',
            category: 'Product Design',
            year: '2024',
            role: 'Lead Designer',
            duration: '6 Months',
            overview: 'Provide a detailed overview of this project. Describe the brief, the client or context, and what you set out to achieve. What was the problem you were solving? What constraints did you work within?',
            process: 'Describe your design and engineering process. What research did you conduct? What methods did you use? How did you iterate on your designs? Include details about sketching, prototyping, testing, and refinement.',
            outcome: 'Describe the final result and its impact. What did you achieve? How was it received? Include any measurable outcomes, awards, or recognition.',
            tags: ['SolidWorks', 'Keyshot', '3D Printing', 'Prototyping', 'User Testing'],
            heroImage: 'images/project-01.jpg',
            images: ['images/project-01-detail-1.jpg', 'images/project-01-detail-2.jpg', 'images/project-01-detail-3.jpg', 'images/project-01-detail-4.jpg', 'images/project-01-detail-5.jpg', 'images/project-01-detail-6.jpg'],
            portfolioLink: ''
        },
        {
            id: 2,
            title: 'Project Title Two',
            category: 'Industrial Design',
            year: '2023',
            role: 'Design Engineer',
            duration: '4 Months',
            overview: 'Provide a detailed overview of this project.',
            process: 'Describe your design and engineering process.',
            outcome: 'Describe the final result and its impact.',
            tags: ['CAD', 'CNC Machining', 'Sheet Metal', 'GD&T'],
            heroImage: 'images/project-02.jpg',
            images: ['images/project-02-detail-1.jpg', 'images/project-02-detail-2.jpg', 'images/project-02-detail-3.jpg', 'images/project-02-detail-4.jpg', 'images/project-02-detail-5.jpg', 'images/project-02-detail-6.jpg'],
            portfolioLink: ''
        },
        {
            id: 3,
            title: 'Project Title Three',
            category: 'Engineering',
            year: '2023',
            role: 'Engineer',
            duration: '8 Months',
            overview: 'Provide a detailed overview of this project.',
            process: 'Describe your design and engineering process.',
            outcome: 'Describe the final result and its impact.',
            tags: ['FEA', 'MATLAB', 'Testing', 'Documentation'],
            heroImage: 'images/project-03.jpg',
            images: ['images/project-03-detail-1.jpg', 'images/project-03-detail-2.jpg', 'images/project-03-detail-3.jpg', 'images/project-03-detail-4.jpg', 'images/project-03-detail-5.jpg', 'images/project-03-detail-6.jpg'],
            portfolioLink: ''
        },
        {
            id: 4,
            title: 'Project Title Four',
            category: 'Concept',
            year: '2022',
            role: 'Concept Designer',
            duration: '3 Months',
            overview: 'Provide a detailed overview of this project.',
            process: 'Describe your design and engineering process.',
            outcome: 'Describe the final result and its impact.',
            tags: ['Sketching', 'Rhino', 'Rendering', 'Concept Development'],
            heroImage: 'images/project-04.jpg',
            images: ['images/project-04-detail-1.jpg', 'images/project-04-detail-2.jpg', 'images/project-04-detail-3.jpg', 'images/project-04-detail-4.jpg', 'images/project-04-detail-5.jpg', 'images/project-04-detail-6.jpg'],
            portfolioLink: ''
        },
        {
            id: 5,
            title: 'Project Title Five',
            category: 'Furniture',
            year: '2022',
            role: 'Designer & Maker',
            duration: '5 Months',
            overview: 'Provide a detailed overview of this project.',
            process: 'Describe your design and engineering process.',
            outcome: 'Describe the final result and its impact.',
            tags: ['Woodworking', 'Joinery', 'CNC', 'Finishing'],
            heroImage: 'images/project-05.jpg',
            images: ['images/project-05-detail-1.jpg', 'images/project-05-detail-2.jpg', 'images/project-05-detail-3.jpg', 'images/project-05-detail-4.jpg', 'images/project-05-detail-5.jpg', 'images/project-05-detail-6.jpg'],
            portfolioLink: ''
        },
        {
            id: 6,
            title: 'Project Title Six',
            category: 'Prototype',
            year: '2021',
            role: 'Prototyper',
            duration: '2 Months',
            overview: 'Provide a detailed overview of this project.',
            process: 'Describe your design and engineering process.',
            outcome: 'Describe the final result and its impact.',
            tags: ['Arduino', 'Electronics', '3D Printing', 'Laser Cutting'],
            heroImage: 'images/project-06.jpg',
            images: ['images/project-06-detail-1.jpg', 'images/project-06-detail-2.jpg', 'images/project-06-detail-3.jpg', 'images/project-06-detail-4.jpg', 'images/project-06-detail-5.jpg', 'images/project-06-detail-6.jpg'],
            portfolioLink: ''
        },
        {
            id: 7,
            title: 'Project Title Seven',
            category: 'Packaging',
            year: '2021',
            role: 'Designer',
            duration: '3 Months',
            overview: 'Provide a detailed overview of this project.',
            process: 'Describe your design and engineering process.',
            outcome: 'Describe the final result and its impact.',
            tags: ['Dieline', 'Illustrator', 'Material Selection', 'Sustainability'],
            heroImage: 'images/project-07.jpg',
            images: ['images/project-07-detail-1.jpg', 'images/project-07-detail-2.jpg', 'images/project-07-detail-3.jpg', 'images/project-07-detail-4.jpg', 'images/project-07-detail-5.jpg', 'images/project-07-detail-6.jpg'],
            portfolioLink: ''
        },
        {
            id: 8,
            title: 'Project Title Eight',
            category: 'Sustainable Design',
            year: '2020',
            role: 'Design Engineer',
            duration: '7 Months',
            overview: 'Provide a detailed overview of this project.',
            process: 'Describe your design and engineering process.',
            outcome: 'Describe the final result and its impact.',
            tags: ['LCA', 'Bio-materials', 'Circular Design', 'Research'],
            heroImage: 'images/project-08.jpg',
            images: ['images/project-08-detail-1.jpg', 'images/project-08-detail-2.jpg', 'images/project-08-detail-3.jpg', 'images/project-08-detail-4.jpg', 'images/project-08-detail-5.jpg', 'images/project-08-detail-6.jpg'],
            portfolioLink: ''
        }
    ];

    // --- Get Project ID from URL ---
    var params = new URLSearchParams(window.location.search);
    var projectId = parseInt(params.get('id'), 10) || 1;
    var project = projects.find(function (p) { return p.id === projectId; });

    if (!project) {
        project = projects[0];
    }

    // --- Populate Page ---
    document.title = project.title + ' — Archie Midgley';

    var el = function (id) { return document.getElementById(id); };

    el('projectLabel').textContent = project.category;
    el('detailCategory').textContent = project.category;
    el('detailTitle').textContent = project.title;
    el('detailYear').textContent = project.year;
    el('detailRole').textContent = project.role;
    el('detailDuration').textContent = project.duration;
    el('detailOverview').textContent = project.overview;
    el('detailProcess').textContent = project.process;
    el('detailOutcome').textContent = project.outcome;

    // Hero image
    el('detailHeroImg').src = project.heroImage;
    el('detailHeroImg').alt = project.title;

    // Gallery images
    for (var i = 0; i < 6; i++) {
        var img = el('detailImg' + (i + 1));
        if (img && project.images[i]) {
            img.src = project.images[i];
            img.alt = project.title + ' detail ' + (i + 1);
        }
    }

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

    // --- Prev / Next Navigation ---
    var currentIndex = projects.findIndex(function (p) { return p.id === projectId; });
    var prevIndex = currentIndex > 0 ? currentIndex - 1 : projects.length - 1;
    var nextIndex = currentIndex < projects.length - 1 ? currentIndex + 1 : 0;

    var prevLink = el('prevProject');
    var nextLink = el('nextProject');

    prevLink.href = 'project.html?id=' + projects[prevIndex].id;
    el('prevTitle').textContent = projects[prevIndex].title;

    nextLink.href = 'project.html?id=' + projects[nextIndex].id;
    el('nextTitle').textContent = projects[nextIndex].title;

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

    // --- Dark Mode ---
    var darkToggle = document.getElementById('darkToggle');
    if (darkToggle) {
        if (localStorage.getItem('darkMode') === 'true') {
            document.body.classList.add('dark');
            darkToggle.classList.add('active');
        }
        darkToggle.addEventListener('click', function () {
            document.body.classList.toggle('dark');
            darkToggle.classList.toggle('active');
            localStorage.setItem('darkMode', document.body.classList.contains('dark'));
        });
    }

})();
