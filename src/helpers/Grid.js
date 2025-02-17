export const GRID_SIZE = 16;

export function gridCells(num) {
	return num * GRID_SIZE;
}

export function isSpaceFree(walls, x, y) {
	const str = `${x}, ${y}`;
	const isWallPresent = walls.has(str);

	return !isWallPresent;
}