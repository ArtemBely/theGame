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
