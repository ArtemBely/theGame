// if(document.body.classList.contains('preview')) {
//   
//   wrap.scrollTo(0, 0)
//   console.log(wrap.offsetHeight - wrap.offsetTop)
// }

const wrap = document.querySelector('.wrap_allScreens')

wrap.addEventListener('click', function() {
  console.log(wrap.scrollTop)
})