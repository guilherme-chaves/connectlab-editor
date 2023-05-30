import ComponentType from "../types"
import Position from "../types/Position"
import Component from "./Component"
import Line from "./Line"
import NodeComponent from "./NodeComponent"

class ConnectionComponent extends Component {
    public lines: Array<Line>
    public connectedTo: {start?: NodeComponent, end?: NodeComponent}

    constructor(id: number, line: Line, connection1?: NodeComponent, connection2?: NodeComponent) {
        super(id, new Position(line.start.x, line.start.y), ComponentType.LINE)
        this.lines = []
        this.lines.push(line)
        this.connectedTo = {}
        this.connectedTo.start = connection1
        this.connectedTo.end = connection2
    }

    draw(ctx: CanvasRenderingContext2D): void {
        this.lines.forEach(line => {
            line.draw(ctx)
        })
    }

    addLine(line: Line, position: number = this.lines.length): void {
        this.lines.splice(position, 0, line)
    }

    removeLine(position: number = this.lines.length - 1) {
        this.lines.splice(position, 1)
    }

    // Recebe um delta da posição anterior e a atual, atualiza todas as linhas a partir disso
    changePositions(delta: Position) {
        this.lines.forEach(line => {
            line.start.x += delta.x
            line.start.y += delta.y
            line.end.x += delta.x
            line.end.y += delta.y
        })
    }

    changePosition(delta: Position, lineIndex: number = this.lines.length - 1, lineChange: number = 2): void {
        // lineChange = (0 - start, 1 - end, 2 - both)
        if (lineChange != 1) {
            this.lines[lineIndex].start.x += delta.x
            this.lines[lineIndex].start.y += delta.y
        }
        if (lineChange != 0) {
            this.lines[lineIndex].end.x += delta.x
            this.lines[lineIndex].end.y += delta.y
        }
    }

    changeConnection(newNode: NodeComponent, end: boolean = false) {
        if (end)
            this.connectedTo.end = newNode
        this.connectedTo.start = newNode
    }
}

export default ConnectionComponent