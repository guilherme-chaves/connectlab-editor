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

    // static add(pos1: Position, pos2: Position): Position {
    //     return new Position(pos1.x + pos2.x, pos1.y + pos2.y)
    // }

    // static minus(pos1: Position, pos2: Position): Position {
    //     return new Position(pos1.x - pos2.x, pos1.y - pos2.y)
    // }

    // static dot(pos1: Position, pos2: Position): number {
    //     return pos1.x * pos2.x + pos1.y * pos2.y
    // }

    // static magSq(pos: Position) {
    //     return Position.dot(pos, pos)
    // }

    // static inBounds(pos: Position, top: number, left: number, bottom: number, right: number): Position {
    //     pos.x = Math.min(Math.max(pos.x, left), right)
    //     pos.y = Math.min(Math.max(pos.y, top), bottom)
    //     return pos
    // }
}

export default Position