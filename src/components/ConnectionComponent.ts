import ComponentType from "../types/types"
import Position from "../types/Position"
import Component from "./Component"
import Line from "./Line"
import NodeComponent from "./NodeComponent"

class ConnectionComponent extends Component {
    private points: Array<Position>
    private connectedTo: {start?: NodeComponent, end?: NodeComponent}
    private attractionBias: number // Tendência de um ponto a assumir uma das coordenadas de seu antecessor

    constructor(id: number, position: Position, connection1?: NodeComponent, connection2?: NodeComponent) {
        super(id, position, ComponentType.LINE)
        this.points = []
        // Os pontos funcionam com coordenadas locais, relacionadas a variável position
        this.points.push(new Position(0, 0))
        this.points.push(new Position(0, 0)) // Segundo ponto que será editado para gerar a linha
        this.connectedTo = {}
        this.connectedTo.start = connection1
        this.connectedTo.end = connection2
        this.attractionBias = 32
    }
    // TODO - Refatorar o código da função draw e a classe Line
    /*
        A linha intermediária deve estar conectada a linha anterior (end -> start)
        As linhas devem ser desenhadas como um único path (path2d?)
    */
    draw(ctx: CanvasRenderingContext2D): void {
        ctx.beginPath()
        ctx.moveTo(this.points[0].x, this.points[0].y)
        this.points.forEach(point => {
            let globalPos = Position.add(this.position, point)
            ctx.lineTo(globalPos.x, globalPos.y)
        })
        ctx.strokeStyle = "#000000"
        ctx.stroke()
        ctx.closePath()
    }

    addPoint(point: Position, position: number = this.points.length): void {
        let len = this.points.length
        if (point.x > this.points[len-1].x - this.attractionBias && point.x < this.points[len-1].x + this.attractionBias)
            point.x = this.points[len-1].x
        if (point.y > this.points[len-1].y - this.attractionBias && point.y < this.points[len-1].y + this.attractionBias)
            point.y = this.points[len-1].y
        this.points.splice(position, 0, point)
    }

    removePoint(position: number = this.points.length - 1) {
        this.points.splice(position, 1)
    }

    // Recebe um delta entre a posição anterior e a atual
    changePositions(delta: Position) {
        this.position.add(delta)
    }

    changePosition(delta: Position, positionIndex: number = this.points.length - 1): void {
        this.points[positionIndex].add(delta)
    }

    changeConnection(newNode: NodeComponent, end: boolean = false) {
        if (end) {
            this.connectedTo.end = newNode
            return
        }
        this.connectedTo.start = newNode
    }
}

export default ConnectionComponent