import ComponentType from "../types";
import Position from "../types/Position";
import Component from "./Component";

class TextComponent extends Component {
    public text: string
    public parentNode: Component|null
    public style: string
    constructor(id: number, position: Position, text: string = "", style: string = "", parent: Component|null = null) {
        super(id, position, ComponentType.TEXT);
        this.text = text
        this.style = style
        this.parentNode = parent
    }

    draw(ctx: CanvasRenderingContext2D, style?: string) {
        // Ordem de prioridade (argumento -> objeto -> global)
        ctx.font = style ?? (this.style ?? ctx.font)
        // Caso possua um nó-pai, deve usar a posição relativa a ele
        if(this.parentNode != null){
            let pos = Position.add(this.parentNode.position, this.position)
            ctx.fillText(this.text, pos.x, pos.y) 
        } else {
            ctx.fillText(this.text, this.position.x, this.position.y) 
        }
    }
}

export default TextComponent