import {GameObject} from "../../GameObject.js";
import {Vector2} from "../../Vector2.js";
import {Sprite} from '../../Sprite.js';
import {moveTowards} from '../../helpers/Move.js';
import {resources} from '../../Resources.js';
import {Input, LEFT, RIGHT, UP, DOWN} from '../../Input.js';
import {gridCells, GRID_SIZE, isSpaceFree} from '../../helpers/Grid.js'
import {HERO_ANIMATIONS} from './Animations.js';
import {events} from '../../Events.js';


export class Hero extends GameObject {
	constructor(x, y) {
		super({
			position: new Vector2(x, y)
		});

		this.body = new Sprite({
			resource: resources.images.hero,
			frameSize: new Vector2(32, 32),
			hFrames: 3,
			vFrames: 8,
			frame: 1,
			position: new Vector2(-8, -20),
			animations: HERO_ANIMATIONS
		});
		this.destinationPosition = this.position.duplicate();
		this.facingDirection = DOWN;
		this.itemPickupTime = 0;
		this.itemPickupShell = null;
		this.isLocked = false;

		const shadowSprite = new Sprite({
			resource: resources.images.shadow,
			position: new Vector2(-8, -19),
			frameSize: new Vector2(32, 32)
		});
		this.addChild(shadowSprite);
		this.addChild(this.body);
		this.drawLayer = "HERO";

	}

	ready() {
		events.on("HERO_PICKS_UP_ITEM", this, data => {
			this.onPickUpItem(data);
		});

		events.on("START_TEXT_BOX", this, data => {
			this.lockHero(data);
		});

		events.on("START_TEXT_INPUT", this, data => {
			this.lockHero(data);
		});

		events.on("END_TEXT_BOX", this, data => {
			this.unlockHero(data);
		});

		events.on("DECIDE_INPUT_TEXT", this, data => {
			this.unlockHero(data);
		});

		events.on("CANCEL_INPUT_TEXT", this, data => {
			this.unlockHero(data);
		});
	}

	lockHero(data) {
		this.isLocked = true;
	}

	unlockHero(data) {
		this.isLocked = false;
	}

	step(delta, root) {
		if (this.isLocked) {
			return;
		}

		if (this.itemPickupTime > 0) {
			this.workOnItemPickup(delta);
			return;
		}

		// Check for input
		const input = root.input;
		if (input?.getActionJustPressed("Space")) {
			// Look for an object at the next space (according to where Hero is facing)
			const objAtPosition = this.parent.children.find(child => {
				return child.position.matches(this.position.toNeighbor(this.facingDirection));
			})
			if (objAtPosition) {
				events.emit("HERO_REQUESTS_ACTION", objAtPosition);
			}
		}


		const distance = moveTowards(this, this.destinationPosition, 1);
		const hasArrived = distance <= 1;
		if (hasArrived) {
			this.tryMove(root);
		}

		this.tryEmitPosition();
	}

	tryEmitPosition() {
		if (this.lastX === this.position.x && this.lastY === this.position.y) {
			return;
		}

		this.lastX = this.position.x;
		this.lastY = this.position.y;

		events.emit("HERO_POSITION", this.position);
	}


	tryMove(root) {
		const input = root.input;

		if (!input.direction) {
			if (this.facingDirection === LEFT) { this.body.animations.play("STAND_LEFT");}
			if (this.facingDirection === RIGHT) { this.body.animations.play("STAND_RIGHT");}
			if (this.facingDirection === UP) { this.body.animations.play("STAND_UP");}
			if (this.facingDirection === DOWN) { this.body.animations.play("STAND_DOWN");}
			return;
		}

		let nextX = this.destinationPosition.x;
		let nextY = this.destinationPosition.y;

		if (input.direction === LEFT) {
			nextX -= gridCells(1);
			this.body.frame = 9;
			this.body.animations.play("WALK_LEFT");
			this.facingDirection = LEFT;
		}

		if (input.direction === RIGHT) {
			nextX += gridCells(1);
			this.body.frame = 3;
			this.body.animations.play("WALK_RIGHT");
			this.facingDirection = RIGHT;
		}

		if (input.direction === UP) {
			nextY -= gridCells(1);
			this.body.frame = 6;
			this.body.animations.play("WALK_UP");
			this.facingDirection = UP;
		}

		if (input.direction === DOWN) {
			nextY += gridCells(1);
			this.body.frame = 0;
			this.body.animations.play("WALK_DOWN");
			this.facingDirection = DOWN;
		}

		const spaceIsFree = isSpaceFree(root.level?.walls, nextX, nextY);
		const solidBodyAtSpace = this.parent.children.find(c => {
			return c.isSolid && c.position.x === nextX && c.position.y === nextY
		});

		if (spaceIsFree && !solidBodyAtSpace) {
			this.destinationPosition.x = nextX;
			this.destinationPosition.y = nextY;	
		}
	}

	onPickUpItem(data) {
		const image = data.image;
		const position = data.position;

		this.destinationPosition = position.duplicate();

		// start the pickup animation
		this.itemPickupTime = 2500;
		this.itemPickupShell = new GameObject({});
		this.itemPickupShell.addChild(new Sprite({
			resource: image,
			position: new Vector2(0, -18)
		}));
		this.addChild(this.itemPickupShell);
	}

	workOnItemPickup(delta) {
		this.itemPickupTime -= delta;
		this.body.animations.play("PICK_UP_DOWN");

		if (this.itemPickupTime <= 0) {
			this.itemPickupShell.destroy();
		}
	}

}