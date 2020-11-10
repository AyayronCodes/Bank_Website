'use strict';

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const nav = document.querySelector('.nav');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

///////////////////////////////////////
// Modal window

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);

overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

// Button scrolling
btnScrollTo.addEventListener('click', function(e) {
  section1.scrollIntoView({behavior: 'smooth'});
})

//////////////////////////////////
// Page navigation
// document.querySelectorAll('.nav__link').forEach(function(el) {
//   el.addEventListener('click', function(e) {
//     e.preventDefault();
//     const id = this.getAttribute('href');
//     console.log(id);
//     document.querySelector(id).scrollIntoView({behavior: 'smooth'});
//   });
// });
// EVENT DELEGATION EVENT DELEGATION EVENT DELEGATION PARENT ELEMENT REPRESENTS(IS A DELEGATE) CHILD ELEMENTS
// event handler to common parent of all elements
// 1. Add event listener to common parent element
// 2. Determine what element originated the event
document.querySelector('.nav__links').addEventListener('click', function(e) {
  e.preventDefault();
  if (e.target.hasAttribute('href')) {
    document.querySelector(e.target.getAttribute('href')).scrollIntoView({behavior: 'smooth'});
  }
});

///////////////////////

// event delegation: set eventhandler on common parent element
tabsContainer.addEventListener('click', function(e) {

  // Guard clause modern way
  if(e.target.tagName !== 'BUTTON') return;
  // cleaner and returns right away if not satisfied

  // old way
  // if(clicked) {// do something} for each
  
  // remove active classes for tab and content
  document.querySelectorAll('.operations__tab').forEach(btn => btn.classList.remove('operations__tab--active'));
  document.querySelectorAll('.operations__content').forEach(con => con.classList.remove('operations__content--active'));

  console.log(e.target.dataset.tab);
  // activate content area
  e.target.classList.add('operations__tab--active');
  document.querySelector(`.operations__content--${e.target.dataset.tab}`).classList.add('operations__content--active');

});

/////////////////////////

// Menu fade animation
// links and logo needed so so get entire navigation
// mouseenter does not bubble, mouseover does

// handler function can only have one real event argument
// if need more, use bind
const handleHover = function(e) {
    if(e.target.tagName !== 'A') return;
    // instead of moving up manually, use closest to move up to common parent
    e.target.closest('.nav').firstElementChild.style.opacity = `${this}`;
    [...e.target.closest('.nav__links').children].forEach(link => link.firstElementChild.style.opacity
     = `${this}`);
    e.target.style.opacity = '1';
}

// Passing 'argument' into handler with bind
nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));

///////////////////////////

// Sticky navigation
// const initialCoords = section1.getBoundingClientRect();
// window.addEventListener('scroll', function(e) {
  
//   if(window.scrollY > initialCoords.top) nav.classList.add('sticky');
//   else nav.classList.remove('sticky');   -
// });

//////////
// Sticky navigation: Interesection Observer API
// 

const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function(entries) {
  const entry = entries[0];
  if (entry.isIntersecting) return;
  nav.classList.add('sticky');
}

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});
headerObserver.observe(header);

///////////////////////////

// Reveal sections
const allSections = document.querySelectorAll('.section');

const revealSection = function(entries, observer) {
  const entry = entries[0];
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
}

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(function(section) {
  section.classList.add('section--hidden');
  sectionObserver.observe(section);
});

// // Lazy Loading Images
const imgTargets = document.querySelectorAll('img[data-src]');

const loadImg = function(entries, observer) {
  const entry = entries[0];
  if (!entry.isIntersecting) return;
  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener('load', () => entry.target.classList.remove('lazy-img')); 
}

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '300px',
});

imgTargets.forEach(img => {
  imgObserver.observe(img);
});


// Slider
const slider = function() {

  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');

  let curSlide = 0;
  const maxSlide = slides.length - 1;

  // Functions
  const createDots = function() {
    slides.forEach((_, i) => dotContainer.insertAdjacentHTML('beforeend', `<button class="dots__dot" data-slide="${i}"></button>`));
  }

  // use queryselector []
  const activateDot = function(slide) {
    document.querySelectorAll('.dots__dot').forEach(btn => btn.classList.remove('dots__dot--active'));
    document.querySelector(`button[data-slide="${slide}"]`).classList.add('dots__dot--active');
  }

  // formula
  const goToSlide = function(slide) {
    curSlide = slide;
    slides.forEach((slide, i) => slide.style.transform = `translateX(${100 * (i - curSlide)}%)`);
  }

  const init = function() {
    createDots();
    activateDot(curSlide);
    goToSlide(curSlide);
  } 

  init();

  // Next slide
  const nextSlide = function() {
    if (curSlide === maxSlide) curSlide = 0;
    else curSlide++;
    activateDot(curSlide);
    goToSlide(curSlide);
  }

  const prevSlide = function() {
    if (curSlide === 0) curSlide = maxSlide;
    else curSlide--;
    activateDot(curSlide);
    goToSlide(curSlide);
  }

  btnRight.addEventListener('click', nextSlide);

  btnLeft.addEventListener('click', prevSlide);

  document.addEventListener('keydown', function(e) {
    
  });

  dotContainer.addEventListener('click', function(e) {
    if (e.target.tagName !== 'BUTTON') return;
    activateDot(Number(e.target.dataset.slide));
    goToSlide(Number(e.target.dataset.slide));

  });

}

slider();

// // as soon as html parsed (Downloaded and converted to dom tree)
// document.addEventListener('DOMContentLoaded', function(e) {
//   console.log('HTML parsed and DOM tree built!', e);
// })

// // not only html but also all img external resources css
// window.addEventListener('load', function(e) {
//   console.log('Page fully loaded', e);
// });

// window.addEventListener('beforeunload', function(e) {
//   e.preventDefault();
//   console.log(e);
//   e.returnValue = '';
// });
