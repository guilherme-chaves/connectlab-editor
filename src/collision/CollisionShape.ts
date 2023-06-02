import Position from "../types/Position";

export default class CollisionShape {
    public a: Position = new Position(0,0)
    public b: Position = new Position(0,0)
    public color: string = "#FF8008"
    protected drawPath: Path2D = this.generatePath()

    protected generatePath(): Path2D {
        let path = new Path2D()
        let size = this.b.minus(this.a)
        path.rect(this.a.x, this.a.y, size.x, size.y)
        return path
    }

    draw(ctx: CanvasRenderingContext2D, selected: boolean): void {
        if(!selected)
            return
        let oldStrokeStyle = ctx.strokeStyle
        ctx.strokeStyle = this.color
        ctx.stroke(this.drawPath)
        ctx.strokeStyle = oldStrokeStyle
    }

    moveShape(delta: Position) {
        this.a.add(delta)
        this.b.add(delta)
    }

    collisionWithPoint(point: Position) {
        throw new Error("Função não implementada, utilize uma das classes-filhas")
    }
}