
export const SKIP = -1;
export const EMPTY = 0;

export class Matrix {

	constructor(matrix = {}) {
		this.matrix = matrix;
		this._width = this.calculateWidth();
		this._height = this.calculateHeight();
	}

	add(x, y, value) {
		if (!this.matrix[y]) {
			this.matrix[y] = {};
		}

		this.matrix[y][x] = value;		
		this.clearSize();
	}

	clearSize() {
		this._width = undefined;
		this._height = undefined;
	}

	get(x, y) {
		if (!this.matrix[y] || !this.matrix[y][x]) {
			return EMPTY;
		}
		return this.matrix[y][x];
	}

	width() {
		if (this._width) {
			return this._width;	
		}
		const a = this.calculateWidth();
		this._width = a;
		return a;
	}

	calculateWidth() {
		let max = 0;
		for (let a = 0; a < this.height(); a ++) {
			const rowMax = Object.keys(this.matrix[a]).reduce((curr, next) => {
				curr = Number(curr);
				next = Number(next);
				if (curr > next) {
				    return curr;
				}
				return next;
			}, 0);
			if (rowMax > max) {
				max = rowMax;
			}
		}
		return max + 1;
	}

	height() {
		if (this._height) {
			return this._height;	
		}
		const a = this.calculateHeight();
		this._height = a;
		return a;
	}

	calculateHeight() {
		return Object.keys(this.matrix).length;
	}

	matches(b) {
		for (let y = 0; y < this.height(); y ++) {
			for (let x = 0; x < this.width(); x ++) {
				if (this.get(x,y) === SKIP || b.get(x,y) === SKIP) {
					continue;
				}

				if (this.get(x,y) !== b.get(x,y)) {
					return false;
				}
			}
		}
		return true;
	}

	compare(value) {
		let m = new Matrix([]);

		for (let y = 0; y < this.height(); y ++) {
			for (let x = 0; x < this.width(); x ++) {
				if (this.get(x, y) === value) {
					m.add(x, y, 0);
				} else if (this.get(x, y) > value) {
					m.add(x, y, 1);
				} else if (this.get(x, y) < value) {
					m.add(x, y, -1);
				}
			}
		}
		return m;
	}

	extract(x, y, width, height) {
		let m = new Matrix({});

		for (let i = 0; i < width; i ++) {
			for (let j = 0; j < height; j ++) {
				// console.log(i, j, x+i, y+j, "is " + this.get(x + i, y + j))
				// console.log(i, j, x+i, y+j, "is " + this.get(y + j, x + i))
				m.add(i, j, this.get(x + i, y + j));
			}
		}
		// console.log(m.toString())
		return m;
	}

	toString() {
		let str = "";

		for (let y = 0; y < this.height(); y ++) {
			for (let x = 0; x < this.width(); x ++) {
				str += "\t" + this.get(x, y);
			}
			str += "\n";
		}
		return str;
	}


}

/**
 * TESTING
 */
console.assert(new Matrix([
	[0,0],
	[1,1],
	[2,2]
]).width() == 2, "Width should be 2")

console.assert(new Matrix([
	[0,0],
	[1,1],
	[2,2]
]).height() == 3, "Height should be 3")


console.assert(new Matrix([
	[-1,-1],
	[ 1, 1],
	[ 2, 2]
]).get(1, 2) === 2, "an x y of 1, 2 should be 2");

console.assert(new Matrix([
	[-1,-1],
	[ 1, 1],
	[ 2, 2]
]).get(4, 5) === EMPTY, "an x y coordinate that does not exist should be empty");

console.assert(new Matrix([
	[5, 5, 5],
	[5,-1, 4],
	[5, 4,12],
]).matches(new Matrix([
	[5, 5, 5],
	[5, 7, 4],
	[5, 4,-1]
])), "values that are -1 should be skipped when matching");

console.assert(new Matrix([
	[5, 5, 5],
	[5, 1, 4],
	[5, 4,12],
]).matches(new Matrix([
	[5, 5, 5],
	[5, 7, 4],
	[5, 4, 1]
])) === false, "If matrixes are different then they should not match");

console.assert(new Matrix([
	[5, 5, 5],
	[5, 4, 4],
	[5, 4, 3],
]).matches(new Matrix([
	[5, 5, 5],
	[5, 4, 4],
	[5, 4, 3]
])), "Two matrixes that are the same shape and content should match");

console.assert(new Matrix([
	[5, 5, 5],
	[5, 4, 4],
	[5, 4, 3],
]).compare(4).matches(new Matrix([
	[1, 1, 1],
	[1, 0, 0],
	[1, 0,-1]
])), "Compare should show if a matrix value is less than or greater than the provided value");

console.assert(new Matrix([
	[5, 5, 5, 5, 5],
	[5, 4, 4, 4, 5],
	[5, 4, 3, 4, 5],
	[5, 4, 4, 4, 5],
	[5, 5, 5, 5, 5],
]).extract(0, 0, 3, 3).matches(new Matrix([
	[5, 5, 5],
	[5, 4, 4],
	[5, 4, 3]
])), "An extraction at the root should match");


console.assert(new Matrix([
	[ 0, 1, 2, 3, 4],
	[ 5, 4, 3, 2, 1],
	[ 7, 8, 9,12,11],
	[52,74,53,21,31],
	[59,64,93,32,41],
]).extract(1, 1, 3, 3).matches(new Matrix([
	[ 4, 3, 2],
	[ 8, 9,12],
	[74,53,21]
])), "An extraction at the root should match");