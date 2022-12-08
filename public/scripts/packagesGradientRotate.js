(function() {
  const gradient = document.querySelector('.packages-bg');

  let options = {rootMargin: '-500px 0px'}

  const gradientRotate = (entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting) {
        gradient.classList.add('rotated')
      }
    })
  }

  const observer = new IntersectionObserver(gradientRotate, options)

  observer.observe(gradient)
})();