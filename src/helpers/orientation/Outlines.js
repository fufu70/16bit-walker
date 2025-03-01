import {Matrix} from '../../Matrix.js';
import {
	NORTH_SINGLE,
	NORTH_RIGHT,
	NORTH,
	NORTH_LEFT,
	NORTH_WEST_CORNER,
	NORTH_WEST,
	WEST_TOP,
	WEST,
	WEST_BOTTOM,
	SOUTH_WEST,
	SOUTH_WEST_CORNER,
	SOUTH_LEFT,
	SOUTH,
	SOUTH_RIGHT,
	SOUTH_EAST,
	SOUTH_EAST_CORNER,
	EAST_BOTTOM,
	EAST,
	EAST_TOP,
	NORTH_EAST,
	NORTH_EAST_CORNER,
	CENTER,
	CENTER_NORTH_WEST_CORNER,
	CENTER_NORTH,
	CENTER_NORTH_WEST,
	CENTER_WEST,
	CENTER_NORTH_EAST,
} from './Orientation.js';

/**
 * North Single
 * 
 * XXX  XXX  XXX  XXX  XXX  XXX
 * XWX  FWF  FWF  FWF  XWF  FWX
 * XFX  FFF  FFX  XFF  XFF  FFX
 */
export const NORTH_SINGLE_OUTLINES = [
	/**
	 * XXX
	 * XWX
	 * XFX
	 */
	new Matrix([
		[-1,-1,-1],
		[ 0, 0, 0],
		[ 0, 1, 0]
	]),
	/**
	 * XXX
	 * FWF
	 * FFF
	 */
	new Matrix([
		[-1,-1,-1],
		[ 1, 0, 1],
		[ 1, 1, 1]
	]),

	/**
	 * XXX
	 * FWF
	 * FFX
	 */
	new Matrix([
		[-1,-1,-1],
		[ 1, 0, 1],
		[ 1, 1, 0]
	]),

	/**
	 * XXX
	 * FWF
	 * XFF
	 */
	new Matrix([
		[-1,-1,-1],
		[ 1, 0, 1],
		[ 0, 1, 1]
	]),

	/**
	 * XXX
	 * XWF
	 * XFF
	 */
	new Matrix([
		[-1,-1,-1],
		[ 0, 0, 1],
		[ 0, 1, 1]
	]),

	/**
	 * XXX
	 * FWX
	 * FFX
	 */
	new Matrix([
		[-1,-1,-1],
		[ 1, 0, 0],
		[ 1, 1, 0]
	]),
];

/**
 * North
 * 
 * XXX
 * XWX
 * FFF
 */ 
export const NORTH_OUTLINES = [
	/**
	 * XXX
	 * XWX
	 * FFF
	 */
	new Matrix([
		[-1,-1,-1],
		[ 0, 0, 0],
		[ 1, 1, 1]
	]),
];

/**
 * North Right
 * 
 * XXX  XXX
 * XWX  XWF
 * FFX  FFF
 */ 
export const NORTH_RIGHT_OUTLINES = [
	/**
	 * XXX
	 * XWX
	 * FFX
	 */
	new Matrix([
		[-1,-1,-1],
		[ 0, 0, 0],
		[ 1, 1, 0],
	]),
	/**
	 * XXX
	 * XWF
	 * FFF
	 */
	new Matrix([
		[-1,-1,-1],
		[ 0, 0, 1],
		[ 1, 1, 1]
	]),
];

/**
 * North Left
 * 
 * XXX  XXX
 * XWX  FWX
 * XFF  FFF
 */ 
export const NORTH_LEFT_OUTLINES = [
	/**
	 * XXX
	 * XWX
	 * XFF
	 */
	new Matrix([
		[-1,-1,-1],
		[-1, 0, 0],
		[ 0, 1, 1]
	]),
	/**
	 * XXX
	 * FWX
	 * FFF
	 */
	new Matrix([
		[-1,-1,-1],
		[ 1, 0, 0],
		[ 1, 1, 1]
	]),
];

/**
 * NORTH_WEST_CORNER
 * 
 * XXX
 * XWF
 * XFF
 */ 
export const NORTH_WEST_CORNER_OUTLINES = [
	/**
	 * XXX
	 * XWX
	 * XFF
	 */
	new Matrix([
		[-1,-1,-1],
		[-1, 0, 0],
		[ 0, 1, 1]
	]),
	/**
	 * XXX
	 * FWX
	 * FFF
	 */
	new Matrix([
		[-1,-1,-1],
		[ 1, 0, 0],
		[ 1, 1, 1]
	]),
];

/**
 * NORTH_WEST
 * 
 * XXX
 * XWX
 * XXF
 */
export const NORTH_WEST_OUTLINES = [
	/**
	 * XXX
	 * XWX
	 * XXF
	 */
	new Matrix([
		[-1,-1,-1],
		[-1, 0, 0],
		[ 0, 0, 1]
	]),
];

/**
 * WEST_TOP
 * 
 * XXX 
 * XWF
 * XXF
 */
