import {Adam} from './Adam.js';
import {Alex} from './Alex.js';
import {Amelia} from './Amelia.js';
import {Bob} from './Bob.js';
import {Knight} from './Knight.js';


const NPCS = [
	Adam, 
	Alex, 
	Amelia, 
	Bob, 
	// Knight
];

export class NpcFactory {
	static getRandom(vector2, config, seed) {

		const factory = new NpcFactory();
		const npcClass = factory.seedNpc(seed);
		console.log(npcClass);

		return new npcClass(vector2.x, vector2.y, config);
	}



	seedNpc(seed) {
		console.log(seed);
		return NPCS[Math.floor(NPCS.length * seed())];
	}
}