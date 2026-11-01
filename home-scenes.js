(()=>{
  const journey=document.querySelector('.interior-journey');
  const stage=journey?.querySelector('.interior-stage');
  const scenes=[...(journey?.querySelectorAll('.interior-scene')||[])];
  const nav=[...(journey?.querySelectorAll('[data-scene-jump]')||[])];
  const products=[...(journey?.querySelectorAll('[data-product-scene]')||[])];
  const label=journey?.querySelector('.interior-scene-label');
  const meter=journey?.querySelector('.walkthrough-progress i');
  const meterText=journey?.querySelector('.walkthrough-progress span');
  const labels=['Living space','Evening lounge','Kitchen display'];
  if(!journey||!stage||scenes.length<2)return;
  if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;

  let ticking=false;
  const clamp=value=>Math.min(1,Math.max(0,value));
  const update=()=>{
    ticking=false;
    const rect=journey.getBoundingClientRect();
    const distance=Math.max(1,journey.offsetHeight-innerHeight);
    const progress=clamp(-rect.top/distance);
    const position=progress*(scenes.length-1);
    const active=Math.round(position);
    const phase=position%1;
    const portal=Math.pow(Math.sin(Math.PI*phase),6);
    stage.style.setProperty('--light-x',`${-45+progress*250}%`);
    stage.style.setProperty('--portal',portal.toFixed(3));
    scenes.forEach((scene,index)=>{
      const visibility=clamp(1-Math.abs(position-index));
      const eased=visibility*visibility*(3-2*visibility);
      const local=position-index;
      const scale=1.055+Math.max(0,local)*.17+Math.max(0,-local)*.095;
      scene.style.opacity=eased;
      scene.style.transform=`translate3d(${local*-4.8}%,${local*1.5}%,0) scale(${scale})`;
      scene.classList.toggle('active',index===active);
    });
    nav.forEach((button,index)=>{const on=index===active;button.classList.toggle('active',on);button.setAttribute('aria-current',on?'true':'false')});
    products.forEach((product,index)=>product.classList.toggle('active',index===active));
    if(label)label.innerHTML=`<b>${String(active+1).padStart(2,'0')}</b> ${labels[active]}`;
    if(meter)meter.style.transform=`scaleX(${progress})`;
    if(meterText)meterText.textContent=`${String(Math.round(progress*100)).padStart(2,'0')}%`;
  };
  const requestUpdate=()=>{if(!ticking){ticking=true;requestAnimationFrame(update)}};
  addEventListener('scroll',requestUpdate,{passive:true});
  addEventListener('resize',requestUpdate);
  nav.forEach((button,index)=>button.addEventListener('click',()=>{
    const distance=Math.max(1,journey.offsetHeight-innerHeight);
    scrollTo({top:journey.offsetTop+(index/(scenes.length-1))*distance,behavior:'smooth'});
  }));
  update();
})();
