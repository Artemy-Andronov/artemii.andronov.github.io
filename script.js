// Ждем полной загрузки страницы, включая изображения
window.addEventListener('load', () => {
    const preloader = document.querySelector('.preloader');
    preloader.classList.add('hidden');
    
    // Запускаем все интерактивные скрипты после исчезновения прелоадера
    setTimeout(initInteractive, 500); // Небольшая задержка для плавности
});

function initInteractive() {

    // Проверка на запрос пользователя об уменьшении анимаций
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // --- 1. INTERACTIVE PARTICLES BACKGROUND ---
    tsParticles.load("tsparticles", {
        fpsLimit: 60,
        particles: {
            number: { value: 80, density: { enable: true, value_area: 800 } },
            color: { value: "#ffffff" },
            shape: { type: "circle" },
            opacity: { value: 0.5, random: true },
            size: { value: 1.5, random: true },
            move: {
                enable: true,
                speed: 1,
                direction: "none",
                random: true,
                straight: false,
                out_mode: "out",
            },
            links: {
                enable: true,
                distance: 150,
                color: "rgba(255, 255, 255, 0.2)",
                opacity: 0.4,
                width: 1,
            },
        },
        interactivity: {
            detect_on: "canvas",
            events: {
                onhover: { enable: true, mode: "repulse" },
                onclick: { enable: true, mode: "push" },
            },
            modes: {
                repulse: { distance: 100, duration: 0.4, speed: 1, factor: 20, easing: "ease-out-quad" },
                push: { particles_nb: 4 },
            },
        },
        detectRetina: true,
    });


    // --- 2. ЭФФЕКТЫ, ЗАВИСЯЩИЕ ОТ ДВИЖЕНИЯ ---
    if (!prefersReducedMotion) {
        // --- 3D TILT EFFECT FOR CARDS ---
        const tiltCards = document.querySelectorAll('.project-card, .service-card');
        tiltCards.forEach(card => {
            const maxTilt = 10;
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = ((y - centerY) / centerY) * -maxTilt;
                const rotateY = ((x - centerX) / centerX) * maxTilt;
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
                card.style.setProperty('--mouse-x', `${x}px`);
                card.style.setProperty('--mouse-y', `${y}px`);
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
            });
        });

        // --- MAGNETIC EFFECT FOR BUTTONS & LINKS ---
        const magneticElements = document.querySelectorAll('.btn, .nav-menu a, .social-links a');
        const magneticStrength = 0.5;
        magneticElements.forEach(el => {
            el.addEventListener('mousemove', function(e) {
                const rect = this.getBoundingClientRect();
                const x = e.clientX - (rect.left + rect.width / 2);
                const y = e.clientY - (rect.top + rect.height / 2);
                this.style.transition = 'transform 0.1s ease-out';
                this.style.transform = `translate(${x * magneticStrength}px, ${y * magneticStrength}px)`;
            });
            el.addEventListener('mouseleave', function() {
                this.style.transition = 'transform 0.3s ease-out';
                this.style.transform = 'translate(0, 0)';
            });
        });

        // --- SCROLL PARALLAX EFFECT ---
        function initScrollParallax() {
            document.querySelectorAll('.sec-number, .neon-circle').forEach(el => el.classList.add('parallax-element'));
            const parallaxElements = document.querySelectorAll('.parallax-element');
            function updateParallax() {
                const scrollY = window.scrollY;
                parallaxElements.forEach(el => {
                    const speed = parseFloat(el.dataset.parallaxSpeed) || (el.classList.contains('sec-number') ? -0.15 : 0.1);
                    const offset = scrollY * speed;
                    el.style.transform = `translateY(${offset}px)`;
                });
            }
            window.addEventListener('scroll', updateParallax, { passive: true });
            updateParallax();
        }
        initScrollParallax();
    }


    // --- 3. CUSTOM CURSOR ---
    const cursor = document.querySelector('.cursor');
    const follower = document.querySelector('.cursor-follower');
    let posX = 0, posY = 0;
    let mouseX = 0, mouseY = 0;
    
    function updateCursorPosition() {
        posX += (mouseX - posX) / 9;
        posY += (mouseY - posY) / 9;
        if (follower) follower.style.transform = `translate3d(${posX}px, ${posY}px, 0)`;
        if (cursor) cursor.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
        requestAnimationFrame(updateCursorPosition);
    }
    requestAnimationFrame(updateCursorPosition);
    
    window.addEventListener('mousemove', e => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    const hoverables = document.querySelectorAll('a, button, .project-card, .service-card');
    hoverables.forEach(el => {
        el.addEventListener('mouseenter', () => document.body.classList.add('hovered'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('hovered'));
    });


    // --- 4. TYPING EFFECT ---
    const typingText = document.querySelector('.typing-text');
    if (typingText) {
        const words = ["РЕШЕНИЯ", "ИНСАЙТЫ", "ИННОВАЦИИ"]; 
        let wordIndex = 0, charIndex = 0, isDeleting = false;
        function type() {
            const currentWord = words[wordIndex];
            typingText.innerHTML = currentWord.substring(0, charIndex) + '<span style="color:var(--accent)">_</span>';
            let typeSpeed = 100;
            if (isDeleting) typeSpeed /= 2;
            if (!isDeleting && charIndex < currentWord.length) {
                charIndex++;
                setTimeout(type, typeSpeed);
            } else if (isDeleting && charIndex > 0) {
                charIndex--;
                setTimeout(type, typeSpeed);
            } else {
                isDeleting = !isDeleting;
                if (!isDeleting) {
                    wordIndex = (wordIndex + 1) % words.length;
                    typeSpeed = 2000;
                } else {
                    typeSpeed = 1000;
                }
                setTimeout(type, typeSpeed);
            }
        }
        setTimeout(type, 1000);
    }

    // --- 5. REPEATING SCROLL-REVEAL ANIMATIONS & PROGRESS BAR ---
    const scrollProgressBar = document.querySelector('.scroll-progress-bar');
    function updateScrollProgress() {
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const currentScroll = window.scrollY;
        const scrollFraction = currentScroll / maxScroll;
        if (scrollProgressBar) {
            scrollProgressBar.style.transform = `scaleX(${scrollFraction})`;
        }
    }
    window.addEventListener('scroll', updateScrollProgress);
    updateScrollProgress();

    function initAdvancedReveals() {
        const observerOptions = {
            threshold: 0.1
        };
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    const textElements = entry.target.querySelectorAll('.section-title, .lead-text');
                    textElements.forEach(textEl => {
                        if (!textEl.dataset.animated) {
                            const words = textEl.innerText.split(' ');
                            textEl.innerHTML = '';
                            words.forEach((word, index) => {
                                const wordSpan = document.createElement('span');
                                wordSpan.className = 'text-reveal-container';
                                wordSpan.innerHTML = `<span class="text-reveal-item" style="transition-delay: ${index * 0.05}s">${word}&nbsp;</span>`;
                                textEl.appendChild(wordSpan);
                            });
                            textEl.dataset.animated = 'true';
                        }
                    });
                    const skillsList = entry.target.querySelector('.skills-list');
                    if (skillsList && !skillsList.dataset.animated) {
                        const skills = skillsList.querySelectorAll('li');
                        skills.forEach((skill, index) => {
                            skill.style.transitionDelay = `${index * 0.07}s`;
                        });
                        skillsList.dataset.animated = 'true';
                    }
                } 
                else {
                    entry.target.classList.remove('active');
                }
            });
        }, observerOptions);
        const revealElements = document.querySelectorAll('.reveal');
        revealElements.forEach(el => observer.observe(el));
    }
    initAdvancedReveals();


    // --- 6. HEADER SCROLL EFFECT ---
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 50);
    });

    // --- 7. MOBILE MENU ---
    const burger = document.querySelector('.burger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-menu li a');
    function toggleNav() {
        navMenu.classList.toggle('active');
        burger.children[0].style.transform = navMenu.classList.contains('active') ? 'rotate(45deg) translate(5px, 5px)' : 'none';
        burger.children[1].style.transform = navMenu.classList.contains('active') ? 'rotate(-45deg) translate(4px, -5px)' : 'none';
    }
    burger.addEventListener('click', toggleNav);
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) {
                toggleNav();
            }
        });
    });

    // --- 8. FORM SUBMISSION HANDLING ---
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Предотвращаем стандартную перезагрузку страницы

            const submitButton = this.querySelector('button[type="submit"]');
            const name = this.elements['name'].value;
            const email = this.elements['email'].value;
            const message = this.elements['message'].value;
            
            if (!name || !email || !message) {
                formStatus.textContent = 'Пожалуйста, заполните все поля.';
                formStatus.className = 'form-status error';
                return;
            }

            submitButton.disabled = true;
            submitButton.textContent = 'ОТПРАВКА...';
            
            // Имитируем отправку данных на сервер
            setTimeout(() => {
                formStatus.textContent = 'Ваше сообщение успешно отправлено!';
                formStatus.className = 'form-status success';
                
                submitButton.disabled = false;
                submitButton.textContent = 'ОТПРАВИТЬ';
                
                this.reset(); // Очищаем форму
                
                // Убираем сообщение через 5 секунд
                setTimeout(() => {
                    formStatus.className = 'form-status';
                }, 5000);

            }, 1500);
        });
    }
}