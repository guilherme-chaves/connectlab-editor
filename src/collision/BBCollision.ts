import Position from "../types/Position";
import CollisionShape from "./CollisionShape";

export default class BBCollision extends CollisionShape {
    constructor(position: Position, width: number, height: number, color?: string) {
        super()
        this.a = position
        this.b = new Position(width, height)
        this.color = color ?? this.color
        this.drawPath = this.generatePath()
    }

    protected generatePath(): Path2D {
        let path = new Path2D()
        path.rect(this.a.x, this.a.y, this.b.x, this.b.y)
        return path
    }

    draw(ctx: CanvasRenderingContext2D, selected: boolean) {
        super.draw(ctx, selected)
    }

    moveShape(delta: Position): void {
        this.a = this.a.add(delta)
        this.drawPath = this.generatePath()
    }

    collisionWithPoint(point: Position): boolean {
        let b = this.b.add(this.a)
        return (point.x > this.a.x && point.x < b.x && point.y > this.a.y && point.y < b.y)
    }
}