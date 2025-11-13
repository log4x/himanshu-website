// Optimized main.js for Himanshu Chauhan Portfolio
(() => {
  'use strict';

  // ---------- Helpers ----------
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const on = (el, evt, fn, opts = {}) => el && el.addEventListener(evt, fn, opts);
  const once = (el, evt, fn, opts = {}) => el && el.addEventListener(evt, fn, { ...opts, once: true });
  const hasLib = (name) => typeof window[name] !== 'undefined';

  function debounce(fn, wait = 200) {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn(...args), wait);
    };
  }

  function throttle(fn, wait = 100) {
    let last = 0;
    return (...args) => {
      const now = Date.now();
      if (now - last >= wait) {
        last = now;
        fn(...args);
      }
    };
  }

  // RequestAnimationFrame counter helper
  function animateCounterTo(element, target, duration = 2000) {
    let start = null;
    const initial = parseInt(element.textContent, 10) || 0;
    const delta = target - initial;
    function step(ts) {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      element.textContent = Math.floor(initial + delta * progress);
      if (progress < 1) requestAnimationFrame(step);
      else element.textContent = target;
    }
    requestAnimationFrame(step);
  }

  // ---------- Shared Intersection Observers ----------
  const revealObserverOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active', 'animate-in');
      }
    });
  }, revealObserverOptions);

  const visibilityObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.dispatchEvent(new CustomEvent('becameVisible', { bubbles: true }));
        visibilityObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  // ---------- PortfolioApp ----------
  class PortfolioApp {
    constructor() {
      this.currentPage = this.getCurrentPage();
      this.cache = {};
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
      this.initPageTransition();
      this.initNavigation();
      this.initGlobalObservers();
      this.initPageSpecificFeatures();
      this.initBackgroundAnimation(); // lazy inside method
    }

    // Page transition: one-time init
    initPageTransition() {
      document.body.style.transition = 'opacity 0.3s ease-in-out';
      // Start with hidden until load
      document.body.style.opacity = '0';
      window.addEventListener('load', () => {
        document.body.style.opacity = '1';
      }, { once: true });
    }

    initNavigation() {
      const nav = $('nav');
      if (!nav) return;

      // Delegated click handling for nav anchors that point to html pages
      on(nav, 'click', (e) => {
        const a = e.target.closest('a');
        if (!a) return;
        const href = a.getAttribute('href') || '';
        if (href.includes('.html')) {
          e.preventDefault();
          this.navigateToPage(a.href);
        }
      });

      this.updateActiveNav();
    }

    navigateToPage(url) {
      // simple fade + navigate
      document.body.style.opacity = '0';
      setTimeout(() => (window.location.href = url), 300);
    }

    updateActiveNav() {
      const navLinks = $$('nav a');
      navLinks.forEach(link => {
        const href = link.getAttribute('href') || '';
        link.classList.toggle('active', (href === 'index.html' && this.currentPage === 'home') || href.includes(this.currentPage));
      });
    }

    initGlobalObservers() {
      // wire reveal and visibility observers to elements used across pages
      $$('[data-reveal], .reveal, .fade-in, .slide-up, .scale-in').forEach(el => revealObserver.observe(el));
      // elements that require a visibility trigger to start animation/counter
      $$('[data-visible-trigger], .counter, .achievement-counter, .achievements-section, .bg-gray-50').forEach(el => visibilityObserver.observe(el));
    }

    initPageSpecificFeatures() {
      switch (this.currentPage) {
        case 'home': this.initHomePage(); break;
        case 'skills': this.initSkillsPage(); break;
        case 'projects': this.initProjectsPage(); break;
        case 'experience': this.initExperiencePage(); break;
      }
    }

    // ---------- HOME ----------
    initHomePage() {
      this.initTypewriter();
      this.initCounters();       // counters with observer event
      this.initSkillsPreview();  // hover
      this.initHeroInteractions();
    }

    initTypewriter() {
      const el = document.querySelector('.typewriter-text');
      if (!el) return;
      const text = el.textContent.trim();
      if (!text) return;
      el.textContent = '';
      let i = 0;
      const frame = () => {
        if (i < text.length) {
          el.textContent += text.charAt(i++);
          setTimeout(frame, 80); // slightly faster
        }
      };
      // start when visible
      if (el.getBoundingClientRect().top < window.innerHeight) frame();
      else {
        visibilityObserver.observe(el);
        on(el, 'becameVisible', frame, { once: true });
      }
    }

    initCounters() {
      const counters = $$('.counter');
      if (!counters.length) return;
      counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target') || '0', 10);
        if (!target) return;
        on(counter, 'becameVisible', () => animateCounterTo(counter, target, 1800), { once: true });
        visibilityObserver.observe(counter);
      });
    }

    initSkillsPreview() {
      const skillContainer = $('.skills-list') || document;
      if (!hasLib('anime')) return; // anime helps here; if missing, skip
      // event delegation for hover to reduce listeners
      on(skillContainer, 'pointerenter', (e) => {
        const card = e.target.closest('.skill-card');
        if (!card) return;
        anime({
          targets: card,
          scale: 1.05,
          rotateY: 5,
          duration: 300,
          easing: 'easeOutQuad'
        });
      }, { passive: true });

      on(skillContainer, 'pointerleave', (e) => {
        const card = e.target.closest('.skill-card');
        if (!card) return;
        anime({
          targets: card,
          scale: 1,
          rotateY: 0,
          duration: 300,
          easing: 'easeOutQuad'
        });
      }, { passive: true });
    }

    initHeroInteractions() {
      // Smooth intra-page anchors (single handler)
      on(document, 'click', (e) => {
        const a = e.target.closest('a[href^="#"]');
        if (!a) return;
        const href = a.getAttribute('href');
        const target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });

      // parallax: throttle and passive
      const parallax = throttle(() => {
        const scrolled = window.pageYOffset;
        const parallaxEls = $$('.parallax');
        if (!parallaxEls.length) return;
        parallaxEls.forEach(el => {
          const speed = parseFloat(el.dataset.speed) || 0.5;
          el.style.transform = `translateY(${-(scrolled * speed)}px)`;
        });
      }, 50);

      on(window, 'scroll', parallax, { passive: true });
    }

    // ---------- SKILLS ----------
    initSkillsPage() {
      this.initSkillsChart();
      this.initCertificationBadges();
      this.initProgressBars(); // animate progress bars using shared visibility observer
    }

    initSkillsChart() {
      const container = document.getElementById('skills-chart');
      if (!container) return;
      // lazy init existing echarts instance or created if echarts present
      const createChart = () => {
        if (!hasLib('echarts')) return;
        const skillsData = [
          { name: 'Networking', value: 90 },
          { name: 'Programming', value: 85 },
          { name: 'Data Science', value: 75 },
          { name: 'Cloud Computing', value: 80 },
          { name: 'Windows Server', value: 88 },
          { name: 'Security', value: 82 }
        ];
        const chart = echarts.init(container);
        const option = {
          backgroundColor: 'transparent',
          radar: {
            indicator: skillsData.map(skill => ({ name: skill.name, max: 100 })),
            radius: '70%',
            axisLine: { lineStyle: { color: '#4a9b8e' } },
            splitLine: { lineStyle: { color: '#c47f3e', opacity: 0.3 } }
          },
          series: [{
            type: 'radar',
            data: [{
              value: skillsData.map(s => s.value),
              areaStyle: { color: 'rgba(196, 127, 62, 0.3)' },
              lineStyle: { color: '#c47f3e', width: 2 },
              itemStyle: { color: '#c47f3e' }
            }],
            animationDuration: 1600
          }]
        };
        chart.setOption(option);
        const resizeHandler = debounce(() => chart.resize(), 200);
        on(window, 'resize', resizeHandler);
      };

      // if echarts present init immediately, otherwise observe for visibility and then lazy init
      if (hasLib('echarts')) createChart();
      else {
        // if echarts loaded later (e.g., via script tag), try to initialize when visible
        visibilityObserver.observe(container);
        on(container, 'becameVisible', createChart, { once: true });
      }
    }

    initCertificationBadges() {
      const container = document.querySelector('.certifications') || document;
      on(container, 'click', (e) => {
        const badge = e.target.closest('.cert-badge');
        if (!badge) return;
        const details = badge.querySelector('.cert-details');
        if (details) details.classList.toggle('show');
      });
    }

    initProgressBars() {
      const skillsSection = document.querySelector('.bg-gray-50');
      if (!skillsSection) return;
      const bars = $$('.bg-teal-500, .bg-amber-500, .bg-blue-500', skillsSection);
      if (!bars.length) return;
      const animate = () => {
        bars.forEach(bar => {
          const width = bar.getAttribute('data-width') || bar.style.width || '75%';
          bar.style.width = '0%';
          if (hasLib('anime')) {
            anime({ targets: bar, width: width, duration: 1200, easing: 'easeOutQuad', delay: 300 });
          } else {
            // fallback rudimentary animation
            setTimeout(() => (bar.style.width = width), 400);
          }
        });
      };

      visibilityObserver.observe(skillsSection);
      on(skillsSection, 'becameVisible', animate, { once: true });
    }

    // ---------- PROJECTS ----------
    initProjectsPage() {
      this.initProjectFilters();
      this.initProjectCards();
    }

    initProjectFilters() {
      const filters = $$('.filter-btn');
      const projectContainer = document.querySelector('.projects-container') || document;
      if (!filters.length) return;

      // delegated handling for filter buttons
      on(document, 'click', (e) => {
        const btn = e.target.closest('.filter-btn');
        if (!btn) return;
        const filter = btn.getAttribute('data-filter') || 'all';
        filters.forEach(b => b.classList.toggle('active', b === btn));
        const projectCards = $$('.project-card', projectContainer);
        projectCards.forEach(card => {
          const cats = (card.getAttribute('data-categories') || '').split(',').map(s => s.trim());
          const match = filter === 'all' || cats.includes(filter);
          if (match) {
            card.style.display = '';
            if (hasLib('anime')) anime({ targets: card, opacity: [0, 1], scale: [0.9, 1], duration: 420, easing: 'easeOutQuad' });
            else card.style.opacity = '1';
          } else {
            if (hasLib('anime')) {
              anime({ targets: card, opacity: 0, scale: 0.9, duration: 260, easing: 'easeInQuad', complete: () => (card.style.display = 'none') });
            } else {
              card.style.display = 'none';
            }
          }
        });
      });
    }

    initProjectCards() {
      const container = document.querySelector('.projects-container') || document;
      // open modal by delegation
      on(container, 'click', (e) => {
        const card = e.target.closest('.project-card');
        if (!card) return;
        const modal = card.querySelector('.project-modal');
        if (!modal) return;
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
      });

      // close modal (delegated)
      on(document, 'click', (e) => {
        if (e.target.matches('.modal-close, .project-modal.show')) {
          const modal = e.target.closest('.project-modal');
          if (!modal) return;
          modal.classList.remove('show');
          document.body.style.overflow = '';
        }
      });
    }

    // ---------- EXPERIENCE ----------
    initExperiencePage() {
      this.initTimeline();
      this.initAchievementCounters();
    }

    initTimeline() {
      const items = $$('.timeline-item');
      if (!items.length) return;
      items.forEach(item => {
        visibilityObserver.observe(item);
        on(item, 'becameVisible', () => {
          if (hasLib('anime')) {
            anime({ targets: item, translateX: [-100, 0], opacity: [0, 1], duration: 700, easing: 'easeOutQuad' });
          } else {
            item.style.transform = 'translateX(0)';
            item.style.opacity = '1';
          }
        }, { once: true });
      });
    }

    initAchievementCounters() {
      const achievements = $$('.achievement-item');
      if (!achievements.length) return;
      achievements.forEach(ach => {
        // hover animation only if anime present
        on(ach, 'pointerenter', () => {
          if (!hasLib('anime')) return;
          anime({ targets: ach, scale: 1.05, duration: 300, easing: 'easeOutQuad' });
        }, { passive: true });
        on(ach, 'pointerleave', () => {
          if (!hasLib('anime')) return;
          anime({ targets: ach, scale: 1, duration: 300, easing: 'easeOutQuad' });
        }, { passive: true });
      });
    }

    // ---------- BACKGROUND (p5 network) ----------
    initBackgroundAnimation() {
      const bgContainer = document.getElementById('background-animation');
      if (!bgContainer) return;
      // lazy-init p5 when available
      const initP5 = () => {
        if (!hasLib('p5')) return;
        // avoid recreating multiple instances
        if (bgContainer.dataset.p5Inited) return;
        bgContainer.dataset.p5Inited = '1';

        new p5((p) => {
          let nodes = [];
          const numNodes = 50;

          p.setup = () => {
            const canvas = p.createCanvas(p.windowWidth, p.windowHeight);
            canvas.parent(bgContainer);
            canvas.style('position', 'fixed');
            canvas.style('top', '0');
            canvas.style('left', '0');
            canvas.style('z-index', '-1');
            canvas.style('opacity', '0.1');

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
            for (let i = 0; i < nodes.length; i++) {
              const node = nodes[i];
              node.x += node.vx;
              node.y += node.vy;
              if (node.x < 0) node.x = p.width;
              if (node.x > p.width) node.x = 0;
              if (node.y < 0) node.y = p.height;
              if (node.y > p.height) node.y = 0;

              for (let j = i + 1; j < nodes.length; j++) {
                const other = nodes[j];
                const distance = p.dist(node.x, node.y, other.x, other.y);
                if (distance < 100) {
                  p.stroke(74, 155, 142, p.map(distance, 0, 100, 50, 0));
                  p.strokeWeight(1);
                  p.line(node.x, node.y, other.x, other.y);
                }
              }
              p.fill(196, 127, 62, 100);
              p.noStroke();
              p.circle(node.x, node.y, 3);
            }
          };

          p.windowResized = () => p.resizeCanvas(p.windowWidth, p.windowHeight);
        });
      };

      // if p5 loaded, init immediately, else init when visible
      if (hasLib('p5')) initP5();
      else {
        visibilityObserver.observe(bgContainer);
        on(bgContainer, 'becameVisible', initP5, { once: true });
      }
    }
  } // end class

  // ---------- Global UI utilities ----------
  // Notification helper (guarded to anime)
  function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 p-4 rounded-lg text-white z-50`;
    notification.classList.add(type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500');
    notification.textContent = message;
    document.body.appendChild(notification);

    if (hasLib('anime')) {
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
          complete: () => notification.remove()
        });
      }, 3000);
    } else {
      // fallback animation + removal
      notification.style.transition = 'transform 0.3s, opacity 0.3s';
      notification.style.transform = 'translateX(0)';
      setTimeout(() => {
        notification.style.transform = 'translateX(300px)';
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 300);
      }, 3000);
    }
  }

  // Validate email util
  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  // ---------- Initial DOMContentLoaded wiring ----------
  once(document, 'DOMContentLoaded', () => {
    // Instantiate app
    new PortfolioApp();

    // Single delegated hover for nav-link color changes (if anime available)
    const navRoot = document.querySelector('nav') || document;
    on(navRoot, 'pointerenter', (e) => {
      const link = e.target.closest('.nav-link');
      if (!link || !hasLib('anime')) return;
      anime({ targets: link, color: '#1f2937', duration: 200, easing: 'easeOutQuad' });
    }, { passive: true });
    on(navRoot, 'pointerleave', (e) => {
      const link = e.target.closest('.nav-link');
      if (!link || !hasLib('anime')) return;
      anime({ targets: link, color: '#6b7280', duration: 200, easing: 'easeOutQuad' });
    }, { passive: true });

    // Card hover effects - delegated to reduce listeners
    on(document, 'pointerenter', (e) => {
      const card = e.target.closest('.card-hover');
      if (!card || !hasLib('anime')) return;
      anime({ targets: card, scale: 1.02, duration: 300, easing: 'easeOutQuad' });
    }, { passive: true });

    on(document, 'pointerleave', (e) => {
      const card = e.target.closest('.card-hover');
      if (!card || !hasLib('anime')) return;
      anime({ targets: card, scale: 1, duration: 300, easing: 'easeOutQuad' });
    }, { passive: true });

    // Skill badges hover (delegated)
    on(document, 'pointerenter', (e) => {
      const badge = e.target.closest('.skill-badge');
      if (!badge || !hasLib('anime')) return;
      anime({ targets: badge, scale: 1.1, rotate: '2deg', duration: 200, easing: 'easeOutQuad' });
    }, { passive: true });

    on(document, 'pointerleave', (e) => {
      const badge = e.target.closest('.skill-badge');
      if (!badge || !hasLib('anime')) return;
      anime({ targets: badge, scale: 1, rotate: '0deg', duration: 200, easing: 'easeOutQuad' });
    }, { passive: true });

    // Buttons hover (delegated)
    on(document, 'pointerenter', (e) => {
      const btn = e.target.closest('a[class*="bg-"]');
      if (!btn || !hasLib('anime')) return;
      anime({ targets: btn, scale: 1.05, duration: 200, easing: 'easeOutQuad' });
    }, { passive: true });

    on(document, 'pointerleave', (e) => {
      const btn = e.target.closest('a[class*="bg-"]');
      if (!btn || !hasLib('anime')) return;
      anime({ targets: btn, scale: 1, duration: 200, easing: 'easeOutQuad' });
    }, { passive: true });

    // Loading animation for hero content (only once)
    const heroContent = $('.hero-content');
    if (heroContent && hasLib('anime')) {
      anime.timeline({ easing: 'easeOutExpo', duration: 750 }).add({
        targets: '.hero-content > *',
        translateY: [60, 0],
        opacity: [0, 1],
        delay: anime.stagger(100)
      });
    }

    // Achievement counters (single animate function using shared visibility observer)
    const achievementsSection = document.querySelector('.achievements-section');
    if (achievementsSection) {
      on(achievementsSection, 'becameVisible', () => {
        $$('.achievement-counter', achievementsSection).forEach(c => {
          const target = parseInt(c.getAttribute('data-target') || '0', 10);
          if (target) animateCounterTo(c, target, 1600);
        });
      }, { once: true });
      visibilityObserver.observe(achievementsSection);
    }

    // Decorative: Smooth scroll for anchor links (already delegated in app), but keep one more fallback:
    // This is purposely not duplicated.

    // Progress bars and other reveal elements are wired inside the PortfolioApp page inits or via observers.
  });

  // Expose showNotification (if any other script needs it)
  window.portfolioNotify = showNotification;
})();
