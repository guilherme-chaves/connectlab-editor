import Editor from "../Editor";
import ComponentsList from "../components/ComponentsList";
import Position from "../types/Position";
import ComponentType from "../types/types";
import EditorEvents from "./events";

export default {
    editingLineId: -1,
    editingLine: false,
    oldSlotCollision: -1,
    slotCollision: -1,
    // Busca na lista de conexões quais possuem uma colisão com o ponto do mouse
    checkConnectionClick(componentsList: ComponentsList) {
        // Cada linha da conexão possui um BB ou OBB, então precisa passar por um loop no array de malhas de colisão
        return undefined
    },
    addLine(editor: Editor, eventsObject: EditorEvents) {
        if (this.editingLine)
            return
        let slotCollisions = eventsObject.getCollisionList().slots
        if (slotCollisions != undefined) {
            let key = Object.values(slotCollisions)[0]
            let slot = editor.getEnviroment().getComponents().slots[key]
            let slotPosition = slot.position.add(slot.getParentPosition())
            this.editingLineId = editor.line(slotPosition.x, slotPosition.y, {type: ComponentType.SLOT, id: key})
            this.editingLine = true
            return true
        } else {
            this.slotCollision = -1
        }
        return false
    },
    lineDrag(componentsList: ComponentsList, eventsObject: EditorEvents, mouseDelta: Position) {
        if (this.editingLine && this.editingLineId != -1) {
            componentsList.getComponents().connections[this.editingLineId].changePosition(mouseDelta, 1, true)
            this.bindConnection(componentsList, eventsObject)
            return true
        }
        return false
    },
    fixLine(componentsList: ComponentsList, eventsObject: EditorEvents) {
        if (this.editingLine && this.editingLineId != -1) {
            if (this.slotCollision != -1) {
                let actualSlot = eventsObject.checkSlotClick(componentsList)
                if (actualSlot != undefined) {
                    let actualSlotConnection = componentsList.getComponents().slots[actualSlot[0]].getConnectionId()
                    // Se já existir uma conexão feita com esse slot, remove-a antes de adicionar a nova
                    if (actualSlotConnection != this.editingLineId)
                        delete componentsList.getComponents().connections[actualSlotConnection]
                }
                componentsList.getComponents().connections[this.editingLineId].changeConnection(this.slotCollision, ComponentType.SLOT, true)
                componentsList.getComponents().slots[this.slotCollision].setConnectionId(this.editingLineId)
            } else {
                delete componentsList.getComponents().connections[this.editingLineId]
            }
            this.editingLine = false
            this.editingLineId = -1
        }
    },
    bindConnection(componentsList: ComponentsList, eventsObject: EditorEvents) {
        if (this.editingLine && this.editingLineId != -1) {
            let slotCollided = eventsObject.checkSlotClick(componentsList)
            if (slotCollided != undefined) {
                // Evitar colisões com o slot de onde a linha se origina
                if (componentsList.getComponents().connections[this.editingLineId].connectedTo.start?.id != slotCollided[0]) {
                    let collisionWith = componentsList.getComponents().slots[slotCollided[0]]
                    this.oldSlotCollision = this.slotCollision
                    this.slotCollision = slotCollided[0]
                    // A posição do slot é relativa ao seu componente-pai
                    let collisionPos = collisionWith.position.add(collisionWith.getParentPosition())
                    // Fixa a posição da linha para o slot
                    componentsList.getComponents().connections[this.editingLineId].endPosition = collisionPos
                    // Define a conexão do slot para a linha atual
                    // componentsList.getComponents().slots[slotCollided[0]].setConnectionId(this.editingLineId)
                }
            } else if (this.slotCollision != -1) {
                componentsList.getComponents().slots[this.slotCollision].setConnectionId(-1)
            }
        }
    }
}