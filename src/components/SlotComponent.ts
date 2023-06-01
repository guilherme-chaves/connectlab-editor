import Position from "../types/Position";
import ComponentType from "../types/types";
import Component from "./Component";

export class SlotComponent extends Component {
    private parentNode: Component
    private state: boolean
    private inSlot: boolean
    private color: string
    private colorActive: string
    constructor(id: number, position: Position, parent: Component, inSlot: boolean = true, color: string = "#0880FF", colorActive: string = "#FF0000") {
        super(id, position, ComponentType.SLOT)
        this.parentNode = parent
        this.color = color
        this.colorActive = colorActive
        this.state = false
        this.inSlot = inSlot
    }

    getState() {
        return this.state
    }
    
    setState(state: boolean) {
        this.state = state
    }

    getInSlot() {
        return this.inSlot
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath()
        ctx.arc(this.parentNode.position.x+this.position.x, this.parentNode.position.y+this.position.y, 4, 0, Math.PI*2)
        let oldFillStyle = ctx.fillStyle
        ctx.fillStyle = (this.state ? this.colorActive : this.color)
        ctx.fill()
        ctx.fillStyle = oldFillStyle
    }
}