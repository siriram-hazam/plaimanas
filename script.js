function fitHeroTitle() {
  const heroTitle = document.querySelector('.hero-title');
  if (!heroTitle || heroTitle.classList.contains('scrolled')) return;
  const vw = window.innerWidth;
  heroTitle.style.fontSize = '17.5vw';
  const textW = heroTitle.scrollWidth;
  if (textW > 0) {
    const fs = parseFloat(getComputedStyle(heroTitle).fontSize);
    heroTitle.style.fontSize = (fs * vw) / textW + 'px';
  }
}
window.addEventListener('load', fitHeroTitle);
window.addEventListener('resize', fitHeroTitle);

function debounce(func, wait) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

(() => {
  'use strict';

  const navbar = document.querySelector('.navbar');
  const heroImage = document.querySelector('.hero-img');
  const heroTitle = document.querySelector('.hero-title');
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  const bestsellerScroll = document.querySelector('.bestseller-scroll');
  const bestsellerLabel = document.querySelector('.bestseller-sticky-label');

  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // FAQ accordion
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach((item) => {
    item.querySelector('.faq-question').addEventListener('click', () => {
      faqItems.forEach((other) => {
        if (other !== item && other.classList.contains('active')) {
          other.classList.remove('active');
          other.querySelector('.faq-icon').textContent = '+';
        }
      });
      const isActive = item.classList.toggle('active');
      item.querySelector('.faq-icon').textContent = isActive ? '−' : '+';
    });
  });

  // FAQ tabs
  document.querySelectorAll('.faq-tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      document
        .querySelectorAll('.faq-tab')
        .forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
    });
  });

  // Contact form
  const contactForm = document.querySelector('.contact-form');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const fullName = contactForm.querySelector(
        'input[placeholder="Full name*"]',
      ).value;
      const phone = contactForm.querySelector('input[type="tel"]').value;
      const subject = contactForm.querySelector('.form-select').value;
      const termsChecked = contactForm.querySelector(
        'input[type="checkbox"]',
      ).checked;

      if (!fullName || !phone || !subject) {
        alert('Please fill in all required fields marked with *');
        return;
      }
      if (!termsChecked) {
        alert('Please agree to the terms & conditions');
        return;
      }
      alert('Thank you for your inquiry! We will get back to you soon.');
      contactForm.reset();
    });
  }

  // Newsletter form
  const newsletterForm = document.querySelector('.newsletter-form');

  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = newsletterForm.querySelector('.newsletter-input').value;
      if (email) {
        alert('Thank you for subscribing!');
        newsletterForm.reset();
      }
    });
  }

  // Scroll handler (debounced)
  const revealElements = document.querySelectorAll(
    '.featured-section, .collections-section, .features-section',
  );

  function updateBestsellerLabel() {
    if (!bestsellerScroll || !bestsellerLabel) return;
    const rect = bestsellerScroll.getBoundingClientRect();
    const labelH = bestsellerLabel.offsetHeight;
    const pinY = heroTitle
      ? heroTitle.getBoundingClientRect().bottom + 20
      : 120;
    const labelNaturalY = rect.top + rect.height / 2;

    if (labelNaturalY >= pinY) {
      bestsellerLabel.style.top = '50%';
    } else {
      const desiredTop = pinY - rect.top;
      const maxTop = rect.height - labelH / 2;
      bestsellerLabel.style.top = Math.min(desiredTop, maxTop) + 'px';
    }
  }

  function onScroll() {
    const scrollY = window.scrollY;
    const windowH = window.innerHeight;

    if (navbar) {
      navbar.style.boxShadow =
        scrollY > 100 ? '0 2px 10px rgba(0,0,0,0.1)' : 'none';
    }

    if (heroImage) {
      heroImage.style.transform = `translateY(${scrollY * 0.5}px)`;
    }

    updateBestsellerLabel();

    revealElements.forEach((el) => {
      if (el.getBoundingClientRect().top < windowH - 150) {
        el.classList.add('reveal', 'active');
      }
    });
  }

  onScroll();
  window.addEventListener('scroll', debounce(onScroll, 10));
  window.addEventListener('scroll', updateBestsellerLabel, { passive: true });

  // Image fade-in
  const imageObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.style.opacity = '0';
          img.style.transition = 'opacity 0.6s ease';
          setTimeout(() => {
            img.style.opacity = '1';
          }, 100);
          observer.unobserve(img);
        }
      });
    },
    { rootMargin: '50px' },
  );

  document.querySelectorAll('img').forEach((img) => imageObserver.observe(img));

  // Mobile menu
  if (hamburger && mobileMenu) {
    const closeMobileMenu = () => {
      mobileMenu.classList.remove('active');
      hamburger.classList.remove('active');
      document.body.style.overflow = '';
      if (heroTitle) heroTitle.style.opacity = '';
    };

    hamburger.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('active');
      hamburger.classList.toggle('active');
      document.body.style.overflow = isOpen ? 'hidden' : '';
      if (heroTitle) heroTitle.style.opacity = isOpen ? '0' : '';
    });

    mobileMenu.querySelectorAll('a.mobile-menu-link').forEach((link) => {
      link.addEventListener('click', closeMobileMenu);
    });
  }

  // Mobile editorial sub-menu
  const mobileEditorialTrigger = document.querySelector(
    '.mobile-editorial-trigger',
  );
  const mobileEditorialSub = document.querySelector('.mobile-editorial-sub');

  if (mobileEditorialTrigger && mobileEditorialSub) {
    mobileEditorialTrigger.addEventListener('click', () => {
      mobileEditorialTrigger.classList.toggle('active');
      mobileEditorialSub.classList.toggle('active');
    });
  }

  // Editorial hover overlay (desktop)
  const editorialTrigger = document.querySelector('.dropdown-trigger');
  const editorialOverlay = document.querySelector('.editorial-overlay');
  const editorialContent = document.querySelector('.editorial-overlay-content');

  if (editorialTrigger && editorialOverlay && editorialContent) {
    editorialTrigger.addEventListener('mouseenter', () => {
      if (window.innerWidth > 768) editorialOverlay.classList.add('active');
    });

    editorialOverlay.addEventListener('click', (e) => {
      if (!editorialContent.contains(e.target))
        editorialOverlay.classList.remove('active');
    });

    editorialContent.addEventListener('mouseleave', () => {
      editorialOverlay.classList.remove('active');
    });
  }

  // Spacebar toggle
  let isSmall = false;

  document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && heroTitle) {
      e.preventDefault();
      isSmall = !isSmall;
      if (isSmall) {
        heroTitle.classList.add('scrolled');
        heroTitle.style.fontSize = '';
      } else {
        heroTitle.classList.remove('scrolled');
        fitHeroTitle();
      }
    }
  });

  // Collection hover video
  document
    .querySelectorAll('.collection-main, .collection-item')
    .forEach((item) => {
      const hoverVideo = item.querySelector('video.collection-hover');
      if (!hoverVideo) return;
      item.addEventListener('mouseenter', () => {
        hoverVideo.currentTime = 0;
        hoverVideo.play();
      });
      item.addEventListener('mouseleave', () => hoverVideo.pause());
    });

  // Currency selector
  const currencyOptions = document.querySelectorAll('.currency-option');
  const currencyText = document.querySelector('.currency-text');

  function updateCurrencyDropdown() {
    const current = currencyText.textContent;
    currencyOptions.forEach((opt) => {
      opt.style.display = opt.dataset.currency === current ? 'none' : 'block';
    });
  }

  if (currencyText && currencyOptions.length) {
    updateCurrencyDropdown();
    currencyOptions.forEach((option) => {
      option.addEventListener('click', (e) => {
        e.preventDefault();
        currencyText.textContent = option.dataset.currency;
        updateCurrencyDropdown();
      });
    });
  }
})();
