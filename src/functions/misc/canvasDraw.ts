import { FullComponentList } from '@connectlab-editor/types/common';

// Ordem crescente em que os componentes serão desenhados (menor z-index para maior z-index)
const drawOrder = ['connections', 'nodes', 'slots', 'texts'];

// Limpa o canvas antes de desenhar um novo quadro
function clearFrame(ctx: CanvasRenderingContext2D): void {
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.restore();
}

export function updateCanvas(
  ctx: CanvasRenderingContext2D,
  elements: FullComponentList,
): void {
  clearFrame(ctx);
  for (const category of drawOrder) {
    for (const component of elements[category].values()) {
      component.draw(ctx);
    }
  }
}

export function updateBackground(
  ctx: CanvasRenderingContext2D,
  bgPattern: CanvasPattern | null,
): void {
  clearFrame(ctx);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.fillStyle = bgPattern ?? '#ff0000';
  ctx.rect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.fill();
}
