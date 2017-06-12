export default class Cube {
	constructor({ 
		size = 5, 
		roughness = 1, 
		color = 0xffffff, 
		bumpScale = 1, 
		metalness = 1, 
		emissive = 1, 
		position = {
			x: 0, y: 0, z: 0
		}, 
		castShadow = true
	} = {}) {
		this.geometry = new THREE.CubeGeometry(size, size, size, 1, 1, 1);

		this.material = new THREE.MeshStandardMaterial({
			roughness,
			color,
			bumpScale,
			metalness,
			emissive
		});

		this.cube = new THREE.Mesh(this.geometry, this.material);

		this.geometry.castShadow = castShadow;

		this.setPosition(position);
	}

	setPosition({ 
		x = 0, 
		y = 0, 
		z = 0
	} = {}) {
		this.setX(x);
		this.setY(y);
		this.setZ(z);
	}

	setX(x = 0) {
		this.cube.position.x = x;
	}

	setY(y = 0) {
		this.cube.position.y = y;
	}

	setZ(z = 0) {
		this.cube.position.z = z;
	}

	get() {
		return this.cube;
	}
}