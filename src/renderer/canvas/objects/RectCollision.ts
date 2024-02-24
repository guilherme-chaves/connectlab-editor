import {RectCollision as RectCollisionInterface} from '../../../interfaces/renderObjects';
import CanvasRenderer from '../renderer';
import Point2i from '../../../types/Point2i';
import Vector2i from '../../../types/Vector2i';

export default class RectCollision implements RectCollisionInterface {
  public renderer: CanvasRenderer;
  public position: Point2i;
  public size: Point2i;
  public display: boolean;
  public borderColor: string;
  public selected: boolean;
  private path: Path2D;
  private parentPosition: Point2i;

  constructor(
    renderer: CanvasRenderer,
    position: Point2i,
    parentPosition: Point2i,
    size: Point2i,
    borderColor: string = '#ff8000'
  ) {
    this.renderer = renderer;
    this.position = position;
    this.parentPosition = parentPosition;
    this.size = size;
    this.display = true;
    this.borderColor = borderColor;
    this.selected = false;
    this.path = this.generatePath();
  }

  draw(): void {
    if (!this.display) return;
    const oldStrokeStyle = this.renderer.ctx.strokeStyle;
    this.renderer.ctx.strokeStyle = this.borderColor;
    this.renderer.ctx.stroke(this.path);
    this.renderer.ctx.strokeStyle = oldStrokeStyle;
  }

  move(nPos: Point2i, isDelta: boolean): void {
    if (isDelta) Vector2i.add(this.parentPosition, nPos, this.parentPosition);
    else Vector2i.copy(this.parentPosition, nPos);
    this.path = this.generatePath();
  }

  update(): void {
    this.path = this.generatePath();
  }

  private generatePath(): Path2D {
    const path = new Path2D();
    const globalPosition = Vector2i.add(this.position, this.parentPosition);
    path.rect(globalPosition.x, globalPosition.y, this.size.x, this.size.y);
    return path;
  }
}
