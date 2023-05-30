class Line {
    public start : Position
    public end : Position
    public color : string

    constructor(start: Position, end?: Position, color?: string) {
        this.start = start
        this.end = end ?? start
        this.color = color ?? "#000000"
    }

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.beginPath()
        ctx.moveTo(this.start.x, this.start.y)
        ctx.lineTo(this.end.x, this.end.y)
        ctx.strokeStyle = this.color
        ctx.stroke()
    }
}