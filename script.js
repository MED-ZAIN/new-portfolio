/* ============================================
   PORTFOLIO — Script principal
============================================ */

(() => {
    'use strict';

    /* ===== PRELOADER ===== */
    const preloader = document.getElementById('preloader');
    const fill = document.getElementById('preloaderFill');
    const pct = document.getElementById('preloaderPercent');
    let progress = 0;
    document.body.style.overflow = 'hidden';

    const setProgress = (val) => {
        progress = Math.min(val, 100);
        if (fill) fill.style.width = progress + '%';
        if (pct) pct.textContent = Math.round(progress) + '%';
    };

    const fakeProgress = setInterval(() => {
        setProgress(progress + Math.random() * 12);
        if (progress >= 90) clearInterval(fakeProgress);
    }, 120);

    const hidePreloader = () => {
        clearInterval(fakeProgress);
        setProgress(100);
        setTimeout(() => {
            preloader.classList.add('hidden');
            document.body.style.overflow = '';
        }, 400);
    };

    if (document.readyState === 'complete') {
        setTimeout(hidePreloader, 600);
    } else {
        window.addEventListener('load', () => setTimeout(hidePreloader, 300));
        setTimeout(hidePreloader, 3000);
    }

    /* ===== ORBE SOURIS ===== */
    const orb = document.getElementById('mouseOrb');
    if (orb) {
        let orbX = window.innerWidth / 2;
        let orbY = window.innerHeight / 2;
        document.addEventListener('mousemove', (e) => {
            orbX += (e.clientX - orbX) * 0.08;
            orbY += (e.clientY - orbY) * 0.08;
            orb.style.left = orbX + 'px';
            orb.style.top = orbY + 'px';
        });
    }

    /* ===== CURSEUR PERSONNALISÉ ===== */
    const cursor = document.querySelector('.cursor');
    const follower = document.querySelector('.cursor-follower');
    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;

    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursor.style.left = mouseX + 'px';
            cursor.style.top = mouseY + 'px';
        });

        const animateFollower = () => {
            followerX += (mouseX - followerX) * 0.15;
            followerY += (mouseY - followerY) * 0.15;
            follower.style.left = followerX + 'px';
            follower.style.top = followerY + 'px';
            requestAnimationFrame(animateFollower);
        };
        animateFollower();

        document.querySelectorAll('a, button, .project-card, [role="button"]').forEach(el => {
            el.addEventListener('mouseenter', () => follower.classList.add('hover'));
            el.addEventListener('mouseleave', () => follower.classList.remove('hover'));
        });

        document.addEventListener('mouseleave', () => {
            cursor.style.opacity = '0';
            follower.style.opacity = '0';
        });
        document.addEventListener('mouseenter', () => {
            cursor.style.opacity = '1';
            follower.style.opacity = '1';
        });
    }

    /* ===== BOUTONS MAGNÉTIQUES ===== */
    document.querySelectorAll('.magnetic').forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            btn.style.transform = `translate(${x * 0.18}px, ${y * 0.18}px) translateY(-2px)`;
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = '';
        });
    });

    /* ===== PARTICULES CANVAS ===== */
    const canvas = document.getElementById('particles');
    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouse = { x: null, y: null };

    const resizeCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    document.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });
    document.addEventListener('mouseleave', () => { mouse.x = null; mouse.y = null; });

    class Particle {
        constructor() {
            this.reset();
            this.y = Math.random() * canvas.height;
        }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.4;
            this.speedY = (Math.random() - 0.5) * 0.4;
            this.opacity = Math.random() * 0.5 + 0.2;
        }
        update() {
            if (mouse.x !== null) {
                const dx = this.x - mouse.x;
                const dy = this.y - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 100) {
                    this.x += dx / dist * 1.5;
                    this.y += dy / dist * 1.5;
                }
            }
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
                this.reset();
            }
        }
        draw() {
            const theme = document.documentElement.getAttribute('data-theme');
            const color = theme === 'light' ? '99, 102, 241' : '168, 85, 247';
            ctx.fillStyle = `rgba(${color}, ${this.opacity})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    const initParticles = () => {
        particles = [];
        const count = Math.min(80, Math.floor((canvas.width * canvas.height) / 18000));
        for (let i = 0; i < count; i++) particles.push(new Particle());
    };

    const connectParticles = () => {
        const theme = document.documentElement.getAttribute('data-theme');
        const color = theme === 'light' ? '99, 102, 241' : '168, 85, 247';
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 120) {
                    ctx.strokeStyle = `rgba(${color}, ${0.15 * (1 - dist / 120)})`;
                    ctx.lineWidth = 0.5;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    };

    const animateParticles = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => { p.update(); p.draw(); });
        connectParticles();
        requestAnimationFrame(animateParticles);
    };

    initParticles();
    animateParticles();
    window.addEventListener('resize', initParticles);

    /* ===== NAVIGATION : SCROLL & MENU MOBILE ===== */
    const navbar = document.getElementById('navbar');
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.querySelector('.nav-links');
    const navLinksItems = document.querySelectorAll('.nav-link');

    const onScroll = () => {
        const scrolled = window.scrollY > 50;
        navbar.classList.toggle('scrolled', scrolled);

        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (window.scrollY / docHeight) * 100;
        document.querySelector('.scroll-progress').style.width = progress + '%';

        const sections = document.querySelectorAll('section[id]');
        let current = '';
        sections.forEach(s => {
            const top = s.offsetTop - 100;
            if (window.scrollY >= top) current = s.id;
        });
        navLinksItems.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === '#' + current);
        });

        document.getElementById('backToTop').classList.toggle('visible', window.scrollY > 600);
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        navLinks.classList.toggle('open');
    });

    navLinksItems.forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            navLinks.classList.remove('open');
        });
    });

    /* ===== THÈME ===== */
    const themeToggle = document.getElementById('themeToggle');
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);

    themeToggle.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
    });

    /* ===== EFFET TYPING ===== */
    const roles = [
        'Développeur Full Stack',
        'Designer UI/UX',
        'Architecte Web',
        'Créateur d\'expériences'
    ];
    const typedRole = document.getElementById('typedRole');
    let roleIndex = 0, charIndex = 0, isDeleting = false;

    const typeEffect = () => {
        const current = roles[roleIndex];
        if (isDeleting) {
            typedRole.textContent = current.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typedRole.textContent = current.substring(0, charIndex + 1);
            charIndex++;
        }

        let speed = isDeleting ? 50 : 100;
        if (!isDeleting && charIndex === current.length) {
            speed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            speed = 500;
        }
        setTimeout(typeEffect, speed);
    };
    typeEffect();

    /* ===== COMPTEUR STATS ===== */
    const animateCounter = (el) => {
        const target = parseInt(el.dataset.target);
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        const update = () => {
            current += step;
            if (current >= target) {
                el.textContent = target;
            } else {
                el.textContent = Math.floor(current);
                requestAnimationFrame(update);
            }
        };
        update();
    };

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.stat-number').forEach(el => statsObserver.observe(el));

    /* ===== ANIMATION ON SCROLL ===== */
    const aosObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('aos-animate');
                if (entry.target.classList.contains('skill-card')) {
                    entry.target.classList.add('animate');
                }
                aosObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('[data-aos]').forEach(el => {
        const delay = el.dataset.aosDelay;
        if (delay) el.style.transitionDelay = (parseInt(delay) / 1000) + 's';
        aosObserver.observe(el);
    });

    /* ===== SKILLS TABS ===== */
    const tabBtns = document.querySelectorAll('.tab-btn');
    const skillsPanels = document.querySelectorAll('.skills-panel');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tab = btn.dataset.tab;
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            skillsPanels.forEach(p => {
                p.classList.toggle('active', p.dataset.panel === tab);
            });
            const activePanel = document.querySelector(`.skills-panel[data-panel="${tab}"]`);
            activePanel.querySelectorAll('.skill-card').forEach(card => {
                card.classList.remove('animate');
                requestAnimationFrame(() => card.classList.add('animate'));
            });
        });
    });

    /* ===== FILTRE PROJETS ===== */
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.dataset.filter;
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            projectCards.forEach((card, i) => {
                const matches = filter === 'all' || card.dataset.category === filter;
                if (matches) {
                    card.classList.remove('hidden');
                    card.style.animation = 'none';
                    requestAnimationFrame(() => {
                        card.style.animation = `fadeIn 0.5s ${i * 0.08}s var(--ease-out) both`;
                    });
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });

    /* ===== EFFET TILT 3D PROJETS ===== */
    projectCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -6;
            const rotateY = ((x - centerX) / centerX) * 6;
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });

    /* ===== MODAL PROJETS ===== */
    const modal = document.getElementById('projectModal');
    const modalClose = document.getElementById('modalClose');
    const modalTitle = document.getElementById('modalTitle');
    const modalDescription = document.getElementById('modalDescription');
    const modalTags = document.getElementById('modalTags');
    const modalHeaderBg = document.getElementById('modalHeaderBg');
    const modalEmoji = document.getElementById('modalEmoji');
    const modalYear = document.getElementById('modalYear');
    const modalCategory = document.getElementById('modalCategory');
    const modalStatus = document.getElementById('modalStatus');
    const modalLinkLive = document.getElementById('modalLinkLive');
    const modalLinkGithub = document.getElementById('modalLinkGithub');

    const openModal = (card) => {
        modalTitle.textContent = card.dataset.title || '';
        modalDescription.textContent = card.dataset.description || '';
        const tech = card.dataset.tech ? card.dataset.tech.split(',') : [];
        modalTags.innerHTML = tech.map(t => `<span>${t.trim()}</span>`).join('');
        modalHeaderBg.style.background = card.dataset.grad || 'var(--accent-gradient)';
        modalEmoji.textContent = card.dataset.emoji || '🚀';
        if (modalYear) modalYear.textContent = card.dataset.year || '—';
        if (modalCategory) modalCategory.textContent = card.dataset.cat || '—';
        if (modalStatus) modalStatus.textContent = card.dataset.status || '—';
        if (modalLinkLive) modalLinkLive.href = card.dataset.link || '#';
        if (modalLinkGithub) modalLinkGithub.href = card.dataset.github || '#';

        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        modal.classList.remove('open');
        document.body.style.overflow = '';
    };

    projectCards.forEach(card => {
        card.addEventListener('click', (e) => {
            if (e.target.closest('.project-links')) return;
            openModal(card);
        });

        card.setAttribute('role', 'button');
        card.setAttribute('tabindex', '0');
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openModal(card);
            }
        });
    });

    if (modalClose) modalClose.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

    /* ===== FORMULAIRE DE CONTACT ===== */
    const form = document.getElementById('contactForm');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const submitBtn = form.querySelector('.btn-submit');
        const btnText = submitBtn.querySelector('.btn-text');
        const originalText = btnText.textContent;

        btnText.textContent = 'Envoi en cours…';
        submitBtn.disabled = true;

        setTimeout(() => {
            btnText.textContent = '✓ Message envoyé !';
            submitBtn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
            form.reset();

            setTimeout(() => {
                btnText.textContent = originalText;
                submitBtn.style.background = '';
                submitBtn.disabled = false;
            }, 3000);
        }, 1500);
    });

    /* ===== LABEL FLOTTANT ===== */
    document.querySelectorAll('.form-group input, .form-group textarea').forEach(input => {
        input.setAttribute('placeholder', ' ');
    });

    /* ===== BACK TO TOP ===== */
    document.getElementById('backToTop').addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    /* ===== ANNÉE FOOTER ===== */
    document.getElementById('year').textContent = new Date().getFullYear();

    /* ===== SMOOTH SCROLL POUR ANCRES ===== */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                const offset = 80;
                const top = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });

    /* ===== PARALLAX BLOBS HERO ===== */
    const blobs = document.querySelectorAll('.blob');
    document.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 2;
        const y = (e.clientY / window.innerHeight - 0.5) * 2;
        blobs.forEach((blob, i) => {
            const factor = (i + 1) * 15;
            blob.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
        });
    });

    /* ===== EASTER EGG : Konami code ===== */
    const konami = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
    let konamiIndex = 0;
    document.addEventListener('keydown', (e) => {
        if (e.key === konami[konamiIndex]) {
            konamiIndex++;
            if (konamiIndex === konami.length) {
                document.body.style.animation = 'rotate 2s linear';
                setTimeout(() => document.body.style.animation = '', 2000);
                konamiIndex = 0;
            }
        } else {
            konamiIndex = 0;
        }
    });

    onScroll();

    console.log('%c👋 Bienvenue sur mon portfolio !', 'color: #6366f1; font-size: 20px; font-weight: bold;');
    console.log('%cTu inspectes le code ? Curieux comme moi 😄', 'color: #a855f7; font-size: 14px;');
})();
