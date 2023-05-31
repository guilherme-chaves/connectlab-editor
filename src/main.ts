import './style.css'
import './types'
import Editor from './Editor.ts'

/* Obtem os elementos DOM dos dois canvas sobrepostos */
const canvas = <HTMLCanvasElement> document.getElementById("editor-canvas")
const bg = <HTMLCanvasElement> document.getElementById("editor-background")

const editor = new Editor("teste", canvas, bg)
editor.line(0, 0, 300, 400)
editor.text("Olá mundo", 500, 200, "32px sans-serif")

addEventListener("load", () => editor.resize())

/* Atualizar tamanho do canvas caso tamanho do navegador se altere */
addEventListener("resize", () => {
    editor.resize()
    editor.draw(true, true)
})
