(function() {
  const elem = document.querySelector('.wrap_spaces');
  const computers = document.querySelector('.computers');

  window.addEventListener('scroll', function() {
    let currentPosition = elem.offsetTop;
    
    computers.style.left = `-${currentPosition / 2}px`;
  })
})();