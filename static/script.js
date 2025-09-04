// Modern Sudoku AI Solver - JavaScript

// Check if GSAP is available
let gsapAvailable = false;
try {
    if (typeof gsap !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
        gsapAvailable = true;
        console.log('GSAP loaded successfully');
    }
} catch (error) {
    console.warn('GSAP not available, using fallback methods');
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing...');
    
    // Ensure elements are visible by default
    ensureVisibility();
    
    // Initialize navigation first (most important)
    initializeNavigation();
    
    // Initialize animations with error handling
    try {
        if (gsapAvailable) {
            initializeAnimations();
            initializeScrollEffects();
        }
        initializeInteractiveElements();
    } catch (error) {
        console.warn('Animation initialization failed:', error);
        // Fallback: ensure all content is visible
        ensureVisibility();
    }
});

// Ensure all content is visible by default
function ensureVisibility() {
    const aboutCards = document.querySelectorAll('.about-card');
    const featureItems = document.querySelectorAll('.feature-item');
    const sectionHeaders = document.querySelectorAll('.section-header');
    
    aboutCards.forEach(card => {
        card.style.opacity = '1';
        card.style.transform = 'none';
        card.style.visibility = 'visible';
    });
    
    featureItems.forEach(item => {
        item.style.opacity = '1';
        item.style.transform = 'none';
        item.style.visibility = 'visible';
    });
    
    sectionHeaders.forEach(header => {
        header.style.opacity = '1';
        header.style.transform = 'none';
        header.style.visibility = 'visible';
    });
}

// Simple smooth scroll function
function smoothScrollTo(targetElement, offset = 0) {
    if (!targetElement) {
        console.warn('Target element not found');
        return;
    }
    
    console.log('Scrolling to:', targetElement.id, 'with offset:', offset);
    
    const targetPosition = targetElement.offsetTop - offset;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    const duration = 1000;
    let start = null;
    
    function animation(currentTime) {
        if (start === null) start = currentTime;
        const timeElapsed = currentTime - start;
        const run = ease(timeElapsed, startPosition, distance, duration);
        window.scrollTo(0, run);
        if (timeElapsed < duration) requestAnimationFrame(animation);
    }
    
    function ease(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }
    
    requestAnimationFrame(animation);
}

// Navigation functionality - SIMPLIFIED AND RELIABLE
function initializeNavigation() {
    console.log('Initializing navigation...');
    
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.querySelector('.nav-menu');
    
    // Create overlay for mobile menu
    let navOverlay = document.querySelector('.nav-overlay');
    if (!navOverlay) {
        navOverlay = document.createElement('div');
        navOverlay.className = 'nav-overlay';
        document.body.appendChild(navOverlay);
    }
    
    // Mobile menu toggle
    if (navToggle) {
        navToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const isActive = navToggle.classList.contains('active');
            
            if (isActive) {
                // Close menu
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                navOverlay.classList.remove('active');
                document.body.style.overflow = '';
            } else {
                // Open menu
                navToggle.classList.add('active');
                navMenu.classList.add('active');
                navOverlay.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    }

    // Close menu when clicking overlay
    navOverlay.addEventListener('click', function() {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
        navOverlay.classList.remove('active');
        document.body.style.overflow = '';
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            navOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // NAVIGATION LINKS - SIMPLIFIED AND RELIABLE
    const navLinks = document.querySelectorAll('.nav-link');
    console.log('Found navigation links:', navLinks.length);
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Navigation link clicked:', this.getAttribute('href'));
            
            // Close mobile menu if open
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            navOverlay.classList.remove('active');
            document.body.style.overflow = '';
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                console.log('Target section found:', targetId);
                
                // Calculate offset for fixed navbar
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const offset = navbarHeight + 20;
                
                console.log('Scrolling with offset:', offset);
                
                // Use GSAP if available, otherwise use fallback
                if (gsapAvailable && ScrollToPlugin) {
                    console.log('Using GSAP ScrollTo');
                    gsap.to(window, {
                        duration: 1.5,
                        scrollTo: { y: targetSection, offsetY: offset },
                        ease: 'power3.inOut'
                    });
                } else {
                    console.log('Using fallback scroll');
                    smoothScrollTo(targetSection, offset);
                }
            } else {
                console.warn('Target section not found:', targetId);
            }
        });
    });

    // Navbar background on scroll
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    });

    // Close menu on window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            navOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
    
    console.log('Navigation initialized successfully');
}

