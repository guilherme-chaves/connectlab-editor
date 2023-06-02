import { componentListInterface } from "../types/types";

// Limpa o canvas antes de desenhar um novo quadro
export function clearFrame(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.restore();
}

export function updateCanvas(ctx: CanvasRenderingContext2D, elements: componentListInterface): any {
    clearFrame(ctx)
    Object.keys(elements).forEach(keyCateg => {
        Object.keys(elements[keyCateg]).forEach(element => {
            elements[keyCateg][parseInt(element)].draw(ctx)
        })
    })
}

export function updateBackground(ctx: CanvasRenderingContext2D, bgPattern: CanvasPattern|null): any {
    clearFrame(ctx)
    ctx.rect(0, 0, ctx.canvas.width, ctx.canvas.height)
    ctx.fillStyle = bgPattern ?? "#ff0000"
    ctx.fill()
}

function updateAll(canvasCtx: CanvasRenderingContext2D, elements: componentListInterface,
        bgCtx: CanvasRenderingContext2D|null, bgPattern: CanvasPattern|null): any {
    updateCanvas(canvasCtx, elements)
    if (bgCtx != null) {
        updateBackground(bgCtx, bgPattern)
    }
}

export default updateAll