export const WEST_TOP_OUTLINES = [
	/**
	 * XXX
	 * XWF
	 * XXF
	 */
	new Matrix([
		[-1, 0, 0],
		[-1, 0, 1],
		[-1, 0, 1]
	]),
];

/**
 * WEST
 * 
 * XXF 
 * XWF
 * XXF
 */
export const WEST_OUTLINES = [
	/**
	 * XXF 
	 * XWF
	 * XXF
	 */
	new Matrix([
		[-1, 0, 1],
		[-1, 0, 1],
		[-1, 0, 1]
	]),
];

/**
 * WEST_BOTTOM
 * 
 * XXF 
 * XWF
 * XXX
 */
export const WEST_BOTTOM_OUTLINES = [
	/**
	 * XXF 
	 * XWF
	 * XXX
	 */
	new Matrix([
		[-1, 0, 1],
		[-1, 0, 1],
		[-1, 0, 0]
	]),
];

/**
 * SOUTH_WEST
 * 
 * XXF
 * XWX
 * XXX
 */
export const SOUTH_WEST_OUTLINES = [
	/**
	 * XXF
	 * XWX
	 * XXX
	 */
	new Matrix([
		[-1, 0, 1],
		[-1, 0, 0],
		[-1,-1,-1]
	]),
];

/**
 * SOUTH_WEST_CORNER
 * 
 * XFF
 * XWF
 * XXX
 */
export const SOUTH_WEST_CORNER_OUTLINES = [
	/**
	 * XFF
	 * XWF
	 * XXX
	 */
	new Matrix([
		[-1, 1, 1],
		[-1, 0, 1],
		[-1,-1,-1]
	]),
];

/**
 * SOUTH_LEFT
 * 
 * XFF
 * XWX
 * XXX
 */
export const SOUTH_LEFT_OUTLINES = [
	/**
	 * XFF
	 * XWX
	 * XXX
	 */
	new Matrix([
		[ 0, 1, 1],
		[ 0, 0, 0],
		[-1,-1,-1]
	]),
];

/**
 * SOUTH
 * 
 * FFF
 * XWX
 * XXX
 */
export const SOUTH_OUTLINES = [
	/**
	 * FFF
	 * XWX
	 * XXX
	 */
	new Matrix([
		[ 1, 1, 1],
		[ 0, 0, 0],
		[-1,-1,-1]
	]),
];

/**
 * SOUTH_RIGHT
 * 
 * FFX
 * XWX
 * XXX
 */
export const SOUTH_RIGHT_OUTLINES = [
	/**
	 * FFX
	 * XWX
	 * XXX
	 */
	new Matrix([
		[ 1, 1, 0],
		[ 0, 0, 0],
		[-1,-1,-1]
	]),
];

/**
 * SOUTH_EAST
 * 
 * FXX
 * XWX
 * XXX
 */
export const SOUTH_EAST_OUTLINES = [
	/**
	 * FXX
	 * XWX
	 * XXX
	 */
	new Matrix([
		[ 1, 0,-1],
		[ 0, 0,-1],
		[-1,-1,-1]
	]),
];

/**
 * SOUTH_EAST_CORNER
 * 
 * FFX
 * FWX
 * XXX
 */
export const SOUTH_EAST_CORNER_OUTLINES = [
	/**
	 * FFX
	 * FWX
	 * XXX
	 */
	new Matrix([
		[ 1, 1,-1],
		[ 1, 0,-1],
		[-1,-1,-1]
	]),
];


/**
 * EAST_BOTTOM
 * 
 * FXX
 * FWX
 * XXX
 */
export const EAST_BOTTOM_OUTLINES = [
	/**
	 * FXX
	 * FWX
	 * XXX
	 */
	new Matrix([
		[ 1, 0,-1],
		[ 1, 0,-1],
		[ 0, 0,-1]
	]),
];

/**
 * EAST
 * 
 * FXX
 * FWX
 * FXX
 */
export const EAST_OUTLINES = [
	/**
	 * FXX
	 * FWX
	 * FXX
	 */
	new Matrix([
		[ 1, 0,-1],
		[ 1, 0,-1],
		[ 1, 0,-1]
	]),
];

/**
 * EAST_TOP
 * 
 * XXX
 * FWX
 * FXX
 */
export const EAST_TOP_OUTLINES = [
	/**
	 * XXX
	 * FWX
	 * FXX
	 */
	new Matrix([
		[ 0, 0,-1],
		[ 1, 0,-1],
		[ 1, 0,-1]
	]),
];

/**
 * NORTH_EAST
 * 
 * XXX
 * XWX
 * FXX
 */
export const NORTH_EAST_OUTLINES = [
	/**
	 * XXX
	 * XWX
	 * FXX
	 */
	new Matrix([
		[-1,-1,-1],
		[ 0, 0,-1],
		[ 1, 0,-1]
	]),
];

/**
 * NORTH_EAST_CORNER
 * 
 * XXX
 * FWX
 * FFX
 */
