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
