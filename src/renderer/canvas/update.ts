import {FullComponentList} from '../../types/types';

const drawOrder = [
  'connections',
  'nodes',
  'inputs',
  'outputs',
  'slots',
  'texts',
];

// Limpa o canvas antes de desenhar um novo quadro
export function clearFrame(ctx: CanvasRenderingContext2D) {
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.restore();
}

export function updateCanvas(
  ctx: CanvasRenderingContext2D,
  elements: FullComponentList
) {
  clearFrame(ctx);
  for (const category of drawOrder) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    for (const [_key, component] of elements[category]) {
      component.draw(ctx);
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

export default function updateAll(
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
