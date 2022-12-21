(function() {
  window.onscroll = function() {
    const element = document.querySelector('.wrap_imgs1');
    const elementRect = element.getBoundingClientRect();
  
    let distance = Math.floor(window.innerHeight - elementRect.top)
    
    if(distance < 0) {
      distance = 0;
    }
    element.style.transform = `translateX(-${distance / 30}%)`;
  
    // requestAnimationFrame(window.onscroll);
  }
})()