import {Point as PointInterface} from '../../../interfaces/renderObjects';
import Point2i from '../../../types/Point2i';
import Vector2i from '../../../types/Vector2i';

export default class Point implements PointInterface {
  public position: Point2i;
  public size: number;
  public color: string;
  public colorSelected: string;
  public childElements: Set<number>;
  public selected: boolean;
  private path: Path2D;

  constructor(
    position: Point2i,
    size: number = 4,
    color: string = '#0080ff',
    colorSelected: string | undefined,
    children: Set<number> = new Set()
  ) {
    this.position = position;
    this.size = size;
    this.color = color;
    this.colorSelected = colorSelected ?? color;
    this.childElements = children;
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
    else this.position = nPos;
    this.path = this.generatePath();
  }

  private generatePath(): Path2D {
    const path = new Path2D();
    path.arc(this.position.x, this.position.y, this.size, 0, Math.PI * 2);
    return path;
  }
}
