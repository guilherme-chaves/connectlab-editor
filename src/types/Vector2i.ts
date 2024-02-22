import Point from '../interfaces/Point';
import Vector2Interface from '../interfaces/Vector2';
import Point2f from './Point2f';
import Point2i from './Point2i';
import Vector2f from './Vector2f';

export default class Vector2i implements Vector2Interface {
  public point: Point2i;

  constructor(xOrVector2: number | Point = 0, y = 0) {
    this.point = new Point2i();
    if (typeof xOrVector2 === 'number') {
      this.point.x = xOrVector2;
      this.point.y = y;
    } else if (typeof xOrVector2 === 'object') {
      this.point.x = xOrVector2.x;
      this.point.y = xOrVector2.y;
    }
  }

  add(other: Vector2Interface): Vector2i {
    return new Vector2i(
      this.point.x + other.point.x,
      this.point.y + other.point.y
    );
  }

  static add(p1: Point, p2: Point, out?: Point2i): Point2i {
    out ??= new Point2i();
    out.x = p1.x + p2.x;
    out.y = p1.y + p2.y;
    return out;
  }

  sub(other: Vector2Interface): Vector2i {
    return new Vector2i(
      this.point.x - other.point.x,
      this.point.y - other.point.y
    );
  }

  static sub(p1: Point, p2: Point, out?: Point2i): Point2i {
    out ??= new Point2i();
    out.x = p1.x - p2.x;
    out.y = p1.y - p2.y;
    return out;
  }

  multS(s: number): Vector2i {
    return new Vector2i(this.point.x * s, this.point.y * s);
  }

  static multS(p1: Point, s: number, out?: Point2i): Point2i {
    out ??= new Point2i();
    out.x = p1.x * s;
    out.y = p1.y * s;
    return out;
  }

  mult(other: Vector2Interface): Vector2i {
    return new Vector2i(
      this.point.x * other.point.x,
      this.point.y * other.point.y
    );
  }

  static mult(p1: Point, p2: Point, out?: Point2i): Point2i {
    out ??= new Point2i();
    out.x = p1.x * p2.x;
    out.y = p1.y * p2.y;
    return out;
  }

  div(other: Vector2Interface): Vector2f {
    return new Vector2f(
      this.point.x / other.point.x,
      this.point.y / other.point.y
    );
  }

  static div(p1: Point, p2: Point, out?: Point2f): Point2f {
    out ??= new Point2f();
    out.x = p1.x / p2.x;
    out.y = p1.y / p2.y;
    return out;
  }

  divS(s: number): Vector2f {
    return new Vector2f(this.point.x / s, this.point.y / s);
  }

  static divS(p1: Point, s: number, out?: Point2f): Point2f {
    out ??= new Point2f();
    out.x = p1.x / s;
    out.y = p1.y / s;
    return out;
  }

  abs(): Vector2i {
    return new Vector2i(Math.abs(this.point.x), Math.abs(this.point.y));
  }

  static abs(p1: Point, out?: Point2i): Point2i {
    out ??= new Point2i();
    out.x = Math.abs(p1.x);
    out.y = Math.abs(p1.y);
    return out;
  }

  dot(other: Vector2Interface): number {
    return this.point.x * other.point.x + this.point.y * other.point.y;
  }

  static dot(p1: Point, p2: Point): number {
    return p1.x * p2.x + p1.y * p2.y;
  }

  cross(other: Vector2Interface): number {
    return this.point.x * other.point.y - this.point.y * other.point.x;
  }

  static cross(p1: Point, p2: Point): number {
    return p1.x * p2.y - p1.y * p2.x;
  }

  mag(): number {
    return Math.sqrt(this.magSq());
  }

  static mag(p1: Point): number {
    return Vector2i.magSq(p1);
  }

  magSq(): number {
    return this.dot(this);
  }

  static magSq(p1: Point): number {
    return Vector2i.dot(p1, p1);
  }

