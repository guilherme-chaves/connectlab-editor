import {Point as PointInterface} from '../../../interfaces/renderObjects';
import CanvasRenderer from '../renderer';
import Point2i from '../../../types/Point2i';
import Vector2i from '../../../types/Vector2i';

export default class Point implements PointInterface {
  public position: Point2i;
  public size: number;
  public color: string;
  public colorSelected: string;
  public selected: boolean;
  public renderer: CanvasRenderer;
  private path: Path2D;
  private parentPosition: Point2i;
  private regeneratePath: boolean;

  constructor(
    renderer: CanvasRenderer,
    position: Point2i,
    parentPosition: Point2i,
    size: number = 4,
    color: string = '#0080ff',
    colorSelected: string | undefined
  ) {
    this.renderer = renderer;
    this.position = position;
    this.parentPosition = parentPosition;
    this.size = size;
    this.color = color;
    this.colorSelected = colorSelected ?? color;
    this.selected = false;
    this.regeneratePath = false;
    this.path = this.generatePath();
  }

  draw(): void {
    if (this.regeneratePath) this.path = this.generatePath();
    const oldFillStyle = this.renderer.ctx.fillStyle;
    this.renderer.ctx.fillStyle = this.selected
      ? this.colorSelected
      : this.color;
    this.renderer.ctx.fill(this.path);
    this.renderer.ctx.fillStyle = oldFillStyle;
  }

  move(nPos: Point2i, isDelta: boolean): void {
    if (isDelta) Vector2i.add(this.parentPosition, nPos, this.parentPosition);
    else Vector2i.copy(this.parentPosition, nPos);
    this.regeneratePath = true;
  }

  private generatePath(): Path2D {
    const path = new Path2D();
    const globalPosition = Vector2i.add(this.parentPosition, this.position);
    path.arc(globalPosition.x, globalPosition.y, this.size, 0, Math.PI * 2);
    return path;
  }
}
