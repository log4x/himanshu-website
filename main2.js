// Main JavaScript functionality for Himanshu Chauhan Portfolio
class PortfolioApp {
    constructor() {
        this.currentPage = this.getCurrentPage();
        this.init();
    }

    getCurrentPage() {
        const path = window.location.pathname;
        if (path.includes('skills.html')) return 'skills';
        if (path.includes('projects.html')) return 'projects';
        if (path.includes('experience.html')) return 'experience';
        return 'home';
    }

    init() {
        this.initNavigation();
        this.initScrollAnimations();
        this.initPageSpecificFeatures();
        this.initBackgroundAnimation();
    }

    initNavigation() {
        // Smooth page transitions
        const navLinks = document.querySelectorAll('nav a');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                if (link.href.includes('.html')) {
                    e.preventDefault();
                    this.navigateToPage(link.href);
                }
            });
        });

        // Update active nav state
        this.updateActiveNav();
    }

    navigateToPage(url) {
        // Add fade out animation
        document.body.style.opacity = '0';
        setTimeout(() => {
            window.location.href = url;
        }, 300);
    }

    updateActiveNav() {
        const navLinks = document.querySelectorAll('nav a');
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if ((href === 'index.html' && this.currentPage === 'home') ||
                href.includes(this.currentPage)) {
                link.classList.add('active');
            }
        });
    }

    initScrollAnimations() {
        // Intersection Observer for scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);
 
        // Observe all elements with animation classes
        document.querySelectorAll('.fade-in, .slide-up, .scale-in').forEach(el => {
            observer.observe(el);
        });

        
    }

    initPageSpecificFeatures() {
        switch (this.currentPage) {
            case 'home':
                this.initHomePage();
                break;
            case 'skills':
                this.initSkillsPage();
                break;
            case 'projects':
                this.initProjectsPage();
                break;
            case 'experience':
                this.initExperiencePage();
                break;
        }
    }

    initHomePage() {
        // Typewriter effect for hero text
        this.initTypewriter();
        
        // Animated counters
        this.initCounters();
        
        // Skills preview hover effects
        this.initSkillsPreview();
    }

    initTypewriter() {
        const typewriterElement = document.querySelector('.typewriter-text');
        if (!typewriterElement) return;

        const text = typewriterElement.textContent;
        typewriterElement.textContent = '';
        
        let i = 0;
        const typeInterval = setInterval(() => {
            if (i < text.length) {
                typewriterElement.textContent += text.charAt(i);
                i++;
            } else {
                clearInterval(typeInterval);
            }
        }, 100);
    }

    initCounters() {
        const counters = document.querySelectorAll('.counter');
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            const duration = 2000;
            const increment = target / (duration / 16);
            let current = 0;

            const updateCounter = () => {
                if (current < target) {
                    current += increment;
                    counter.textContent = Math.ceil(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                }
            };

            // Start counter when element is visible
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        updateCounter();
                        observer.unobserve(entry.target);
                    }
                });
            });

            observer.observe(counter);
        });
    }

    initSkillsPreview() {
        const skillCards = document.querySelectorAll('.skill-card');
        skillCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                anime({
                    targets: card,
                    scale: 1.05,
                    rotateY: 5,
                    duration: 300,
                    easing: 'easeOutQuad'
                });
            });

            card.addEventListener('mouseleave', () => {
                anime({
                    targets: card,
                    scale: 1,
                    rotateY: 0,
                    duration: 300,
                    easing: 'easeOutQuad'
                });
            });
        });
    }

    initSkillsPage() {
        // Initialize skills radar chart
        this.initSkillsChart();
        
        // Certification hover effects
        this.initCertificationBadges();
    }

    initSkillsChart() {
        const chartContainer = document.getElementById('skills-chart');
        if (!chartContainer) return;

        const chart = echarts.init(chartContainer);
        
        const skillsData = [
            { name: 'Networking', value: 90 },
            { name: 'Programming', value: 85 },
            { name: 'Data Science', value: 75 },
            { name: 'Cloud Computing', value: 80 },
            { name: 'Windows Server', value: 88 },
            { name: 'Security', value: 82 }
        ];

        const option = {
            backgroundColor: 'transparent',
            radar: {
                indicator: skillsData.map(skill => ({
                    name: skill.name,
                    max: 100
                })),
                radius: '70%',
                axisLine: {
                    lineStyle: {
                        color: '#4a9b8e'
                    }
                },
                splitLine: {
                    lineStyle: {
                        color: '#c47f3e',
                        opacity: 0.3
                    }
                }
            },
            series: [{
                type: 'radar',
                data: [{
                    value: skillsData.map(skill => skill.value),
                    areaStyle: {
                        color: 'rgba(196, 127, 62, 0.3)'
                    },
                    lineStyle: {
                        color: '#c47f3e',
                        width: 2
                    },
                    itemStyle: {
                        color: '#c47f3e'
                    }
                }],
                animationDuration: 2000
            }]
        };

        chart.setOption(option);
        
        // Responsive chart
        window.addEventListener('resize', () => {
            chart.resize();
        });
    }

    initCertificationBadges() {
        const badges = document.querySelectorAll('.cert-badge');
        badges.forEach(badge => {
            badge.addEventListener('click', () => {
                const details = badge.querySelector('.cert-details');
                if (details) {
                    details.classList.toggle('show');
                }
            });
        });
    }

    initProjectsPage() {
        // Project filtering
        this.initProjectFilters();
        
        // Project card animations
        this.initProjectCards();
    }

    initProjectFilters() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const projectCards = document.querySelectorAll('.project-card');

        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const filter = button.getAttribute('data-filter');
                
                // Update active button
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                // Filter projects
                projectCards.forEach(card => {
                    const categories = card.getAttribute('data-categories').split(',');
                    
                    if (filter === 'all' || categories.includes(filter)) {
                        card.style.display = 'block';
                        anime({
                            targets: card,
                            opacity: [0, 1],
                            scale: [0.8, 1],
                            duration: 500,
                            easing: 'easeOutQuad'
                        });
                    } else {
                        anime({
                            targets: card,
                            opacity: 0,
                            scale: 0.8,
                            duration: 300,
                            easing: 'easeInQuad',
                            complete: () => {
                                card.style.display = 'none';
                            }
                        });
                    }
                });
            });
        });
    }

    initProjectCards() {
        const projectCards = document.querySelectorAll('.project-card');
        projectCards.forEach(card => {
            card.addEventListener('click', () => {
                const modal = card.querySelector('.project-modal');
                if (modal) {
                    modal.classList.add('show');
                    document.body.style.overflow = 'hidden';
                }
            });
        });

        // Close modal functionality
        document.querySelectorAll('.modal-close').forEach(closeBtn => {
            closeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const modal = closeBtn.closest('.project-modal');
                modal.classList.remove('show');
                document.body.style.overflow = 'auto';
            });
        });
    }

    initExperiencePage() {
        // Timeline animations
        this.initTimeline();
        
        // Achievement counters
        this.initAchievementCounters();
    }

    initTimeline() {
        const timelineItems = document.querySelectorAll('.timeline-item');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    anime({
                        targets: entry.target,
                        translateX: [-100, 0],
                        opacity: [0, 1],
                        duration: 800,
                        easing: 'easeOutQuad'
                    });
                }
            });
        }, { threshold: 0.3 });

        timelineItems.forEach(item => {
            observer.observe(item);
        });
    }

    initAchievementCounters() {
        const achievements = document.querySelectorAll('.achievement-item');
        achievements.forEach(achievement => {
            achievement.addEventListener('mouseenter', () => {
                anime({
                    targets: achievement,
                    scale: 1.05,
                    duration: 300,
                    easing: 'easeOutQuad'
                });
            });

            achievement.addEventListener('mouseleave', () => {
                anime({
                    targets: achievement,
                    scale: 1,
                    duration: 300,
                    easing: 'easeOutQuad'
                });
            });
        });
    }

    initBackgroundAnimation() {
        // Network nodes animation using p5.js
        if (typeof p5 !== 'undefined') {
            new p5((p) => {
                let nodes = [];
                const numNodes = 50;

                p.setup = () => {
                    const canvas = p.createCanvas(p.windowWidth, p.windowHeight);
                    canvas.parent('background-animation');
                    canvas.style('position', 'fixed');
                    canvas.style('top', '0');
                    canvas.style('left', '0');
                    canvas.style('z-index', '-1');
                    canvas.style('opacity', '0.1');

                    // Create nodes
                    for (let i = 0; i < numNodes; i++) {
                        nodes.push({
                            x: p.random(p.width),
                            y: p.random(p.height),
                            vx: p.random(-0.5, 0.5),
                            vy: p.random(-0.5, 0.5)
                        });
                    }
                };

                p.draw = () => {
                    p.clear();
                    
                    // Update and draw nodes
                    for (let i = 0; i < nodes.length; i++) {
                        let node = nodes[i];
                        
                        // Update position
                        node.x += node.vx;
                        node.y += node.vy;
                        
                        // Wrap around edges
                        if (node.x < 0) node.x = p.width;
                        if (node.x > p.width) node.x = 0;
                        if (node.y < 0) node.y = p.height;
                        if (node.y > p.height) node.y = 0;
                        
                        // Draw connections
                        for (let j = i + 1; j < nodes.length; j++) {
                            let other = nodes[j];
                            let distance = p.dist(node.x, node.y, other.x, other.y);
                            
                            if (distance < 100) {
                                p.stroke(74, 155, 142, p.map(distance, 0, 100, 50, 0));
                                p.strokeWeight(1);
                                p.line(node.x, node.y, other.x, other.y);
                            }
                        }
                        
                        // Draw node
                        p.fill(196, 127, 62, 100);
                        p.noStroke();
                        p.circle(node.x, node.y, 3);
                    }
                };

                p.windowResized = () => {
                    p.resizeCanvas(p.windowWidth, p.windowHeight);
                };
            });
        }
    }
}

