import Editor from "../Editor";
import ComponentType, { nodeTypes } from "../types/types";
import Position from "../types/Position";

export default class EditorEvents {
    private static currentComponentType: ComponentType = ComponentType.NODE
    private static currentNodeType: nodeTypes = nodeTypes.NOT
    private static editingLine: boolean = false
    static addComponent(editor: Editor, ev: MouseEvent): void {
        let rect = editor.getContext(true).canvas.getBoundingClientRect()
        let mousePos = new Position(ev.clientX - rect.top, ev.clientY - rect.left)
        switch (this.currentComponentType) {
            case ComponentType.LINE:
                editor.line(mousePos.x, mousePos.y, mousePos.x, mousePos.y+200)
                this.editingLine = true
                break
            case ComponentType.NODE:
                editor.node(mousePos.x, mousePos.y, this.currentNodeType)
                break
            case ComponentType.TEXT:
                editor.text("Teste", mousePos.x, mousePos.y)
                break
            default:
                break
        }
    }
}