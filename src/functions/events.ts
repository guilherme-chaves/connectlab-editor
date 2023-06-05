import Editor from "../Editor";
// import ComponentType, { nodeTypes } from "../types/types";
import Position from "../types/Position";
import ComponentsList from "../components/ComponentsList";

interface collisionListInterface {
    [index: string]: Array<number>|undefined,
    "nodes": Array<number>|undefined,
    "slots": Array<number>|undefined,
    "connections": Array<number>|undefined,
    "texts": Array<number>|undefined,
}

export default class EditorEvents {
    // private currentComponentType: ComponentType
    // private currentNodeType: nodeTypes
    private editingLineId: number
    private editingLine: boolean
    private collisionList: collisionListInterface
    private mousePosition: Position // Posição dentro do canvas, não global
    private oldMousePosition: Position
    private mouseClicked: boolean

    constructor() {
        // this.currentComponentType = ComponentType.NODE
        // this.currentNodeType = nodeTypes.NOT
        this.editingLineId = -1
        this.editingLine = false
        this.collisionList = {
            "nodes": undefined,
            "slots": undefined,
            "connections": undefined,
            "texts": undefined
        }
        this.mousePosition = new Position(0, 0)
        this.oldMousePosition = this.mousePosition
        this.mouseClicked = false
    }

    // addComponent(editor: Editor, clientX?: number, clientY?: number): void {
    //     if (this.editingLine)
    //         return
    //     switch (this.currentComponentType) {
    //         case ComponentType.LINE:
    //             editor.line(this.mousePosition.x, this.mousePosition.y, this.mousePosition.x, this.mousePosition.y+200)
    //             this.editingLine = true
    //             break
    //         case ComponentType.NODE:
    //             editor.node(this.mousePosition.x, this.mousePosition.y, this.currentNodeType)
    //             break
    //         case ComponentType.TEXT:
    //             editor.text("Teste", this.mousePosition.x, this.mousePosition.y,)
    //             break
    //         default:
    //             break
    //     }
    // }

    getMousePosition(): Position {
        return this.mousePosition
    }

    setMousePosition(position: Position) {
        this.oldMousePosition = this.mousePosition
        this.mousePosition = position
    }

    mouseClick(componentsList: ComponentsList) {
        // Obtêm uma lista com todas as colisões encontradas
        let collisions: collisionListInterface = {
            "nodes": this.checkNodeClick(componentsList),
            "slots": this.checkSlotClick(componentsList),
            "connections": undefined,
            "texts": undefined
        }
        //console.log(collisions)

        // Escrever aqui ou chamar outras funções que tratem o que cada tipo de colisão encontrada deve responder
        if(collisions.slots) {
            collisions.slots.forEach(slot => {
                componentsList.getComponents().slots[slot].setState(true)
            })
        }

        if(this.editingLine) {
            componentsList.getComponents().connections[this.editingLineId].position
            this.editingLine = false
        }
        this.clearUnselectedComponents(componentsList, collisions)
        this.collisionList = collisions
    }

    // Busca na lista de nodes quais possuem uma colisão com o ponto do mouse
    checkNodeClick(componentsList: ComponentsList): number[] | undefined {
        let collided = false
        let collidedWith = new Array<number>
        Object.keys(componentsList.getComponents()['nodes']).forEach((key) => {
            let keyN = parseInt(key)
            let collision = componentsList.getComponents()['nodes'][keyN].getCollisionShape().collisionWithPoint(this.mousePosition)
            if (collision)
                collidedWith.push(keyN)
            collided = collided || collision
        })
        return collided ? collidedWith : undefined
    }

    // Busca na lista de slots quais possuem uma colisão com o ponto do mouse
    checkSlotClick(componentsList: ComponentsList): number[] | undefined {
        let collided = false
        let collidedWith = new Array<number>
        Object.keys(componentsList.getComponents()['slots']).forEach((key) => {
            let keyN = parseInt(key)
            let collision = componentsList.getComponents()['slots'][keyN].getCollisionShape().collisionWithPoint(this.mousePosition)
            if (collision)
                collidedWith.push(keyN)
            collided = collided || collision
        })
        return collided ? collidedWith : undefined
    }

    // Busca na lista de conexões quais possuem uma colisão com o ponto do mouse
    checkConnectionClick(editor: Editor) {
        // Cada linha da conexão possui um BB ou OBB, então precisa passar por um loop no array de malhas de colisão
    }

    // Busca na lista de textos quais possuem uma colisão com o ponto do mouse
    checkTextClick(editor: Editor) {

    }

    mouseDrag(editor: Editor, componentsList: ComponentsList) {
        if (this.mouseClicked) {
            this.addLine(editor) ? true :
            this.moveNode(componentsList, this.mousePosition.minus(this.oldMousePosition))
            
        }
        if (this.editingLine) {
            editor.getEnviroment().getComponents().connections[this.editingLineId].changePosition(this.mousePosition.minus(this.oldMousePosition))
        }
    }

    moveNode(componentsList: ComponentsList, delta: Position): boolean {
        if(this.collisionList.nodes != undefined) {
            let key = Object.values(this.collisionList.nodes)[0]
            componentsList.getComponents().nodes[key].changePosition(delta)
            componentsList.getComponents().nodes[key].getCollisionShape().moveShape(delta)
            componentsList.getComponents().nodes[key].getSlotComponents().forEach(slotKey => {
                componentsList.getComponents().slots[slotKey].setParentPosition(componentsList.getComponents().nodes[key].position)
                componentsList.getComponents().slots[slotKey].getCollisionShape().moveShape(delta)
            });
            return true
        }
        return false
    }

    addLine(editor: Editor): boolean {
        if (this.editingLine)
            return true
        if (this.collisionList.slots != undefined) {
            let key = Object.values(this.collisionList.slots)[0]
            let slotPos = editor.getEnviroment().getComponents().slots[key].position.add(editor.getEnviroment().getComponents().slots[key].getParentPosition())
            this.editingLine = true
            this.editingLineId = editor.line(slotPos.x, slotPos.y)
            console.log(this.editingLineId)
            return true
        }
        return false
    }

    getEditingLine() {
        return this.editingLine
    }

    setEditingLine(state: boolean) {
        this.editingLine = state
    }

    // Define a posição da linha flutuante (no processo de criação de linhas), caso o usuário clique no canvas, finaliza o processo
    setLinePoint(componentsList: ComponentsList) {
        if (this.editingLine) {
            componentsList.getComponents().connections[this.editingLineId].changePosition(this.mousePosition.minus(this.oldMousePosition))
        }
    }

    // Procura na lista anterior de colisões as que não estão presentes na atual, removendo seu estado de selecionado/ativo
    clearUnselectedComponents = (componentsList: ComponentsList, newCollisionList: Object): void => {
        if(this.collisionList["slots"]) {
            this.collisionList["slots"].forEach(slot => {
                if (!(Object.prototype.hasOwnProperty.call(newCollisionList, slot))) {
                    componentsList.getComponents().slots[slot].setState(false)
                }
            })
        }
    }

    clearDragCollisions = () => {
        this.collisionList = {
            "nodes": undefined,
            "slots": this.collisionList.slots,
            "connections": this.collisionList.connections,
            "texts": this.collisionList.texts
        }
    }

    setMouseClicked(state: boolean = false) {
        this.mouseClicked = state
    }
}