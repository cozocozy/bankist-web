'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnOpenModal = document.querySelectorAll('.btn--show-modal');
const btnLearnMore = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1')
const nav = document.querySelector('.nav');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

const openModal = function () {
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden')
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

for (let i = 0; i < btnOpenModal.length; i++)
  btnOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

//move operation each tab
tabsContainer.addEventListener('click', function(e) {
 const clicked = e.target.closest('.operations__tab');

 //guard clause
 if(!clicked) return;

 //remove active classes
 tabs.forEach(t => t.classList.remove('operations__tab--active'));
 tabsContent.forEach(c=> c.classList.remove('operations__content--active'))

 //active tab
 clicked.classList.add('operations__tab--active');

 //active content
 document.querySelector(`.operations__content--${clicked.dataset.tab}`).classList.add('operations__content--active');
})

//sticky navigation based on scrollY
window.addEventListener('scroll',function() {
  const initialCoords = section1.getBoundingClientRect();
  //scroll position Y
  // console.log(window.scrollY);
  if(window.scrollY > initialCoords.top) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
})

//reveal section
const allSections = document.querySelectorAll('.section');

const revealSection = function (entries,observer) {
const [entry] = entries;

if(!entry.isIntersecting) return;
entry.target.classList.remove('section--hidden');
observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection,{
  root:null,
  threshold:.2,
});

allSections.forEach(function(section){
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

//lazy loading images
const imgTargets = document.querySelectorAll(`img[data-src]`);
const loadImg = function(entries,observer) {
  const [entry] = entries;
  if(!entry.isIntersecting) return;
  //replace src with data-src
  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener('load',function() {
    entry.target.classList.remove('lazy-img');
  })
  observer.unobserve(entry.target);
}
const imgObserver = new IntersectionObserver(loadImg,{
  root:null,
  threshold:.2,
})
imgTargets.forEach(img => imgObserver.observe(img));

//slider
const slider = function () {
const slides = document.querySelectorAll('.slide');
const btnRight = document.querySelector('.slider__btn--right');
const btnLeft = document.querySelector('.slider__btn--left');
const dotContainer = document.querySelector('.dots')

let curSlide = 0;
const maxSlide = slides.length;

//create dots
const createDots = function() {
  slides.forEach(function(_,i) {
    dotContainer.insertAdjacentHTML('beforeend',
      `<button class='dots__dot' data-slide=${i}></button>`
    )
  })
};
createDots();

//active dots
const activeDots = function(slide) {
  document.querySelectorAll('.dots__dot').forEach(dot => dot.classList.remove('dots__dot--active'));
  document.querySelector(`.dots__dot[data-slide="${slide}"]`).classList.add('dots__dot--active');
}

const goToSlide = function(slide) {
  slides.forEach(
    (s,i) =>(s.style.transform = `translateX(${100 * (i-slide)}%)`));
};
goToSlide(0);

//next slide 
const nextSlide = function() {
  if(curSlide === maxSlide-1) {
    curSlide = 0;
  } else {
    curSlide++;
  }
  goToSlide(curSlide);
  activeDots(curSlide);
};

//prev slide 
const prevSlide = function() {
  if(curSlide === 0) {
    curSlide = maxSlide -1;
  } else {
    curSlide--;
  }
  goToSlide(curSlide);
  activeDots(curSlide);
};

btnRight.addEventListener('click', nextSlide);
btnLeft.addEventListener('click', prevSlide);

document.addEventListener('keydown', function(e) {
  e.key ==='ArrowLeft' && prevSlide();
  e.key === 'ArrowRight' && nextSlide();
});

dotContainer.addEventListener('click', function(e) {
  if(e.target.classList.contains('dots__dot')) {
    const {slide} = e.target.dataset;
    goToSlide(slide);
  activeDots(curSlide);
  }
});
}
slider();