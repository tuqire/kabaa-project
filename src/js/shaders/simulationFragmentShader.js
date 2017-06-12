export default `
	// simulation
	varying vec2 vUv;

	uniform sampler2D tPrevPositions;
	uniform sampler2D tPositions;
	uniform sampler2D tTargetPositions;

	uniform float frames;
	uniform float clampValue;

	uniform float incSize;
	uniform float maxSize;
	uniform float minSize;

	uniform bool flatSimulation;

	highp float rand(vec2 co)
	{
		highp float a = 12.9898;
		highp float b = 78.233;
		highp float c = 43758.5453;
		highp float dt= dot(co.xy ,vec2(a,b));
		highp float sn= mod(dt,3.14);
		return fract(sin(sn) * c);
	}

	float getSize() {
		float defaultSize = texture2D(tTargetPositions, vUv).w;
		float prevSize = texture2D(tPrevPositions, vUv).w;
		float size = texture2D(tPositions, vUv).w;

		if (size == 0.0 && prevSize == 0.0) {
			size = defaultSize;
		} else if (size < minSize) {
			size += incSize;
		} else if (size > maxSize) {
			size -= incSize;
		} else if (size == prevSize) {
			size += incSize;
		} else {
			size += (size - prevSize);
		}

		return size;
	}

	float getZValue(vec3 pos, vec3 targetPos) {
		float prevZ = texture2D(tPrevPositions, vUv).z;
		float incZ = rand(vec2(pos.x, pos.y)) / 60.0;

		if ((pos.z < targetPos.z - 1.0) || (pos.z == targetPos.z)) {
			pos.z += incZ;
		} else if (pos.z > targetPos.z + 1.0) {
			pos.z -= incZ;
		} else {
			pos.z += pos.z - prevZ;
		}

		return pos.z;
	}

	void main() {
		vec3 pos = texture2D(tPositions, vUv).xyz;
		vec3 targetPos = texture2D(tTargetPositions, vUv).xyz;
		float size = getSize();

		// fancy maths goes here
		vec3 distanceToGoal = targetPos - pos;

		if (distanceToGoal.x != 0.0 || distanceToGoal.y != 0.0) {
			vec3 velocity = vec3(
				distanceToGoal.x < clampValue && distanceToGoal.x > -clampValue ? distanceToGoal.x : distanceToGoal.x / frames,
				distanceToGoal.y < clampValue && distanceToGoal.y > -clampValue ? distanceToGoal.y : distanceToGoal.y / frames,
				distanceToGoal.z < clampValue && distanceToGoal.z > -clampValue ? distanceToGoal.z : distanceToGoal.z / frames
			);

			pos += velocity;
		} else {
			if (flatSimulation) {
				// pos.z += rand(vec2(pos.x, pos.y)) / 20.0;
				//
				// if ((pos.z > (1.0 + targetPos.z)) && (size < 1.0)) {
				// 	pos.z = targetPos.z;
				// }

				pos.z = getZValue(pos, targetPos);
			}
		}


		// write new position out
		gl_FragColor = vec4(pos, size);
	}
`;
