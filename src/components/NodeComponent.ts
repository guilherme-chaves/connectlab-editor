class NodeComponent extends Component {
    public readonly nodeType: NodeType
    private slotsStatus: Array<boolean>
    constructor(id: number, position: Position, nodeType: NodeType) {
        super(id, position)
        this.nodeType = nodeType
        this.slotsStatus = []
        this.nodeType.connectionSlots.forEach(() => {
            this.slotsStatus.push(false)
        })
    }

    draw(ctx: CanvasRenderingContext2D) {
        const nodeImg = new Image()
    }
}