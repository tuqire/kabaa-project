export default class Renderer {
	constructor({ 
		alpha = true, 
		pixelRatio = window.devicePixelRatio, 
		width = window.width, 
		height =  window.height,
		container,
	}) {
		this.renderer = new THREE.WebGLRenderer({ alpha });
		this.setPixelRatio(pixelRatio);

		this.setSize(width, height);

		container.appendChild(this.getDomElement());
		window.addEventListener('resize', this.onWindowResize.bind(this));
	}

	getDomElement(container) {
		return this.renderer.domElement;
	}

	onWindowResize() {
		const WIDTH = window.innerWidth;
		const HEIGHT = window.innerHeight;

		this.renderer.setSize(WIDTH, HEIGHT);
	}

	setPixelRatio(pixelRatio) {
		this.renderer.setPixelRatio(pixelRatio);
	}

	setSize(w, h) {
		this.renderer.setSize(w, h);
	}

	render(scene, camera) {
		this.renderer.render(scene, camera);
	}

	get() {
		return this.renderer;
	}
}