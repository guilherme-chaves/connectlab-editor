import './types'
import bgTexturePath from './assets/bg-texture.svg'
import updateAll, { updateBackground, updateCanvas } from './canvasDraw'
import ComponentsList from './components/ComponentsList'
import ConnectionComponent from './components/ConnectionComponent'
import TextComponent from './components/TextComponent'
import NodeComponent from './components/NodeComponent'
import Line from './components/Line'
import Position from './types/Position'
import Component from './components/Component'

export default class Editor {
    private editorEnv: ComponentsList
    private canvasCtx: CanvasRenderingContext2D
    private backgroundCtx: CanvasRenderingContext2D

    private backgroundPattern: CanvasPattern|null
    constructor(documentId: string, canvasDOM: HTMLCanvasElement, backgroundDOM: HTMLCanvasElement) {
        this.editorEnv = new ComponentsList(documentId)
        this.canvasCtx = this.getContext(canvasDOM)
        this.backgroundCtx = this.getContext(backgroundDOM)
        this.backgroundPattern = null

        this.loadPattern(bgTexturePath)
    }

    getContext(domElement: HTMLCanvasElement): CanvasRenderingContext2D {
        return (domElement.getContext('2d')!)
    }

    loadPattern(bgPath: string) {
        let backgroundImg = new Image();
        backgroundImg.onload = () => {
            this.backgroundPattern = this.backgroundCtx.createPattern(backgroundImg, 'repeat')
        }
        backgroundImg.src = bgPath
    }

    draw(canvas: boolean = true, background: boolean = false) {
        if (canvas && background) {
            updateAll(this.canvasCtx, this.editorEnv.getComponents(), this.backgroundCtx, this.backgroundPattern)
        } else if (background) {
            updateBackground(this.backgroundCtx, this.backgroundPattern)
        } else if (canvas) {
            updateCanvas(this.canvasCtx, this.editorEnv.getComponents())
        }
    }

    resize() {
        this.canvasCtx.canvas.width = window.innerWidth * 0.75
        this.canvasCtx.canvas.height = window.innerHeight * 0.75
        this.backgroundCtx.canvas.width = window.innerWidth * 0.75
        this.backgroundCtx.canvas.height = window.innerHeight * 0.75
        requestAnimationFrame.bind(updateAll(this.canvasCtx, this.editorEnv.getComponents(), this.backgroundCtx, this.backgroundPattern))
    }

    node() {
        return
    }

    line(x1: number, y1: number, x2: number, y2: number, from?: NodeComponent, to?: NodeComponent) {
        let newLine = new ConnectionComponent(this.editorEnv.getLastComponentId(), new Line(new Position(x1, y1), new Position(x2, y2)), from, to)
        this.editorEnv.addComponent(newLine)
    }

    text(text: string, x: number, y: number, style?: string, parent?: Component) {
        let newText = new TextComponent(this.editorEnv.getLastComponentId(), new Position(x, y), text, style, parent)
        this.editorEnv.addComponent(newText)
    }
}