class Particle {
    constructor() {
        this.x = random(width);
        this.y = random(height);
        this.vx = random(-0.5, 0.5);
        this.vy = random(-0.5, 0.5);
        this.size = random(2, 4);
        this.opacity = random(0.3, 0.8);
    }
    
    update() {
        this.x += this.vx;
        this.y += this.vy;
        
        // Wrap around edges
        if (this.x < 0) this.x = width;
        if (this.x > width) this.x = 0;
        if (this.y < 0) this.y = height;
        if (this.y > height) this.y = 0;
    }
    
    display() {
        fill(45, 212, 191, this.opacity * 255);
        noStroke();
        ellipse(this.x, this.y, this.size);
    }
    
    connect(particles) {
        for (let other of particles) {
            let distance = dist(this.x, this.y, other.x, other.y);
            if (distance < 100) {
                stroke(45, 212, 191, (1 - distance / 100) * 50);
                strokeWeight(0.5);
                line(this.x, this.y, other.x, other.y);
            }
        }
    }
}



// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {

    new PortfolioApp();

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Scroll reveal animation
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);
    
    // Observe all reveal elements
    document.querySelectorAll('.reveal').forEach(el => {
        observer.observe(el);
    });
    
    // Mobile menu toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            // Add mobile menu functionality here
            console.log('Mobile menu clicked');
        });
    }
    
    // Animated counters for achievements
    function animateCounters() {
        const counters = document.querySelectorAll('.achievement-counter');
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            const duration = 2000;
            const increment = target / (duration / 16);
            let current = 0;
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                counter.textContent = Math.floor(current);
            }, 16);
        });
    }
    
    // Trigger counter animation when achievements section is visible
    const achievementsSection = document.querySelector('.achievements-section');
    if (achievementsSection) {
        const achievementsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    achievementsObserver.unobserve(entry.target);
                }
            });
        });
        achievementsObserver.observe(achievementsSection);
    }
    
    // Parallax effect for hero section
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.parallax');
        
        parallaxElements.forEach(element => {
            const speed = element.dataset.speed || 0.5;
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    });
    
    // Add hover effects to cards
    const cards = document.querySelectorAll('.card-hover');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            anime({
                targets: this,
                scale: 1.02,
                duration: 300,
                easing: 'easeOutQuad'
            });
        });
        
        card.addEventListener('mouseleave', function() {
            anime({
                targets: this,
                scale: 1,
                duration: 300,
                easing: 'easeOutQuad'
            });
        });
    });
    
    // Skill badge animations
    const skillBadges = document.querySelectorAll('.skill-badge');
    skillBadges.forEach(badge => {
        badge.addEventListener('mouseenter', function() {
            anime({
                targets: this,
                scale: 1.1,
                rotate: '2deg',
                duration: 200,
                easing: 'easeOutQuad'
            });
        });
        
        badge.addEventListener('mouseleave', function() {
            anime({
                targets: this,
                scale: 1,
                rotate: '0deg',
                duration: 200,
                easing: 'easeOutQuad'
            });
        });
    });
    
    // Navigation link hover effects
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            anime({
                targets: this,
                color: '#1f2937',
                duration: 200,
                easing: 'easeOutQuad'
            });
        });
        
        link.addEventListener('mouseleave', function() {
            anime({
                targets: this,
                color: '#6b7280',
                duration: 200,
                easing: 'easeOutQuad'
            });
        });
    });
    
    // Button hover effects
    const buttons = document.querySelectorAll('a[class*="bg-"]');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            anime({
                targets: this,
                scale: 1.05,
                duration: 200,
                easing: 'easeOutQuad'
            });
        });
        
        button.addEventListener('mouseleave', function() {
            anime({
                targets: this,
                scale: 1,
                duration: 200,
                easing: 'easeOutQuad'
            });
        });
    });
    
    // Loading animation for page elements
    anime.timeline({
        easing: 'easeOutExpo',
        duration: 750
    })
    .add({
        targets: '.hero-content > *',
        translateY: [60, 0],
        opacity: [0, 1],
        delay: anime.stagger(100)
    });
    
    // Progress bar animations
    function animateProgressBars() {
        const progressBars = document.querySelectorAll('.bg-teal-500, .bg-amber-500, .bg-blue-500');
        progressBars.forEach(bar => {
            const width = bar.style.width;
            bar.style.width = '0%';
            
            anime({
                targets: bar,
                width: width,
                duration: 1500,
                easing: 'easeOutQuad',
                delay: 500
            });
        });
    }
    
    // Trigger progress bar animation when skills section is visible
    const skillsSection = document.querySelector('.bg-gray-50');
    if (skillsSection) {
        const skillsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateProgressBars();
                    skillsObserver.unobserve(entry.target);
                }
            });
        });
        skillsObserver.observe(skillsSection);
    }
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add fade-in animation to body on page load
window.addEventListener('load', () => {
    document.body.style.opacity = '1';
});

// Particle System for Hero Background
let particles = [];
let particleCount = 50;

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Smooth page transitions
function navigateToPage(url) {
    document.body.style.opacity = '0';
    setTimeout(() => {
        window.location.href = url;
    }, 300);
}

// Add page transition styles
document.addEventListener('DOMContentLoaded', function() {
    document.body.style.transition = 'opacity 0.3s ease-in-out';
    document.body.style.opacity = '1';
    
});

// Form validation helper
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Show notification helper
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 p-4 rounded-lg text-white z-50 ${
        type === 'success' ? 'bg-green-500' : 
        type === 'error' ? 'bg-red-500' : 
        'bg-blue-500'
    }`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    anime({
        targets: notification,
        translateX: [300, 0],
        opacity: [0, 1],
        duration: 300,
        easing: 'easeOutQuad'
    });
    
    setTimeout(() => {
        anime({
            targets: notification,
            translateX: [0, 300],
            opacity: [1, 0],
            duration: 300,
            easing: 'easeOutQuad',
            complete: () => {
                document.body.removeChild(notification);
            }
        });
    }, 3000);
}