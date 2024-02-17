import BBCollision from '../../../collision/BBCollision';
import {RectCollision as RectCollisionInterface} from '../../../interfaces/renderObjects';
import Point2i from '../../../types/Point2i';
import Vector2i from '../../../types/Vector2i';

export default class RectCollision implements RectCollisionInterface {
  public position: Point2i;
  public size: Point2i;
  public display: boolean;
  public borderColor: string;
  public selected: boolean;
  public collisionObject: BBCollision;
  private path: Path2D;

  constructor(
    position: Point2i,
    size: Point2i,
    collisionObject: BBCollision,
    borderColor: string = '#ff8000'
  ) {
    this.position = position;
    this.size = size;
    this.display = true;
    this.borderColor = borderColor;
    this.collisionObject = collisionObject;
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
    if (isDelta) {
      Vector2i.add(this.collisionObject.position, nPos, this.position);
    } else {
      Vector2i.sub(nPos, Vector2i.divS(this.size, 2.0), this.position);
    }
    this.path = this.generatePath();
  }

  private generatePath(): Path2D {
    const path = new Path2D();
    path.rect(
      this.collisionObject.position.x,
      this.collisionObject.position.y,
      this.collisionObject.size.x,
      this.collisionObject.size.y
    );
    return path;
  }
}
