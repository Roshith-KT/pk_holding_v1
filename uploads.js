(()=>{
  const updatesSection=document.querySelector('#brand-updates');
  const updatesGrid=document.querySelector('#brand-update-grid');
  const lens=document.querySelector('.media-lens');
  const lensPreview=document.querySelector('.lens-preview');
  const mediaCount=document.querySelector('[data-media-count]');
  const safe=(value='')=>String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  function updateCard(item){
    const media=item.kind==='poster'
      ?`<img src="${safe(item.url)}" alt="${safe(item.title)}" loading="lazy">`
      :item.kind==='video'
        ?`<video src="${safe(item.url)}" controls preload="metadata" playsinline></video>`
        :`<a class="update-pdf" href="${safe(item.url)}" target="_blank" rel="noopener"><span>PDF</span><strong>View brochure ↗</strong></a>`;
    return `<article class="brand-update-card"><div class="brand-update-media">${media}</div><div><small>${safe(item.brand)} · ${safe(item.kind)}</small><h3>${safe(item.title)}</h3>${item.description?`<p>${safe(item.description)}</p>`:''}</div></article>`;
  }
  function showItems(items){
    if(items.length&&updatesSection&&updatesGrid){updatesGrid.innerHTML=items.map(updateCard).join('');updatesSection.hidden=false;}
    const mediaItems=items.filter(item=>item.kind==='poster'||item.kind==='video');
    if(mediaCount)mediaCount.textContent=mediaItems.length;
    const latest=mediaItems[0];
    if(latest&&lensPreview){
      lensPreview.innerHTML=latest.kind==='poster'?`<img src="${safe(latest.url)}" alt="">`:`<video src="${safe(latest.url)}" muted autoplay loop playsinline preload="metadata"></video>`;
      lens.classList.add('has-media');
    }
  }
  fetch('/api/uploads').then(response=>response.ok?response.json():null).then(data=>{if(data)showItems(data.items||[])}).catch(()=>{});
})();
