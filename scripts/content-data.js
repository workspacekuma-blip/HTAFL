/* Shared public-record parsing and destination checks for the three content adapters. */
window.HTAFLContent = Object.freeze({
  hasText: (value) => typeof value === 'string' && value.trim().length > 0,
  readRecords: (id) => {
    try {
      const records = JSON.parse(document.getElementById(id).textContent);
      return Array.isArray(records) ? records : [];
    } catch { return []; }
  },
  publicURL: (value) => {
    try {
      const url = new URL(value, document.baseURI);
      if (url.username || url.password) return null;
      return url.protocol === 'https:' || (url.protocol === location.protocol && url.origin === location.origin) ? url : null;
    } catch { return null; }
  },
});
