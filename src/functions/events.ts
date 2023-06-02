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
        let collisions: collisionListInterface = {
            "nodes": this.checkNodeClick(componentsList),
            "slots": this.checkSlotClick(componentsList),
            "connections": undefined,
            "texts": undefined
        }

        if(collisions.slots) {
            collisions.slots.forEach(slot => {
                componentsList.getComponents().slots[slot].setState(true)
            })
        }
        this.clearUnselectedComponents(componentsList, collisions)
        this.collisionList = collisions
    }

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

    checkConnectionClick(editor: Editor) {

    }

    checkTextClick(editor: Editor) {

    }

    getEditingLine() {
        return this.editingLine
    }

    setEditingLine(state: boolean) {
        this.editingLine = state
    }

    setLinePoint(componentsList: ComponentsList, clickEv: boolean) {
        if (this.editingLine) {
            componentsList.getComponents().connections[this.editingLineId].changePosition(this.mousePosition.minus(this.oldMousePosition))
                if(clickEv)
                    this.editingLine = false
        }
    }

    clearUnselectedComponents = (componentsList: ComponentsList, newCollisionList: Object): void => {
        if(this.collisionList["slots"]) {
            this.collisionList["slots"].forEach(slot => {
                if (!(Object.prototype.hasOwnProperty.call(newCollisionList, slot))) {
                    componentsList.getComponents().slots[slot].setState(false)
                }
            })
        }
    }
}