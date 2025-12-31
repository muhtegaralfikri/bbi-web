// Theme Toggle
const themeToggle = document.getElementById('themeToggle');
const body = document.body;
const logoLight = document.querySelector('.logo-light');
const logoDark = document.querySelector('.logo-dark');

// Load saved theme or default to light
const savedTheme = localStorage.getItem('theme') || 'light';
if (savedTheme === 'dark') {
  body.classList.add('dark');
  if (logoLight) logoLight.style.display = 'none';
  if (logoDark) logoDark.style.display = 'block';
}

// Toggle theme
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark');

    // Toggle logos
    if (body.classList.contains('dark')) {
      if (logoLight) logoLight.style.display = 'none';
      if (logoDark) logoDark.style.display = 'block';
      localStorage.setItem('theme', 'dark');
    } else {
      if (logoLight) logoLight.style.display = 'block';
      if (logoDark) logoDark.style.display = 'none';
      localStorage.setItem('theme', 'light');
    }
  });
}

// Mobile menu toggle
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');

if (menuToggle && navMenu) {
  menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    menuToggle.classList.toggle('active');
  });
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href !== '#') {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  });
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
  if (navMenu && menuToggle && !themeToggle.contains(e.target)) {
    if (!navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
      navMenu.classList.remove('active');
      menuToggle.classList.remove('active');
    }
  }
});

// Add scroll effect to header
const header = document.querySelector('.header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;

  if (currentScroll > 100) {
    header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
  } else {
    header.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
  }

  lastScroll = currentScroll;
});

// Form validation helper
function validateForm(form) {
  const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
  let valid = true;

  inputs.forEach(input => {
    if (!input.value.trim()) {
      input.style.borderColor = '#ef4444';
      valid = false;
    } else {
      input.style.borderColor = '#e2e8f0';
    }
  });

  return valid;
}

// Add validation to forms
document.querySelectorAll('.form').forEach(form => {
  form.addEventListener('submit', (e) => {
    if (!validateForm(form)) {
      e.preventDefault();
    }
  });
});

// Image lazy loading
if ('loading' in HTMLImageElement.prototype) {
  document.querySelectorAll('img[loading="lazy"]').forEach(img => {
    img.src = img.dataset.src || img.src;
  });
}

// Add animation on scroll
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

document.querySelectorAll('.card, .section-title').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(el);
});
