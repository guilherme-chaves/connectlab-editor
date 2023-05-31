import { nodeTypes } from "../types"
import NodeType from "../types/NodeType"
import { ADDNode, NOTNode, ORNode } from "../types/NodeTypes"
import Position from "../types/Position"
import Component from "./Component"

class NodeComponent extends Component {
    public readonly nodeType: NodeType
    private nodeImage: HTMLImageElement
    private slotsStatus: Array<boolean>
    constructor(id: number, position: Position, nodeType: nodeTypes) {
        super(id, position)
        this.nodeType = this.getNodeTypeObject(nodeType)
        this.slotsStatus = []
        this.nodeImage = new Image()
        this.nodeType.connectionSlots.forEach((slot) => {
            this.slotsStatus[slot.id] = false
        })
        this.loadImage().then((value) => {
            this.nodeImage = value
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

    async loadImage(): Promise<HTMLImageElement> {
        let img = new Image()
        img.src = this.nodeType.imgPath
        return img
    }
}

export default NodeComponent