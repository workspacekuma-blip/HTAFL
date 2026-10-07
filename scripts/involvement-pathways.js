/* Keep old enquiry links working in static/file previews; forms have separate pages. */
(() => {
  const links=[...document.querySelectorAll('[data-involvement-pathway]')];
  const url=new URL(location.href),hash=url.hash.slice(1);
  const key=hash==='support-payment'?'support':hash.endsWith('-form')?hash.slice(0,-5):url.searchParams.get('interest');
  const link=links.find(link=>link.dataset.involvementPathway===key);
  if(!link)return;
  const target=new URL(link.href);
  if(target.protocol==='file:' && target.pathname.endsWith('/'))target.pathname+='index.html';
  target.hash=hash==='support-payment'?'support-payment':'involvement-form';
  location.replace(target.href);
})();
