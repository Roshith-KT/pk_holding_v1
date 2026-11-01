(()=>{
  document.documentElement.classList.add('js-home');
  const progress=document.querySelector('.site-progress i');
  const updateProgress=()=>{
    const max=document.documentElement.scrollHeight-window.innerHeight;
    if(progress)progress.style.width=`${max>0?Math.min(100,Math.max(0,window.scrollY/max*100)):0}%`;
  };
  updateProgress();
  window.addEventListener('scroll',updateProgress,{passive:true});
  window.addEventListener('resize',updateProgress);

  const blocks=[...document.querySelectorAll('[data-home-reveal]')];
  if(!('IntersectionObserver'in window)){blocks.forEach(block=>block.classList.add('is-visible'));return;}
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
    if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target);}
  }),{threshold:.08,rootMargin:'0px 0px -4%'});
  blocks.forEach(block=>observer.observe(block));
})();
