import {Vector2} from './Vector2.js';
import {events} from './Events.js';
import {GRID_SIZE} from './helpers/Grid.js'

export class GameObject {
	constructor({position}) {
		this.position = position ?? new Vector2(0, 0);
		this.children = [];
		this.parent = null;
		this.hasReadyBeenCalled = false;
		this.isSolid = false;
		this.drawLayer = null;
		this.size = new Vector2(GRID_SIZE, GRID_SIZE);
	}

	stepEntry(delta, root) {
		this.children.forEach((child) => {
			child.stepEntry(delta, root);
		});

		// call ready on the first frame
		if (!this.hasReadyBeenCalled) {
			this.hasReadyBeenCalled = true;
			this.ready();
		}

		this.step(delta, root);
	}

	// Called when the Game Object is ready
	ready() {
		// leave empty
	}

	step(_delta) {
		// leave empty
	}

	draw(ctx, x, y) {
		const drawPosX = x + this.position.x;
		const drawPosY = y + this.position.y;

		this.drawImage(ctx, drawPosX, drawPosY);

		this.getDrawChildrenOrdered().forEach((child )=> {
			try {
				child.draw(ctx, drawPosX, drawPosY);
			} catch {
				console.log(child);
			}
		})
	}

	getDrawChildrenOrdered() {
		const floors = this.children.filter(a => a.drawLayer === 'FLOOR');
		const exits = this.children.filter(a => a.drawLayer === 'EXIT');
		const walls = this.children.filter(a => a.drawLayer === 'WALL');
		const nonFloors = this.children.filter(a => 
			a.drawLayer !== 'FLOOR' 
			&& a.drawLayer !== 'EXIT' 
			// && a.drawLayer !== 'WALL'
		);

		// console.log(nonFloors.map(a => a.drawLayer))
		// console.log(this.orderByVertical(nonFloors).map(a => a.drawLayer))
		// console.log(this.orderByWall(this.orderByVertical(nonFloors)).map(a => a.drawLayer))

		return [
			...this.orderByVertical(floors),
			...this.orderByVertical(exits),
			// ...this.orderByVertical(walls),
			...this.orderByVertical(nonFloors),
		]
	}

	orderByVertical(kids) {
		return [...kids].sort((a, b) => {
			return a.position.y > b.position.y ? 1 : -1
		});
	}

	orderByWall(kids) {
		return [...kids].sort((a, b) => {
			if (a.drawLayer === 'TRIM' ) {
				return -1;
			}
		});
	}

	drawImage(ctx, drawPosX, drawPosY) {
		// leave empty
	}

	// remove from the tree
	destroy() {
		this.children.forEach(child => {
			child.destroy();
		});

		this.parent.removeChild(this);
	}

	addChild(gameObject) {
		gameObject.parent = this;

		this.children.push(gameObject);
	}

	hasChild(gameObject) {
		return this.children.findIndex((elem) => elem === gameObject) > -1;
	}

	removeChild(gameObject) {
		events.unsubscribe(gameObject);
		this.children = this.children.filter(g => {
			return gameObject !== g;
		})
	}
}