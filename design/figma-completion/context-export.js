/* Read-only native design export when the remote connector is unavailable. */
async function exportImplementationContext() {
  const page = await figma.getNodeByIdAsync('3:2');
  if (!page || page.name !== 'Website — Desktop & Mobile') throw Error('Open the HTAFL master design.');
  await figma.setCurrentPageAsync(page);
  const names = ['Home/Desktop/1440', 'Home/Mobile/390', 'Home/Tablet/768',
    ...['About','HowItWorks','Create','Community','Resources','ResourceDetail','GetInvolved','Experience'].flatMap(n => ['Desktop','Mobile'].map(v => n+'/'+v+'/'+(n==='Experience'?'Create':'Default')))];
  const serialize = n => {
    if (n.visible === false) return null;
    const d = {id:n.id,type:n.type,name:n.name,x:n.x,y:n.y,width:n.width,height:n.height};
    for (const k of ['fills','strokes','strokeWeight','cornerRadius','layoutMode','itemSpacing','paddingLeft','paddingRight','paddingTop','paddingBottom','opacity','rotation','relativeTransform','textAutoResize','fontName','fontSize','lineHeight','letterSpacing','textAlignHorizontal','characters']) {
      if (k in n && typeof n[k] !== 'symbol') d[k] = n[k];
    }
    if ('children' in n) d.children=n.children.map(serialize).filter(Boolean);
    return d;
  };
  const frames = [];
  for (const name of names) {
    const n = page.children.find(c=>c.name===name);
    if (!n) throw Error('Missing design: '+name);
    frames.push(serialize(n));
  }
  const assets = {};
  for (const [name,id] of Object.entries(CONFIG.components).filter(([name])=>/BrandMark.*Mark$/.test(name))) {
    const n=await figma.getNodeByIdAsync(id);
    assets[name]=await n.exportAsync({format:'SVG_STRING'});
  }
  const home = await figma.getNodeByIdAsync('8:107');
  const png = await home.exportAsync({format:'PNG',constraint:{type:'SCALE',value:0.65}});
  return {source:'Native Figma Plugin API read-only export',fileKey:CONFIG.fileKey,frames,assets,homepagePreview:Array.from(png)};
}