// Main animation initialization
function initializeAnimations() {
    if (!gsapAvailable) return;
    
    console.log('Initializing GSAP animations...');
    
    // Hero section entrance animations
    const heroTl = gsap.timeline();
    
    heroTl.from('.navbar', {
        duration: 1,
        y: -100,
        opacity: 0,
        ease: 'power3.out'
    })
    .from('.nav-logo', {
        duration: 0.8,
        scale: 0,
        rotation: -180,
        ease: 'back.out(1.7)'
    }, '-=0.5')
    .from('.nav-menu .nav-link', {
        duration: 0.6,
        y: -20,
        opacity: 0,
        stagger: 0.1,
        ease: 'power2.out'
    }, '-=0.3')
    .from('.hero-title', {
        duration: 1.2,
        y: 100,
        opacity: 0,
        ease: 'power3.out'
    }, '-=0.2')
    .from('.gradient-text', {
        duration: 1.5,
        backgroundPosition: '200% center',
        ease: 'power2.out'
    }, '-=1')
    .from('.hero-subtitle', {
        duration: 1,
        y: 50,
        opacity: 0,
        ease: 'power2.out'
    }, '-=0.8')
    .from('.hero-stats .stat', {
        duration: 0.8,
        scale: 0,
        opacity: 0,
        stagger: 0.2,
        ease: 'back.out(1.7)'
    }, '-=0.6')
    .from('.sudoku-preview', {
        duration: 1.2,
        x: 100,
        opacity: 0,
        scale: 0.8,
        ease: 'power3.out'
    }, '-=0.8')
    .from('.mini-cell', {
        duration: 0.6,
        scale: 0,
        opacity: 0,
        stagger: 0.05,
        ease: 'back.out(1.7)'
    }, '-=0.5')
    .from('.solving-animation', {
        duration: 0.8,
        y: 20,
        opacity: 0,
        ease: 'power2.out'
    }, '-=0.3');

    // Continuous animations
    gsap.to('.pulse-dot', {
        scale: 1.5,
        opacity: 0.3,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: 'power2.inOut'
    });

    gsap.to('.scroll-indicator', {
        y: -10,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'power2.inOut'
    });

    // Floating animation for sudoku preview
    gsap.to('.sudoku-preview', {
        y: -10,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: 'power2.inOut'
    });
}

