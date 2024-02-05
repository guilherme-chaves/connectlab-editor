import {CircleCollision as CircleCollisionInterface} from '../../../interfaces/renderObjects';
import Point2i from '../../../types/Point2i';
import Vector2i from '../../../types/Vector2i';

export default class CircleCollision implements CircleCollisionInterface {
  public radius: number;
  public position: Point2i;
  public display: boolean;
  public borderColor: string;
  public selected: boolean;
  public childElements: Set<number>;
  private path: Path2D;

  constructor(
    position: Point2i,
    radius: number,
    borderColor: string = '#ff8000',
    children: Set<number> = new Set()
  ) {
    this.position = position;
    this.radius = radius;
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
    path.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    return path;
  }
}
