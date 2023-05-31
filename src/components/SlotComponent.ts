import Position from "../types/Position";
import ComponentType from "../types/types";
import Component from "./Component";

export class SlotComponent extends Component {
    private parentNode: Component
    private active: boolean
    private color: string
    private colorActive: string
    constructor(id: number, position: Position, parent: Component, color: string = "#0880FF", colorActive: string = "#FF0000") {
        super(id, position, ComponentType.SLOT)
        this.parentNode = parent
        this.color = color
        this.colorActive = colorActive
        this.active = false
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath()
        ctx.moveTo(this.parentNode.position.x, this.parentNode.position.y)
        ctx.arc(-(this.parentNode.position.x/2), -(this.parentNode.position.y/2), 8, 0, Math.PI*2)
        ctx.strokeStyle = (this.active ? this.colorActive : this.color)
        ctx.stroke()
    }
}