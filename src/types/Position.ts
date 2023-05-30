interface Position {
    x: number;
    y: number;
}

class Position {
    constructor(xOrPosition: number|Position, y: number) {
        if(typeof xOrPosition == "number") {
            this.x = xOrPosition
            this.y = y
        } else {
            this.x = xOrPosition.x
            this.y = xOrPosition.y
        }
    }

    add(other: Position) {
        this.x += other.x
        this.y += other.y
    }

    minus(other: Position) {
        this.x -= other.x
        this.y -= other.y
    }

    static add(pos1: Position, pos2: Position) {
        return new Position(pos1.x + pos2.x, pos1.y + pos2.y)
    }

    static minus(pos1: Position, pos2: Position) {
        return new Position(pos1.x - pos2.x, pos1.y - pos2.y)
    }
}