export default class Point {
    constructor(x, y) {
        this.X = x;
        this.Y = y;
    }

    isZero() {
        return !this.x && !this.y;
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