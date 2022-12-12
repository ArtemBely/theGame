const wrap = document.querySelector('.wrap_allScreens')

wrap.addEventListener('click', function() {
  console.log(wrap.getBoundingClientRect().top) 
})

window.onload = function() {
  wrap.scrollTo(0, 0);
}