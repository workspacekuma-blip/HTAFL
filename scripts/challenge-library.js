/* Only real, published challenge records belong in the source. Examples stay separate. */
(() => {
  const filters = document.getElementById('challenge-filters');
  if (!filters) return;
  const statuses = { current: 'Current', upcoming: 'Upcoming', past: 'Past' };
  const radios = [...filters.querySelectorAll('input')];
  const list = document.querySelector('[data-challenge-list]');
  const empty = document.querySelector('[data-challenge-empty]');
  const status = document.getElementById('challenge-status');
  const template = document.getElementById('challenge-card');
  const disclosure = document.getElementById('challenge-library');
  const { hasText: text, readRecords, publicURL } = window.HTAFLContent;
  const raw = readRecords('challenge-data');
  const seen = new Set();
  const challenges = raw.flatMap((entry) => {
    if (!entry || entry.publicationStatus !== 'published' || !text(entry.id) || seen.has(entry.id) ||
        !text(entry.title) || !text(entry.description) || !Object.hasOwn(statuses, entry.status)) return [];
    let href;
    if (entry.href) {
      href = publicURL(entry.href);
      if (!href) return [];
    }
    seen.add(entry.id);
    return [{ ...entry, href: href?.href }];
  });
  const selected = () => radios.find((radio) => radio.checked).value;
  function render() {
    const value = selected();
    const matches = challenges.filter((entry) => !value || entry.status === value);
    const fragment = document.createDocumentFragment();
    matches.forEach((entry) => {
      const card = template.content.cloneNode(true);
      card.querySelector('[data-challenge-label]').textContent = statuses[entry.status];
      card.querySelector('[data-challenge-title]').textContent = entry.title;
      card.querySelector('[data-challenge-description]').textContent = entry.description;
      const link = card.querySelector('[data-challenge-link]');
      if (entry.href) { link.href = entry.href; link.hidden = false; }
      fragment.append(card);
    });
    list.replaceChildren(fragment);
    list.hidden = !matches.length;
    empty.hidden = !!matches.length;
    status.textContent = `${matches.length ? 'Published' : 'No published'} ${value ? `${value} ` : ''}challenges.`;
    empty.textContent = challenges.length
      ? 'No challenges match this status. Choose another filter or All.'
      : `No ${value ? `${value} ` : ''}community challenges have been published yet. Explore the example prompts above at your own pace.`;
  }
  function writeURL(mode) {
    const url = new URL(location.href);
    const value = selected();
    value ? url.searchParams.set('challenge', value) : url.searchParams.delete('challenge');
    if (url.href === location.href) return;
    try { history[mode](null, '', url); } catch { /* Filtering remains usable from local files. */ }
  }
  function readURL() {
    const value = new URL(location.href).searchParams.get('challenge') || '';
    const normalized = Object.hasOwn(statuses, value) ? value : '';
    radios.forEach((radio) => { radio.checked = radio.value === normalized; });
    if (normalized) disclosure.open = true;
    render();
  }
  radios.forEach((radio) => radio.addEventListener('change', () => { render(); writeURL('pushState'); }));
  window.addEventListener('popstate', readURL);
  filters.hidden = false;
  readURL();
  writeURL('replaceState');
})();
