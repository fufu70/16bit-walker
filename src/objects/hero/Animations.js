import {Animations} from '../../Animations.js';
import {FrameIndexPattern} from '../../FrameIndexPattern.js';

export function makeWalkingFrames(rootFrame=0) {
	return {
		duration: 400,
		frames: [
			{
				time: 0,
				frame: rootFrame + 1
			},

			{
				time: 100,
				frame: rootFrame
			},
			{
				time: 200,
				frame: rootFrame + 1
			},
			{
				time: 300,
				frame: rootFrame + 2
			}
		]
	};
}


export function makeStandingFrames(rootFrame = 0) {
	return {	
		duration: 400,
		frames: [
			{
				time: 0,
				frame: rootFrame
			},
		]
	};
}

export const WALK_DOWN = makeWalkingFrames(0);
export const WALK_RIGHT = makeWalkingFrames(3);
export const WALK_UP = makeWalkingFrames(6);
export const WALK_LEFT = makeWalkingFrames(9);
export const STAND_DOWN = makeStandingFrames(1);
export const STAND_RIGHT = makeStandingFrames(4);
export const STAND_UP = makeStandingFrames(7);
export const STAND_LEFT = makeStandingFrames(10);

export const PICK_UP_DOWN = {
	duration: 400,
	frames: [
		{
			time: 0,
			frame: 12
		}
	]
};


export const HERO_ANIMATIONS = new Animations({
	WALK_DOWN: new FrameIndexPattern(WALK_DOWN),
	WALK_RIGHT: new FrameIndexPattern(WALK_RIGHT),
	WALK_UP: new FrameIndexPattern(WALK_UP),
	WALK_LEFT: new FrameIndexPattern(WALK_LEFT),
	STAND_DOWN: new FrameIndexPattern(STAND_DOWN),
	STAND_RIGHT: new FrameIndexPattern(STAND_RIGHT),
	STAND_UP: new FrameIndexPattern(STAND_UP),
	STAND_LEFT: new FrameIndexPattern(STAND_LEFT),
	PICK_UP_DOWN: new FrameIndexPattern(PICK_UP_DOWN),
});