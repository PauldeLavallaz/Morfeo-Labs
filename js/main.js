/* ========================================
   MORFEO LANDING PAGE - JavaScript
   Optimized for Performance + UX
   ======================================== */

document.addEventListener('DOMContentLoaded', function() {

    // ========================================
    // Performance: Use passive listeners
    // ========================================
    const passiveSupported = (() => {
        let passive = false;
        try {
            const options = {
                get passive() {
                    passive = true;
                    return false;
                }
            };
            window.addEventListener("test", null, options);
            window.removeEventListener("test", null, options);
        } catch (err) {
            passive = false;
        }
        return passive;
    })();

    const passiveOptions = passiveSupported ? { passive: true } : false;

    // ========================================
    // Scroll-triggered Animations
    // Optimized with requestAnimationFrame
    // ========================================
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.15
    };

    const observerCallback = (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                requestAnimationFrame(() => {
                    entry.target.classList.add('visible');
                });
            }
        });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Select elements to animate
    const animateElements = document.querySelectorAll(
        '.problem-card, .solution-item, .outcome-card, .highlight-block, .comfy-block, .not-for, .is-for, .faq-item'
    );

    animateElements.forEach(el => {
        el.classList.add('animate-on-scroll');
        observer.observe(el);
    });

    // ========================================
    // Smooth Scroll for anchor links
    // ========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');

            if (targetId === '#') {
                e.preventDefault();
                return;
            }

            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                e.preventDefault();
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ========================================
    // Floating CTA visibility control
    // Optimized with throttle
    // ========================================
    const floatingCta = document.getElementById('floatingCta');
    const heroSection = document.querySelector('.hero');
    const finalCtaSection = document.getElementById('agenda');
    const footerSection = document.querySelector('.footer');

    if (floatingCta && heroSection) {
        const floatingCtaObserver = new IntersectionObserver((entries) => {
            let hideFloating = false;

            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    hideFloating = true;
                }
            });

            // Check all sections visibility
            const heroVisible = heroSection.getBoundingClientRect().bottom > 100;
            const ctaVisible = finalCtaSection && finalCtaSection.getBoundingClientRect().top < window.innerHeight && finalCtaSection.getBoundingClientRect().bottom > 0;
            const footerVisible = footerSection && footerSection.getBoundingClientRect().top < window.innerHeight;

            requestAnimationFrame(() => {
                if (heroVisible || ctaVisible || footerVisible) {
                    floatingCta.classList.remove('visible');
                } else {
                    floatingCta.classList.add('visible');
                }
            });
        }, { threshold: [0, 0.1, 0.5, 1] });

        floatingCtaObserver.observe(heroSection);
        if (finalCtaSection) floatingCtaObserver.observe(finalCtaSection);
        if (footerSection) floatingCtaObserver.observe(footerSection);

        // Initial check
        setTimeout(() => {
            const heroVisible = heroSection.getBoundingClientRect().bottom > 100;
            if (!heroVisible) {
                floatingCta.classList.add('visible');
            }
        }, 1000);
    }

    // ========================================
    // FAQ Accordion
    // ========================================
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');

        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Close all items with animation
            faqItems.forEach(faqItem => {
                if (faqItem !== item) {
                    faqItem.classList.remove('active');
                    faqItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
                }
            });

            // Toggle current item
            requestAnimationFrame(() => {
                if (!isActive) {
                    item.classList.add('active');
                    question.setAttribute('aria-expanded', 'true');
                } else {
                    item.classList.remove('active');
                    question.setAttribute('aria-expanded', 'false');
                }
            });
        });
    });

    // ========================================
    // Staggered animation for cards
    // ========================================
    function staggerAnimation(selector, delay = 100) {
        const elements = document.querySelectorAll(selector);
        elements.forEach((el, index) => {
            el.style.transitionDelay = `${index * delay}ms`;
        });
    }

    staggerAnimation('.problem-card', 100);
    staggerAnimation('.solution-item', 80);
    staggerAnimation('.faq-item', 60);

    // ========================================
    // Button hover ripple effect
    // ========================================
    const ctaButtons = document.querySelectorAll('.cta-button.primary');

    ctaButtons.forEach(button => {
        button.addEventListener('mouseenter', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            this.style.setProperty('--ripple-x', `${x}px`);
            this.style.setProperty('--ripple-y', `${y}px`);
        });
    });

    // ========================================
    // Parallax effect on hero background
    // Uses CSS custom properties for smooth animation
    // ========================================
    let ticking = false;

    function updateParallax() {
        const scrolled = window.pageYOffset;
        const heroHeight = heroSection ? heroSection.offsetHeight : 800;

        if (scrolled < heroHeight) {
            const parallaxValue = scrolled * 0.3;
            document.documentElement.style.setProperty('--parallax-offset', `${parallaxValue}px`);
        }

        ticking = false;
    }

    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }, passiveOptions);

    // ========================================
    // Preload hover images/links
    // ========================================
    const preloadLinks = document.querySelectorAll('a[href^="http"]');

    preloadLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            // Create preload hint for faster navigation
            const href = this.getAttribute('href');
            if (href && !document.querySelector(`link[href="${href}"]`)) {
                const preload = document.createElement('link');
                preload.rel = 'prefetch';
                preload.href = href;
                document.head.appendChild(preload);
            }
        }, { once: true });
    });

    // ========================================
    // Keyboard navigation for FAQ
    // ========================================
    faqItems.forEach((item, index) => {
        const question = item.querySelector('.faq-question');

        question.addEventListener('keydown', (e) => {
            let targetIndex;

            switch (e.key) {
                case 'ArrowDown':
                    e.preventDefault();
                    targetIndex = (index + 1) % faqItems.length;
                    faqItems[targetIndex].querySelector('.faq-question').focus();
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    targetIndex = (index - 1 + faqItems.length) % faqItems.length;
                    faqItems[targetIndex].querySelector('.faq-question').focus();
                    break;
                case 'Home':
                    e.preventDefault();
                    faqItems[0].querySelector('.faq-question').focus();
                    break;
                case 'End':
                    e.preventDefault();
                    faqItems[faqItems.length - 1].querySelector('.faq-question').focus();
                    break;
            }
        });
    });

    // ========================================
    // Reduce motion for accessibility
    // ========================================
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    if (prefersReducedMotion.matches) {
        document.documentElement.style.setProperty('--transition-fast', '0s');
        document.documentElement.style.setProperty('--transition-normal', '0s');
        document.documentElement.style.setProperty('--transition-slow', '0s');
    }

    // ========================================
    // Console welcome message
    // ========================================
    console.log('%c MORFEO ', 'background: linear-gradient(135deg, #a3e635, #84cc16); color: #050508; font-size: 24px; font-weight: bold; padding: 10px 20px; border-radius: 8px;');
    console.log('%cSistemas de contenido automatizado con IA', 'color: #9ca3af; font-size: 12px;');
    console.log('%cOptimizado con Marketing Psychology + Performance', 'color: #6b7280; font-size: 10px;');

});
