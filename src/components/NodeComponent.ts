import { nodeTypes } from "../types/types"
import NodeType from "../types/NodeType"
import { ADDNode, NOTNode, ORNode } from "../types/NodeTypes"
import Position from "../types/Position"
import Component from "./Component"
import { SlotComponent } from "./SlotComponent"

class NodeComponent extends Component {
    public readonly nodeType: NodeType
    private imageLoaded: boolean
    private nodeImage: HTMLImageElement
    private slotComponents: Array<SlotComponent>
    private slotsStatus: Array<boolean>
    constructor(id: number, position: Position, nodeType: nodeTypes, canvasWidth: number, canvasHeight: number) {
        super(id, position)
        this.nodeType = this.getNodeTypeObject(nodeType)
        this.slotComponents = []
        this.slotsStatus = []
        this.nodeImage = new Image()
        this.imageLoaded= false
        this.nodeImage.addEventListener('load', () => {
            // Centraliza a imagem no mouse
            let halfImgPos = new Position(this.nodeImage.width/2, this.nodeImage.height/2)
            this.position.minus(halfImgPos)
            let canvasBound = new Position(canvasWidth, canvasHeight)
            canvasBound.minus(halfImgPos)
            this.position.inBounds(0, 0, canvasBound.y, canvasBound.x)
            this.imageLoaded = true
        })
        this.nodeImage.src = this.nodeType.imgPath
        this.nodeType.connectionSlots.forEach((slot) => {
            this.slotsStatus[slot.id] = false
            this.setSlotComponent(slot.id, slot.localPos, slot.in)
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

    setSlotComponent(id: number, localPos: Position, inSlot: boolean = true, color?: string, colorActive?: string): void {
        this.slotComponents.push(new SlotComponent(id, localPos, this, inSlot, color, colorActive))
    }

    getNodeImage() {
        return this.nodeImage
    }

    draw(ctx: CanvasRenderingContext2D) {
        if (this.imageLoaded) {
            ctx.drawImage(this.nodeImage, this.position.x, this.position.y)
            this.slotComponents.forEach((slot) => {
                slot.draw(ctx)
            })
        }
    }
}

export default NodeComponent