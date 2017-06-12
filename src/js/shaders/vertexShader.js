export default `
	uniform sampler2D map;

	uniform float sizeMultipler;

	varying vec2 vUv;

	void main() {
		vUv = position.xy;

		// position saved as color value in a texture object in momery
		vec3 pos = texture2D(map, vUv).xyz;
		float size = texture2D(map, vUv).w;

		vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
		gl_PointSize = size * (sizeMultipler / -mvPosition.z);
		gl_Position = projectionMatrix * mvPosition;
	}
`;