import {GameObject} from "../../GameObject.js";
import {Vector2} from "../../Vector2.js";
import {Sprite} from '../../Sprite.js';
import {moveTowards} from '../../helpers/Move.js';
import {resources} from '../../Resources.js';
import {Input, LEFT, RIGHT, UP, DOWN} from '../../Input.js';
import {gridCells, GRID_SIZE, isSpaceFree} from '../../helpers/Grid.js'
import {events} from '../../Events.js';


export class Rod extends GameObject {
	constructor(x, y) {
		super({
			position: new Vector2(x, y)
		});

		const sprite = new Sprite({
			resource: resources.images.rod,
			position: new Vector2(0, -5) // nudge upwards visually
		});
		this.addChild(sprite);
	}

	ready() {
		events.on("HERO_POSITION", this, pos => {
			const roundedHeroX = Math.round(pos.x);
			const roundedHeroY = Math.round(pos.y);

			if (roundedHeroX === this.position.x && roundedHeroY === this.position.y) {
				this.onCollideWithHero();
			}
		});
	}

	onCollideWithHero() {
		this.destroy();
		console.log("HERO_PICKS_UP_ITEM");

		events.emit("HERO_PICKS_UP_ITEM", {
			image: resources.images.rod,
			position: this.position
		});
	}
}