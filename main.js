const THREE = window.MINDAR.IMAGE.THREE;
import {loadGLTF, loadAudio} from "./libs/loader.js";

document.addEventListener('DOMContentLoaded', () => {
	const start = async() => {
		const mindarThree = new window.MINDAR.IMAGE.MindARThree({
			container: document.body,
			imageTargetSrc: './abc.mind',
			maxTrack: 3,
		});
		
		const {renderer, scene, camera} = mindarThree;
		
		const light = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
		scene.add(light);
		
		const airplane = await loadGLTF("./airplane/scene.gltf");
		airplane.scene.scale.set(0.5, 0.5, 0.5);
		
		const airplaneMixer = new THREE.AnimationMixer(airplane.scene);
		const airplaneAction = airplaneMixer.clipAction(airplane.animations[0]);
		airplaneAction.play();
		
		// we are loading a audio clip from our hard disk
		const airplaneClip = await loadAudio("./sound/airplane.mp3");
		// add a listener to play this audio
		const airplaneListener = new THREE.AudioListener();
		// add a speaker or player
		const airplaneAudio = new THREE.PositionalAudio(airplaneListener);
		
		const ball = await loadGLTF("./ball/scene.gltf");
		ball.scene.scale.set(0.2, 0.2, 0.2);
		
		const ballMixer = new THREE.AnimationMixer(ball.scene);
		const ballAction = ballMixer.clipAction(ball.animations[0]);
		ballAction.play();
		
		const ballClip = await loadAudio("./sound/ball.mp3");
		const ballListener = new THREE.AudioListener();
		const ballAudio = new THREE.PositionalAudio(ballListener);
		
		const car = await loadGLTF("./car/scene.gltf");
		car.scene.scale.set(0.3, 0.3, 0.3);
		car.scene.position.set(0, -0.1, 0);
		
		const carMixer = new THREE.AnimationMixer(car.scene);
		const carAction = carMixer.clipAction(car.animations[0]);
		carAction.play();
		
		const carClip = await loadAudio("./sound/car.mp3");
		const carListener = new THREE.AudioListener();
		const carAudio = new THREE.PositionalAudio(carListener);
		
		const airplaneAnchor = mindarThree.addAnchor(0);
		airplaneAnchor.group.add(airplane.scene);
		// adding a listener to my camera this will change audio level as object zoomsin
		camera.add(airplaneListener);
		//set the reference distance from where the audio has to diminish
		airplaneAudio.setRefDistance(100);
		// add the audio track to your player
		airplaneAudio.setBuffer(airplaneClip);
		// make it loop
		airplaneAudio.setLoop(true);
		airplaneAnchor.group.add(airplaneAudio);
		
		// audio should play only when the target is detected
		
		airplaneAnchor.onTargetFound = () => {
			airplaneAudio.play();
		}
		
		// audio will stop playing when target is lost
		airplaneAnchor.onTargetLost = () => {
			airplaneAudio.pause();
		}
		
		const ballAnchor = mindarThree.addAnchor(1);
		ballAnchor.group.add(ball.scene);
		camera.add(ballListener);
		ballAudio.setRefDistance(100);
		ballAudio.setBuffer(ballClip);
		ballAudio.setLoop(true);
		
		ballAnchor.onTargetFound = () => {
			ballAudio.play();
		}
		
		ballAnchor.onTargetLost = () => {
			ballAudio.pause();
		}
		
		const carAnchor = mindarThree.addAnchor(2);
		carAnchor.group.add(car.scene);
		
		camera.add(carListener);
		carAudio.setRefDistance(100);
		carAudio.setBuffer(carClip);
		carAudio.setLoop(true);
		
		carAnchor.onTargetFound = () => {
			carAudio.play();
		}
		
		carAnchor.onTargetLost = () => {
			carAudio.pause();
		}
		
		const clock = new THREE.Clock();
		
		
		await mindarThree.start();		
		
		renderer.setAnimationLoop(() => {
			const delta = clock.getDelta();
			airplaneMixer.update(delta);
			ballMixer.update(delta);
			carMixer.update(delta);
			car.scene.rotation.set(0, car.scene.rotation.y + delta, 0);
			renderer.render(scene, camera);
		});
	}
	start();
	
});
