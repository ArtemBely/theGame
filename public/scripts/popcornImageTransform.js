(function () {
  const wrapPopcorn = document.querySelector('.wrap_popcorn');

  let options = {rootMargin: '-500px 0px -100px 0px', threshold: 0}

  const popcornTransform = (entries, observer) => {
    entries.forEach(entry => {
      if(entry.isIntersecting) {
        wrapPopcorn.classList.add('js-popcorn-active')
      } else {
        wrapPopcorn.classList.remove('js-popcorn-active')
      }
    })
  }

  const imgObserver = new IntersectionObserver(popcornTransform, options)

  imgObserver.observe(wrapPopcorn)
})()