import Component from "../components/Component";
import ConnectionComponent from "../components/ConnectionComponent";
import NodeComponent from "../components/NodeComponent";
import { SlotComponent } from "../components/SlotComponent";
import TextComponent from "../components/TextComponent";

export function clearFrame(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.restore();
}

export function updateCanvas(ctx: CanvasRenderingContext2D, elements: Array<Component|NodeComponent|ConnectionComponent|TextComponent|SlotComponent>): any {
    clearFrame(ctx)
    elements.forEach(element => {
        element.draw(ctx)
    });
}

export function updateBackground(ctx: CanvasRenderingContext2D, bgPattern: CanvasPattern|null): any {
    clearFrame(ctx)
    ctx.rect(0, 0, ctx.canvas.width, ctx.canvas.height)
    ctx.fillStyle = bgPattern ?? "#ff0000"
    ctx.fill()
}

function updateAll(canvasCtx: CanvasRenderingContext2D, elements: Array<Component|NodeComponent|ConnectionComponent|TextComponent|SlotComponent>,
        bgCtx: CanvasRenderingContext2D|null, bgPattern: CanvasPattern|null): any {
    updateCanvas(canvasCtx, elements)
    if (bgCtx != null) {
        updateBackground(bgCtx, bgPattern)
    }
}

export default updateAll