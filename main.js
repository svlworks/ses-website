document.addEventListener('DOMContentLoaded', () => {
  // --- HEADER SCROLL ACTION ---
  const header = document.querySelector('header');
  const handleScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Check initially

  // --- MOBILE NAV TOGGLE ---
  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('nav');

  if (navToggle && nav) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('open');
      nav.classList.toggle('mobile-active');
      
      // Prevent body scrolling when menu is active
      if (nav.classList.contains('mobile-active')) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    });

    // Close menu when clicking nav links
    const navLinks = nav.querySelectorAll('a');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('open');
        nav.classList.remove('mobile-active');
        document.body.style.overflow = '';
      });
    });
  }

  // --- ACTIVE PAGE HIGHLIGHT ---
  const currentPath = window.location.pathname;
  const currentPage = currentPath.split("/").pop() || "index.html";
  const navItems = document.querySelectorAll('nav ul li a');

  navItems.forEach(item => {
    const itemPage = item.getAttribute('href');
    if (itemPage === currentPage || (currentPage === 'index.html' && itemPage === 'index.html')) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });

  // --- SCROLL REVEAL ANIMATION (INTERSECTION OBSERVER) ---
  const revealElements = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealElements.length > 0) {
    const observerOptions = {
      root: null,
      threshold: 0.12,
      rootMargin: '0px 0px -50px 0px'
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target); // Stop observing once revealed
        }
      });
    }, observerOptions);

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback if IntersectionObserver is not supported
    revealElements.forEach(el => el.classList.add('active'));
  }

  // --- BOOK PAGE PURCHASE INTERACTION ---
  const purchaseOptions = document.querySelectorAll('.purchase-option');
  if (purchaseOptions.length > 0) {
    purchaseOptions.forEach(option => {
      option.addEventListener('click', () => {
        purchaseOptions.forEach(opt => opt.classList.remove('active'));
        option.classList.add('active');
      });
    });
  }

  // --- CSEP FORM VALIDATION & SUBMISSION HANDLING ---
  const csepForm = document.getElementById('csep-application');
  const formNotification = document.getElementById('form-notification');

  if (csepForm) {
    csepForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Reset notifications
      formNotification.style.display = 'none';
      formNotification.className = 'form-notification';

      // Capture inputs
      const firstName = document.getElementById('first-name').value.trim();
      const lastName = document.getElementById('last-name').value.trim();
      const email = document.getElementById('email').value.trim();
      const industry = document.getElementById('industry').value;
      const experience = document.getElementById('experience').value;
      const consent = document.getElementById('consent').checked;

      // Basic validation checks
      if (!firstName || !lastName || !email || !industry || !experience) {
        showNotification('Please fill in all required fields.', 'error');
        return;
      }

      if (!validateEmail(email)) {
        showNotification('Please enter a valid email address.', 'error');
        return;
      }

      if (!consent) {
        showNotification('You must consent to the application rules.', 'error');
        return;
      }

      // Simulate API submit
      const submitBtn = csepForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = 'SUBMITTING APPLICATION...';

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;
        showNotification(`Congratulations, ${firstName}! Your application for the CSEP designation has been submitted successfully. A Sellebrity Council member will contact you within 48 hours.`, 'success');
        csepForm.reset();
      }, 1500);
    });
  }

  // Helper validation functions
  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  function showNotification(message, type) {
    if (formNotification) {
      formNotification.textContent = message;
      formNotification.classList.add(type);
      formNotification.style.display = 'block';
      formNotification.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }
});

