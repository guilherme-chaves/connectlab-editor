import { nodeTypes } from "../types/types"
import NodeType from "../types/NodeType"
import { ADDNode, NOTNode, ORNode } from "../types/NodeTypes"
import Position from "../types/Position"
import Component from "./Component"

class NodeComponent extends Component {
    public readonly nodeType: NodeType
    private imageLoaded: boolean
    private nodeImage: HTMLImageElement
    private slotComponents: Array<number>
    constructor(id: number, position: Position, nodeType: nodeTypes, canvasWidth: number, canvasHeight: number, slotKeys: Array<number>) {
        super(id, position)
        this.nodeType = NodeComponent.getNodeTypeObject(nodeType)
        this.slotComponents = slotKeys
        this.nodeImage = new Image()
        this.imageLoaded= false
        this.nodeImage.addEventListener('load', () => {
            // Centraliza a imagem no mouse - bug relacionado ao posicionamento dos slots
            // let halfImgPos = new Position(this.nodeImage.width/2, this.nodeImage.height/2)
            // this.position.minus(halfImgPos)
            let canvasBound = new Position(canvasWidth, canvasHeight)
            canvasBound.minus(new Position(this.nodeImage.width, this.nodeImage.height))
            this.position.inBounds(0, 0, canvasBound.y, canvasBound.x)
            this.imageLoaded = true
        })
        this.nodeImage.src = this.nodeType.imgPath
    }

    static getNodeTypeObject(type: nodeTypes): NodeType {
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

    addSlotComponents(slotKeys: Array<number>) {
        this.slotComponents = slotKeys
    }

    changePosition(delta: Position): void {
        super.changePosition(delta)
    }

    getNodeImage() {
        return this.nodeImage
    }

    getNodeType() {
        return this.nodeType
    }

    getSlotComponents() {
        return this.slotComponents
    }

    draw(ctx: CanvasRenderingContext2D) {
        if (this.imageLoaded) {
            ctx.drawImage(this.nodeImage, this.position.x, this.position.y)
        }
    }
}

export default NodeComponent