import ComponentType from "../types/types"
import Position from "../types/Position"

class Component {
    public readonly id: number
    public position: Position
    public readonly type: ComponentType
    protected componentPath: Path2D

    constructor(id: number, position: Position, type: ComponentType = ComponentType.NODE) {
        this.id = id
        this.position = position
        this.type = type
        this.componentPath = new Path2D()
    }

    changePosition(delta: Position) {
        this.position.x += delta.x
        this.position.y += delta.y
        this.generatePath()
    }

    draw(_ctx: CanvasRenderingContext2D) {
        throw new Error("Função não implementada na classe-pai, utilize uma das subclasses!")
    }

    protected generatePath() {
        //console.error("Função não implementada na classe-pai, utilize uma das subclasses!")
        return new Path2D()
    }
}

export default Component