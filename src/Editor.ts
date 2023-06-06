import ComponentType, { nodeTypes } from './types/types'
import bgTexturePath from './assets/bg-texture.svg'
import updateAll, { updateBackground, updateCanvas } from './functions/canvasDraw'
import ComponentsList from './components/ComponentsList'
import ConnectionComponent from './components/ConnectionComponent'
import TextComponent from './components/TextComponent'
import NodeComponent from './components/NodeComponent'
import Position from './types/Position'
import Component from './components/Component'
import SlotComponent from './components/SlotComponent'
import EditorEvents from './functions/events'

export default class Editor {
    // Lista de componentes
    private editorEnv: ComponentsList
    // Controle de eventos do canvas
    private editorEvents: EditorEvents
    // Contextos dos canvas
    private canvasCtx: CanvasRenderingContext2D
    private backgroundCtx: CanvasRenderingContext2D
    // Propriedades dos canvas
    private canvasArea: Position // [0, 1] dentro dos dois eixos, representa a porcentagem da tela a ser ocupada
    private backgroundPattern: CanvasPattern|null
    
    constructor(documentId: string, canvasDOM: HTMLCanvasElement, backgroundDOM: HTMLCanvasElement, canvasVw: number, canvasVh: number) {
        this.editorEnv = new ComponentsList(documentId)
        this.editorEvents = new EditorEvents()
        this.canvasCtx = this.createContext(canvasDOM)
        this.backgroundCtx = this.createContext(backgroundDOM)
        this.backgroundPattern = null
        this.canvasArea = new Position(canvasVw, canvasVh, true)
        this.loadPattern(bgTexturePath)
    }

    // static loadFile(jsonData): Editor

    // saveToFile()

    private createContext(domElement: HTMLCanvasElement): CanvasRenderingContext2D {
        return (domElement.getContext('2d')!)
    }

    getEnviroment(): ComponentsList {
        return this.editorEnv
    }

    getContext(canvas: boolean = true): CanvasRenderingContext2D {
        if (canvas)
            return this.canvasCtx
        return this.backgroundCtx
    }

    loadPattern(bgPath: string) {
        let backgroundImg = new Image()
        backgroundImg.onload = () => {
            this.backgroundPattern = this.backgroundCtx.createPattern(backgroundImg, 'repeat')
        }
        backgroundImg.src = bgPath
    }

    draw(canvas: boolean = true, background: boolean = false) {
        if (background) 
            updateBackground(this.backgroundCtx, this.backgroundPattern)
        if (canvas)
            updateCanvas(this.canvasCtx, this.editorEnv.getComponents())
    }

    update = () => {
        requestAnimationFrame(this.update)
        this.draw(true)
        // this.checkConnections()
        // this.checkCollisions()
        // To-Do -> Adicionar as seguintes partes:
        // eventos e adição de componentes
        // colisão(this.editorEnv)
    }

    move = () => {
        this.editorEvents.mouseDrag(this, this.editorEnv)
    }

    onclick = () => {
        this.editorEvents.mouseClick(this.editorEnv)
    }

    ondrag = () => {
        
    }

    resize = () => {
        this.canvasCtx.canvas.width = window.innerWidth * this.canvasArea.x
        this.canvasCtx.canvas.height = window.innerHeight * this.canvasArea.y
        this.backgroundCtx.canvas.width = window.innerWidth * this.canvasArea.x
        this.backgroundCtx.canvas.height = window.innerHeight * this.canvasArea.y
        requestAnimationFrame.bind(updateAll(this.canvasCtx, this.editorEnv.getComponents(), this.backgroundCtx, this.backgroundPattern))
    }

    node(x: number = this.editorEvents.getMousePosition().x, y: number = this.editorEvents.getMousePosition().y, type: nodeTypes= nodeTypes.NOT) {
        let slotKeys: Array<number> = []
        let newNode = new NodeComponent(this.editorEnv.getLastComponentId(), new Position(x, y), type, this.canvasCtx.canvas.width, this.canvasCtx.canvas.height, slotKeys)
        let newNodeId = this.editorEnv.addComponent(newNode)
        NodeComponent.getNodeTypeObject(type).connectionSlots.forEach(slot => {
            let key = this.slot(slot.localPos.x, slot.localPos.y, ComponentType.NODE, newNodeId, new Position(x, y), slot.in)
            slotKeys.push(key)
        })
        this.editorEnv.getComponents().nodes[newNodeId].addSlotComponents(slotKeys)
        return newNodeId
    }

    line(x1: number, y1: number, from?: SlotComponent|TextComponent, to?: SlotComponent|TextComponent) {
        let start = undefined
        let end = undefined
        if (from != undefined)
            start = {type: from.type, id: from.id}
        if (to != undefined)
            end = {type: to.type, id: to.id}
        let newLine = new ConnectionComponent(this.editorEnv.getLastComponentId(), new Position(x1, y1), new Position(x1, y1), {start, end})
        return this.editorEnv.addComponent(newLine)
    }

    text(text: string, x: number, y: number, style?: string, parent?: Component) {
        let newText = new TextComponent(this.editorEnv.getLastComponentId(), new Position(x, y), text, style, parent)
        return this.editorEnv.addComponent(newText)
    }

    slot(x: number, y: number, parentType: ComponentType, parentId: number, parentPosition: Position, inSlot?: boolean, radius?: number,
            attractionRadius?: number, color?: string, colorActive?: string) {
        let newSlot = new SlotComponent(this.editorEnv.getLastComponentId(), new Position(x, y), parentType, parentId, parentPosition,
            inSlot, radius, attractionRadius, color, colorActive)
        return this.editorEnv.addComponent(newSlot)
    }

    setMousePosition(clientX: number, clientY: number) {
        let rect = this.canvasCtx.canvas.getBoundingClientRect()
        this.editorEvents.setMousePosition(new Position(clientX - rect.left, clientY - rect.top))
    }

    getMousePosition() {
        return this.editorEvents.getMousePosition()
    }

    setMouseClicked(state: boolean) {
        this.editorEvents.setMouseClicked(state)
    }

    clearCollision(onlyDragCollisions: boolean = true) {
        if (onlyDragCollisions) 
            this.editorEvents.clearDragCollisions()
    }
}