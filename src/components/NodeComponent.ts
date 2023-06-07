import { nodeTypes } from "../types/types"
import NodeType from "../types/NodeType"
import { ADDNode, NOTNode, ORNode } from "../types/NodeTypes"
import Position from "../types/Position"
import Component from "./Component"
import BBCollision from "../collision/BBCollision"

class NodeComponent extends Component {
    public readonly nodeType: NodeType
    private imageLoaded: boolean
    private nodeImage: HTMLImageElement
    private slotComponents: Array<number>
    declare protected collisionShape: BBCollision

    constructor(id: number, position: Position, nodeType: nodeTypes, canvasWidth: number, canvasHeight: number, slotKeys: Array<number>) {
        super(id, position)
        this.nodeType = NodeComponent.getNodeTypeObject(nodeType)
        this.slotComponents = slotKeys
        this.nodeImage = new Image()
        this.imageLoaded= false
        // Ideia/Workaround -> Mover a atribuição do src para o Editor, então seria possível atualizar os slots também?
        this.nodeImage.addEventListener('load', () => {
            // Centraliza a imagem no mouse - bug relacionado ao posicionamento dos slots
            // let halfImgPos = new Position(this.nodeImage.width/2, this.nodeImage.height/2)
            // this.position.minus(halfImgPos)
            let canvasBound = new Position(canvasWidth, canvasHeight)
            canvasBound.minus(new Position(this.nodeImage.width, this.nodeImage.height))
            this.position = this.position.inBounds(0, 0, canvasBound.y, canvasBound.x)
            this.collisionShape = new BBCollision(this.position, this.nodeImage.width, this.nodeImage.height)
            this.imageLoaded = true
        })
        this.nodeImage.src = this.nodeType.imgPath
    }

    static getNodeTypeObject(type: nodeTypes): NodeType {
        // Carrega o objeto do tipo de Node solicitado
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

    getSlotComponents() {
        return this.slotComponents
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

    setSlotId(slotId: number, index: number) {
        this.nodeType.connectionSlots[index].slotId = slotId
    }

    getConnectionSlots() {
        return this.nodeType.connectionSlots
    }
    
    getCollisionShape(): BBCollision {
        return this.collisionShape
    }

    draw(ctx: CanvasRenderingContext2D) {
        if (this.imageLoaded) {
            ctx.drawImage(this.nodeImage, this.position.x, this.position.y)
            if(this.collisionShape != undefined)
                this.collisionShape.draw(ctx, true)
        }
    }
}

export default NodeComponent