  madd(other: Vector2Interface, s: number): Vector2i {
    return new Vector2i(
      this.point.x + s * other.point.x,
      this.point.y + s * other.point.y
    );
  }

  static madd(p1: Point, p2: Point, s: number, out?: Point2i): Point2i {
    out ??= new Point2i();
    out.x = p1.x + s * p2.x;
    out.y = p1.y + s * p2.y;
    return out;
  }

  // Interpolação linear
  lerp(other: Vector2Interface, t: number): Vector2i {
    return this.madd(other.sub(this), t);
  }

  static lerp(p1: Point, p2: Point, t: number, out?: Point2i): Point2i {
    out ??= new Point2i();
    Vector2i.madd(p1, Vector2i.sub(p2, p1), t, out);
    return out;
  }

  // Interpolação bilinear
  bilinear(other: Vector2Interface, bt: Point2f): Vector2i {
    return new Vector2i(
      this.lerp(other, bt.x).point.x,
      this.lerp(other, bt.y).point.y
    );
  }

  static bilinear(p1: Point, p2: Point, bt: Point2f, out?: Point2i): Point2i {
    out ??= new Point2i();
    out.x = Vector2i.lerp(p1, p2, bt.x).x;
    out.y = Vector2i.lerp(p1, p2, bt.y).y;
    return out;
  }

  equals(other: Vector2i): boolean {
    return this.point.x === other.point.x && this.point.y === other.point.y;
  }

  static equals(p1: Point2i, p2: Point2i): boolean {
    return p1.x === p2.x && p1.y === p2.y;
  }

  min(other: Vector2Interface): Vector2i {
    return new Vector2i(
      Math.min(this.point.x, other.point.x),
      Math.min(this.point.y, other.point.y)
    );
  }

  static min(p1: Point, p2: Point, out?: Point2i): Point2i {
    out ??= new Point2i();
    out.x = Math.min(p1.x, p2.x);
    out.y = Math.min(p1.y, p2.y);
    return out;
  }

  max(other: Vector2Interface): Vector2i {
    return new Vector2i(
      Math.max(this.point.x, other.point.x),
      Math.max(this.point.y, other.point.y)
    );
  }

  static max(p1: Point, p2: Point, out?: Point2i): Point2i {
    out ??= new Point2i();
    out.x = Math.max(p1.x, p2.x);
    out.y = Math.max(p1.y, p2.y);
    return out;
  }

  rotate(angle: number): Vector2i {
    const sin = Math.sin(angle);
    const cos = Math.cos(angle);
    return new Vector2i(
      this.point.x * cos - this.point.y * sin,
      this.point.x * sin + this.point.y * cos
    );
  }

  static rotate(p1: Point, radians: number, out?: Point2i): Point2i {
    out ??= new Point2i();
    const sin = Math.sin(radians);
    const cos = Math.cos(radians);
    out.x = p1.x * cos - p1.y * sin;
    out.y = p1.x * sin + p1.y * cos;
    return out;
  }

  getAngle(other: Vector2Interface): number {
    return Math.atan2(
      other.point.y - this.point.y,
      other.point.x - this.point.x
    );
  }

  static getAngle(p1: Point, p2: Point): number {
    return Math.atan2(p2.y - p1.y, p2.x - p1.x);
  }

  normalize(): Vector2f {
    return this.divS(Math.sqrt(this.magSq()));
  }

  static normalize(p1: Point, out?: Point2f): Point2f {
    out ??= new Point2f();
    Vector2i.divS(p1, Vector2i.mag(p1), out);
    return out;
  }

  copy(other: Vector2Interface): Vector2Interface {
    this.point.x = other.point.x;
    this.point.y = other.point.y;
    return this;
  }

  static copy(p1: Point, p2: Point): Point {
    p1.x = p2.x;
    p1.y = p2.y;
    return p1;
  }
}
