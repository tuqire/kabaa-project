export default class Camera {
	constructor({ 
		fov = 400, 
		aspectRatio = 1, 
		near = 0.1, 
		far = 2000, 
		position = {
			x: 0, y: 0, z: 0
		}, 
		up = [0, 0, 1] 
	}) {
		this.camera = new THREE.PerspectiveCamera(fov, aspectRatio, near, far);
		this.defaultUp = up;

		this.setPosition(position);
		this.setUp(...this.defaultUp);

		window.addEventListener('resize', this.onWindowResize.bind(this));
	}

	onWindowResize() {
		const WIDTH = window.innerWidth;
		const HEIGHT = window.innerHeight;
		this.camera.aspect = WIDTH / HEIGHT;
		this.camera.updateProjectionMatrix();
	}

	setUp(x, y, z) {
		this.camera.up.set(x, y, z);
	}

	setPosition({ 
		x = this.camera.position.x, 
		y = this.camera.position.y, 
		z = this.camera.position.z }) {
		this.setX(x);
		this.setY(y);
		this.setZ(z);
	}

	setX(x) {
		this.camera.position.x = x;
	}

	setY(y) {
		this.camera.position.y = y;
	}

	setZ(z) {
		this.camera.position.z = z;
	}

	update() {
		this.setUp(...this.defaultUp);
		if (this.camera.position.z < 10) {
			this.camera.position.z++;
		}
	}

	get() {
		return this.camera;
	}
}