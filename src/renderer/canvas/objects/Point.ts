import {Point as PointInterface} from '../../../interfaces/renderObjects';
import Point2i from '../../../types/Point2i';
import Vector2i from '../../../types/Vector2i';

export default class Point implements PointInterface {
  public position: Point2i;
  public size: number;
  public color: string;
  public colorSelected: string;
  public selected: boolean;
  private path: Path2D;
  private parentPosition: Point2i;

  constructor(
    position: Point2i,
    parentPosition: Point2i,
    size: number = 4,
    color: string = '#0080ff',
    colorSelected: string | undefined
  ) {
    this.position = position;
    this.parentPosition = parentPosition;
    this.size = size;
    this.color = color;
    this.colorSelected = colorSelected ?? color;
    this.selected = false;
    this.path = this.generatePath();
  }

  draw(ctx: CanvasRenderingContext2D): void {
    const oldFillStyle = ctx.fillStyle;
    ctx.fillStyle = this.selected ? this.colorSelected : this.color;
    ctx.fill(this.path);
    ctx.fillStyle = oldFillStyle;
  }

  move(nPos: Point2i, isDelta: boolean): void {
    if (isDelta)
      this.position = Vector2i.add(this.position, nPos, this.position);
    else Vector2i.copy(this.position, nPos);
  }

  private generatePath(): Path2D {
    const path = new Path2D();
    const globalPosition = Vector2i.add(this.parentPosition, this.position);
    path.arc(globalPosition.x, globalPosition.y, this.size, 0, Math.PI * 2);
    return path;
  }
}
