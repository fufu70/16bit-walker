
import {
	NORTH_SINGLE,
	NORTH_RIGHT,
	NORTH,
	NORTH_LEFT
} from '../../../helpers/orientation/Orientation.js';

export const RED_PATTERN = 'RED_PATTERN';
export const YELLOW_PATTERN = 'YELLOW_PATTERN';
export const BLUE_PATTERN = 'BLUE_PATTERN';
export const LIGHT_WOOD = 'LIGHT_WOOD';
export const DARK_WOOD = 'DARK_WOOD';
export const OFFICE_GREY = 'OFFICE_GREY';
export const OFFICE_BROWN = 'OFFICE_BROWN';

export const PATTERNS = [
	RED_PATTERN,
	YELLOW_PATTERN,
	BLUE_PATTERN,
	LIGHT_WOOD,
	DARK_WOOD,
	OFFICE_GREY,
	OFFICE_BROWN,
];

export const WALLS = {};
WALLS[RED_PATTERN] = {};
WALLS[RED_PATTERN][NORTH_LEFT] = {
	TopWall: 85,
	BottomWall: 102	
};
WALLS[RED_PATTERN][NORTH] = {
	TopWall: 86,
	BottomWall: 103
};
WALLS[RED_PATTERN][NORTH_RIGHT] = {
	TopWall: 87,
	BottomWall: 104
};
WALLS[RED_PATTERN][NORTH_SINGLE] = {
	TopWall: 88,
	BottomWall: 105
};



WALLS[YELLOW_PATTERN] = {};
WALLS[YELLOW_PATTERN][NORTH_LEFT] = {
	TopWall: 119,
	BottomWall: 136	
};
WALLS[YELLOW_PATTERN][NORTH] = {
	TopWall: 120,
	BottomWall: 137
};
WALLS[YELLOW_PATTERN][NORTH_RIGHT] = {
	TopWall: 121,
	BottomWall: 138
};
WALLS[YELLOW_PATTERN][NORTH_SINGLE] = {
	TopWall: 122,
	BottomWall: 139
};

WALLS[BLUE_PATTERN] = {};
WALLS[BLUE_PATTERN][NORTH_LEFT] = {
	TopWall: 153,
	BottomWall: 170	
};
WALLS[BLUE_PATTERN][NORTH] = {
	TopWall: 154,
	BottomWall: 171
};
WALLS[BLUE_PATTERN][NORTH_RIGHT] = {
	TopWall: 155,
	BottomWall: 172
};
WALLS[BLUE_PATTERN][NORTH_SINGLE] = {
	TopWall: 156,
	BottomWall: 173
};

WALLS[LIGHT_WOOD] = {};
WALLS[LIGHT_WOOD][NORTH_LEFT] = {
	TopWall: 187,
	BottomWall: 204	
};
WALLS[LIGHT_WOOD][NORTH] = {
	TopWall: 188,
	BottomWall: 205
};
WALLS[LIGHT_WOOD][NORTH_RIGHT] = {
	TopWall: 189,
	BottomWall: 206
};
WALLS[LIGHT_WOOD][NORTH_SINGLE] = {
	TopWall: 190,
	BottomWall: 207
};

WALLS[DARK_WOOD] = {};
WALLS[DARK_WOOD][NORTH_LEFT] = {
	TopWall: 221,
	BottomWall: 238	
};
WALLS[DARK_WOOD][NORTH] = {
	TopWall: 222,
	BottomWall: 239
};
WALLS[DARK_WOOD][NORTH_RIGHT] = {
	TopWall: 223,
	BottomWall: 240
};
WALLS[DARK_WOOD][NORTH_SINGLE] = {
	TopWall: 224,
	BottomWall: 241
};

WALLS[OFFICE_GREY] = {};
WALLS[OFFICE_GREY][NORTH_LEFT] = {
	TopWall: 289,
	BottomWall: 306	
};
WALLS[OFFICE_GREY][NORTH] = {
	TopWall: 290,
	BottomWall: 307
};
WALLS[OFFICE_GREY][NORTH_RIGHT] = {
	TopWall: 291,
	BottomWall: 308
};
WALLS[OFFICE_GREY][NORTH_SINGLE] = {
	TopWall: 292,
	BottomWall: 309
};

WALLS[OFFICE_BROWN] = {};
WALLS[OFFICE_BROWN][NORTH_LEFT] = {
	TopWall: 323,
	BottomWall: 340
};
WALLS[OFFICE_BROWN][NORTH] = {
	TopWall: 324,
	BottomWall: 341
};
WALLS[OFFICE_BROWN][NORTH_RIGHT] = {
	TopWall: 325,
	BottomWall: 342
};
WALLS[OFFICE_BROWN][NORTH_SINGLE] = {
	TopWall: 326,
	BottomWall: 343
};
