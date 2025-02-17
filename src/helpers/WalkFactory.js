import {Vector2} from "../Vector2.js";
import {Matrix} from "../Matrix.js";
import {LEFT, RIGHT, UP, DOWN} from '../Input.js';

export class WalkFactoryQuery {

	static WIDTH = 100;
	static HEIGHT = 100;
	static MAX_STEPS = 1000;
	static STEP_SIZE = 3;
	static SEED = 9;

	constructor(params={}) {

		this.width = params.width ?? WalkFactoryQuery.WIDTH;
		this.height = params.height ?? WalkFactoryQuery.HEIGHT;
		this.maxSteps = params.maxSteps ?? WalkFactoryQuery.MAX_STEPS;
		this.seed = params.seed ??  Math.seed(WalkFactoryQuery.SEED);
		this.stepSize = params.stepSize ?? WalkFactoryQuery.STEP_SIZE;
		this.randomGenerator = params.seed;


		let x = Math.round(this.random() * this.width);
		let y = Math.round(this.random() * this.height);
		const sp = new Vector2(x, y);
		this.startingPosition = params.startingPosition ?? sp;
	}

	random() {
		return this.randomGenerator();
	}
}

export class WalkFactory {
	static getFloorPlan(query) {
		return new WalkFactory().walkDrunk(query);
	}

	walkDrunk(query) {
		let matrix = this.generateMatrix(query);

		let steps = 0;
		let position = query.startingPosition.duplicate();

		while (steps < query.maxSteps) {
			if (position.x < query.stepSize - 2) {
				position.x = 1;
			}
			if (position.x >= query.width - query.stepSize) {
				position.x = query.width - query.stepSize;
			}

			if (position.y < query.stepSize - 2) {
				position.y = 1;
			}
			if (position.y >= query.height - query.stepSize) {
				position.y = query.height - query.stepSize;
			}

			matrix = this.createStep(position, query, matrix)
			position = this.randomStep(position, query);
			steps ++;
		}

		return new Matrix(matrix);
	}

	createStep(position, query, floorPlan) {
		for (let x = 0; x < query.stepSize; x ++) {
			for (let y = 0; y < query.stepSize; y ++) {
				floorPlan[position.x + x][position.y + y] += 1;
			}
		}
		return floorPlan;
	}

	randomStep(position, query) {
		const directions = [LEFT, RIGHT, UP, DOWN];
		const randomDirection = directions[Math.round(query.random() * directions.length)];
		return position.toStepNeighbor(randomDirection);
	}

	generateMatrix(query) {
		const matrix = {};
		for (let x = 0; x < query.width; x ++) {
			matrix[x] = [];
			for (let y = 0; y < query.height; y ++) {
				matrix[x][y] = 0;
			}
		}

		return matrix;
	}
}