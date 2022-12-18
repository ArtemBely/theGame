 const img = new Image();
 img.src = "./public/images/Group 60.jpeg";

  img.onload = () => { 
    const loader = document.querySelector('.load-wrap');
    loader.classList.add('loaded')
   }