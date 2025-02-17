export class Animations {
	constructor(patterns) {
		this.patterns = patterns;
		this.activeKey = Object.keys(this.patterns)[0];
	}

	get frame() {
		return this.patterns[this.activeKey].frame;
	}

	play(key, startAtTime = 0) {

		// already playing this one
		if (this.activeKey === key) {
			return;
		}

		// switch
		this.activeKey = key;
		this.step(startAtTime);
	}

	step(delta) {
		this.patterns[this.activeKey].step(delta);
	}
}