// Interactive elements
function initializeInteractiveElements() {
    // About cards hover effects
    document.querySelectorAll('.about-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            if (gsapAvailable) {
                gsap.to(this, {
                    duration: 0.3,
                    y: -10,
                    scale: 1.02,
                    ease: 'power2.out'
                });
                
                gsap.to(this.querySelector('.card-icon'), {
                    duration: 0.3,
                    scale: 1.1,
                    rotation: 5,
                    ease: 'power2.out'
                });
            } else {
                // Fallback CSS transition
                this.style.transform = 'translateY(-10px) scale(1.02)';
                const icon = this.querySelector('.card-icon');
                if (icon) icon.style.transform = 'scale(1.1) rotate(5deg)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            if (gsapAvailable) {
                gsap.to(this, {
                    duration: 0.3,
                    y: 0,
                    scale: 1,
                    ease: 'power2.out'
                });
                
                gsap.to(this.querySelector('.card-icon'), {
                    duration: 0.3,
                    scale: 1,
                    rotation: 0,
                    ease: 'power2.out'
                });
            } else {
                // Fallback CSS transition
                this.style.transform = 'translateY(0) scale(1)';
                const icon = this.querySelector('.card-icon');
                if (icon) icon.style.transform = 'scale(1) rotate(0deg)';
            }
        });
    });

    // Feature items hover effects
    document.querySelectorAll('.feature-item').forEach(item => {
        item.addEventListener('mouseenter', function() {
            if (gsapAvailable) {
                gsap.to(this, {
                    duration: 0.3,
                    y: -5,
                    scale: 1.02,
                    ease: 'power2.out'
                });
                
                gsap.to(this.querySelector('.feature-number'), {
                    duration: 0.3,
                    scale: 1.1,
                    ease: 'power2.out'
                });
            } else {
                // Fallback CSS transition
                this.style.transform = 'translateY(-5px) scale(1.02)';
                const number = this.querySelector('.feature-number');
                if (number) number.style.transform = 'scale(1.1)';
            }
        });
        
        item.addEventListener('mouseleave', function() {
            if (gsapAvailable) {
                gsap.to(this, {
                    duration: 0.3,
                    y: 0,
                    scale: 1,
                    ease: 'power2.out'
                });
                
                gsap.to(this.querySelector('.feature-number'), {
                    duration: 0.3,
                    scale: 1,
                    ease: 'power2.out'
                });
            } else {
                // Fallback CSS transition
                this.style.transform = 'translateY(0) scale(1)';
                const number = this.querySelector('.feature-number');
                if (number) number.style.transform = 'scale(1)';
            }
        });
    });

    // Demo button hover effects
    const demoBtn = document.querySelector('.demo-btn');
    if (demoBtn) {
        demoBtn.addEventListener('mouseenter', function() {
            if (gsapAvailable) {
                gsap.to(this.querySelector('.btn-icon'), {
                    duration: 0.3,
                    rotation: 15,
                    ease: 'power2.out'
                });
            } else {
                const icon = this.querySelector('.btn-icon');
                if (icon) icon.style.transform = 'rotate(15deg)';
            }
        });
        
        demoBtn.addEventListener('mouseleave', function() {
            if (gsapAvailable) {
                gsap.to(this.querySelector('.btn-icon'), {
                    duration: 0.3,
                    rotation: 0,
                    ease: 'power2.out'
                });
            } else {
                const icon = this.querySelector('.btn-icon');
                if (icon) icon.style.transform = 'rotate(0deg)';
            }
        });
    }

    // Tech tags hover effects
    document.querySelectorAll('.tech-tag').forEach(tag => {
        tag.addEventListener('mouseenter', function() {
            if (gsapAvailable) {
                gsap.to(this, {
                    duration: 0.3,
                    scale: 1.05,
                    ease: 'power2.out'
                });
            } else {
                this.style.transform = 'scale(1.05)';
            }
        });
        
        tag.addEventListener('mouseleave', function() {
            if (gsapAvailable) {
                gsap.to(this, {
                    duration: 0.3,
                    scale: 1,
                    ease: 'power2.out'
                });
            } else {
                this.style.transform = 'scale(1)';
            }
        });
    });
}

