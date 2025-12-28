import Collision from '@connectlab-editor/interfaces/collisionInterface';
import Vector2i from '@connectlab-editor/types/vector2i';
import CircleCollision
  from '@connectlab-editor/collisionShapes/circleCollision';
import LineCollision from '@connectlab-editor/collisionShapes/lineCollision';
import Vector2f from '@connectlab-editor/types/vector2f';

// Sentido anti-horário, começando do ponto superior esquerdo
interface BoxVertices {
  a: Vector2i
  b: Vector2i
  c: Vector2i
  d: Vector2i
}

export default class BoxCollision implements Collision {
  public position: Vector2i;
  public readonly localVertices: BoxVertices;
  public readonly vertices: BoxVertices;
  public readonly width: number;
  public readonly height: number;
  private drawPath: Path2D | undefined;
  private regenPath: boolean;
  public borderColor: string;
  private center: Vector2i;
  constructor(
    position: Vector2i,
    width = 2,
    height = 2,
    borderColor = '#FF8008DC',
  ) {
    this.position = position;
    this.width = width;
    this.height = height;
    this.borderColor = borderColor;
    this.localVertices = this.setLocalVertices();
    this.regenPath = false;
    this.vertices = {
      a: Vector2i.add(this.position, this.localVertices.a),
      b: Vector2i.add(this.position, this.localVertices.b),
      c: Vector2i.add(this.position, this.localVertices.c),
      d: Vector2i.add(this.position, this.localVertices.d),
    };
    this.center = Vector2f.div(
      Vector2f.add(this.vertices.a, this.vertices.c),
      2,
    );
  }

  private setVertices(): void {
    Vector2i.add(this.position, this.localVertices.a, this.vertices.a);
    Vector2i.add(this.position, this.localVertices.b, this.vertices.b);
    Vector2i.add(this.position, this.localVertices.c, this.vertices.c);
    Vector2i.add(this.position, this.localVertices.d, this.vertices.d);
  }

  private setLocalVertices(): BoxVertices {
    return Object.freeze({
      a: new Vector2i(),
      b: new Vector2i(this.width, 0),
      c: new Vector2i(this.width, this.height),
      d: new Vector2i(0, this.height),
    });
  }

  private generatePath(): Path2D {
    const path = new Path2D();
    path.rect(this.vertices.a._x, this.vertices.a._y, this.width, this.height);
    this.regenPath = false;
    return path;
  }

  draw(ctx: CanvasRenderingContext2D, selected: boolean): void {
    if (!selected) return;
    if (!this.drawPath || this.regenPath) this.drawPath = this.generatePath();
    ctx.save();
    ctx.strokeStyle = this.borderColor;
    ctx.stroke(this.drawPath);
    ctx.restore();
  }

  moveShape(v: Vector2i, useDelta = true): void {
    if (useDelta) Vector2i.add(this.position, v, this.position);
    else Vector2i.copy(v, this.position);
    this.setVertices();
    this.regenPath = true;
  }

  collisionWithPoint(point: Vector2i): boolean {
    return !(
      point._x <= this.vertices.a._x
      || point._x >= this.vertices.c._x
      || point._y <= this.vertices.a._y
      || point._y >= this.vertices.c._y
    );
  }

  collisionWithBox(other: BoxCollision): boolean {
    return !(
      this.vertices.c._x < other.vertices.a._x
      || this.vertices.c._y < other.vertices.a._y
      || this.vertices.a._x > other.vertices.c._x
      || this.vertices.a._y > other.vertices.c._y
    );
  }

  collisionWithCircle(other: CircleCollision): boolean {
    return other.collisionWithBox(this);
  }

  collisionWithLine(other: LineCollision): boolean {
    const e = [
      this.vertices.c._x - this.center._x,
      this.vertices.c._y - this.center._y,
    ];
    const m = [
      (other.position._x + other.endPosition._x) / 2,
      (other.position._y + other.endPosition._y) / 2,
    ];
    const d = [
      other.endPosition._x - m[0],
      other.endPosition._y - m[1],
    ];
    m[0] -= this.center._x;
    m[1] -= this.center._y;
    const am = [Math.abs(m[0]), Math.abs(m[1])];
    const ad = [Math.abs(d[0]), Math.abs(d[1])];
    if (am[0] > e[0] + ad[0]) return false;
    if (am[1] > e[1] + ad[1]) return false;

    ad[0] += 1e-3;
    ad[1] += 1e-3;
    if (Math.abs(m[0] * d[1] - m[1] * d[0]) > e[0] * ad[1] + e[1] * ad[0])
      return false;
    return true;
  }
}
