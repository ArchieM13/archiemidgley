/* ============================================
   PROJECT DETAIL PAGE
   ============================================ */

(function () {
    'use strict';

    var projects = [
        {
            id: 1,
            title: 'LumaPath',
            category: 'Human-centered Engineering',
            year: '2025',
            role: 'Lead Designer',
            duration: '6 Months',
            overview: 'A motion-activated lighting system, connecting via UART to highlight areas of emergency and escape routes. Designing to enhance the liveability of temporary shelters for those facing prolonged displacement, specifically with limited access to basic amenities.',
            process: 'With 90% of refugees, lacking proper lighting, we set out to design an entire lighting system, rather than just a single product. With wide-area connectivity, the lights can illuminate exit paths and highlight areas of emergency when required. \n\nFinal prototyping showcased all product features, with the electronics held within an entirely 3D printed body. A secondary CAD was developed with injection moulding features, eg. side cores, to ensure final manufacturability. A secondary power supply system of a pulley was integrated, with a 1:40 gear ratio - a reserve method from solar panel charging. It back-drives a DC motor to charge the enclosed LiFe battery. Annular snap fits and attachment rails were used over external fasteners to improve repairability and manufacturability, with a strong focus on ease of use in areas of limited resources.',
            tags: ['Fusion 360', 'Keyshot', 'Mechanics', 'Prototyping', 'User Testing'],
            heroImage: 'images/project-01-hero.jpg',
            images: ['images/project-01-detail-1.jpg', 'images/project-01-detail-2.jpg', 'images/project-01-detail-3.jpg', 'images/project-01-detail-4.jpg', 'images/project-01-detail-5.jpg'],
            portfolioLink: '',
            captions: ['', '', '', '', '']
        },
        {
            id: 2,
            title: 'Byte',
            category: 'Industrial Futures Design',
            year: '2026',
            role: 'Design Engineer',
            duration: '4 Months',
            overview: 'Byte is a custom-fitted tooth cap positioned across two premolars, integrating a multi-electrode biosensor array, capable of monitoring six salivary biomarkers. This provides personalised guidance to improve circadian alignment through diet optimisation, eating windows, and sleep realignment.',
            process: 'Biomarker signals are analysed using neuroendocrine modelling that combines ordinary differential equation (ODE) simulation with machine-learning regression to estimate circadian phase and compute a Circadian Health Index. This feeds an AI system using a knowledge graph and food–biomarker lookup tables to generate personalised recommendations for meal timing, nutrient composition, and activity scheduling. \n\nEngineering feasibility was evaluated through sensor modelling, material testing, power analysis, and manufacturing design. Finite element analysis confirmed structural durability under bite forces, while chemical testing verified the stability of PDMS-coated PETG in the oral environment. A galvanic biofuel cell was identified as the most viable energy source, integrated through roll-to-roll printed electronics within over moulded polymer structures for scalable manufacturing. \n\nValidation combined digital and physical simulations with expert consultation across dentistry, biosensing, manufacturing, and machine learning. Byte demonstrates a roadmap towards minimally invasive, circadian health management - as enabling technologies improve by 2045.',
            tags: ['User Research', 'Scientific Testing', 'Simulation Analysis', 'DFMA'],
            heroImage: 'images/project-02-hero.jpg',
            images: ['images/project-02-detail-1.jpg', 'images/project-02-detail-2.jpg', 'images/project-02-detail-3.jpg', 'images/project-02-detail-4.jpg', 'images/project-02-detail-5.jpg'],
            portfolioLink: '',
            captions: ['', '', '', '', '']
        },
        {
            id: 3,
            title: 'AIESEC Hackathon',
            category: 'Robotics Competition',
            year: '2024',
            role: 'Design Engineer',
            duration: '8 Months',
            overview: 'A winning project for a robotics hackathon, hosted by AIESEC. Briefed to design and manufacture a robotic mascot for the company to present at conferences across the world - focusing on the brand’s message of worldwide connections.',
            process: 'We designed a self-balancing robot, constructed in the form of a globe, with a magnetic figurine that appears to walk upon its surface as it moves. The 3d printed shell holds an ESP32 which controls two DC motors, enabling multi-directional movement. The motors extend outward and drive the rotation of the outer shell. As the sphere moves, this inner housing will remain stabilised by additional weights. The manufacturing of the robot is currently underway, due to be finished by November.',
            tags: ['Robotics', 'Electronics', 'Fusion 360', 'Presentation'],
            heroImage: 'images/project-03-hero.jpg',
            images: ['images/project-03-detail-1.jpg', 'images/project-03-detail-2.jpg', 'images/project-03-detail-3.jpg', 'images/project-03-detail-4.jpg', 'images/project-03-detail-5.jpg'],
            portfolioLink: '',
            captions: ['', '', '', '', '']
        },
        {
            id: 4,
            title: 'Ponder',
            category: 'Audio Experience Design',
            year: '2026',
            role: 'Audio Engineer',
            duration: '3 Months',
            overview: 'Exploring the design and implementation of an interactive audio design installation inspired by the dynamics of a koi pond. The installation creates a calm, immersive environment where users draw virtual fish and generate sound through vocal input, which is then translated into musical output in real time.',
            process: 'Each fish moves within the pond, and its position directly influences the spatialisation of sound. As a result, the system produces a continuously evolving soundscape, where audio is distributed in space based on the movement and location of each fish. \n\nThe system uses pitch detection and mapping techniques to convert input signals into instrument playback, while instrument selection and interaction design were guided by the koi pond theme to evoke fluidity, tranquility and organic movement. \n\nDesigned for a public, museum-like environment, the installation must operate reliably under var ying levels of background noise and user behaviour. Both the audio processing pipeline and hardware selection were therefore carefully considered to ensure stability and responsiveness.',
            tags: ['MaxMSP', 'Python', 'Audio Mechanics', 'User Experience'],
            heroImage: 'images/project-04-hero.jpg',
            images: ['images/project-04-detail-1.jpg', 'images/project-04-detail-2.jpg', 'images/project-04-detail-3.jpg', 'images/project-04-detail-4.jpg', 'images/project-04-detail-5.jpg'],
            portfolioLink: '',
            captions: ['', '', '', '', '']
        },
        {
            id: 5,
            title: 'Temporomandibular FEA',
            category: 'Finite Element Analysis',
            year: '2024',
            role: 'Mechanical Engineer',
            duration: '5 Months',
            overview: 'Report analysis and redesign of the condyle for weight reduction and structural integrity. This is thhe section of a an implant which is attached directly to the mandible and is hinged onto the fossa.',
            process: 'Two varying materials were assessed for the implant, as well as the original and weight-optimised design. Mutilple simulations were ran to assure structural integrity and stress distribution. The optimised redesign was successful, passing all tests, and providing a 28% reduction in overall weight - despite it reducing natural frequency slightly and adding several areas of higher stress concentration, it still much exceeded the fundamental frequency of 50Hz.',
            tags: ['Ansys', 'Scientific Reporting', 'Medical Design', 'Optimisation'],
            heroImage: 'images/project-05-hero.jpg',
            images: ['images/project-05-detail-1.jpg', 'images/project-05-detail-2.jpg', 'images/project-05-detail-3.jpg', 'images/project-05-detail-4.jpg', 'images/project-05-detail-5.jpg'],
            portfolioLink: '',
            captions: ['', '', '', '', '']
        },
        {
            id: 6,
            title: 'The HighLighter',
            category: 'Physical Electronics',
            year: '2024',
            role: 'Design Engineer',
            duration: '2 Months',
            overview: 'A desk device which is utilised for directional visibility when reading or writing in a dark environment.',
            process: 'The initial concept was to design a product which allowed the user to read to write without the need to use a large light source (disturbing others in the room) or to constantly adjust a small book light. \n\nThe lamp head is attached to two servo motors which allow full axial movement. Under the base at which the user places sheets of paper or a book, lies a series of hall effect sensors - assembled in a grid pattern. The pen/stylus-guide features a magnetic tip which, when run over a hallf effect sensor, triggers the lamp head to move and illuminate the given position. \n\nThis gives the function of a moving spotlight, tracing the users movement actoss the page.',
            tags: ['C++', 'Electronics', 'Hands-on', 'Experience Design'],
            heroImage: 'images/project-06-hero.jpg',
            images: ['images/project-06-detail-1.jpg', 'images/project-06-detail-2.jpg', 'images/project-06-detail-3.jpg', 'images/project-06-detail-4.jpg', 'images/project-06-detail-5.jpg'],
            portfolioLink: '',
            captions: ['', '', '', '', '']
        },
        {
            id: 7,
            title: 'Thermofluids Design',
            category: 'Thermodynamics',
            year: '2024',
            role: 'Mechanical Engineer',
            duration: '3 Months',
            overview: 'Designing an EV car for aerodynamic improvement and battery cooling efficiency. Both tested via Ansys simulations.',
            process: 'Tasked with redesigning a pickup vehicle for better fuel efficiency through aerodynamic improvements and an optimised battery cooling design. \n\nCFD results were compared to wind tunnel testing measurements; 3D printing and bolting my redesigned truck into the tunnel to get a more accurate gauge of improvements to drag reduction. \n\nThe cooling system was designed to implement efficient heat transfer, whilst ensuring pressure drop across the pipeline is as low as possible and surface coverage is at a maximum. After optimisation and design changes, final readings of 178Pa pressure drop, 39oC average temperature and 43.9oC maximum temperature were recorded for the serpentine pipeline design. These readings were taken from a highly accurate CFD analysis of the battery module and cooling plate to simulate a real-life scenario of battery cooling.',
            tags: ['Ansys', 'Scientific Reporting', 'Optimisation', 'Automotive Design'],
            heroImage: 'images/project-07-hero.jpg',
            images: ['images/project-07-detail-1.jpg', 'images/project-07-detail-2.jpg', 'images/project-07-detail-3.jpg', 'images/project-07-detail-4.jpg', 'images/project-07-detail-5.jpg'],
            portfolioLink: '',
            captions: ['', '', '', '', '']
        },
        {
            id: 8,
            title: 'Leap Pen',
            category: 'Medical Design Engineering',
            year: '2023',
            role: 'Medical Design Engineer',
            duration: '7 Months',
            overview: 'An Insulin Pen body, redesigned to suit young Type 1 Diabetics. Aiming to help them overcome a fear of needles, as well as teach them how to take care of their autoimmune disease via an interactive app.',
            process: 'Describe your design and engineering process.',
            tags: ['Human-centered Design', 'Medical Regulations', 'Sustainability Analysis', 'Fusion 360'],
            heroImage: 'images/project-08-hero.jpg',
            images: ['images/project-08-detail-1.jpg', 'images/project-08-detail-2.jpg', 'images/project-08-detail-3.jpg', 'images/project-08-detail-4.jpg', 'images/project-08-detail-5.jpg'],
            portfolioLink: '',
            captions: ['', '', '', '', '']
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

    var heroImg = el('detailHeroImg');
    heroImg.onerror = function () { this.parentElement.classList.add('placeholder'); };
    heroImg.parentElement.classList.remove('placeholder');
    heroImg.src = project.heroImage;
    heroImg.alt = project.title;

    // Gallery images 1–5 map directly to detailImg1–detailImg5
    for (var i = 1; i <= 5; i++) {
        var img = el('detailImg' + i);
        if (!img) continue;
        if (project.images[i - 1]) {
            img.onerror = function () { this.parentElement.classList.add('placeholder'); };
            img.parentElement.classList.remove('placeholder');
            img.src = project.images[i - 1];
            img.alt = project.title + ' detail ' + i;
        } else {
            img.parentElement.classList.add('placeholder');
        }
    }

    // Captions
    if (project.captions) {
        for (var c = 0; c < 5; c++) {
            var cap = el('detailCaption' + (c + 1));
            if (cap) cap.textContent = project.captions[c] || '';
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
