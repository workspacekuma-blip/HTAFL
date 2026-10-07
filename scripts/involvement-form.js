/* Real same-origin services; a static preview never claims delivery. */
(() => {
  const forms = [...document.querySelectorAll('[data-api-form]')];
  if (!forms.length) return;
  const config = location.protocol === 'file:' ? Promise.resolve(null) : fetch('/api/config').then(r => r.ok ? r.json() : null).catch(() => null);
  forms.forEach(async form => {
    const upload = form.dataset.apiForm === 'artwork';
    const fieldset = form.querySelector('fieldset');
    const fields = [...fieldset.querySelectorAll('input,select,textarea')].filter(f => f.name !== 'website' && f.type !== 'hidden');
    const summary = form.querySelector('[data-form-errors]');
    const status = form.querySelector('[data-form-status]');
    const notice = form.querySelector('[data-form-notice]');
    const submit = form.querySelector('[data-submit]');
    const submitLabel = submit.textContent;
    const errors = new Map();
    let ready = false, pending = false, reviewed = false, previewURL, maxUploadBytes=3*1024*1024;
    form.noValidate = true;
    const messageFor = field => {
      const value = field.value.trim();
      if (field.type === 'checkbox') return field.required && !field.checked ? 'Please confirm this permission.' : '';
      if (field.type === 'file') {
        const file = field.files[0];
        if (!file) return 'Choose one image of your work.';
        if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) return 'Choose a JPEG, PNG or WebP image.';
        return file.size > maxUploadBytes ? `Choose an image no larger than ${maxUploadBytes/1024/1024} MB.` : '';
      }
      if (field.required && !value) return 'Complete this field.';
      if (field.minLength > 0 && value.length < field.minLength) return `Use at least ${field.minLength} characters.`;
      if (field.maxLength > 0 && value.length > field.maxLength) return `Use no more than ${field.maxLength} characters.`;
      if (field.type === 'email' && !field.validity.valid) return 'Enter a valid email address.';
      if (field.type === 'url' && value) {
        try { const url = new URL(value); if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) throw Error(); }
        catch { return 'Enter a full http(s) URL without sign-in details, or leave it empty.'; }
      }
      return '';
    };
    const setError = (field, message) => {
      const node = document.getElementById(`${field.id}-error`);
      if (node) { node.textContent = message; node.hidden = !message; }
      if (message) { errors.set(field, message); field.setAttribute('aria-invalid', 'true'); }
      else { errors.delete(field); field.removeAttribute('aria-invalid'); }
    };
    const renderErrors = () => {
      const list = summary.querySelector('ul'); list.replaceChildren();
      errors.forEach((message, field) => {
        const item = document.createElement('li'), link = document.createElement('a');
        link.href = `#${field.id}`;
        link.textContent = `${field.labels?.[0]?.textContent.trim() || field.name}: ${message}`;
        link.addEventListener('click', event => { event.preventDefault(); field.focus(); });
        item.append(link); list.append(item);
      });
      summary.hidden = !errors.size;
    };
    const preview = form.querySelector('[data-upload-preview]');
    const clearPreview = () => {
      if (previewURL) URL.revokeObjectURL(previewURL);
      previewURL = undefined;
      if (preview) { preview.hidden = true; preview.removeAttribute('src'); }
    };
    fields.forEach(field => {
      const update = () => {
        status.textContent = '';
        if (reviewed || errors.has(field)) { setError(field, messageFor(field)); renderErrors(); }
        if (field.type === 'file') {
          clearPreview();
          if (!messageFor(field)) {
            previewURL = URL.createObjectURL(field.files[0]); preview.src = previewURL; preview.hidden = false;
            preview.onerror = () => { clearPreview(); setError(field, 'This image could not be read. Choose another still image.'); renderErrors(); };
          }
        }
      };
      field.addEventListener('input', update); field.addEventListener('change', update);
      field.addEventListener('blur', () => { setError(field, messageFor(field)); renderErrors(); });
    });
    form.addEventListener('submit', async event => {
      event.preventDefault();
      if (!ready || pending) return;
      reviewed = true;
      fields.forEach(field => setError(field, messageFor(field))); renderErrors();
      if (errors.size) { status.textContent = ''; summary.focus(); return; }
      const data = new FormData(form);
      fields.filter(f => f.type === 'checkbox').forEach(field => data.set(field.name, String(field.checked)));
      const body = upload ? data : JSON.stringify({...Object.fromEntries(data), consent: form.elements.consent.checked, adultConsent: form.elements.adultConsent.checked});
      pending = true; fieldset.disabled = true; form.setAttribute('aria-busy', 'true'); submit.textContent = upload ? 'Uploading…' : 'Sending…';
      status.textContent = upload ? 'Uploading your work for private review…' : 'Sending your enquiry…';
      let serverErrors = {}, successful = false;
      try {
        const response = await fetch(form.action, {method: 'POST', body, headers: upload ? {} : {'Content-Type': 'application/json'}});
        const result = await response.json();
        if (!response.ok) { serverErrors = result.fields || {}; throw Error(result.message || 'Your submission could not be completed.'); }
        successful = true; form.reset();
        status.textContent = result.message + (upload ? ` Reference: ${result.id}.` : '');
      } catch (error) {
        status.textContent = error.message === 'Failed to fetch' ? 'The connection failed. Your details are preserved. Please try again.' : error.message;
      } finally {
        pending = false; fieldset.disabled = false; form.removeAttribute('aria-busy'); submit.textContent = submitLabel;
        fields.forEach(field => { if (serverErrors[field.name]) setError(field, serverErrors[field.name]); }); renderErrors();
        if (errors.size) summary.focus();
        if (successful) { status.tabIndex = -1; status.focus({preventScroll: true}); }
      }
    });
    form.addEventListener('reset', () => {
      reviewed = false; clearPreview(); fields.forEach(field => setError(field, '')); renderErrors(); status.textContent = '';
    });
    window.addEventListener('pagehide', clearPreview);
    const availability = await config;
    if(Number.isSafeInteger(availability?.maxUploadBytes) && availability.maxUploadBytes>0)maxUploadBytes=availability.maxUploadBytes;
    const limitNotice=form.querySelector('[data-upload-limit]');if(limitNotice)limitNotice.textContent=`${maxUploadBytes/1024/1024} MB`;
    fieldset.disabled = false;
    ready = upload ? availability?.uploadsReady === true : availability?.emailReady === true;
    submit.disabled = !ready;
    const message = ready ? (upload ? 'Uploads are private until reviewed. Publication permission is optional.' : 'Your enquiry will be sent to htafl@africamail.com.') : upload ? 'Online uploads need the running HTAFL server. Please email us to arrange sharing your work.' : 'Online email delivery is not configured yet. Please email htafl@africamail.com directly.';
    notice.replaceChildren(document.createTextNode(message + ' '));
    const emailLink = document.createElement('a'); emailLink.href = 'mailto:htafl@africamail.com'; emailLink.textContent = 'Email HTAFL'; notice.append(emailLink);
  });
})();
