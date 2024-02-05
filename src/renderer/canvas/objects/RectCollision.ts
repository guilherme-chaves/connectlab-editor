import {RectCollision as RectCollisionInterface} from '../../../interfaces/renderObjects';
import Point2i from '../../../types/Point2i';
import Vector2i from '../../../types/Vector2i';

export default class RectCollision implements RectCollisionInterface {
  public position: Point2i;
  public size: Point2i;
  public display: boolean;
  public borderColor: string;
  public selected: boolean;
  public childElements: Set<number>;
  private path: Path2D;

  constructor(
    position: Point2i,
    size: Point2i,
    borderColor: string = '#ff8000',
    children: Set<number> = new Set()
  ) {
    this.position = position;
    this.size = size;
    this.display = false;
    this.borderColor = borderColor;
    this.childElements = children;
    this.selected = false;
    this.path = this.generatePath();
  }

  draw(ctx: CanvasRenderingContext2D): void {
    if (!this.display) return;
    const oldStrokeStyle = ctx.strokeStyle;
    ctx.strokeStyle = this.borderColor;
    ctx.stroke(this.path);
    ctx.strokeStyle = oldStrokeStyle;
  }

  move(nPos: Point2i, isDelta: boolean): void {
    if (isDelta) Vector2i.add(this.position, nPos, this.position);
    else this.position = nPos;
    this.path = this.generatePath();
  }

  private generatePath(): Path2D {
    const path = new Path2D();
    path.rect(this.position.x, this.position.y, this.size.x, this.size.y);
    return path;
  }
}
