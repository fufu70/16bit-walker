import {Animations} from '../../Animations.js';
import {FrameIndexPattern} from '../../FrameIndexPattern.js';
import {getCharacterWidth, getCharacterFrame} from '../textbox/spriteFontMap.js';

export function makeBlinkingFrame(character = "|") {
	return {
		duration: 500,
		frames: [
			{
				time: 0,
				frame: getCharacterFrame(character)
			},

			{
				time: 350,
				frame: getCharacterFrame(" ")
			},
		]
	};
}

export function getCharacterAnimations(character) {
	return new Animations({
		BLINKING: new FrameIndexPattern(makeBlinkingFrame(character)),
	});
}