import * as THREE from 'three';
import { GLTFLoader } from 'gltfloader';
import { OrbitControls } from 'orbitalcontrols';
import { LoadingManager } from 'loadingmanager';
const clock = new THREE.Clock();
const modelpath = "model.gltf"

//its like a movie scene
//you have like components in the movie scene such as the characters 
//then you have the camera which would be like the angle of such movie scene 
//renderer does all the back work so it actually appears on the screen for us 
//ceratings the controls itself 
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const renderer = new THREE.WebGLRenderer();
const light = new THREE.AmbientLight(0xffffff, 1 ); // soft white light
scene.background = new THREE.Color( 0xADD8E6 );
scene.add( light );
//it adds the controls like shown in demo 
const controls = new OrbitControls( camera, renderer.domElement );
controls.addEventListener( "change", event => {  
    console.log( controls.object.position ); 
})
//sets the scene height and width basically
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );
//creates cube and adds it to the scene/properties
let model = null

// //this controls the depth of your camera --> show DEMO
camera.position.z = 4;
camera.position.x = -10;
const screenload = new LoadingManager();

const loader = new GLTFLoader(screenload);
// ... (previous code)

// Load your model
loader.load(
  modelpath,
  (gltf) => {
    model = gltf.scene;
    scene.add(model);

    // ... (other code)

    // Get the animation clip
    const clip = gltf.animations[0];

    // Update the animation target
    clip.tracks = clip.tracks.map((track) => {
      // Assuming "root.position" is the property being animated
      if (track.name === "root.position") {
        // Update the track name to target the scene's position
        track.name = "model.position"; // Replace "modelJordan" with your object's name
      }
      return track;
    });

    // Create a new AnimationMixer
    const mixer = new THREE.AnimationMixer(gltf.scene);

    // Create an action from the updated animation clip
    const action = mixer.clipAction(clip);
    action.play();

    function animate() {
      requestAnimationFrame( animate );
      controls.update();
      mixer.update( clock.getDelta() );


      renderer.render( scene, camera );
    }
    
    animate();

  },
)

//show_import_model_button()

class Image{
  constructor(src){
    console.log("d")
    this.element = document.createElement("img");
    this.element.src = src;
  }
  set_size(width, height){
    this.element.width = width
    this.element.height = height
  }
  show(){
    document.body.appendChild(this.element)
  }
  set_pos(x, y){
    this.element.style.position = "absolute"
    this.element.style.left = x + "px"
    this.element.style.top = y + "px"
  }
  make_button(onclick){
    this.element.style.cursor = "pointer"
    this.element.onclick = onclick
  }
}

let img = new Image("/engine/ThreeJS Engine import model button(1).png")
img.set_size(96, 54)
img.set_pos(100, 10)
img.make_button(()=>{
  var input = document.createElement('input');
  input.type = 'file';
  input.accept = ".gltf"
  input.click();
})
img.show()