import ComponentType, { connectionSlotsInterface } from "../types/types"
import Position from "../types/Position"
import Component from "./Component"

class ConnectionComponent extends Component {
    public endPosition: Position
    // Pesos relativos ao ponto inicial e final
    public anchors: Array<Position>
    public connectedTo: connectionSlotsInterface
    private connectionPath: Path2D
    private regenConnectionPath: boolean
    private attractionBias: number // Tendência de um ponto a assumir uma das coordenadas de seu antecessor
    private slotComponents: Array<number>
    private minDistFromConnection: number // Distância mínima em pixels que a conexão deve se manter do local onde se conecta

    constructor(id: number, startPoint: Position, endPosition: Position, connections: connectionSlotsInterface = {start: undefined, end: undefined}) {
        // A variável position funciona como startPoint
        super(id, startPoint, ComponentType.LINE)
        this.endPosition = endPosition
        // As âncoras funcionam como porcentagens de interpolação entre os dois pontos
        this.anchors = [new Position(0.5, 0, true), new Position(0.5, 1, true)]
        this.connectedTo = connections
        this.attractionBias = 0.075
        this.slotComponents = []
        this.minDistFromConnection = 64
        this.connectionPath = this.generatePath()
        this.regenConnectionPath = false
    }

    // Gera um objeto Path2D contendo a figura a ser desenhada, armazenando-a em uma variável
    generatePath() {
        let path = new Path2D()
        path.moveTo(this.position.x, this.position.y)
        this.anchors.forEach(anchor => {
            let globalPos = this.position.bilinear(this.endPosition, anchor)
            path.lineTo(globalPos.x, globalPos.y)
        })
        path.lineTo(this.endPosition.x, this.endPosition.y)
        this.regenConnectionPath = false
        return path
    }

    draw(ctx: CanvasRenderingContext2D): void {
        if (this.endPosition == this.position)
            return
        if (this.regenConnectionPath)
            this.connectionPath = this.generatePath()
        ctx.strokeStyle = "#000000"
        ctx.lineWidth = 2
        ctx.lineJoin = "round"
        ctx.stroke(this.connectionPath)
    }

    anchorAttractionBias(point: Position, arrIndex: number = this.anchors.length): Position {
        let len = this.anchors.length
        if (len > 1 && (arrIndex >= 0 && arrIndex <= this.anchors.length)) {
            if (arrIndex > 0) {
                if (point.x > this.anchors[arrIndex-1].x - this.attractionBias && point.x < this.anchors[arrIndex-1].x + this.attractionBias)
                point.x = this.anchors[arrIndex-1].x
                if (point.y > this.anchors[arrIndex-1].y - this.attractionBias && point.y < this.anchors[arrIndex-1].y + this.attractionBias)
                    point.y = this.anchors[arrIndex-1].y
            }
            if (arrIndex < len - 1) {
                if (point.x > this.anchors[arrIndex+1].x - this.attractionBias && point.x < this.anchors[arrIndex+1].x + this.attractionBias)
                point.x = this.anchors[arrIndex+1].x
                if (point.y > this.anchors[arrIndex+1].y - this.attractionBias && point.y < this.anchors[arrIndex+1].y + this.attractionBias)
                    point.y = this.anchors[arrIndex+1].y
            }
        }
        return point
    }

    addAnchor(point: Position, arrIndex: number = this.anchors.length): void {
        let npoint = this.anchorAttractionBias(point.div(this.position, true), arrIndex)
        this.anchors.splice(arrIndex, 0, npoint)
        this.regenConnectionPath = true
    }

    removePoint(index: number = this.anchors.length - 1) {
        if (index < 0 || index >= this.anchors.length) {
            console.error("ConnectionComponent.removePoint - index is out of bounds!")
            return
        }
        this.anchors.splice(index, 1)
        this.regenConnectionPath = true
    }

    // Recebe um delta entre a posição anterior e a atual
    // movePoint -> 0 = position, 1 = endPosition, 2 (ou qualquer outro) = ambos
    changePosition(delta: Position, movePoint: number = 2, useDelta: boolean = true) {
        if (useDelta) {
            if (movePoint != 1)
            this.position = this.position.add(delta)
            if (movePoint != 0)
                this.endPosition = this.endPosition.add(delta)
        } else {
            if (movePoint != 1)
                this.position = delta
            if (movePoint != 0)
                this.endPosition = delta
        }
        this.regenConnectionPath = true
    }

    changeAnchor(position: Position, index: number = this.anchors.length - 1): void {
        if (index < 0 || index >= this.anchors.length) {
            console.error("ConnectionComponent.changePosition - index is out of bounds!")
            return
        }
        this.anchors[index] = this.anchorAttractionBias(position.div(this.position, true), index)
        this.regenConnectionPath = true
    }

    changeConnection(nodeId: number|undefined, nodeType: ComponentType|undefined, end: boolean = false) {
        if (nodeId != undefined && nodeType != undefined) {
            if (end) {
                this.connectedTo.end = {type: nodeType, id: nodeId}
                return
            }
            this.connectedTo.start = {type: nodeType, id: nodeId}
        }
    }
}

export default ConnectionComponent