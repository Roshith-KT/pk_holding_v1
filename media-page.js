(()=>{
  document.documentElement.classList.add('js-enabled');
  const player=document.querySelector('#featured-video');
  const playerShell=document.querySelector('#featured-player-shell');
  const title=document.querySelector('#featured-title');
  const description=document.querySelector('#featured-description');
  const brand=document.querySelector('#featured-brand');
  const sequence=document.querySelector('#featured-sequence');
  const playlist=document.querySelector('#video-playlist');
  const posters=document.querySelector('#poster-gallery');
  const videoTotal=document.querySelector('[data-video-total]');
  const posterTotal=document.querySelector('[data-poster-total]');
  const menuButton=document.querySelector('.menu-button');
  const siteNav=document.querySelector('.site-header nav');
  const fallbackVideos=[
    {title:'Walk Inside Our Showroom',brand:'PK Holding',description:'Take a full visual journey through the PK Holding showroom and experience materials in a finished interior setting.',url:'assets/showroom/walk-inside-showroom.mp4',poster:'assets/showroom/arrival-lounge-enhanced.webp'},
    {title:'Showroom Stories',brand:'PK Holding',description:'A closer look at the displays, finishes and material combinations inside our showroom.',url:'assets/reels/pk-reel-showroom.mp4',poster:'assets/showroom/material-library-enhanced.webp'},
    {title:'Designed for Modern Kitchens',brand:'PK Holding',description:'Discover material and hardware ideas created for refined, functional contemporary kitchens.',url:'assets/reels/pk-reel-kitchens.mp4',poster:'assets/showroom/consultation-bar-enhanced.webp'},
    {title:'Material Moments',brand:'PK Holding',description:'Premium surfaces, hardware and finishing details brought together in motion.',url:'assets/reels/pk-reel-products.mp4',poster:'assets/hero/luxury-interior-wallpaper-4k.webp'},
    {title:'Built on Trust',brand:'PK Holding',description:'A visual celebration of PK Holding milestones, partnerships and the work behind every achievement.',url:'assets/reels/pk-reel-achievements.mp4',poster:'assets/immersive-living-room-lighted-hd.webp'}
  ];
  let videos=[];
  const safe=(value='')=>String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));

  function closeMenu(){document.body.classList.remove('mobile-menu-open');menuButton?.setAttribute('aria-expanded','false');if(menuButton)menuButton.textContent='☰'}
  menuButton?.addEventListener('click',()=>{const open=document.body.classList.toggle('mobile-menu-open');menuButton.setAttribute('aria-expanded',String(open));menuButton.textContent=open?'×':'☰'});
  siteNav?.querySelectorAll('a').forEach(link=>link.addEventListener('click',closeMenu));

  function selectVideo(index,play=false){
    const item=videos[index];
    if(!item||!player)return;
    player.pause();
    player.src=item.url;
    player.poster=item.poster||'';
    player.load();
    playerShell?.classList.add('has-video');
    title.textContent=item.title||'PK Holding video';
    description.textContent=item.description||'Watch the latest video published by PK Holding.';
    brand.textContent=item.brand||'PK Holding';
    if(sequence)sequence.textContent=`${String(index+1).padStart(2,'0')} / ${String(videos.length).padStart(2,'0')}`;
    document.querySelectorAll('.video-card').forEach((card,i)=>card.classList.toggle('active',i===index));
    if(play){player.play().catch(()=>{});playerShell?.scrollIntoView({behavior:'smooth',block:'center'});}
  }

  function renderVideos(){
    videoTotal.textContent=String(videos.length).padStart(2,'0');
    playlist.innerHTML=videos.map((item,index)=>{
      const visual=item.poster?`<img src="${safe(item.poster)}" alt="" loading="lazy">`:`<video src="${safe(item.url)}" muted preload="metadata" playsinline></video>`;
      return `<button class="video-card${index===0?' active':''}" type="button" data-video-index="${index}" aria-label="Play ${safe(item.title)}"><span class="video-card-visual">${visual}<span>▶</span><span class="video-card-number">${String(index+1).padStart(2,'0')}</span></span><span class="video-card-copy"><small>${safe(item.brand||'PK Holding')} · Film</small><strong>${safe(item.title||'Untitled video')}</strong><em>Watch with sound ↗</em></span></button>`;
    }).join('');
    playlist.querySelectorAll('[data-video-index]').forEach(button=>button.addEventListener('click',()=>selectVideo(Number(button.dataset.videoIndex),true)));
    selectVideo(0,false);
  }

  function renderPosters(items){
    posterTotal.textContent=String(items.length).padStart(2,'0');
    if(!items.length)return;
    posters.innerHTML=items.map(item=>`<article class="poster-card"><a class="poster-visual" href="${safe(item.url)}" target="_blank" rel="noopener"><img src="${safe(item.url)}" alt="${safe(item.title||'PK Holding poster')}" loading="lazy"></a><div class="poster-copy"><small>${safe(item.brand||'PK Holding')} · Poster</small><h3>${safe(item.title||'Brand poster')}</h3>${item.description?`<p>${safe(item.description)}</p>`:''}</div></article>`).join('');
  }

  function revealOnScroll(){
    const blocks=[...document.querySelectorAll('[data-reveal]')];
    if(!('IntersectionObserver'in window)){blocks.forEach(block=>block.classList.add('is-visible'));return;}
    const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target)}}),{threshold:.12});
    blocks.forEach(block=>observer.observe(block));
  }

  function showMedia(items=[]){
    const uploadedVideos=items.filter(item=>item.kind==='video');
    videos=[...uploadedVideos,...fallbackVideos.filter(fallback=>!uploadedVideos.some(item=>item.url===fallback.url))];
    renderVideos();
    renderPosters(items.filter(item=>item.kind==='poster'));
  }

  revealOnScroll();
  fetch('/api/uploads').then(response=>response.ok?response.json():Promise.reject()).then(data=>showMedia(Array.isArray(data.items)?data.items:[])).catch(()=>showMedia());
})();
