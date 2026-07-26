const walk=document.querySelector('.showroom-walk');
const title=document.querySelector('[data-walk-title]');
const text=document.querySelector('[data-walk-text]');

const chapters=[
  {
    title:'Arrival lounge',
    text:'The first view opens into a soft lounge setting with large material panels, warm display lighting and a clear kitchen display mood.'
  },
  {
    title:'Material library',
    text:'Move deeper into the showroom and the laminate, veneer and decorative board stands become the main experience.'
  },
  {
    title:'Hardware gallery',
    text:'Backlit hardware walls allow handles, profiles and accessories to be compared clearly under showroom lighting.'
  },
  {
    title:'Kitchen display',
    text:'The final zone showcases kitchen finishes, counter surfaces, storage flow and material combinations for real home planning.'
  }
];

let ticking=false;
function updateWalk(){
  if(!walk){ticking=false;return}
  const rect=walk.getBoundingClientRect();
  const distance=Math.max(1,walk.offsetHeight-window.innerHeight);
  const progress=Math.min(1,Math.max(0,-rect.top/distance));
  const step=Math.min(chapters.length-1,Math.floor(progress*chapters.length));
  walk.style.setProperty('--walk-progress',progress.toFixed(3));
  walk.dataset.step=String(step);
  if(title&&text){
    title.textContent=chapters[step].title;
    text.textContent=chapters[step].text;
  }
  ticking=false;
}

window.addEventListener('scroll',()=>{if(!ticking){requestAnimationFrame(updateWalk);ticking=true;}},{passive:true});
updateWalk();
