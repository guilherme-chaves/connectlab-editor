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

    inBounds(top: number, left: number, bottom: number, right: number) {
        this.x = Math.min(Math.max(this.x, left), right)
        this.y = Math.min(Math.max(this.y, top), bottom)
    }

    static add(pos1: Position, pos2: Position) {
        return new Position(pos1.x + pos2.x, pos1.y + pos2.y)
    }

    static minus(pos1: Position, pos2: Position) {
        return new Position(pos1.x - pos2.x, pos1.y - pos2.y)
    }

    static inBounds(pos: Position, top: number, left: number, bottom: number, right: number) {
        pos.x = Math.min(Math.max(pos.x, left), right)
        pos.y = Math.min(Math.max(pos.y, top), bottom)
    }
}

export default Position