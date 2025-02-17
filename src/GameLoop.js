export class GameLoop {
	constructor(update, render) {
		this.lastFrameTime = 0;
		this.accumulatedTime = 0;
		this.timeStep = 1000 / 60; // 60 frames per second


		this.update = update;
		this.render = render;
		this.rafId = null;
		this.isRunning = false;
	}

	mainLoop(timestamp) {
		if (!this.isRunning) {
			return;
		}

		let deltaTime = timestamp - this.lastFrameTime;
		this.lastFrameTime = timestamp;

		// Accumulated Time
		this.accumulatedTime += deltaTime;

		// Fixed time step updates;
		while (this.accumulatedTime >= this.timeStep) {
			this.update(this.timeStep); // Here, we pass the fixed time step size
			this.accumulatedTime -= this.timeStep;
		}

		this.render();
		this.rafId = requestAnimationFrame((timestamp) => {
			this.mainLoop(timestamp)
		});
	}

	start() {
		if (!this.isRunning) {
			this.isRunning = true;
			this.rafId = requestAnimationFrame((timestamp) => {
				this.mainLoop(timestamp);
			});
		}
	}

	stop() {
		if (this.rafId) {
			cancelAnimationFrame(this.rafId);
		}

		this.isRunning = false;
	}
}