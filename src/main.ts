import './style.css'
import './types/types.ts'
import Editor from './Editor.ts'

/* Obtem os elementos DOM dos dois canvas sobrepostos */
const canvas = <HTMLCanvasElement> document.getElementById("editor-canvas")
const bg = <HTMLCanvasElement> document.getElementById("editor-background")

const editor = new Editor("teste", canvas, bg)
editor.line(0, 0, 300, 400)
editor.text("Olá mundo", 500, 200, "32px sans-serif")

addEventListener("load", () => {
    editor.resize()
    editor.draw(true, true)
})

/* Atualizar tamanho do canvas caso tamanho do navegador se altere */
addEventListener("resize", () => {
    editor.resize()
    editor.draw(true, true)
})

canvas.addEventListener("click", (ev) => {
    var rect = canvas.getBoundingClientRect()
    editor.node(ev.clientX - rect.top, ev.clientY - rect.left)
})
