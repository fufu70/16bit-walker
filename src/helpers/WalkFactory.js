import {Vector2} from "../Vector2.js";
import {Matrix} from "../Matrix.js";
import {LEFT, RIGHT, UP, DOWN} from '../Input.js';

export class WalkFactoryQuery {

	static WIDTH = 100;
	static HEIGHT = 100;
	static MAX_STEPS = 600;
	static STEP_SIZE = 1;
	static SEED = 9;
	static ROTATION_CHANGES = 100;
	static ROOMS = 1;
	static ROOM_PARAMS = {
		stepSize: 5,
		maxSteps: 10,
		rotationChanges: 1,
	}

	constructor(params={}) {

		this.params = params;
		this.width = params.width ?? WalkFactoryQuery.WIDTH;
		this.height = params.height ?? WalkFactoryQuery.HEIGHT;
		this.maxSteps = params.maxSteps ?? WalkFactoryQuery.MAX_STEPS;
		this.seed = params.seed ??  Math.seed(WalkFactoryQuery.SEED);
		this.stepSize = params.stepSize ?? WalkFactoryQuery.STEP_SIZE;
		this.rotationChanges = params.rotationChanges ?? WalkFactoryQuery.ROTATION_CHANGES;
		this.rooms = params.rooms ?? WalkFactoryQuery.ROOMS;
		this.roomParams = params.roomParams ?? WalkFactoryQuery.ROOM_PARAMS;
		this.randomGenerator = Math.seed(params.seed());

		this.stepsToRotate = this.findRandomSteps(this.rotationChanges, this.maxSteps);
		this.roomsAt = this.findRandomSteps(this.rooms, this.maxSteps);

		let x = Math.round(this.random() * this.width);
		let y = Math.round(this.random() * this.height);
		const sp = new Vector2(x, y);
		this.startingPosition = params.startingPosition ?? sp;
	}

	findRandomSteps(rotationChanges, steps) {
		const rotateAtStep = [];
		if (steps < rotationChanges) {
			rotationChanges = steps;
		}
		for (var i = 0; i < rotationChanges; i++) {
			const step = Math.floor(steps * this.random());
			if (rotateAtStep.indexOf(step) > -1) {
				i --;
			} else {
				rotateAtStep.push(step);	
			}
		}
		return rotateAtStep;
	}

	random() {
		return this.randomGenerator();
	}
}

export class WalkFactory {
	static getFloorPlan(query) {
		const matrix = new Matrix(new WalkFactory().walkDrunk(query));
		// console.log(matrix.toString());
		return matrix;
	}

	walkDrunk(query, matrix, position) {
		if (matrix === undefined) {
			matrix = this.generateMatrix(query);	
		}
		if (position === undefined) {
			position = query.startingPosition.duplicate();
			matrix = this.createStep(position, {
				...query,
				stepSize: 3
			}, matrix);
		}

		let direction = this.getDirection(query);

		let steps = 0;

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
			if (query.roomsAt.indexOf(steps) > -1) {
				matrix = this.createRoom(query, matrix, position);
			} else {
				matrix = this.createStep(position, query, matrix);	
			}
			direction = this.getDirection(query, direction, steps);
			position = this.randomStep(position, direction, query);
			steps ++;
		}

		return matrix;
	}

	createRoom(query, matrix, position) {

		return this.walkDrunk(new WalkFactoryQuery({
			...query.params,
			stepSize: query.roomParams.stepSize,
			maxSteps: query.roomParams.maxSteps,
			rotationChanges: query.roomParams.rotationChanges,
			rooms: 0
		}), matrix, position);
	}

	createStep(position, query, floorPlan) {
		for (let x = 0; x < query.stepSize; x ++) {
			if (floorPlan[position.x + x] === undefined) {
				break;
			}

			for (let y = 0; y < query.stepSize; y ++) {
				if (floorPlan[position.x + x][position.y + y] === undefined) {
					break;
				}

				floorPlan[position.x + x][position.y + y] += 1;
			}
		}
		return floorPlan;
	}

	randomStep(position, direction, query) {
		return position.toStepNeighbor(direction);
	}

	getDirection(query, previousDirection, step) {
		if (previousDirection === undefined 
			|| query.stepsToRotate.length === 0
			|| query.stepsToRotate.indexOf(step) > -1) {
			return this.getRandomDirection(query);
		}
		return previousDirection;
	}

	getRandomDirection(query) {
		const directions = [LEFT, RIGHT, UP, DOWN];
		return directions[Math.round(query.random() * directions.length)];
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