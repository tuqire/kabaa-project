export default class FBO {
	constructor({ 
		tWidth = 512, 
		tHeight = 512, 
		numTargets = 3,
		format = THREE.RGBAFormat,
		type = THREE.FloatType,
		renderer,
		uniforms,
		simulationVertexShader,
		simulationFragmentShader
	} = {}) {
		this.tWidth = tWidth;
		this.tHeight = tHeight;
		this.numTargets = numTargets;
		this.format = format;
		this.type = type;
		this.renderer = renderer;

		this.simulationShader = new THREE.ShaderMaterial({
			uniforms,
			vertexShader: simulationVertexShader,
			fragmentShader:  simulationFragmentShader
		});

		this.targets = [];
		this.dataTextures = {};
		this.dataTextureCallbacks = {};

		for (let i = 0; i < this.numTargets; i++) {
			this.targets.push(this.createTarget());
		}

		this.cameraRTT = new THREE.OrthographicCamera(-tWidth / 2, tWidth / 2, tHeight / 2, -tHeight / 2, -1000000, 1000000);
		this.cameraRTT.position.z = 100;

		this.sceneRTTPos = new THREE.Scene();
		this.sceneRTTPos.add(this.cameraRTT);

		this.plane = new THREE.PlaneBufferGeometry(tWidth, tHeight);
		const quad = new THREE.Mesh(this.plane, this.simulationShader);
		quad.position.z = -5000;
		this.sceneRTTPos.add(quad);
		
		this.count = 0;
	}

	createTarget() {
		const target = new THREE.WebGLRenderTarget(this.tWidth, this.tHeight, {
			minFilter: THREE.NearestFilter,
			magFilter: THREE.NearestFilter,
			format: this.format,
			type: this.type,
			depthBuffer: false,
			stencilBuffer: false,
			antialias: true
		});

		target.generateMipmaps = false;
		return target;
	}

	setBufferAttribute(name, data, countPerVertices = 3) {
		this.plane.addAttribute(name, new THREE.BufferAttribute(data, countPerVertices));
	}

	setTextureUniform(name, data) {
		const dataTexture = new THREE.DataTexture(
			data, 
			this.tWidth, 
			this.tHeight, 
			this.format, 
			this.type
		);

		dataTexture.minFilter = THREE.NearestFilter;
		dataTexture.magFilter = THREE.NearestFilter;
		dataTexture.needsUpdate = true;
		dataTexture.flipY = false;

		if (typeof name === 'object') {
			name.forEach(sName => this.simulationShader.uniforms[sName].value = dataTexture);
		} else {
			this.simulationShader.uniforms[name].value = dataTexture;
		}
	}

	simulate() {
		const prev = (this.count === 0 ? this.numTargets : this.count) - 1;
		const prevTarget = this.targets[prev];

		this.renderer.render(
			this.sceneRTTPos,
			this.cameraRTT,
			this.targets[this.count], 
			false
		);
		this.simulationShader.uniforms.tPrevPositions.value = prevTarget;
		this.simulationShader.uniforms.tPositions.value = this.targets[this.count];

		this.count++;

		if (this.count === this.numTargets) {
			this.count = 0;
		}
	}
}