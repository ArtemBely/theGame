(function () {
  const neonText = document.querySelector('.neon_txt');

  const options = {
    rootMargin: '0px 0px -100px 0px',
    threshold: 1,
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('neon_text_active');
      } else {
        entry.target.classList.remove('neon_text_active');
      }
    });
  }, options);

  observer.observe(neonText);
})();

(function () {
  const wrapPopcorn = document.querySelector('.wrap_popcorn');
  const colaImg = document.querySelector('#cola')

  let options = { 
    threshold: 0
  }

  const popcornTransform = (entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting && !wrapPopcorn.classList.contains('js-popcorn-active')) {
        wrapPopcorn.classList.add('js-popcorn-active')
      } 
    })
  }

  const imgObserver = new IntersectionObserver(popcornTransform, options)

  imgObserver.observe(colaImg)
})();;

(function() {
  const gradient = document.querySelector('.packages-bg');
  const table = document.querySelector('.packages-table')

  let options = {threshold: 0.5}

  const gradientRotate = (entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting) {
        console.log(gradient.classList)
        gradient.classList.add('rotated')
      } else {
        gradient.classList.remove('rotated')
      }
    })
  }

  const observer = new IntersectionObserver(gradientRotate, options)

  observer.observe(table)
})();

(function(){
const fifthScreen = document.querySelector('.fithScreen');

const screenExpand = (entries) => {
  entries.forEach(entry => {
    if(fifthScreen.offsetWidth < 400 & entry.isIntersecting) {
      fifthScreen.classList.add('fifthScreen-expanded')
      console.log('aaaa')
    } 
  })
}

const observer = new IntersectionObserver(screenExpand, {threshold: 0.5})

observer.observe(fifthScreen)
})()