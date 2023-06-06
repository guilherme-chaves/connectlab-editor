import CircleCollision from "../collision/CircleCollision";
import Position from "../types/Position";
import ComponentType from "../types/types";
import Component from "./Component";

export default class SlotComponent extends Component {
    private parentType: ComponentType
    private parentId: number
    private connectionId: number
    private parentPosition: Position
    private state: boolean
    private inSlot: boolean
    private color: string
    private colorActive: string
    private radius: number
    private attractionBias: number // Área de atração do slot para linhas a serem conectadas
    declare protected collisionShape: CircleCollision;

    constructor(id: number, position: Position, parentType: ComponentType, parentId: number, parentPosition: Position, connectionId: number = -1, inSlot: boolean = true, radius: number = 4, attractionRadius: number = 12, color: string = "#0880FF", colorActive: string = "#FF0000") {
        super(id, position, ComponentType.SLOT)
        this.parentType = parentType
        this.parentId = parentId
        this.parentPosition = parentPosition
        this.connectionId = connectionId
        this.color = color
        this.colorActive = colorActive
        this.state = false
        this.inSlot = inSlot
        this.radius = radius
        this.attractionBias = attractionRadius
        this.collisionShape = new CircleCollision(this.position.add(this.parentPosition), this.attractionBias)
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

    getParentId() {
        return this.parentId
    }

    getParentPosition() {
        return this.parentPosition
    }

    setParentPosition(position: Position) {
        this.parentPosition = position
        this.componentPath = this.generatePath()
    }

    getCollisionShape(): CircleCollision {
        return this.collisionShape
    }

    getConnectionId() {
        return this.connectionId
    }

    setConnectionId(id: number) {
        this.connectionId = id
    }

    // Gera um objeto Path2D contendo a figura a ser desenhada, armazenando-a em uma variável
    protected generatePath(): Path2D {
        let path = new Path2D()
        path.arc(this.parentPosition.x+this.position.x, this.parentPosition.y+this.position.y, this.radius, 0, Math.PI*2)
        return path
    }

    draw(ctx: CanvasRenderingContext2D, ): void {
        let oldFillStyle = ctx.fillStyle
        ctx.fillStyle = (this.state ? this.colorActive : this.color)
        ctx.fill(this.componentPath)
        ctx.fillStyle = oldFillStyle
        this.collisionShape.draw(ctx, true)
    }
}