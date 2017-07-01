const fragmentShader = `
	uniform sampler2D texture;

	void main() {
		gl_FragColor = vec4(0.7, 0.7, 0.7, 0.6);
		gl_FragColor = gl_FragColor * texture2D(texture, gl_PointCoord);
	}
`;

const vertexShader = `
	uniform sampler2D tPosition;

	varying vec2 vUv;

	uniform float sizeMultipler;

	void main() {
		vUv = position.xy;

		// position saved as color value in a texture object in momery
		vec3 pos = texture2D(tPosition, vUv).xyz;
		float size = texture2D(tPosition, vUv).w;

		vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
		gl_PointSize = size * (sizeMultipler / -mvPosition.z);
		gl_Position = projectionMatrix * mvPosition;
	}
`;

export {
	fragmentShader,
	vertexShader
};
