import { nodeTypes } from "../types/types"
import NodeType from "../types/NodeType"
import { ADDNode, NOTNode, ORNode } from "../types/NodeTypes"
import Position from "../types/Position"
import Component from "./Component"

class NodeComponent extends Component {
    public readonly nodeType: NodeType
    private nodeImage: HTMLImageElement
    private slotsStatus: Array<boolean>
    constructor(id: number, position: Position, nodeType: nodeTypes, ctx: CanvasRenderingContext2D) {
        super(id, position)
        this.nodeType = this.getNodeTypeObject(nodeType)
        this.slotsStatus = []
        this.nodeImage = new Image()
        this.nodeImage.addEventListener('load', () => {
            // Centraliza a imagem no mouse e a desenha no canvas; Necessário devido a falta de um loop de renderização
            this.position.minus(new Position(this.nodeImage.width/2, this.nodeImage.height/2))
            ctx.drawImage(this.nodeImage, this.position.x, this.position.y)
        })
        this.nodeImage.src = this.nodeType.imgPath
        this.nodeType.connectionSlots.forEach((slot) => {
            this.slotsStatus[slot.id] = false
        })
    }

    getNodeTypeObject(type: nodeTypes): NodeType {
        switch (type) {
            case nodeTypes.ADD:
                return ADDNode
            case nodeTypes.OR:
                return ORNode
            case nodeTypes.NOT:
                return NOTNode
            default:
                return NOTNode
        }
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.drawImage(this.nodeImage, this.position.x, this.position.y)
    }
}

export default NodeComponent