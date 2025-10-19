import Collision from '@connectlab-editor/interfaces/collisionInterface';
import Vector2i from '@connectlab-editor/types/vector2i';
import CircleCollision
  from '@connectlab-editor/collisionShapes/circleCollision';
import LineCollision from '@connectlab-editor/collisionShapes/lineCollision';

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
    path.rect(this.vertices.a.x, this.vertices.a.y, this.width, this.height);
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
    if (useDelta) this.position.add(v);
    else this.position.copy(v);
    this.setVertices();
    this.regenPath = true;
  }

  collisionWithPoint(point: Vector2i): boolean {
    return (
      point.x > this.vertices.a.x
      && point.x < this.vertices.c.x
      && point.y > this.vertices.a.y
      && point.y < this.vertices.c.y
    );
  }

  collisionWithBox(other: BoxCollision): boolean {
    return !(
      this.vertices.c.x < other.vertices.a.x
      || this.vertices.c.y < other.vertices.a.y
      || this.vertices.a.x > other.vertices.c.x
      || this.vertices.a.y > other.vertices.c.y
    );
  }

  collisionWithCircle(other: CircleCollision): boolean {
    return other.collisionWithBox(this);
  }

  collisionWithLine(other: LineCollision): boolean {
    const left = new LineCollision(this.vertices.a, this.vertices.d);
    const top = new LineCollision(this.vertices.a, this.vertices.b);
    const right = new LineCollision(this.vertices.b, this.vertices.c);
    const bottom = new LineCollision(this.vertices.c, this.vertices.d);

    return (
      this.collisionWithPoint(other.position)
      || this.collisionWithPoint(other.endPosition)
      || other.collisionWithLine(left)
      || other.collisionWithLine(top)
      || other.collisionWithLine(right)
      || other.collisionWithLine(bottom)
    );
  }
}
