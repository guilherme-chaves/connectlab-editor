import Editor from "../Editor";
import ComponentType, { nodeTypes } from "../types/types";
import Position from "../types/Position";
import ConnectionComponent from "../components/ConnectionComponent";

export default class EditorEvents {
    private static currentComponentType: ComponentType = ComponentType.NODE
    private static currentNodeType: nodeTypes = nodeTypes.NOT
    private static editingLine: boolean = false
    static addComponent(editor: Editor, clientX: number, clientY: number): void {
        if (this.editingLine)
            return
        let rect = editor.getContext(true).canvas.getBoundingClientRect()
        let mousePos = new Position(clientX - rect.top,clientY - rect.left)
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

    static setLinePoint(connection: ConnectionComponent) {
        if (this.editingLine) {
            
        }
    }
}