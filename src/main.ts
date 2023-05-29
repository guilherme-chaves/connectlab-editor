import './style.css'
import bgTexturePath from './assets/bg-texture.svg'
import './types.ts'
import updateAll from './canvasDraw.ts'

const canvasComponents : ComponentsList = {
    documentId: "1",
    lastComponentId: -1,
    components: []
}

const canvas = <HTMLCanvasElement> document.getElementById("editor-canvas")
const bg = <HTMLCanvasElement> document.getElementById("editor-background")


const bgCtx = bg.getContext("2d") ?? new CanvasRenderingContext2D()
const bgTexture = new Image();
bgTexture.onload = () => {
    var bgPattern = bgCtx.createPattern(bgTexture, "repeat")
    bgCtx.rect(0, 0, bg.width, bg.height)
    bgCtx.fillStyle = bgPattern ?? "#F0F0F0"
    bgCtx.fill()
}
bgTexture.src = bgTexturePath

const canvasCtx = canvas.getContext("2d") ?? new CanvasRenderingContext2D()
canvasCtx.moveTo(0, 0)
canvasCtx.lineTo(400,500)
canvasCtx.stroke()

// Define o tamanho do canvas como o tamanho em pixels da área interna do navegador
canvas.width = window.innerWidth
canvas.height = 0.9 * window.innerHeight // Número = Porcentagem da área que o canvas ocupa

bg.width = window.innerWidth
bg.height = 0.9 * window.innerHeight // Número = Porcentagem da área que o canvas ocupa

addEventListener("resize", () => {
    canvas.width = window.innerWidth
    canvas.height = 0.9 * window.innerHeight
    bg.width = window.innerWidth
    bg.height = 0.9 * window.innerHeight
    requestAnimationFrame(updateAll(canvas, canvasCtx, canvasComponents.components))
})
