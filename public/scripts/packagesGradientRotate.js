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