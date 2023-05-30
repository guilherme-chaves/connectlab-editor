import './style.css'
import bgTexturePath from './assets/bg-texture.svg'
import './types'
import updateAll from './canvasDraw.ts'
import ComponentsList from './components/ComponentsList.ts'
import ConnectionComponent from './components/ConnectionComponent.ts'
import Line from './components/Line.ts'
import Position from './types/Position.ts'

/* Objeto contendo todos os elementos a serem desenhados dentro do canvas,
    o identificador do documento e o último identificador indexado
*/
const list = new ComponentsList("teste")

/* Obtem os elementos DOM dos dois canvas sobrepostos */
const canvas = <HTMLCanvasElement> document.getElementById("editor-canvas")
const bg = <HTMLCanvasElement> document.getElementById("editor-background")

/* Obtem o contexto do plano de fundo, 
    carrega textura e a exibe repete dentro do espaço
    (Caso textura não possa ser carregada exibe fundo de cor) */
const bgCtx = bg.getContext("2d") ?? new CanvasRenderingContext2D()
const bgTexture = new Image();
bgTexture.onload = () => {
    var bgPattern = bgCtx.createPattern(bgTexture, "repeat")
    bgCtx.rect(0, 0, bg.width, bg.height)
    bgCtx.fillStyle = bgPattern ?? "#F0F0F0"
    bgCtx.fill()
}
bgTexture.src = bgTexturePath

/* Carrega contexto do canvas principal */
const canvasCtx = canvas.getContext("2d") ?? new CanvasRenderingContext2D()
// canvasCtx.moveTo(0, 0)
// canvasCtx.lineTo(400,500)
// canvasCtx.stroke()
let newLine = new ConnectionComponent(list.getLastComponentId(), new Line(new Position(0, 0), new Position(200, 200)))
list.addComponent(newLine)

// Define o tamanho do canvas como a área em pixels da área interna do navegador
canvas.width = window.innerWidth
canvas.height = 0.9 * window.innerHeight // Número = Porcentagem da área que o canvas ocupa

bg.width = window.innerWidth
bg.height = 0.9 * window.innerHeight // Número = Porcentagem da área que o canvas ocupa


/* Atualizar tamanho do canvas caso tamanho do navegador se altere */
addEventListener("resize", () => {
    canvas.width = window.innerWidth
    canvas.height = 0.9 * window.innerHeight
    bg.width = window.innerWidth
    bg.height = 0.9 * window.innerHeight
    requestAnimationFrame(updateAll(canvas, canvasCtx, list.getComponents()))
})
