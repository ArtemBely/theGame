(function (){
  const bg = document.querySelector('canvas.spaces-bg');

  let camera, scene, renderer;
  let planeMesh;
  let stars = [];
  let sizes = {
    width: window.innerWidth, 
    height: window.innerHeight,
  };
  let colors = [
    "#0952BD",
    "#A5BFF0",
    "#118CD6",
    "#1AAEE8",
    "#ffffff"
  ];

  function init() {
    scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x000000, 0.015, 72);

    camera = new THREE.PerspectiveCamera( 75, sizes.width/sizes.height, 0.1, 1000 );
    renderer = new THREE.WebGLRenderer({canvas: bg, preserveDrawingBuffer: true, alpha: true});
    renderer.sortObjects = false;
    renderer.autoClearColor = false;

    // Scene initialization
    camera.position.z = 55;

    renderer.setClearColor( "#000", 1);
    renderer.setSize( sizes.width, sizes.height );
    renderer.setPixelRatio( window.devicePixelRatio );

    for (let i = 0; i < 3000; i++) {
      let geometry = new THREE.SphereBufferGeometry(0.12 * Math.random(), 10, 10);
      let material = new THREE.MeshBasicMaterial({
        color: colors[Math.floor(Math.random() * colors.length)], 
        flatShading: THREE.FlatShading
        });

        let star = new THREE.Mesh(geometry, material);

        star.position.x = Math.random() * 100 - 50;
        star.position.y = Math.random() * 100 - 50;
        star.position.z = Math.random() * 50 - 25;

        scene.add(star);
        stars.push(star);
    }

    let planeGeometry = new THREE.PlaneGeometry(1000, 500, 1, 1);
    let planeMaterial = new THREE.MeshBasicMaterial( {color: 0x000000, transparent: true, opacity: 1} );

    planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);

    scene.add(planeMesh);
  }

  // resize
  window.addEventListener('resize', () => {
  
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();
  
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  });


  function render() {

      requestAnimationFrame(render);
    renderer.render(scene, camera);

    for (let i = 0; i < stars.length; i++) {
      stars[i].position.z += 0.09;

      if (stars[i].position.z >= 60) {
        stars[i].position.x = Math.random() * 100 - 50;
          stars[i].position.y = Math.random() * 100 - 50;
        stars[i].position.z = 5;
      }
    }
  }

  init();
  render();

})();

