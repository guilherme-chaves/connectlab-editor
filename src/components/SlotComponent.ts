import Position from "../types/Position";
import ComponentType from "../types/types";
import Component from "./Component";

export default class SlotComponent extends Component {
    private parentPosition: Position
    private state: boolean
    private inSlot: boolean
    private color: string
    private colorActive: string
    private radius: number
    private attractionBias: number // Área de atração do slot para linhas a serem conectadas
    
    constructor(id: number, position: Position, parentPosition: Position, inSlot: boolean = true, radius: number = 4, attractionRadius: number = 12, color: string = "#0880FF", colorActive: string = "#FF0000") {
        super(id, position, ComponentType.SLOT)
        this.parentPosition = parentPosition
        this.color = color
        this.colorActive = colorActive
        this.state = false
        this.inSlot = inSlot
        this.radius = radius
        this.attractionBias = attractionRadius
        // Buscar como ler os parâmetros do Node após as mudanças realizadas - centralizar no mouse e colisão com os limites do canvas
        this.componentPath = this.generatePath()
    }

    getState(): boolean {
        return this.state
    }
    
    setState(state: boolean): void {
        this.state = state
    }
    
    getInSlot(): boolean {
        return this.inSlot
    }

    setParentPosition(position: Position) {
        this.parentPosition = position
    }

    protected generatePath(): Path2D {
        let path = new Path2D()
        path.arc(this.parentPosition.x+this.position.x, this.parentPosition.y+this.position.y, this.radius, 0, Math.PI*2)
        return path
    }

    private generateAttractionPath(): Path2D {
        let path = new Path2D()
        path.arc(this.parentPosition.x+this.position.x, this.parentPosition.y+this.position.y, this.radius+this.attractionBias, 0, Math.PI*2)
        return path
    }

    draw(ctx: CanvasRenderingContext2D, ): void {
        ctx.beginPath()
        let oldFillStyle = ctx.fillStyle
        ctx.fillStyle = (this.state ? this.colorActive : this.color)
        ctx.fill(this.componentPath)
        ctx.fillStyle = oldFillStyle
        ctx.closePath()
    }
}