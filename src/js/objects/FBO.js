export default class FBO {
	constructor({
		tWidth = 512,
		tHeight = 512,
		numTargets = 3,
		filterType = THREE.NearestFilter,
		format = THREE.RGBAFormat,
		renderer,
		uniforms,
		simulationVertexShader,
		simulationFragmentShader
	} = {}) {
		this.tWidth = tWidth;
		this.tHeight = tHeight;
		this.numTargets = numTargets;
		this.filterType = filterType;
		this.format = format;
		this.renderer = renderer;

		this.simulationShader = new THREE.ShaderMaterial({
			uniforms: Object.assign({}, uniforms, {
				numFrames: { type: 'f', value: 60 },
				tPrev: { type: 't', value: null },
				tCurr: { type: 't', value: null }
			}),
			vertexShader: simulationVertexShader,
			fragmentShader:  simulationFragmentShader
		});

		this.cameraRTT = new THREE.OrthographicCamera(-tWidth / 2, tWidth / 2, tHeight / 2, -tHeight / 2, -1000000, 1000000);
		this.cameraRTT.position.z = 100;

		this.sceneRTTPos = new THREE.Scene();
		this.sceneRTTPos.add(this.cameraRTT);

		this.type = this.getType();
		this.targets = [];

		for (let i = 0; i < this.numTargets; i++) {
			this.targets.push(this.createTarget());
		}

		this.plane = new THREE.PlaneBufferGeometry(tWidth, tHeight);
		const quad = new THREE.Mesh(this.plane, this.simulationShader);
		quad.position.z = -1;
		this.sceneRTTPos.add(quad);

		this.count = -1;
	}

	/**
		Tests if rendering to float render targets is available
		THREE.FloatType not available on ios
	**/
	getType() {
		const renderTarget = new THREE.WebGLRenderTarget(16, 16, {
      format: THREE.RGBAFormat,
      type: THREE.FloatType
		});
		this.renderer.render(this.sceneRTTPos, this.cameraRTT, renderTarget);
		const gl = this.renderer.context;
		const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
		if (status !== gl.FRAMEBUFFER_COMPLETE) {
			console.log('FloatType not supported');
		  return THREE.HalfFloatType;
		}
		return THREE.FloatType;
	}

	createTarget() {
		const target = new THREE.WebGLRenderTarget(this.tWidth, this.tHeight, {
			minFilter: this.filterType,
			magFilter: this.filterType,
			format: this.format,
			type: this.type,
			depthBuffer: false,
			stencilBuffer: false,
			antialias: true
		});
		target.texture.generateMipmaps = false;

		return target;
	}

	setTextureUniform(name, data) {
		const dataTexture = new THREE.DataTexture(
			data,
			this.tWidth,
			this.tHeight,
			this.format,
			THREE.FloatType
		);

		dataTexture.minFilter = dataTexture.magFilter = this.filterType;
		dataTexture.needsUpdate = true;
		dataTexture.flipY = false;

		if (typeof name === 'object') {
			name.forEach(sName => this.simulationShader.uniforms[sName].value = dataTexture);
		} else {
			this.simulationShader.uniforms[name].value = dataTexture;
		}
	}

	simulate() {
		this.count++;

		if (this.count === this.numTargets) {
			this.count = 0;
		}

		const prev = (this.count === 0 ? this.numTargets : this.count) - 1;
		const prevTarget = this.targets[prev];

		this.renderer.render(
			this.sceneRTTPos,
			this.cameraRTT,
			this.getCurrentFrame()
		);

		this.simulationShader.uniforms.tPrev.value = prevTarget;
		this.simulationShader.uniforms.tCurr.value = this.getCurrentFrame();
	}

	getCurrentFrame() {
		return this.targets[this.count];
	}
}
