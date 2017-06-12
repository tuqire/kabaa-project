export default class Light {
	constructor({ 
		color = 0xffffff,
		strength = 1,
		position = [0, 0, 0]
	}) {
		this.light = new THREE.PointLight(color, strength);
		this.light.position.set(position[0], position[1], position[2]);
	}

	get() {
		return this.light;
	}
}