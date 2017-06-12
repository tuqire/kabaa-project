export default `
	attribute vec3 newPosition;
	attribute float size;
	attribute vec3 mainColor;
	uniform float sizeMultipler;

	varying vec3 vColor;

	void main() {
		vec3 minReset = vec3(0, 0, 0);
		vec3 divideVal = vec3(60, 60, 60);

		vColor = mainColor;
		vec3 velocity = newPosition - position;

		velocity.x = velocity.x < minReset.x && velocity.x > -minReset.x ? velocity.x : velocity.x / divideVal.x;
		velocity.y = velocity.y < minReset.y && velocity.y > -minReset.y ? velocity.y : velocity.y / divideVal.y;
		velocity.z = velocity.z < minReset.z && velocity.z > -minReset.z ? velocity.z : velocity.z / divideVal.z;

		vec3 pos = position + velocity;

		vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);

		gl_PointSize = size * (sizeMultipler / -mvPosition.z) ;

		gl_Position = projectionMatrix * mvPosition;
	}
`;