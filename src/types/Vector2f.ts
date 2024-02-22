import Point from '../interfaces/Point';
import Vector2Interface from '../interfaces/Vector2';
import Point2f from './Point2f';

export default class Vector2f implements Vector2Interface {
  public point: Point2f;

  constructor(xOrVector2: number | Point = 0, y = 0) {
    this.point = new Point2f();
    if (typeof xOrVector2 === 'number') {
      this.point.x = xOrVector2;
      this.point.y = y;
    } else if (typeof xOrVector2 === 'object') {
      this.point.x = xOrVector2.x;
      this.point.y = xOrVector2.y;
    }
  }

  add(other: Vector2Interface): Vector2f {
    return new Vector2f(
      this.point.x + other.point.x,
      this.point.y + other.point.y
    );
  }

  static add(p1: Point, p2: Point, out?: Point2f): Point2f {
    out ??= new Point2f();
    out.x = p1.x + p2.x;
    out.y = p1.y + p2.y;
    return out;
  }

  sub(other: Vector2Interface): Vector2f {
    return new Vector2f(
      this.point.x - other.point.x,
      this.point.y - other.point.y
    );
  }

  static sub(p1: Point, p2: Point, out?: Point2f): Point2f {
    out ??= new Point2f();
    out.x = p1.x - p2.x;
    out.y = p1.y - p2.y;
    return out;
  }

  multS(s: number): Vector2f {
    return new Vector2f(this.point.x * s, this.point.y * s);
  }

  static multS(p1: Point, s: number, out?: Point2f): Point2f {
    out ??= new Point2f();
    out.x = p1.x * s;
    out.y = p1.y * s;
    return out;
  }

  mult(other: Vector2Interface): Vector2f {
    return new Vector2f(
      this.point.x * other.point.x,
      this.point.y * other.point.y
    );
  }

  static mult(p1: Point, p2: Point, out?: Point2f): Point2f {
    out ??= new Point2f();
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

  abs(): Vector2f {
    return new Vector2f(Math.abs(this.point.x), Math.abs(this.point.y));
  }

  static abs(p1: Point, out?: Point2f): Point2f {
    out ??= new Point2f();
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
    return Vector2f.magSq(p1);
  }

  magSq(): number {
    return this.dot(this);
  }

  static magSq(p1: Point): number {
    return Vector2f.dot(p1, p1);
  }

  madd(other: Vector2Interface, s: number): Vector2f {
    return new Vector2f(
      this.point.x + s * other.point.x,
      this.point.y + s * other.point.y
    );
  }

  static madd(p1: Point, p2: Point, s: number, out?: Point2f): Point2f {
    out ??= new Point2f();
    out.x = p1.x + s * p2.x;
    out.y = p1.y + s * p2.y;
    return out;
  }

  // Interpolação linear
  lerp(other: Vector2Interface, t: number): Vector2f {
    return this.madd(other.sub(this), t);
  }

  static lerp(p1: Point, p2: Point, t: number, out?: Point2f): Point2f {
    out ??= new Point2f();
    Vector2f.madd(p1, Vector2f.sub(p2, p1), t, out);
    return out;
  }

  // Interpolação bilinear
  bilinear(other: Vector2Interface, bt: Point2f): Vector2f {
    return new Vector2f(
      this.lerp(other, bt.x).point.x,
      this.lerp(other, bt.y).point.y
    );
  }

  static bilinear(p1: Point, p2: Point, bt: Point2f, out?: Point2f): Point2f {
    out ??= new Point2f();
    out.x = Vector2f.lerp(p1, p2, bt.x).x;
    out.y = Vector2f.lerp(p1, p2, bt.y).y;
    return out;
  }

  equals(other: Vector2f, e: number = 0.00001): boolean {
    return (
      Math.abs(this.point.x - other.point.x) < e &&
      Math.abs(this.point.y - other.point.y) < e
    );
  }

  static equals(p1: Point2f, p2: Point2f): boolean {
    return p1.x === p2.x && p1.y === p2.y;
  }

  min(other: Vector2Interface): Vector2f {
    return new Vector2f(
      Math.min(this.point.x, other.point.x),
      Math.min(this.point.y, other.point.y)
    );
  }

  static min(p1: Point, p2: Point, out?: Point2f): Point2f {
    out ??= new Point2f();
    out.x = Math.min(p1.x, p2.x);
    out.y = Math.min(p1.y, p2.y);
    return out;
  }

  max(other: Vector2Interface): Vector2f {
    return new Vector2f(
      Math.max(this.point.x, other.point.x),
      Math.max(this.point.y, other.point.y)
    );
  }

  static max(p1: Point, p2: Point, out?: Point2f): Point2f {
    out ??= new Point2f();
    out.x = Math.max(p1.x, p2.x);
    out.y = Math.max(p1.y, p2.y);
    return out;
  }

  rotate(angle: number): Vector2f {
    const sin = Math.sin(angle);
    const cos = Math.cos(angle);
    return new Vector2f(
      this.point.x * cos - this.point.y * sin,
      this.point.x * sin + this.point.y * cos
    );
  }

  static rotate(p1: Point, radians: number, out?: Point2f): Point2f {
    out ??= new Point2f();
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
    Vector2f.divS(p1, Vector2f.mag(p1), out);
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
