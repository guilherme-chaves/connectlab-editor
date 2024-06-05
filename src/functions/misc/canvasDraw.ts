import {FullComponentList} from '@connectlab-editor/types';

const drawOrder = ['connections', 'nodes', 'slots', 'texts'];

// Limpa o canvas antes de desenhar um novo quadro
function clearFrame(ctx: CanvasRenderingContext2D) {
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.restore();
}

function updateCanvas(
  ctx: CanvasRenderingContext2D,
  elements: FullComponentList
) {
  clearFrame(ctx);
  for (const category of drawOrder) {
    for (const component of elements[category].values()) {
      component.draw(ctx);
    }
  }
}

function updateBackground(
  ctx: CanvasRenderingContext2D,
  bgPattern: CanvasPattern | null
) {
  clearFrame(ctx);
  ctx.rect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.fillStyle = bgPattern ?? '#ff0000';
  ctx.fill();
}

export function updateEditor(
  canvasCtx: CanvasRenderingContext2D,
  elements: FullComponentList,
  bgCtx: CanvasRenderingContext2D | null,
  bgPattern: CanvasPattern | null
) {
  updateCanvas(canvasCtx, elements);
  if (bgCtx !== null) {
    updateBackground(bgCtx, bgPattern);
  }
}
