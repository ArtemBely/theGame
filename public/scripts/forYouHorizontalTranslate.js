(function() {
  window.onscroll = function() {
    const element = document.querySelector('.wrap_imgs1');
    const elementRect = element.getBoundingClientRect();
    const elementPosition = elementRect.left;
  
    const scrollPosition = elementRect.top;
    let movement = scrollPosition / 10; // Adjust the division factor to control the speed of the animation
  
    element.style.left = `${movement}px`;
  
    requestAnimationFrame(window.onscroll);
  }
})()