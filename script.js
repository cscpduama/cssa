// CSSA site — small progressive-enhancement behaviors, no framework.

document.addEventListener('DOMContentLoaded', () => {
  // Mobile nav toggle
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }));
  }

  // ---- Generic scoped filter/search (events, FAQs, projects, gallery) ----
  // Each filter group is a wrapper with [data-filter-group] containing:
  //   a <select data-filter-select>, an <input data-filter-search>, an optional
  //   [data-filter-reset], and item rows with [data-filter-item] + data-tags/data-title.
  document.querySelectorAll('[data-filter-group]').forEach(group => {
    const select = group.querySelector('[data-filter-select]');
    const search = group.querySelector('[data-filter-search]');
    const reset = group.querySelector('[data-filter-reset]');
    const items = group.querySelectorAll('[data-filter-item]');

    function apply() {
      const cat = select ? select.value : 'all';
      const q = search ? search.value.trim().toLowerCase() : '';
      items.forEach(item => {
        const tags = (item.dataset.tags || '').toLowerCase();
        const title = (item.dataset.title || '').toLowerCase();
        const matchesCat = cat === 'all' || tags.includes(cat);
        const matchesSearch = !q || title.includes(q) || tags.includes(q);
        item.style.display = (matchesCat && matchesSearch) ? '' : 'none';
      });
    }
    if (select) select.addEventListener('change', apply);
    if (search) search.addEventListener('input', apply);
    if (reset) reset.addEventListener('click', (e) => {
      e.preventDefault();
      if (select) select.value = 'all';
      if (search) search.value = '';
      apply();
    });
  });

  // ---- Gallery filter chips (chip-style, single group per page) ----
  const chips = document.querySelectorAll('[data-gallery-chip]');
  const tiles = document.querySelectorAll('[data-gallery-tile]');
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      const cat = chip.dataset.galleryChip;
      tiles.forEach(t => {
        t.style.display = (cat === 'all' || t.dataset.galleryTile === cat) ? '' : 'none';
      });
    });
  });

  // ---- Sticky sidebar scrollspy ----
  const sideNav = document.querySelector('.side-nav');
  if (sideNav) {
    const links = Array.from(sideNav.querySelectorAll('a[href^="#"]'));
    const sections = links
      .map(link => document.querySelector(link.getAttribute('href')))
      .filter(Boolean);

    function setActive() {
      let current = sections[0];
      const probe = window.scrollY + 140;
      sections.forEach(sec => { if (sec.offsetTop <= probe) current = sec; });
      links.forEach(link => {
        const match = current && link.getAttribute('href') === `#${current.id}`;
        link.classList.toggle('active', !!match);
      });
    }
    setActive();
    window.addEventListener('scroll', setActive, { passive: true });
    window.addEventListener('resize', setActive);
  }
});
