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
})()