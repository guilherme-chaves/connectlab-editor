import CollisionShape from "./CollisionShape";
import Position from "../types/Position";

export default class CircleCollision extends CollisionShape {
    public radius: number
    public radiusSq: number
    protected drawPath: Path2D

    constructor(position: Position, radius: number, color?: string) {
        super()
        this.a = position
        this.radius = radius
        this.radiusSq = radius * radius
        this.color = color ?? this.color
        this.drawPath = this.generatePath()
    }

    protected generatePath(): Path2D {
        let path = new Path2D()
        path.arc(this.a.x, this.a.y, this.radius, 0, Math.PI*2)
        return path
    }

    draw(ctx: CanvasRenderingContext2D, selected: boolean): void {
        if(!selected)
            return
        ctx.beginPath()
        let oldStrokeStyle = ctx.strokeStyle
        ctx.strokeStyle = this.color
        ctx.stroke(this.drawPath)
        ctx.strokeStyle = oldStrokeStyle
        ctx.closePath()
    }

    moveShape(delta: Position): void {
        this.a = this.a.add(delta)
        this.drawPath = this.generatePath()
    }

    collisionWithPoint(point: Position): boolean {
        return (this.a.minus(point).magSq() < this.radiusSq)
    }
}