// Scroll-triggered animations
function initializeScrollEffects() {
    if (!gsapAvailable) return;
    
    // About section animations
    gsap.from('.about .section-header', {
        scrollTrigger: {
            trigger: '.about',
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse'
        },
        duration: 1,
        y: 50,
        opacity: 0,
        ease: 'power3.out'
    });

    gsap.from('.about-card', {
        scrollTrigger: {
            trigger: '.about',
            start: 'top 70%',
            end: 'bottom 30%',
            toggleActions: 'play none none reverse'
        },
        duration: 0.8,
        y: 100,
        opacity: 0,
        stagger: 0.2,
        ease: 'power3.out'
    });

    // Features section animations
    gsap.from('.features .section-header', {
        scrollTrigger: {
            trigger: '.features',
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse'
        },
        duration: 1,
        y: 50,
        opacity: 0,
        ease: 'power3.out'
    });

    gsap.from('.feature-item', {
        scrollTrigger: {
            trigger: '.features',
            start: 'top 70%',
            end: 'bottom 30%',
            toggleActions: 'play none none reverse'
        },
        duration: 0.8,
        y: 100,
        opacity: 0,
        stagger: 0.15,
        ease: 'power3.out'
    });

    // Demo section animations
    gsap.from('.demo .section-header', {
        scrollTrigger: {
            trigger: '.demo',
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse'
        },
        duration: 1,
        y: 50,
        opacity: 0,
        ease: 'power3.out'
    });

    gsap.from('.demo-container', {
        scrollTrigger: {
            trigger: '.demo',
            start: 'top 70%',
            end: 'bottom 30%',
            toggleActions: 'play none none reverse'
        },
        duration: 1,
        y: 100,
        opacity: 0,
        ease: 'power3.out'
    });

    // Footer animations
    gsap.from('.footer-content', {
        scrollTrigger: {
            trigger: '.footer',
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse'
        },
        duration: 1,
        y: 50,
        opacity: 0,
        ease: 'power3.out'
    });

    // Parallax effects
    gsap.to('.hero-particles', {
        scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: 1
        },
        y: -100,
        ease: 'none'
    });

    // Counter animations for stats
    const stats = document.querySelectorAll('.stat-number');
    stats.forEach(stat => {
        const finalValue = stat.textContent;
        const isNumber = !isNaN(finalValue);
        
        if (isNumber) {
            gsap.from(stat, {
                scrollTrigger: {
                    trigger: stat,
                    start: 'top 80%',
                    toggleActions: 'play none none reverse'
                },
                duration: 2,
                textContent: 0,
                ease: 'power2.out',
                snap: { textContent: 1 },
                onUpdate: function() {
                    stat.textContent = Math.ceil(stat.textContent);
                }
            });
        }
    });
}

// Utility functions
function createParticles() {
    const particlesContainer = document.querySelector('.hero-particles');
    if (!particlesContainer) return;

    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: 2px;
            height: 2px;
            background: rgba(255, 255, 255, 0.5);
            border-radius: 50%;
            pointer-events: none;
        `;
        
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 3 + 's';
        particle.style.animationDuration = (Math.random() * 3 + 2) + 's';
        
        particlesContainer.appendChild(particle);
        
        // Animate particles
        if (gsapAvailable) {
            gsap.to(particle, {
                y: -100,
                opacity: 0,
                duration: Math.random() * 3 + 2,
                repeat: -1,
                ease: 'none',
                delay: Math.random() * 3
            });
        }
    }
}

// Initialize particles
setTimeout(createParticles, 1000);

// Performance optimization
let ticking = false;
function updateOnScroll() {
    if (!ticking) {
        requestAnimationFrame(() => {
            // Any scroll-based updates can go here
            ticking = false;
        });
        ticking = true;
    }
}

window.addEventListener('scroll', updateOnScroll);

// Error handling for animations
window.addEventListener('error', function(e) {
    console.warn('Animation error:', e);
    // Fallback: ensure visibility
    ensureVisibility();
});

// Cleanup function for memory management
function cleanup() {
    if (gsapAvailable && ScrollTrigger) {
        ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        gsap.killTweensOf('*');
    }
}

// Fallback: ensure visibility after a delay
setTimeout(ensureVisibility, 2000);

// Test navigation on load
setTimeout(() => {
    console.log('Testing navigation links...');
    const links = document.querySelectorAll('.nav-link');
    links.forEach(link => {
        console.log('Link:', link.getAttribute('href'), 'Target:', document.querySelector(link.getAttribute('href')));
    });
}, 1000);
  