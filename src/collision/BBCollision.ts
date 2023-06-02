import Position from "../types/Position";
import CollisionShape from "./CollisionShape";

export default class BBCollision extends CollisionShape {
    constructor(position: Position, width: number, height: number, color?: string) {
        super()
        this.a = position
        this.b = this.a.add(new Position(width, height))
        this.color = color ?? this.color
        this.drawPath = this.generatePath()
    }

    draw(ctx: CanvasRenderingContext2D, selected: boolean) {
        super.draw(ctx, selected)
    }

    moveShape(delta: Position): void {
        super.moveShape(delta)
    }

    collisionWithPoint(point: Position): boolean {
        return (point.x > this.a.x && point.x < this.b.x && point.y > this.a.y && point.y < this.b.y)
    }
}