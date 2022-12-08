(function() {
  const elem = document.querySelector('.wrap_spaces');
  const computers = document.querySelector('.computers');

  window.addEventListener('scroll', function() {
    let currentPosition = elem.offsetTop;
    let parentEnd = elem.offsetParent.offsetHeight - elem.offsetHeight;

    computers.style.left = `-${currentPosition / 10}%`;
  })
})();