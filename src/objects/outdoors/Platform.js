import {GameObject} from "../../GameObject.js";
import {Vector2} from "../../Vector2.js";
import {Sprite} from '../../Sprite.js';
import {resources} from '../../Resources.js';

export class Platform extends GameObject {
	constructor(x, y) {
		super({
			position: new Vector2(x, y),
			isSolid: true
		});

		this.addChild(new Sprite({
			resource: resources.images.outdoors,
			position: new Vector2(0, 0),
			hFrames: 5,
			vFrames: 5,
			frame: 11
		}));
	}
}