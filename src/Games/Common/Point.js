export default class Point {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    isZero() {
        return !(this.x || this.y);
    }

    getSquareLength() {
        return Math.pow(this.x, 2) + Math.pow(this.y, 2);
    }

    add(point) {
        return new Point(this.x + point.x, this.y + point.y);
    }

    substitute(point) {
        return new Point(this.x - point.x, this.y - point.y);
    }
}