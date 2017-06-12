export default `
	uniform sampler2D texture;
	
	void main() {
		gl_FragColor = vec4(0.7, 0.7, 0.7, 0.6);
		gl_FragColor = gl_FragColor * texture2D(texture, gl_PointCoord);
	}
`;