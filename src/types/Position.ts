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

    add(other: Position, forceFloat: boolean = false): Position {
        return new Position(this.x + other.x, this.y + other.y, forceFloat)
    }

    minus(other: Position, forceFloat: boolean = false): Position {
        return new Position(this.x - other.x, this.y - other.y, forceFloat)
    }

    multS(s: number, forceFloat: boolean = false): Position {
        return new Position(this.x * s, this.y * s, forceFloat)
    }

    mult(other: Position, forceFloat: boolean = false) {
        return new Position(this.x * other.x, this.y * other.y, forceFloat)
    }

    div(other: Position, forceFloat: boolean = false) {
        return new Position(this.x / other.x, this.y / other.y, forceFloat)
    }

    divS(s: number, forceFloat: boolean = false) {
        return new Position(this.x / s, this.y / s, forceFloat)
    }

    dot(other: Position): number {
        return this.x * other.x + this.y * other.y
    }

    magSq(): number {
        return this.dot(this)
    }

    madd(other: Position, s: number, forceFloat: boolean = false) {
        return new Position(this.x + s * other.x, this.y + s * other.y, forceFloat)
    }

    // Interpolação linear
    lerp(other: Position, t: number, forceFloat: boolean = false) {
        return this.madd(other.minus(this), t, forceFloat)
    }

    // Interpolação bilinear
    bilinear(other: Position, bt: Position, forceFloat: boolean = false) {
        return new Position(
            this.lerp(other, bt.x, forceFloat).x,
            this.lerp(other, bt.y, forceFloat).y,
            forceFloat
        )
    }

    equals(other: Position): boolean {
        return (this.x == other.x) && (this.y == other.y)
    }

    inBounds(top: number, left: number, bottom: number, right: number, forceFloat: boolean = false): Position {
        return new Position(
            Math.min(Math.max(this.x, left), right),
            Math.min(Math.max(this.y, top), bottom),
            forceFloat
        )
    }
}

export default Position