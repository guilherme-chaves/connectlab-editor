import './types/types'
import bgTexturePath from './assets/bg-texture.svg'
import updateAll, { updateBackground, updateCanvas } from './functions/canvasDraw'
import ComponentsList from './components/ComponentsList'
import ConnectionComponent from './components/ConnectionComponent'
import TextComponent from './components/TextComponent'
import NodeComponent from './components/NodeComponent'
import Position from './types/Position'
import Component from './components/Component'
import { nodeTypes } from './types/types'
import { SlotComponent } from './components/SlotComponent'

export default class Editor {
    private editorEnv: ComponentsList
    private canvasCtx: CanvasRenderingContext2D
    private backgroundCtx: CanvasRenderingContext2D
    private canvasArea: Position // [0, 1] dentro dos dois eixos, representa a porcentagem da tela a ser ocupada

    private backgroundPattern: CanvasPattern|null
    constructor(documentId: string, canvasDOM: HTMLCanvasElement, backgroundDOM: HTMLCanvasElement, canvasVw: number, canvasVh: number) {
        this.editorEnv = new ComponentsList(documentId)
        this.canvasCtx = this.createContext(canvasDOM)
        this.backgroundCtx = this.createContext(backgroundDOM)
        this.backgroundPattern = null
        this.canvasArea = new Position(canvasVw, canvasVh)
        this.loadPattern(bgTexturePath)
    }

    // loadFile(jsonData)

    // createEnviroment(constructor args) ?

    // saveToFile()

    private createContext(domElement: HTMLCanvasElement): CanvasRenderingContext2D {
        return (domElement.getContext('2d')!)
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
        // To-Do -> Adicionar as seguintes partes:
        // eventos e adição de componentes
        // colisão
    }

    resize = () => {
        this.canvasCtx.canvas.width = window.innerWidth * this.canvasArea.x
        this.canvasCtx.canvas.height = window.innerHeight * this.canvasArea.y
        this.backgroundCtx.canvas.width = window.innerWidth * this.canvasArea.x
        this.backgroundCtx.canvas.height = window.innerHeight * this.canvasArea.y
        requestAnimationFrame.bind(updateAll(this.canvasCtx, this.editorEnv.getComponents(), this.backgroundCtx, this.backgroundPattern))
    }

    node(x: number, y: number, type: nodeTypes= nodeTypes.NOT) {
        let newNode = new NodeComponent(this.editorEnv.getLastComponentId(), new Position(x, y), type, this.canvasCtx.canvas.width, this.canvasCtx.canvas.height)
        this.editorEnv.addComponent(newNode)
    }

    line(x1: number, y1: number, x2: number, y2: number, from?: NodeComponent, to?: NodeComponent) {
        let newLine = new ConnectionComponent(this.editorEnv.getLastComponentId(), new Position(x1, y1), from, to)
        newLine.changePosition(Position.minus(new Position(x2, y2), newLine.position), 1)
        this.editorEnv.addComponent(newLine)
    }

    text(text: string, x: number, y: number, style?: string, parent?: Component) {
        let newText = new TextComponent(this.editorEnv.getLastComponentId(), new Position(x, y), text, style, parent)
        this.editorEnv.addComponent(newText)
    }

    slot(x: number, y: number, parent: Component, inSlot?: boolean, color?: string, colorActive?: string) {
        let newSlot = new SlotComponent(this.editorEnv.getLastComponentId(), new Position(x, y), parent, inSlot, color, colorActive)
        this.editorEnv.addComponent(newSlot)
    }
}