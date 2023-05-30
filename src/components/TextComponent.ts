class TextComponent extends Component {
    public text: string
    public parentNode?: Component
    constructor(id: number, position: Position, text: string = "", parent?: Component) {
        // Caso possua um nó-pai, deve usar a posição relativa a ele?
        super(id, position, ComponentType.TEXT);
        this.text = text
        this.parentNode = parent
    }

    draw(ctx: CanvasRenderingContext2D, style?: string) {
        ctx.font = style ?? ctx.font
        ctx.fillText(this.text, this.position.x, this.position.y)
    }
}