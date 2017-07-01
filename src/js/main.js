import isWebglEnabled from 'detector-webgl';

import Camera from './io/camera';
import Controls from './io/controls';
import Renderer from './io/renderer';
import Stats from './io/stats';
import GUI from './io/gui';

import Scene from './objects/scene';
import Particles from './objects/particles';
import Cube from './objects/cube';
import Light from './objects/light';

function getParameterByName(name, url) {
	if (!url) {
		url = window.location.href;
	}

	name = name.replace(/[\[\]]/g, '\\$&');
	const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`);
	const results = regex.exec(url);

	if (!results) return null;
	if (!results[2]) return '';

	return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

document.addEventListener('DOMContentLoaded', () => {
	if (isWebglEnabled) {
		const WIDTH = window.innerWidth;
		const HEIGHT = window.innerHeight;
		const aspectRatio =  WIDTH / HEIGHT;

		const container = document.getElementById('container');

		const renderer = new Renderer({ width: WIDTH, height: HEIGHT, container });

		const camera = new Camera({ aspectRatio, position: { x: 310, y: -220, z: 240 }});
		const controls = new Controls({ dynamicDampingFactor: 0.3, minDistance: 40, maxDistance: 1000, camera: camera.get(), rendererDomElement: renderer.getDomElement() });

		const stats = new Stats();
		const cube = new Cube({ roughness: 0.7, position: { z: 5 / 2 }, bumpScale: 0.02 });
		const light = new Light({ color: 0x555555, strength: 5, position: [150, 150, 100] });
		const particles = new Particles({ numParticles: WIDTH > 480 ? 1000 * 500 : 500 * 400, renderer: renderer.get() });
		const scene = new Scene();

		const gui = new GUI({ particles, scene });

		const init = () => {
			scene.add(cube.get());
			scene.add(light.get());
			scene.add(particles.get());

			controls.onChange(render);

			if (getParameterByName('stats') === 'true') {
				container.appendChild(stats.getDomElement());
			}
		};

		const animate = () => {
			requestAnimationFrame(animate);
			controls.update();
			render();
		};

		const render = () => {
			camera.update();

			particles.update();

			stats.update();

			renderer.render(scene.get(), camera.get());
		};

		init();
		animate();
	} else {
		const info = document.getElementById('info');
		info.innerHTML = 'Your browser is not supported. Please use the latest version of Firefox or Chrome.';
	}
});
