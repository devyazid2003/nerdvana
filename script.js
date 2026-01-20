const nextButton = document.querySelector('.next-btn');
const video = document.querySelector('.hero-video');

const movieList = ['videos/fortnite1.mp4', 'videos/fortnite2.mp4', 'videos/halo.mp4', 'videos/mortal.mp4',];

let index = 0;
nextButton.addEventListener('click', function(){

    index += 1
    video.src  = movieList[index];

    if (index === 3){
        index = -1;
    }
})



//blur animation
function handleScroll() {
    const elements = document.querySelectorAll('.autoBlur');
    const viewportHeight = window.innerHeight;

    elements.forEach(el => {
        const rect = el.getBoundingClientRect();
        const elHeight = rect.height;

        let progress = (viewportHeight - rect.top) / (viewportHeight + elHeight);
        progress = Math.max(0, Math.min(1, progress));

        const blur = Math.abs(0.5 - progress) * 80;
        const opacity = 1 - Math.abs(0.5 - progress) * 2;

        el.style.filter = `blur(${blur}px)`; // fixed
        el.style.opacity = opacity;
    });
}

window.addEventListener('scroll', handleScroll);
window.addEventListener('resize', handleScroll);
window.addEventListener('load', handleScroll);




//autodisplay animation

(() => {
    const els = Array.from(document.querySelectorAll('.autoDisplay'));
    const active = new Set();
    let vh = window.innerHeight;
    let ticking = false;
  
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      els.forEach(el => { el.style.transform = 'none'; el.style.filter = 'none'; el.style.opacity = '1'; });
      return;
    }
  
    // Observe only when near the viewport for perf
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) active.add(e.target);
        else active.delete(e.target);
      });
      requestTick();
    }, { root: null, rootMargin: '20% 0px 20% 0px', threshold: 0 });
  
    els.forEach(el => io.observe(el));
  
    function clamp(n, min, max){ return Math.max(min, Math.min(n, max)); }
    function lerp(a, b, t){ return a + (b - a) * t; }
    // “Stronger in the middle” feel
    function easeInOutCubic(t){ return t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t + 2, 3)/2; }
  
    function update(){
      const startY = vh * 0.90; // start anim when top hits 90% (near bottom)
      const endY   = vh * 0.20; // finish by 20% (upper area)
  
      active.forEach(el => {
        const r = el.getBoundingClientRect();
        // progress: 0 at startY, 1 at endY
        const raw = (startY - r.top) / (startY - endY);
        const p = clamp(raw, 0, 1);
        const t = easeInOutCubic(p);
  
        const blur = lerp(10, 0, t);
        const ty   = lerp(-200, 0, t);
        const sc   = lerp(0, 1, t);
        const op   = lerp(0.2, 1, t);
  
        el.style.transform = `translateY(${ty}px) scale(${sc})`;
        el.style.filter = `blur(${blur}px)`;
        el.style.opacity = op.toFixed(3);
      });
    }
  
    function requestTick(){
      if (!ticking){
        ticking = true;
        requestAnimationFrame(() => {
          ticking = false;
          update();
        });
      }
    }
  
    window.addEventListener('scroll', requestTick, { passive: true });
    window.addEventListener('resize', () => { vh = window.innerHeight; requestTick(); });
  
    // Initial paint
    requestTick();
  })();


  //autotakefull
  
(() => {
  const els = Array.from(document.querySelectorAll('.autoTakeFullAnimation'));
  if (!els.length) return;

  let vh = window.innerHeight;
  let vw = window.innerWidth;
  let ticking = false;

  function clamp(n, min, max){ return Math.max(min, Math.min(n, max)); }
  function lerp(a, b, t){ return a + (b - a) * t; }

  function update(){
    els.forEach(el => {
      const r = el.getBoundingClientRect();

      // progressIn: 0 when bottom just touches bottom of viewport, 1 when top reaches top
      const progressIn = clamp(1 - (r.top / vh), 0, 1);

      // progressOut: 0 when bottom is still inside, 1 when top leaves
      const progressOut = clamp((vh - r.bottom) / vh, 0, 1);

      let expand;
      if (progressIn < 1 && progressOut === 0) {
        // entering → expand
        expand = progressIn;
      } else if (progressIn === 1 && progressOut === 0) {
        // fully inside viewport → locked full screen
        expand = 1;
      } else {
        // leaving → shrink back
        expand = 1 - progressOut;
      }

      const width = lerp(vw * 0.5, vw, expand);      // 80% → 100%
      const height = lerp(vh * 0.6, vh, expand);     // 60vh → 100vh
      const radius = lerp(40, 0, expand);            // 40px → 0
      const marginB = lerp(100, 0, expand);          // 100px → 0

      el.style.width = width + "px";
      el.style.height = height + "px";
      el.style.borderRadius = radius + "px";
      el.style.marginBottom = marginB + "px";
    });
  }

  function requestTick(){
    if (!ticking){
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        update();
      });
    }
  }

  window.addEventListener('scroll', requestTick, { passive: true });
  window.addEventListener('resize', () => {
    vh = window.innerHeight;
    vw = window.innerWidth;
    requestTick();
  });

  requestTick();
})();

 