// Theme Toggle
const themeToggle = document.getElementById('themeToggle');
const body = document.body;
const logoLight = document.querySelector('.logo-light');
const logoDark = document.querySelector('.logo-dark');
const footerLogoLight = document.querySelector('.footer-logo-light');
const footerLogoDark = document.querySelector('.footer-logo-dark');

// Load saved theme or default to light
const savedTheme = localStorage.getItem('theme') || 'light';
if (savedTheme === 'dark') {
  body.classList.add('dark');
  if (logoLight) logoLight.style.display = 'none';
  if (logoDark) logoDark.style.display = 'block';
  if (footerLogoLight) footerLogoLight.style.display = 'none';
  if (footerLogoDark) footerLogoDark.style.display = 'inline-block';
}

// Toggle theme
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark');

    // Toggle logos
    if (body.classList.contains('dark')) {
      if (logoLight) logoLight.style.display = 'none';
      if (logoDark) logoDark.style.display = 'block';
      if (footerLogoLight) footerLogoLight.style.display = 'none';
      if (footerLogoDark) footerLogoDark.style.display = 'inline-block';
      localStorage.setItem('theme', 'dark');
    } else {
      if (logoLight) logoLight.style.display = 'block';
      if (logoDark) logoDark.style.display = 'none';
      if (footerLogoLight) footerLogoLight.style.display = 'inline-block';
      if (footerLogoDark) footerLogoDark.style.display = 'none';
      localStorage.setItem('theme', 'light');
    }
  });
}

// Mobile menu toggle
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');
const navClose = document.getElementById('navClose');
const navOverlay = document.getElementById('navOverlay');

// Function to close mobile menu
function closeMobileMenu() {
  if (navMenu && menuToggle && navOverlay) {
    navMenu.classList.remove('active');
    menuToggle.classList.remove('active');
    navOverlay.classList.remove('active');
  }
}

// Toggle menu on burger click
if (menuToggle && navMenu && navOverlay) {
  menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    menuToggle.classList.toggle('active');
    navOverlay.classList.toggle('active');
  });
}

// Close menu on X button click
if (navClose) {
  navClose.addEventListener('click', () => {
    closeMobileMenu();
  });
}

// Close menu when clicking a nav link (for mobile)
document.querySelectorAll('.nav-menu > li > .nav-link').forEach(link => {
  link.addEventListener('click', (e) => {
    // Don't close if it's a dropdown toggle
    if (!link.parentElement.classList.contains('nav-dropdown')) {
      closeMobileMenu();
    }
  });
});

// Dropdown toggle for mobile
document.querySelectorAll('.nav-dropdown > .nav-link').forEach(dropdownToggle => {
  dropdownToggle.addEventListener('click', (e) => {
    // Only toggle on mobile
    if (window.innerWidth <= 768) {
      e.preventDefault();
      const dropdown = dropdownToggle.parentElement;
      const submenu = dropdown.querySelector('.nav-dropdown-menu');

      // Close other dropdowns
      document.querySelectorAll('.nav-dropdown').forEach(other => {
        if (other !== dropdown) {
          other.classList.remove('active');
          const otherSubmenu = other.querySelector('.nav-dropdown-menu');
          if (otherSubmenu) {
            otherSubmenu.style.display = '';
          }
        }
      });

      // Toggle current dropdown
      dropdown.classList.toggle('active');
      if (submenu) {
        submenu.style.display = dropdown.classList.contains('active') ? 'block' : '';
      }
    }
  });
});

// Dropdown menu links should close the mobile menu
document.querySelectorAll('.nav-dropdown-menu .nav-link').forEach(link => {
  link.addEventListener('click', () => {
    closeMobileMenu();
  });
});

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

// Close mobile menu when clicking on overlay
if (navOverlay) {
  navOverlay.addEventListener('click', () => {
    closeMobileMenu();
  });
}

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

// ====================
// Hero Carousel
// ====================

