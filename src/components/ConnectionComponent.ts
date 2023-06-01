import ComponentType from "../types/types"
import Position from "../types/Position"
import Component from "./Component"
import NodeComponent from "./NodeComponent"

class ConnectionComponent extends Component {
    private points: Array<Position>
    private connectedTo: {start?: NodeComponent, end?: NodeComponent}
    private connectionPath: Path2D
    private regenConnectionPath: boolean
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
        this.connectionPath = this.generatePath()
        this.regenConnectionPath = false
    }

    generatePath() {
        let path = new Path2D()
        path.moveTo(this.points[0].x, this.points[0].y)
        this.points.forEach(point => {
            let globalPos = Position.add(this.position, point)
            path.lineTo(globalPos.x, globalPos.y)
        })
        return path
    }
    // TODO - Refatorar o código da função draw e a classe Line
    /*
        A linha intermediária deve estar conectada a linha anterior (end -> start)
        As linhas devem ser desenhadas como um único path (path2d?)
    */
    draw(ctx: CanvasRenderingContext2D): void {
        if (this.regenConnectionPath)
            this.connectionPath = this.generatePath()
        ctx.strokeStyle = "#000000"
        ctx.stroke(this.connectionPath)
    }

    addPoint(point: Position, position: number = this.points.length): void {
        let len = this.points.length
        if (point.x > this.points[len-1].x - this.attractionBias && point.x < this.points[len-1].x + this.attractionBias)
            point.x = this.points[len-1].x
        if (point.y > this.points[len-1].y - this.attractionBias && point.y < this.points[len-1].y + this.attractionBias)
            point.y = this.points[len-1].y
        this.points.splice(position, 0, point)
        this.regenConnectionPath = true
    }

    removePoint(position: number = this.points.length - 1) {
        this.points.splice(position, 1)
        this.regenConnectionPath = true
    }

    // Recebe um delta entre a posição anterior e a atual
    changePositions(delta: Position) {
        this.position.add(delta)
        this.regenConnectionPath = true
    }

    changePosition(delta: Position, positionIndex: number = this.points.length - 1): void {
        this.points[positionIndex].add(delta)
        this.regenConnectionPath = true
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