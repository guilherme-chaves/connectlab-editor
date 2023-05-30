import Component from "./components/Component";
import ConnectionComponent from "./components/ConnectionComponent";
import NodeComponent from "./components/NodeComponent";
import TextComponent from "./components/TextComponent";

function updateCanvas(ctx: CanvasRenderingContext2D, elements: Array<Component|NodeComponent|ConnectionComponent|TextComponent>): any {
    elements.forEach(element => {
        element.draw(ctx)
    });
}

function updateBackground(bgCanvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, bgTexture: HTMLImageElement): any {
    if (ctx != null) {
        var bgPattern = ctx.createPattern(bgTexture, "repeat")
        ctx.rect(0, 0, bgCanvas.width, bgCanvas.height)
        ctx.fillStyle = bgPattern ?? "#F0F0F0"
        ctx.fill()
    }
}

function updateAll(canvasCtx: CanvasRenderingContext2D, elements: Array<Component|NodeComponent|ConnectionComponent|TextComponent>,
        bgCanvas: HTMLCanvasElement, bgCtx: CanvasRenderingContext2D|null, bgTexture: HTMLImageElement): any {
    updateCanvas(canvasCtx, elements)
    if (bgCtx != null) {
        updateBackground(bgCanvas, bgCtx, bgTexture)
    }
}

export default updateAll