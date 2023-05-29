class ComponentsListClass {
    private componentsList : ComponentsList
    constructor() {
        this.componentsList = {
            documentId: "",
            lastComponentId: -1,
            components: []
        }
    }

    /* Getters e Setters */
    getObject(): ComponentsList {
        return this.componentsList
    }

    getDocumentId(): String {
        return this.componentsList.documentId
    }

    getLastComponentId(): number {
        return this.componentsList.lastComponentId
    }

    getComponents(): Array<CanvasComponent> {
        return this.componentsList.components
    }

    setDocumentId(id: String): void {
        this.componentsList.documentId = id
    }

    setLastComponentId(id: number): void {
        this.componentsList.lastComponentId = id
    }

    addComponent(component: CanvasComponent): void {
        this.componentsList.components.push(component)
        this.componentsList.lastComponentId += 1
    }

    removeComponent(componentId: number): void {
        for(let i = 0; i < this.componentsList.components.length; i++)
            if (this.componentsList.components[i].id == componentId)
                this.componentsList.components.splice(i, 1)
    }
}