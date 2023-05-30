class Component {
    public readonly id: number
    public position: Position
    public readonly type: ComponentType

    constructor(id: number, position: Position, type: ComponentType = ComponentType.NODE) {
        this.id = id
        this.position = position
        this.type = type
    }

    changePosition(delta: Position) {
        this.position.x += delta.x
        this.position.y += delta.y
    }

    draw(_ctx: CanvasRenderingContext2D) {
        return
    }
}