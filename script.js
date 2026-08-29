// Clean URL Address Bar Handler (Strips .html instantly on load)
if (window.location.pathname.endsWith('.html')) {
  const cleanPath = window.location.pathname.slice(0, -5);
  window.history.replaceState(null, '', cleanPath + window.location.search + window.location.hash);
}

document.addEventListener('DOMContentLoaded', () => {
  // Resolve base path dynamically (handles /cssa/ proxy and subpaths)
  const pathParts = window.location.pathname.split('/');
  let basePath = '';
  if (pathParts[1] && pathParts[1].toLowerCase() === 'cssa') {
    basePath = '/' + pathParts[1];
  }

  // Rewrite all internal links to work seamlessly with subpaths and fallback to .html files under the hood
  document.querySelectorAll('a').forEach(link => {
    let href = link.getAttribute('href');
    if (href && !href.startsWith('http') && !href.startsWith('#') && !href.startsWith('//') && href !== '/') {
      // Clean leading and trailing slashes
      href = href.replace(/^\//, '').replace(/\.html$/, '');
      
      // Map to clean path subpath routing
      link.setAttribute('href', basePath + '/' + href);
    }
  });

  // Expandable Accordion Toggle (Events page)
  const accordions = document.querySelectorAll('.event-accordion');
  accordions.forEach(accordion => {
    accordion.addEventListener('click', () => {
      accordion.classList.toggle('open');
    });
  });

  // Contact Form Submission Handler
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    const feedback = document.getElementById('formFeedback');
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const message = document.getElementById('message').value;

      if (name && email && message) {
        if (feedback) {
          feedback.style.display = 'block';
          feedback.style.backgroundColor = 'rgba(25, 135, 84, 0.1)';
          feedback.style.color = '#198754';
          feedback.style.border = '1px solid #198754';
          feedback.textContent = `Thank you, ${name}! Your message has been received. The CSSA team will get back to you shortly.`;
        } else {
          alert(`Thank you, ${name}! Your message has been received.`);
        }
        contactForm.reset();
      }
    });
  }

  // Mobile Nav Toggle
  const navToggle = document.querySelector('.nav-toggle');
  const siteNav = document.getElementById('site-nav');
  if (navToggle && siteNav) {
    navToggle.addEventListener('click', () => {
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !expanded);
      siteNav.classList.toggle('open');
      navToggle.classList.toggle('active');
    });
  }
});