export const NORTH_EAST_CORNER_OUTLINES = [
	/**
	 * XXX
	 * FWX
	 * FFX
	 */
	new Matrix([
		[-1,-1,-1],
		[ 1, 0,-1],
		[ 1, 1,-1]
	]),
];

/**
 * CENTER
 * 
 * FFF
 * FFF
 * FFF
 */
export const CENTER_OUTLINES = [
	/**
	 * FFF
	 * FFF
	 * FFF
	 */
	new Matrix([
		[ 1, 1, 1],
		[ 1, 1,-1],
		[-1,-1,-1]
	]),
];


/**
 * CENTER_NORTH_WEST_CORNER
 * 
 * WFX
 * FFX
 * XXX
 */
export const CENTER_NORTH_WEST_CORNER_OUTLINES = [
	/**
	 * WFX
	 * FFX
	 * XXX
	 */
	new Matrix([
		[ 0, 1,-1],
		[ 1, 1,-1],
		[-1,-1,-1]
	]),
];

/**
 * CENTER_NORTH
 * 
 * WWW
 * XFX
 * XXX
 */
export const CENTER_NORTH_OUTLINES = [
	/**
	 * WWX
	 * XFX
	 * XXX
	 */
	new Matrix([
		[ 0, 0,-1],
		[-1, 1,-1],
		[-1,-1,-1]
	]),
];

/**
 * CENTER_NORTH_WEST
 * 
 * WWW
 * WFX
 * WXX
 */
export const CENTER_NORTH_WEST_OUTLINES = [
	/**
	 * WWW
	 * WFX
	 * WXX
	 */
	new Matrix([
		[ 0, 0,-1],
		[ 0, 1,-1],
		[-1,-1,-1]
	]),
];

/**
 * CENTER_WEST
 * 
 * WFX
 * WFX
 * XXX
 */
export const CENTER_WEST_OUTLINES = [
	/**
	 * WXX
	 * WFX
	 * XXX
	 */
	new Matrix([
		[ 0, 1,-1],
		[ 0, 1,-1],
		[-1,-1,-1]
	]),
];

/**
 * CENTER_NORTH_EAST
 * 
 * WWW
 * XFX
 * XXX
 */
export const CENTER_NORTH_EAST_OUTLINES = [
	/**
	 * XWX
	 * XFX
	 * XXX
	 */
	new Matrix([
		[-1, 0,-1],
		[-1, 1,-1],
		[-1,-1,-1]
	]),
];


export const OUTLINES = {};

OUTLINES[NORTH_SINGLE] = NORTH_SINGLE_OUTLINES;
OUTLINES[NORTH_RIGHT] = NORTH_RIGHT_OUTLINES;
OUTLINES[NORTH] = NORTH_OUTLINES;
OUTLINES[NORTH_LEFT] = NORTH_LEFT_OUTLINES;
OUTLINES[NORTH_WEST_CORNER] = NORTH_WEST_CORNER_OUTLINES;
OUTLINES[NORTH_WEST] = NORTH_WEST_OUTLINES;
OUTLINES[WEST_TOP] = WEST_TOP_OUTLINES;
OUTLINES[WEST] = WEST_OUTLINES;
OUTLINES[WEST_BOTTOM] = WEST_BOTTOM_OUTLINES;
OUTLINES[SOUTH_WEST] = SOUTH_WEST_OUTLINES;
OUTLINES[SOUTH_WEST_CORNER] = SOUTH_WEST_CORNER_OUTLINES;
OUTLINES[SOUTH_LEFT] = SOUTH_LEFT_OUTLINES;
OUTLINES[SOUTH] = SOUTH_OUTLINES;
OUTLINES[SOUTH_RIGHT] = SOUTH_RIGHT_OUTLINES;
OUTLINES[SOUTH_EAST] = SOUTH_EAST_OUTLINES;
OUTLINES[SOUTH_EAST_CORNER] = SOUTH_EAST_CORNER_OUTLINES;
OUTLINES[EAST_BOTTOM] = EAST_BOTTOM_OUTLINES;
OUTLINES[EAST] = EAST_OUTLINES;
OUTLINES[EAST_TOP] = EAST_TOP_OUTLINES;
OUTLINES[NORTH_EAST] = NORTH_EAST_OUTLINES;
OUTLINES[NORTH_EAST_CORNER] = NORTH_EAST_CORNER_OUTLINES;

OUTLINES[CENTER] = CENTER_OUTLINES;
OUTLINES[CENTER_NORTH_WEST] = CENTER_NORTH_WEST_OUTLINES;
OUTLINES[CENTER_WEST] = CENTER_WEST_OUTLINES;
OUTLINES[CENTER_NORTH_WEST_CORNER] = CENTER_NORTH_WEST_CORNER_OUTLINES;
OUTLINES[CENTER_NORTH] = CENTER_NORTH_OUTLINES;
OUTLINES[CENTER_NORTH_EAST] = CENTER_NORTH_EAST_OUTLINES;