import {componentListInterface} from '../types/types';

// Limpa o canvas antes de desenhar um novo quadro
export function clearFrame(ctx: CanvasRenderingContext2D) {
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.restore();
}

export function updateCanvas(
  ctx: CanvasRenderingContext2D,
  elements: componentListInterface
) {
  clearFrame(ctx);
  const drawOrder = ['connections', 'nodes', 'slots', 'texts'];
  for(let i = 0; i < drawOrder.length; i++) {
    let elementKeys = Object.keys(elements[drawOrder[i]])
    for (let j = 0; j < elementKeys.length; j++) {
      elements[drawOrder[i]][parseInt(elementKeys[j])].draw(ctx);
    }
  }
}

export function updateBackground(
  ctx: CanvasRenderingContext2D,
  bgPattern: CanvasPattern | null
) {
  clearFrame(ctx);
  ctx.rect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.fillStyle = bgPattern ?? '#ff0000';
  ctx.fill();
}

function updateAll(
  canvasCtx: CanvasRenderingContext2D,
  elements: componentListInterface,
  bgCtx: CanvasRenderingContext2D | null,
  bgPattern: CanvasPattern | null
) {
  updateCanvas(canvasCtx, elements);
  if (bgCtx !== null) {
    updateBackground(bgCtx, bgPattern);
  }
}

export default updateAll;
