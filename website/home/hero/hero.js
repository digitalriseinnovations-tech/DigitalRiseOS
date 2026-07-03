/* =============================================================
   DIGITAL RISE OS — HERO JAVASCRIPT
   ============================================================= */

(function () {
  'use strict';

  /* ── Nav scroll shadow ─────────────────────────────────── */

  const nav = document.querySelector('.nav');

  if (nav) {
    const onScroll = () => {
      nav.classList.toggle('is-scrolled', window.scrollY > 20);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // run on load in case of scroll position restore
  }


  /* ── Entrance animations via IntersectionObserver ──────── */

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!prefersReducedMotion) {
    const heroContent = document.querySelector('.hero__content');
    const heroVisual  = document.querySelector('.hero__visual');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    if (heroContent) observer.observe(heroContent);
    if (heroVisual)  observer.observe(heroVisual);

  } else {
    // Reduced motion: show immediately, no animation
    document.querySelectorAll('.hero__content, .hero__visual').forEach((el) => {
      el.classList.add('is-visible');
    });
  }


  /* ── Metric counter animation ──────────────────────────── */

  function animateCounter(el, target, duration, prefix, suffix) {
    if (prefersReducedMotion) {
      el.textContent = prefix + target + suffix;
      return;
    }

    const start     = performance.now();
    const isDecimal = target.toString().includes('.');
    const numTarget = parseFloat(target);

    function ease(t) {
      // Deceleration: fast start, slow end
      return 1 - Math.pow(1 - t, 3);
    }

    function update(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const current  = numTarget * ease(progress);

      let display;
      if (isDecimal) {
        display = current.toFixed(1);
      } else {
        display = Math.round(current).toString();
      }

      el.textContent = prefix + display + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = prefix + target + suffix;
      }
    }

    requestAnimationFrame(update);
  }

  // Observe the metrics section
  const metricsSection = document.querySelector('.pc-metrics');
  let metricsAnimated  = false;

  if (metricsSection) {
    const metricsObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !metricsAnimated) {
          metricsAnimated = true;

          const counters = metricsSection.querySelectorAll('[data-count]');
          counters.forEach((el, i) => {
            const target   = el.dataset.count;
            const prefix   = el.dataset.prefix  || '';
            const suffix   = el.dataset.suffix  || '';
            const duration = 1200;
            const delay    = i * 120;

            setTimeout(() => animateCounter(el, target, duration, prefix, suffix), delay);
          });

          metricsObserver.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    metricsObserver.observe(metricsSection);
  }


  /* ── Reduced motion: disable floating card animations ──── */

  if (prefersReducedMotion) {
    document.querySelectorAll('.float-notif, .eyebrow-dot, .live-dot, .active-dot, .pipeline-connector__dot, .pca-dot--pulse, .visual-glow').forEach((el) => {
      el.style.animation = 'none';
    });

    // Show bars at full width immediately
    document.querySelectorAll('.pc-bar-fill[data-width]').forEach((bar) => {
      bar.style.width = bar.dataset.width + '%';
    });
  }


  /* ── Dashboard tilt on hover ───────────────────────────── */

  const visualWrap   = document.querySelector('.visual-wrap');
  const platformCard = document.querySelector('.platform-card');

  if (visualWrap && platformCard && !prefersReducedMotion) {
    let tiltFrame;

    visualWrap.addEventListener('mousemove', (e) => {
      cancelAnimationFrame(tiltFrame);
      tiltFrame = requestAnimationFrame(() => {
        const rect  = visualWrap.getBoundingClientRect();
        const dx    = (e.clientX - (rect.left + rect.width  / 2)) / (rect.width  / 2);
        const dy    = (e.clientY - (rect.top  + rect.height / 2)) / (rect.height / 2);
        platformCard.style.transition = 'transform 0.1s ease-out';
        platformCard.style.transform  = `perspective(900px) rotateX(${-dy * 4}deg) rotateY(${dx * 4}deg) translateZ(6px)`;
      });
    });

    visualWrap.addEventListener('mouseleave', () => {
      cancelAnimationFrame(tiltFrame);
      platformCard.style.transition = 'transform 0.5s ease-out';
      platformCard.style.transform  = 'perspective(900px) rotateX(0deg) rotateY(0deg) translateZ(0)';
    });
  }


  /* ── Lead source bar chart animation ──────────────────── */

  const chartSection = document.querySelector('.pc-chart');
  let chartAnimated  = false;

  if (chartSection && !prefersReducedMotion) {
    const chartObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !chartAnimated) {
          chartAnimated = true;

          chartSection.querySelectorAll('.pc-bar-fill[data-width]').forEach((bar, i) => {
            setTimeout(() => {
              bar.style.width = bar.dataset.width + '%';
            }, i * 100);
          });

          chartObserver.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    chartObserver.observe(chartSection);
  }

})();
