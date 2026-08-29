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

  // --- Client-Side Search, Filter, and Pagination for Activities Page ---
  const eventRows = document.querySelectorAll('.event-row');
  const eventFilter = document.getElementById('event-filter');
  const eventSearch = document.getElementById('event-search');
  const paginationContainer = document.querySelector('.pagination');

  if (eventRows.length > 0) {
    let currentPage = 1;
    const itemsPerPage = 4;

    function updateEvents() {
      const searchTerm = eventSearch ? eventSearch.value.toLowerCase().trim() : '';
      const filterVal = eventFilter ? eventFilter.value.toLowerCase() : 'all';

      // Filter rows by search and tag
      const matchedRows = Array.from(eventRows).filter(row => {
        const title = (row.getAttribute('data-title') || '').toLowerCase();
        const tags = (row.getAttribute('data-tags') || '').toLowerCase();
        
        const matchesSearch = title.includes(searchTerm);
        const matchesFilter = filterVal === 'all' || tags.includes(filterVal);
        
        return matchesSearch && matchesFilter;
      });

      // Hide all rows
      eventRows.forEach(row => row.style.display = 'none');

      // Calculate pagination slice
      const totalItems = matchedRows.length;
      const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
      
      // Keep currentPage in valid range
      if (currentPage > totalPages) currentPage = totalPages;
      if (currentPage < 1) currentPage = 1;

      const start = (currentPage - 1) * itemsPerPage;
      const end = start + itemsPerPage;

      matchedRows.slice(start, end).forEach(row => {
        row.style.display = 'flex';
      });

      // Render pagination numbers
      if (paginationContainer) {
        paginationContainer.innerHTML = '';
        for (let i = 1; i <= totalPages; i++) {
          const span = document.createElement('span');
          span.className = `num${i === currentPage ? ' active' : ''}`;
          span.textContent = i;
          span.addEventListener('click', () => {
            currentPage = i;
            updateEvents();
          });
          paginationContainer.appendChild(span);
        }
      }
    }

    // Attach event listeners for filters
    if (eventFilter) eventFilter.addEventListener('change', () => { currentPage = 1; updateEvents(); });
    if (eventSearch) eventSearch.addEventListener('input', () => { currentPage = 1; updateEvents(); });
    
    const resetLink = document.querySelector('[data-filter-reset]');
    if (resetLink) {
      resetLink.addEventListener('click', (e) => {
        e.preventDefault();
        if (eventFilter) eventFilter.value = 'all';
        if (eventSearch) eventSearch.value = '';
        currentPage = 1;
        updateEvents();
      });
    }

    // Initialize first page
    updateEvents();

    // Toggle event details accordion
    eventRows.forEach(row => {
      row.addEventListener('click', (e) => {
        // Toggle the open class
        row.classList.toggle('open');
      });
    });
  }

  // Trigger smooth page load fade-in
  document.body.classList.add('loaded');

  // Intercept hash anchor clicks for smooth offset scroll
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId && targetId !== '#') {
        e.preventDefault();
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          const offsetTop = targetElement.getBoundingClientRect().top + window.pageYOffset - 90;
          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
          });
        }
      }
    });
  });

  // --- ScrollSpy for Academics / Side Navigation Pages ---
  const sideLinks = document.querySelectorAll('.side-nav a');
  const sideSections = document.querySelectorAll('.side-section');

  if (sideLinks.length > 0 && sideSections.length > 0) {
    function updateActiveLink() {
      let activeSectionId = '';
      const scrollPos = window.scrollY || window.pageYOffset;

      sideSections.forEach(section => {
        // Offset matches the navigation scroll offset
        const sectionTop = section.offsetTop - 140;
        const sectionHeight = section.offsetHeight;
        
        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
          activeSectionId = section.getAttribute('id');
        }
      });

      sideLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${activeSectionId}`) {
          link.classList.add('active');
        }
      });
    }

    window.addEventListener('scroll', updateActiveLink);
    window.addEventListener('resize', updateActiveLink);
    updateActiveLink(); // Run on page load
  }
});
