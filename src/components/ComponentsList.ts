import Component from "./Component"
import ConnectionComponent from "./ConnectionComponent"
import NodeComponent from "./NodeComponent"
import { SlotComponent } from "./SlotComponent"
import TextComponent from "./TextComponent"

class ComponentsList {
    public readonly documentId: string
    public lastComponentId: number
    private componentsList: Array<Component|NodeComponent|ConnectionComponent|TextComponent|SlotComponent>
    constructor(documentId: string, lastComponentId: number = 0, componentsList: Array<Component|NodeComponent|ConnectionComponent|TextComponent|SlotComponent> = []) {
        this.documentId = documentId
        this.lastComponentId = lastComponentId
        this.componentsList = componentsList
    }

    /* Getters e Setters */

    getDocumentId(): string {
        return this.documentId
    }

    getLastComponentId(): number {
        return this.lastComponentId
    }

    getComponents() {
        return this.componentsList
    }

    setLastComponentId(id: number): void {
        this.lastComponentId = id
    }

    addComponent(component: Component): void {
        this.componentsList.push(component)
        this.lastComponentId += 1
    }

    removeComponent(componentId: number = this.componentsList.length - 1): void {
        if(componentId == this.componentsList.length - 1) {
            this.componentsList.pop()
            return
        }
        for(let i = 0; i < this.componentsList.length; i++)
            if (this.componentsList[i].id == componentId)
                this.componentsList.splice(i, 1)
    }
}
 export default ComponentsList