(function () {
  const mount = document.getElementById('sponsorsMount');
  if (!mount) return;

  const fallbackHtml = '<p class="muted">Sponsors to be announced soon...</p>';
  const API_URL = 'https://2dc2431b-ca2c-49be-856d-1cc0dc422ad7-00-2v43r5biefaaw.riker.replit.dev/api/sponsors.json';

  mount.innerHTML = fallbackHtml;

  function normalizeUrl(url) {
    if (!url) return '';
    const trimmed = String(url).trim();
    if (!trimmed) return '';
    if (/^https?:\/\//i.test(trimmed)) return trimmed;
    return 'https://' + trimmed;
  }

  function tierTitle(key) {
    if (key === 'presenting') return 'Presenting Sponsor';
    if (key === 'gold') return 'Gold Sponsors';
    if (key === 'silver') return 'Silver Sponsors';
    return key;
  }

  function renderTier(key, items) {
    if (!Array.isArray(items) || items.length === 0) return '';

    const cards = items
      .map((s, idx) => {
        const name = (s && (s.name || s.displayName) ? String(s.name || s.displayName) : '').trim();
        const logo = (s && (s.logo || s.logoUrl) ? String(s.logo || s.logoUrl) : '').trim();
        const url = normalizeUrl(s && (s.url || s.websiteUrl) ? s.url || s.websiteUrl : '');

        if (!logo) return '';

        const img = `<img class="sponsor-logo" src="${logo}" alt="${name || 'Sponsor logo'}" loading="lazy" />`;
        const inner = url ? `<a class="sponsor-link" href="${url}" target="_blank" rel="noopener noreferrer">${img}</a>` : img;

        return `<div class="sponsor-card" data-tier="${key}" data-idx="${idx}">${inner}</div>`;
      })
      .join('');

    if (!cards.trim()) return '';

    return `
      <div class="sponsor-tier" data-tier="${key}">
        <div class="sponsor-tier-title">${tierTitle(key)}</div>
        <div class="sponsor-grid">${cards}</div>
      </div>
    `;
  }

  fetch(API_URL, { headers: { Accept: 'application/json' } })
    .then((r) => {
      if (!r.ok) throw new Error('Bad response');
      return r.json();
    })
    .then((data) => {
      const presenting = data && data.presenting ? data.presenting : [];
      const gold = data && data.gold ? data.gold : [];
      const silver = data && data.silver ? data.silver : [];

      const html = [
        renderTier('presenting', presenting),
        renderTier('gold', gold),
        renderTier('silver', silver),
      ].join('');

      if (!html.trim()) {
        mount.innerHTML = fallbackHtml;
        return;
      }

      mount.innerHTML = html;
    })
    .catch(() => {
      mount.innerHTML = fallbackHtml;
    });
})();
