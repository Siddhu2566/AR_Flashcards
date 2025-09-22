import * as THREE from "./libs/three.module.js";
import {loadGLTF, loadAudio} from "./libs/loader.js" ;


document.addEventListener('DOMContentLoaded', () => {
  const start = async () => {
    const mindarThree = new window.MINDAR.IMAGE.MindARThree({
      container: document.body,
      imageTargetSrc: "./eor.mind",
	  maxTrack:3,
    });

    const { renderer, scene, camera } = mindarThree;
	
	const light = new THREE.HemisphereLight(0xffffbb, 0x080820, 1); 
	scene.add(light);
	
	const egg = await loadGLTF("./egg/scene.gltf");
	egg.scene.scale.set(0.5, 0.5, 0.5); 
	
	const orange = await loadGLTF("./orange/scene.gltf");
	orange.scene.scale.set(0.01, 0.01, 0.01);
	
	const rabbit = await loadGLTF("./rabbit/scene.gltf");
	rabbit.scene.scale.set(0.5, 0.5, 0.5);
	
	const rabbitAclip = await loadAudio("./sound/rabbit.mp3");
	const rabbitListener = new THREE.AudioListener();
	const rabbitAudio = new THREE.PositionalAudio(rabbitListener);
	
	
	const rabbitMixer = new THREE.AnimationMixer(rabbit.scene);
	const rabbitAction = rabbitMixer.clipAction(rabbit.animations[0]);
	rabbitAction.play();
	
	const eggAnchor = mindarThree.addAnchor(0);
	eggAnchor.group.add(egg.scene);
	
	const orangeAnchor = mindarThree.addAnchor(1);
	orangeAnchor.group.add(orange.scene);
	
	const rabbitAnchor = mindarThree.addAnchor(2);
	rabbitAnchor.group.add(rabbit.scene);
	camera.add(rabbitListener)
	rabbitAudio.setRefDistance(1);
	rabbitAudio.setBuffer(rabbitAclip)
	rabbitAudio.setLoop(true);
	rabbitAnchor.group.add(rabbitAudio);
	
	rabbitAnchor.onTargetFound = () =>{
		rabbitAudio.play();
	}
	
		rabbitAnchor.onTargetLost = () =>{
		rabbitAudio.pause();
	}
	
	const clock = new THREE.Clock();

    await mindarThree.start();

    renderer.setAnimationLoop(() => {
		const delta = clock.getDelta();
		rabbitMixer.update(delta);		
		orange.scene.rotation.set(0, orange.scene.rotation.y + delta, 0);
      renderer.render(scene, camera);
    });
  };

  start();
}); 