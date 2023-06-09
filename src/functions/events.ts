import Editor from "../Editor";
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

    private collisionList: collisionListInterface

    private mousePosition: Position // Posição dentro do canvas, não global
    private oldMousePosition: Position
    private mouseClicked: boolean

    constructor() {
        // this.currentComponentType = ComponentType.NODE
        // this.currentNodeType = nodeTypes.NOT

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
    }

    mouseDrag(editor: Editor, componentsList: ComponentsList) {
        if (connectionEvents.lineDrag(componentsList, this, this.mousePosition.minus(this.oldMousePosition)))
            return true

        if (this.mouseClicked) {
            return connectionEvents.addLine(editor, this) ? true :
            this.moveNode(componentsList, this.mousePosition.minus(this.oldMousePosition))
        }
        return false
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