class HeroCarousel {
  constructor() {
    this.slides = document.querySelectorAll('.carousel-slide');
    this.dots = document.querySelectorAll('.carousel-dot');
    this.prevBtn = document.getElementById('carouselPrev');
    this.nextBtn = document.getElementById('carouselNext');
    this.currentSlide = 0;
    this.totalSlides = this.slides.length;
    this.autoSlideInterval = null;
    this.autoSlideDelay = 5000; // 5 seconds

    if (this.slides.length > 0) {
      this.init();
    }
  }

  init() {
    // Add event listeners
    this.prevBtn?.addEventListener('click', () => this.prevSlide());
    this.nextBtn?.addEventListener('click', () => this.nextSlide());

    this.dots.forEach((dot, index) => {
      dot.addEventListener('click', () => this.goToSlide(index));
    });

    // Start auto-slide
    this.startAutoSlide();

    // Pause on hover
    const carousel = document.querySelector('.hero-carousel');
    if (carousel) {
      carousel.addEventListener('mouseenter', () => this.stopAutoSlide());
      carousel.addEventListener('mouseleave', () => this.startAutoSlide());
    }

    // Pause when tab is not visible
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.stopAutoSlide();
      } else {
        this.startAutoSlide();
      }
    });

    // Add Swipe Support
    this.addSwipeSupport();
  }

  addSwipeSupport() {
    const carousel = document.querySelector('.hero-carousel');
    if (!carousel) return;

    let touchStartX = 0;
    let touchEndX = 0;

    carousel.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      this.stopAutoSlide(); // Stop auto slide on interaction
    }, { passive: true });

    carousel.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      this.handleSwipe();
      this.startAutoSlide(); // Resume auto slide
    }, { passive: true });

    this.handleSwipe = () => {
      const SWIPE_THRESHOLD = 50;
      if (touchEndX < touchStartX - SWIPE_THRESHOLD) {
        // Swipe Left -> Next Slide
        this.nextSlide();
      }
      if (touchEndX > touchStartX + SWIPE_THRESHOLD) {
        // Swipe Right -> Prev Slide
        this.prevSlide();
      }
    };
  }

  goToSlide(index) {
    // Remove active class from current slide
    this.slides[this.currentSlide].classList.remove('active');
    this.dots[this.currentSlide]?.classList.remove('active');

    // Update current slide
    this.currentSlide = index;

    // Add active class to new slide
    this.slides[this.currentSlide].classList.add('active');
    this.dots[this.currentSlide]?.classList.add('active');

    // Reset animation
    const content = this.slides[this.currentSlide].querySelector('.hero-content');
    if (content) {
      content.style.animation = 'none';
      content.offsetHeight; // Trigger reflow
      content.style.animation = 'slideUp 1s ease-out';
    }
  }

  nextSlide() {
    const nextIndex = (this.currentSlide + 1) % this.totalSlides;
    this.goToSlide(nextIndex);
  }

  prevSlide() {
    const prevIndex = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
    this.goToSlide(prevIndex);
  }

  startAutoSlide() {
    if (!this.autoSlideInterval) {
      this.autoSlideInterval = setInterval(() => {
        this.nextSlide();
      }, this.autoSlideDelay);
    }
  }

  stopAutoSlide() {
    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
      this.autoSlideInterval = null;
    }
  }
}

// ====================
// Inline Video Player
// ====================
const videoWrapper = document.getElementById('videoWrapper');

if (videoWrapper) {
  const videoId = videoWrapper.getAttribute('data-video-id');
  const playBtn = videoWrapper.querySelector('.play-btn');
  const thumbnail = videoWrapper.querySelector('.video-thumbnail');

  playBtn.addEventListener('click', () => {
    // Create iframe
    const iframe = document.createElement('iframe');
    iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
    iframe.title = "YouTube video player";
    iframe.frameBorder = "0";
    iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
    iframe.allowFullscreen = true;
    iframe.style.width = "100%";
    iframe.style.height = "100%";
    iframe.style.position = "absolute";
    iframe.style.top = "0";
    iframe.style.left = "0";
    iframe.style.borderRadius = "12px";

    // Clear content and append iframe
    thumbnail.innerHTML = '';
    thumbnail.appendChild(iframe);
  });
}

// Initialize carousel when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new HeroCarousel();
  });
} else {
  new HeroCarousel();
}
