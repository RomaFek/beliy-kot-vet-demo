const menuButton=document.querySelector('.menu-toggle');
const mobileNav=document.querySelector('.mobile-nav');
if(menuButton&&mobileNav){
  menuButton.addEventListener('click',()=>{
    const open=menuButton.getAttribute('aria-expanded')!=='true';
    menuButton.setAttribute('aria-expanded',String(open));
    menuButton.setAttribute('aria-label',open?'Закрыть меню':'Открыть меню');
    mobileNav.classList.toggle('is-open',open);
  });
  mobileNav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{
    mobileNav.classList.remove('is-open');menuButton.setAttribute('aria-expanded','false');menuButton.setAttribute('aria-label','Открыть меню');
  }));
}
if('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches){
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
    if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target)}
  }),{threshold:.08});
  document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
}else{document.querySelectorAll('.reveal').forEach(el=>el.classList.add('is-visible'))}
document.querySelectorAll('#appointment-form').forEach(form=>form.addEventListener('submit',event=>{
  event.preventDefault();
  if(!form.reportValidity())return;
  const name=form.elements.name.value.trim();
  const service=form.elements.service.value;
  const result=form.querySelector('.form-result');
  result.textContent=`${name}, форма заполнена для услуги «${service}». Для записи позвоните нам: +7 965 039-01-29. Данные не отправлены.`;
  result.hidden=false;
}));

const backToTop=document.querySelector('.back-to-top');
if(backToTop){
  const updateBackToTop=()=>backToTop.classList.toggle('is-visible',window.scrollY>500);
  window.addEventListener('scroll',updateBackToTop,{passive:true});
  updateBackToTop();
  backToTop.addEventListener('click',()=>window.scrollTo({top:0,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'}));
}
const reviewCarousel=document.querySelector('.review-carousel');
if(reviewCarousel){
  const track=reviewCarousel.querySelector('.review-track');
  const cards=[...track.querySelectorAll('.review-card')];
  const dots=[...reviewCarousel.querySelectorAll('.review-dot')];
  const previous=reviewCarousel.querySelector('.review-prev');
  const next=reviewCarousel.querySelector('.review-next');
  const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
  let timer=null;
  let pointerHeld=false;
  const cardStep=()=>cards.length>1?cards[1].offsetLeft-cards[0].offsetLeft:track.clientWidth;
  const activeIndex=()=>Math.min(cards.length-1,Math.max(0,Math.round(track.scrollLeft/cardStep())));
  const updateDots=()=>dots.forEach((dot,index)=>dot.setAttribute('aria-current',String(index===activeIndex())));
  const show=index=>track.scrollTo({left:cards[index].offsetLeft-cards[0].offsetLeft,behavior:reducedMotion.matches?'auto':'smooth'});
  const stop=()=>{if(timer){clearInterval(timer);timer=null}};
  const start=()=>{
    stop();
    if(pointerHeld||document.hidden||cards.length<2)return;
    timer=setInterval(()=>show((activeIndex()+1)%cards.length),7000);
  };
  dots.forEach((dot,index)=>dot.addEventListener('click',()=>{show(index);start()}));
  previous.addEventListener('click',()=>{show((activeIndex()-1+cards.length)%cards.length);start()});
  next.addEventListener('click',()=>{show((activeIndex()+1)%cards.length);start()});
  track.addEventListener('keydown',event=>{
    if(event.key!=='ArrowLeft'&&event.key!=='ArrowRight')return;
    event.preventDefault();
    show((activeIndex()+(event.key==='ArrowRight'?1:-1)+cards.length)%cards.length);
    start();
  });
  track.addEventListener('scroll',updateDots,{passive:true});
  track.addEventListener('pointerdown',()=>{pointerHeld=true;stop()},{passive:true});
  window.addEventListener('pointerup',()=>{if(pointerHeld){pointerHeld=false;start()}},{passive:true});
  window.addEventListener('pointercancel',()=>{if(pointerHeld){pointerHeld=false;start()}},{passive:true});
  window.addEventListener('resize',updateDots);
  document.addEventListener('visibilitychange',start);
  updateDots();
  start();
}
