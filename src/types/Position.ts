interface Position {
    x: number;
    y: number;
}

class Position {
    constructor(xOrPosition: number|Position, y: number, forceFloat: boolean = false) {
        if(typeof xOrPosition == "number") {
            if (forceFloat) {
                this.x = xOrPosition
                this.y = y
            } else {
                this.x = Math.floor(xOrPosition)
                this.y = Math.floor(y)
            }
        } else {
            this.x = xOrPosition.x
            this.y = xOrPosition.y
        }
    }

    add(other: Position): Position {
        return new Position(this.x + other.x, this.y + other.y)
    }

    minus(other: Position): Position {
        return new Position(this.x - other.x, this.y - other.y)
    }

    multS(s: number): Position {
        return new Position(this.x * s, this.y * s)
    }

    mult(other: Position) {
        return new Position(this.x * other.x, this.y * other.y)
    }

    dot(other: Position): number {
        return this.x * other.x + this.y * other.y
    }

    magSq(): number {
        return this.dot(this)
    }

    inBounds(top: number, left: number, bottom: number, right: number): Position {
        return new Position(
            Math.min(Math.max(this.x, left), right),
            Math.min(Math.max(this.y, top), bottom)
        )
    }
}

export default Position