// ============================================================
// AMBIENT PARTICLE CONSTELLATION BACKGROUND
// Mesmerizing, on-brand, and non-distracting
// ============================================================
(function () {
  const canvas = document.getElementById('ambient-canvas');
  if (!canvas) return;

  // Respect user preference for reduced motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    canvas.style.display = 'none';
    return;
  }

  const ctx = canvas.getContext('2d');
  let width, height, particles, animationId;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  // --- Brand palette for particles ---
  const PALETTE = [
    { r: 191, g: 161, b: 95 },   // Champagne gold
    { r: 223, g: 194, b: 141 },  // Light gold
    { r: 158, g: 117, b: 40 },   // Deep gold
    { r: 200, g: 86, b: 23 },    // Burnt copper / orange
    { r: 29, g: 48, b: 102 },    // Accent blue
    { r: 148, g: 163, b: 184 },  // Muted silver
  ];

  // --- Particle config ---
  const CONFIG = {
    count: 80,               // Number of particles
    maxRadius: 2.2,          // Largest particle
    minRadius: 0.4,          // Smallest particle
    maxSpeed: 0.25,          // Slow drift speed
    connectionDist: 140,     // Max distance for connecting lines
    connectionOpacity: 0.08, // Subtle connection lines
    parallaxFactor: 0.015,   // Subtle mouse parallax
  };

  let mouseX = 0, mouseY = 0;

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function createParticles() {
    particles = [];
    // Scale count by screen area (fewer on mobile)
    const area = width * height;
    const count = Math.max(30, Math.min(CONFIG.count, Math.floor(area / 14000)));

    for (let i = 0; i < count; i++) {
      const color = PALETTE[Math.floor(Math.random() * PALETTE.length)];
      const radius = CONFIG.minRadius + Math.random() * (CONFIG.maxRadius - CONFIG.minRadius);
      const baseOpacity = 0.15 + Math.random() * 0.45;

      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * CONFIG.maxSpeed * 2,
        vy: (Math.random() - 0.5) * CONFIG.maxSpeed * 2,
        radius: radius,
        color: color,
        baseOpacity: baseOpacity,
        opacity: baseOpacity,
        // Each particle pulses gently at its own rate
        pulseSpeed: 0.003 + Math.random() * 0.008,
        pulsePhase: Math.random() * Math.PI * 2,
      });
    }
  }

  function drawParticle(p, time) {
    // Gentle pulsing opacity
    const pulse = Math.sin(time * p.pulseSpeed + p.pulsePhase);
    p.opacity = p.baseOpacity + pulse * 0.15;

    // Draw soft glow (larger faint circle behind)
    const glowRadius = p.radius * 4;
    const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowRadius);
    glow.addColorStop(0, `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${p.opacity * 0.25})`);
    glow.addColorStop(1, `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, 0)`);
    ctx.beginPath();
    ctx.arc(p.x, p.y, glowRadius, 0, Math.PI * 2);
    ctx.fillStyle = glow;
    ctx.fill();

    // Draw core dot
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${p.opacity})`;
    ctx.fill();
  }

  function drawConnections() {
    const maxDist = CONFIG.connectionDist;
    const maxDist2 = maxDist * maxDist;

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist2 = dx * dx + dy * dy;

        if (dist2 < maxDist2) {
          const dist = Math.sqrt(dist2);
          const alpha = (1 - dist / maxDist) * CONFIG.connectionOpacity;

          // Blend colors of both connected particles
          const a = particles[i].color;
          const b = particles[j].color;
          const mr = Math.round((a.r + b.r) / 2);
          const mg = Math.round((a.g + b.g) / 2);
          const mb = Math.round((a.b + b.b) / 2);

          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(${mr}, ${mg}, ${mb}, ${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function updateParticles() {
    for (const p of particles) {
      // Apply slow drift
      p.x += p.vx;
      p.y += p.vy;

      // Subtle mouse parallax (only move particles slightly toward/from cursor)
      const dx = mouseX - p.x;
      const dy = mouseY - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 300) {
        const force = (300 - dist) / 300 * CONFIG.parallaxFactor;
        p.x -= dx * force;
        p.y -= dy * force;
      }

      // Wrap around screen edges with a soft margin
      const margin = 50;
      if (p.x < -margin) p.x = width + margin;
      if (p.x > width + margin) p.x = -margin;
      if (p.y < -margin) p.y = height + margin;
      if (p.y > height + margin) p.y = -margin;
    }
  }

  function animate(time) {
    ctx.clearRect(0, 0, width, height);

    // Draw a subtle vignette over the canvas
    const vignette = ctx.createRadialGradient(
      width / 2, height / 2, height * 0.2,
      width / 2, height / 2, height * 0.9
    );
    vignette.addColorStop(0, 'rgba(5, 8, 17, 0)');
    vignette.addColorStop(1, 'rgba(5, 8, 17, 0.5)');
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, width, height);

    drawConnections();
    for (const p of particles) {
      drawParticle(p, time);
    }
    updateParticles();

    animationId = requestAnimationFrame(animate);
  }

  // --- Event listeners ---
  window.addEventListener('resize', () => {
    resize();
    createParticles();
  });

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // Pause when tab is hidden
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(animationId);
    } else {
      animationId = requestAnimationFrame(animate);
    }
  });

  // --- Initialize ---
  resize();
  createParticles();
  animationId = requestAnimationFrame(animate);
})();
