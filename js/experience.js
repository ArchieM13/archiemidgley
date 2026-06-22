/* ============================================
   EXPERIENCE DETAIL PAGE
   ============================================ */

(function () {
    'use strict';

    var experiences = [
        {
            id: 1,
            company: 'Shape Shoes',
            category: 'Footwear',
            period: '2023 — Present',
            role: 'COO & Design Engineer',
            location: 'London',
            overview: 'A London-based, 3D-printed footwear startup, designing shoes with major worldwide collaborations to tell artist stories through physical design. Bringing together expertise in prototyping, manufacture, and computational design to take a concept from blank canvas to complete product; highlighting the advantage of additive manufacturing for prototyping. The process leverages TPU 3D printing to produce these rapid design iterations within days. After design finalisation, we organised a seamless transition to mass manufacture, with injection moulding being the best option for both comfort and profit margins.',
            responsibilities: 'Leading initial client communications, fostering a strong relationship between the company and clients by coordinating meetings to discuss design elements and manufacturing processes. This began with our first collaboration with a famous London street artist, Slawn, whose previous projects include the Brit Awards, F1 liveries and official Nike collaboration shoes. Organisation of design reworks and marketing strategies was organised by myself. \n\nAll design prototyping was done via 3D printing, with the print farm managed by myself, optimising print parameters and material usage for small-batch production. This meant that we could make design iterations - prompted by the artist - and deliver the updated version to him within 2 days. A small run of celebrity-exclusive slides were also manufactured with personal details on the sole. \n\nI managed marketing to extend the outreach of the product - print, promotions & digital. I directed and edited various promotional videos, and featured in various interviews for high-street footwear stores. Following this, we made an appearance in Esquire magazine for the slides.',
            tags: ['Additive Manufacturing', 'CAD', 'DFMA',  'Marketing', 'Entrepreneurship'],
            heroImage: 'images/experience-01-detail-1.jpg.png',
            images: [
                'images/experience-01-detail-2.jpg.png',
                'images/experience-01-detail-3.jpg',
                'images/experience-01-detail-4.jpg.png',
                'images/experience-01-detail-5.jpg.png',
                'images/experience-01-detail-6.jpg'
            ]
        },
        {
            id: 2,
            company: 'Orthoson',
            category: 'MedTech',
            period: 'Mar 2026 — Present',
            role: 'Medical & Mechanical Engineer',
            location: 'Oxford',
            overview: 'An Oxford University MedTech spinout, manufacturing a bio-structural gel to restore disc mechano-biology to treat the causes of degeneration (causing lower-back pain). This involves a low-viscosity injectable which follows the fissures of degeneration and gels as it enters the Nucleus Pulposus - mimicking the body’s own tissue. The procedure is micro-invasive and is completed in <30minutes, via the use of a handheld injection system which features a pressure sensor to monitor the surgery.',
            responsibilities: 'Tasked with a full redesign of the pressure monitoring and user interface of the injection system. Prototyping handles and grips for the device for optimal surgeon comfort and maneuroverbility, which would enclose the pressure monitor and display electronics. Button placement and early-stage electronics prototyping involved the use of a Formlabs 3BL resin printer and basic circuitry - ESP32 and an LCD. The user interface was coded entirely in C++, displaying pressure readings as a graph, with key readings and a full alert system for pressure fluctuation scenarios and trends. I solved a data handling problem via the integration of encrypted QR scanning at the end of the procedure; coded in HTML. \n\nAfter receiving positive feedback on the design and the user interaction process at multiple meetings, I was assigned by Rich Simmons (CEO) to manufacture 3 full demo devices which could be taken by himself and Nick Birch to their next physician board meeting in the US. These devices would be used to demonstrate the future of the injection system design and UI, to gain vital feedback from people who will know best on what makes a medical device well designed or diﬃcult to use. \n\nThe design process took many steps to reach a cohesive product build. With the requirement to keep the enclosure size as small as possible, whilst holding the pressure monitor, display module, internal electronics board, a push button and a charging/power system. Although the initial use of a development board was quick and easy to show for feedback, I wanted to ensure manufacturability for the device – utilising a custom PCB instead. This design process was entirely self-taught. \n\nAdditional engineering based projects included the design of Go/No-go quality control jigs for the injection system parts, which were CNC milled. Also, the design of a control box, to be used by the physician in live animal procedure tests.',
            tags: ['DFMA', 'Prototyping', 'Solidworks', 'Medical Regulations', 'PCB Design'],
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
    el('expOverview').innerHTML = exp.overview.split('\n\n').map(function(p){ return '<p class="project-detail__text">' + p + '</p>'; }).join('');
    el('expResponsibilities').innerHTML = exp.responsibilities.split('\n\n').map(function(p){ return '<p class="project-detail__text">' + p + '</p>'; }).join('');

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
