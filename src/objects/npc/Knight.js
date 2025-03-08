import {Vector2} from "../../Vector2.js";
import {Sprite} from '../../Sprite.js';
import {resources} from '../../Resources.js';
import {Npc} from './Npc.js';


export class Knight extends Npc {
	constructor(x, y, textConfig) {
		super(
			x, 
			y, 
			textConfig, 
			new Sprite({
				resource: resources.images.knight,
				frameSize: new Vector2(32, 32),
				hFrames: 2,
				vFrames: 1,
				position: new Vector2(-8, -20)
			}),
			1
		);
	}
}