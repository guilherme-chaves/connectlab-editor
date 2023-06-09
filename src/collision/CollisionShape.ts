import Position from '../types/Position';

export default class CollisionShape {
  public a: Position = new Position(0, 0);
  public b: Position = new Position(0, 0);
  public color = '#FF8008';
  protected drawPath: Path2D = this.generatePath();

  protected generatePath(): Path2D {
    const path = new Path2D();
    const size = this.b.minus(this.a);
    path.rect(this.a.x, this.a.y, size.x, size.y);
    return path;
  }

  draw(ctx: CanvasRenderingContext2D, selected: boolean): void {
    if (!selected) return;
    const oldStrokeStyle = ctx.strokeStyle;
    ctx.strokeStyle = this.color;
    ctx.stroke(this.drawPath);
    ctx.strokeStyle = oldStrokeStyle;
  }

  moveShape(delta: Position) {
    this.a.add(delta);
    this.b.add(delta);
  }

  collisionWithPoint(point: Position) {
    throw new Error('Função não implementada, utilize uma das classes-filhas');
  }
}
