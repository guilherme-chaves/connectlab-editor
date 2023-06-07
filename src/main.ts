import './style.css'
import Editor from './Editor'

/* Obtem os elementos DOM dos dois canvas sobrepostos */
const canvas = <HTMLCanvasElement> document.getElementById("editor-canvas")
const bg = <HTMLCanvasElement> document.getElementById("editor-background")

const editor = new Editor("teste", canvas, bg, 0.75, 0.8)
editor.text("Olá mundo", 500, 200, "32px sans-serif")

addEventListener("load", () => {
    editor.resize()
    editor.update()
})

/* Atualizar tamanho do canvas caso tamanho do navegador se altere */
addEventListener("resize", () => {
    editor.resize()
})

canvas.addEventListener("mousedown", () => {
    editor.setMouseClicked(true)
})

canvas.addEventListener("mouseup", () => {
    editor.setMouseClicked(false)
    editor.mouseReleased()
    editor.clearCollision()
})

canvas.addEventListener("mouseout", () => {
    editor.setMouseClicked(false)
})

addEventListener("mousemove", ({clientX, clientY}) => {
    editor.move()
    editor.setMousePosition(clientX, clientY)
})

canvas.addEventListener("click", () => {
    editor.onclick()
})

addEventListener('keypress', () => {
    editor.node()
})