(() => {
  const form = document.getElementById('resource-search');
  const source = document.getElementById('resource-data');
  const template = document.getElementById('resource-card');
  const list = document.querySelector('[data-resource-list]');
  if (!form || !source || !template || !list) return;
  const query = form.elements.q;
  const radios = [...form.querySelectorAll('[name="category"]')];
  const clear = document.querySelector('[data-clear-resources]');
  const empty = document.querySelector('[data-resource-empty]');
  const status = document.getElementById('resource-status');
  const categories = { mind: 'Mind', movement: 'Movement', create: 'Create', connect: 'Connect', stories: 'Stories' };
  const assetBase = new URL('../', document.currentScript.src);
  const { hasText: text, readRecords, publicURL } = window.HTAFLContent;
  const raw = readRecords('resource-data');
  const seen = new Set();
  const resources = raw.flatMap((entry) => {
    if (!entry || entry.status !== 'published' || !text(entry.id) || seen.has(entry.id) ||
        !text(entry.title) || !text(entry.description) || !text(entry.source) ||
        !Object.hasOwn(categories, entry.category) || !text(entry.href)) return [];
    const href = publicURL(entry.href);
    if (!href) return [];
    seen.add(entry.id);
    const tags = Array.isArray(entry.tags) ? entry.tags.filter(text) : [];
    return [{ ...entry, href: href.href,
      searchText: [entry.title, entry.description, entry.source, categories[entry.category], ...tags].join(' ').toLocaleLowerCase() }];
  });
  const state = () => ({ q: query.value.trim().slice(0, 200), category: form.elements.category.value });
  const writeURL = (mode) => {
    const url = new URL(location.href);
    const { q, category } = state();
    q ? url.searchParams.set('q', q) : url.searchParams.delete('q');
    category ? url.searchParams.set('category', category) : url.searchParams.delete('category');
    if (url.href === location.href) return;
    // Some file browsers disallow History API changes; filtering still works.
    try { history[mode === 'push' ? 'pushState' : 'replaceState'](null, '', url); } catch { /* Keep local filtering available. */ }
  };
  const render = () => {
    const { q, category } = state();
    const terms = q.toLocaleLowerCase().split(/\s+/).filter(Boolean);
    const matches = resources.filter((entry) => (!category || entry.category === category) && terms.every((term) => entry.searchText.includes(term)));
    const fragment = document.createDocumentFragment();
    matches.forEach((entry) => {
      const card = template.content.cloneNode(true);
      card.querySelector('[data-resource-category]').textContent = categories[entry.category];
      const link = card.querySelector('[data-resource-link]');
      link.textContent = entry.title;
      link.href = entry.href;
      const image = card.querySelector('[data-resource-image]');
      if (image && entry.image) {
        const target = new URL(entry.image, assetBase);
        if (target.origin === location.origin) {
          image.src = target.href; image.alt = entry.alt || '';
          image.width = entry.width || 1280; image.height = entry.height || 854;
        } else image.remove();
      }
      card.querySelector('[data-resource-description]').textContent = entry.description;
      card.querySelector('[data-resource-source]').textContent = `Source: ${entry.source}`;
      fragment.append(card);
    });
    list.replaceChildren(fragment);
    list.hidden = matches.length === 0;
    empty.hidden = matches.length > 0;
    clear.hidden = !q && !category;
    const filters = [category ? `category: ${categories[category]}` : '', q ? `search: “${q}”` : ''].filter(Boolean);
    status.textContent = `${matches.length} ${matches.length === 1 ? 'resource' : 'resources'}${filters.length ? ` — ${filters.join('; ')}` : ''}.`;
    empty.querySelector('[data-empty-label]').textContent = resources.length ? 'No matching resources' : 'Resources coming soon';
    empty.querySelector('[data-empty-title]').textContent = !resources.length
      ? (filters.length ? 'No published resources for these filters yet.' : 'The library is taking shape.')
      : 'No resources match your search.';
    empty.querySelector('[data-empty-message]').textContent = !resources.length
      ? 'No resources have been published yet. You can explore the categories or clear your search; verified resources will appear here as they become available.'
      : 'Try a broader keyword, choose another category, or clear search and filters.';
  };
  const readURL = () => {
    const params = new URL(location.href).searchParams;
    query.value = (params.get('q') || '').slice(0, 200);
    const value = params.get('category') || '';
    const category = Object.hasOwn(categories, value) ? value : '';
    radios.forEach((radio) => { radio.checked = radio.value === category; });
    render();
  };
  let timer;
  const update = (mode) => { clearTimeout(timer); render(); writeURL(mode); };
  query.addEventListener('input', () => { clearTimeout(timer); timer = setTimeout(() => update('replace'), 180); });
  radios.forEach((radio) => radio.addEventListener('change', () => update('push')));
  form.addEventListener('submit', (event) => { event.preventDefault(); update('push'); });
  clear.addEventListener('click', () => {
    query.value = '';
    radios.forEach((radio) => { radio.checked = radio.value === ''; });
    update('push');
    query.focus();
  });
  window.addEventListener('popstate', () => { clearTimeout(timer); readURL(); });
  readURL();
  writeURL('replace');
})();
