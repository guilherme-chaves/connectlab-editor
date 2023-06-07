import Editor from "../Editor";
import ComponentType from "../types/types";
import Position from "../types/Position";
import ComponentsList from "../components/ComponentsList";
import connectionEvents from "./connectionEvents";

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

    mouseClick(componentsList: ComponentsList) {
        // Obtêm uma lista com todas as colisões encontradas
        let collisions: collisionListInterface = {
            "nodes": this.checkNodeClick(componentsList),
            "slots": this.checkSlotClick(componentsList),
            "connections": connectionEvents.checkConnectionClick(componentsList),
            "texts": undefined
        }
        // Escrever aqui ou chamar outras funções que tratem o que cada tipo de colisão encontrada deve responder
        if(collisions.slots) {
            collisions.slots.forEach(slot => {
                componentsList.getComponents().slots[slot].setState(true)
            })
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

    // Busca na lista de textos quais possuem uma colisão com o ponto do mouse
    checkTextClick(editor: Editor) {

    }

    mouseRelease(componentsList: ComponentsList) {
        connectionEvents.fixLine(componentsList, this)
        // if (this.editingLine) {
        //     let res = this.bindConnection(componentsList)
        //     if (componentsList.getComponents().connections[this.editingLineId].connectedTo.end == undefined)
        //         delete componentsList.getComponents().connections[this.editingLineId]
        //     else if (componentsList.getComponents().connections[this.editingLineId].connectedTo.end?.id != null) {
        //         if (componentsList.getComponents().slots[componentsList.getComponents().connections[this.editingLineId].connectedTo.end?.id ?? 1].getConnectionId() != this.editingLineId) {
        //             delete componentsList.getComponents().connections[this.editingLineId]
        //         }
        //     }
        //     // if (componentsList.getComponents()["slots"][res.slotCollided].getConnectionId() != -1 && componentsList.getComponents()["slots"][res.slotCollided].getConnectionId() != this.editingLineId)
        //     //     delete componentsList.getComponents()["connections"][componentsList.getComponents()["slots"][res.slotCollided].getConnectionId()]
        //     // if (!res.collisionPos.equals(new Position(-1, -1))) {
        //     //     componentsList.getComponents()["connections"][this.editingLineId].changePosition(res.collisionPos, 1, false)
        //     //     componentsList.getComponents()["slots"][res.slotCollided].setConnectionId(this.editingLineId)
        //     // }
        //     this.editingLine = false
        //     this.editingLineId = -1
        // }
    }

    mouseDrag(editor: Editor, componentsList: ComponentsList) {
        if (connectionEvents.lineDrag(componentsList, this, this.mousePosition.minus(this.oldMousePosition)))
            return true
        // if (this.editingLine && this.editingLineId != -1) {
        //     editor.getEnviroment().getComponents().connections[this.editingLineId].changePosition(this.mousePosition.minus(this.oldMousePosition), 1, true)
        //     this.bindConnection(componentsList)
        //     return true
        // }

        if (this.mouseClicked) {
            return connectionEvents.addLine(editor, this) ? true :
            this.moveNode(componentsList, this.mousePosition.minus(this.oldMousePosition))
        }
        return false
    }

    bindConnection(componentsList: ComponentsList) {
        let collisionPos = new Position(-1, -1)
        let oldConnection = -1
        let slotCollided = -1
        if (this.editingLine && this.editingLineId != -1) {
            for (let key in componentsList.getComponents()["slots"]) {
                let nKey = parseInt(key)
                if (nKey != componentsList.getComponents()["connections"][this.editingLineId].connectedTo.start?.id) {
                    if (componentsList.getComponents()["slots"][nKey].getCollisionShape().collisionWithPoint(this.mousePosition)) {
                        collisionPos = componentsList.getComponents()["slots"][nKey].position.add(componentsList.getComponents()["slots"][nKey].getParentPosition())
                        componentsList.getComponents()["connections"][this.editingLineId].changeConnection(nKey, ComponentType.SLOT, true)
                        slotCollided = nKey
                        oldConnection = componentsList.getComponents()["slots"][nKey].getConnectionId()
                        // componentsList.getComponents()["slots"][nKey].setConnectionId(this.editingLineId)
                        break
                    }
                }
                //
                componentsList.getComponents()["connections"][this.editingLineId].changeConnection(undefined, undefined, true)
                let currentConnection = componentsList.getComponents()["slots"][nKey].getConnectionId()
                if (currentConnection == this.editingLineId)
                    componentsList.getComponents()["slots"][nKey].setConnectionId(-1)
            }
        }
        if (!collisionPos.equals(new Position(-1, -1))) {
            if (componentsList.getComponents()["slots"][slotCollided].getConnectionId() != -1 && componentsList.getComponents()["slots"][slotCollided].getConnectionId() != this.editingLineId)
                delete componentsList.getComponents()["connections"][componentsList.getComponents()["slots"][slotCollided].getConnectionId()]
            componentsList.getComponents()["connections"][this.editingLineId].changePosition(collisionPos, 1, false)
            componentsList.getComponents()["slots"][slotCollided].setConnectionId(this.editingLineId)
        }
        return {slotCollided, collisionPos}
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
            this.editingLineId = editor.line(slotPos.x, slotPos.y, editor.getEnviroment().getComponents().slots[key])
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
            componentsList.getComponents().connections[this.editingLineId].changePosition(this.mousePosition.minus(this.oldMousePosition), 1)
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

    getCollisionList() {
        return this.collisionList
    }

    clearDragCollisions = () => {
        this.collisionList = {
            "nodes": undefined,
            "slots": this.collisionList.slots,
            "connections": this.collisionList.connections,
            "texts": this.collisionList.texts
        }
    }

    getMousePosition(): Position {
        return this.mousePosition
    }

    setMousePosition(position: Position) {
        this.oldMousePosition = this.mousePosition
        this.mousePosition = position
    }

    setMouseClicked(state: boolean = false) {
        this.mouseClicked = state           
    }
}