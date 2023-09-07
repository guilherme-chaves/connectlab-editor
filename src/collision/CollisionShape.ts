import Vector2 from '../types/Vector2';

export default class CollisionShape {
  public parentPosition: Vector2 = new Vector2(0, 0);
  public a: Vector2 = new Vector2(0, 0);
  public b: Vector2 = new Vector2(0, 0);
  public color = '#FF8008DC';
  public drawPath: Path2D = this.generatePath();

  protected generatePath(): Path2D {
    const path = new Path2D();
    const pos = this.a.add(this.parentPosition);
    path.rect(pos.x, pos.y, this.b.x, this.b.y);
    return path;
  }

  draw(ctx: CanvasRenderingContext2D, selected: boolean): void {
    if (!selected) return;
    const oldStrokeStyle = ctx.strokeStyle;
    ctx.strokeStyle = this.color;
    ctx.stroke(this.drawPath);
    ctx.strokeStyle = oldStrokeStyle;
  }

  moveShape(delta: Vector2, useDelta = true) {
    if (useDelta) this.parentPosition.add(delta);
    else this.parentPosition = delta;
    this.drawPath = this.generatePath();
  }

  collisionWithPoint(point: Vector2) {
    throw new Error('Função não implementada, utilize uma das classes-filhas');
  }
}
