import {Vector2 as Vector2Interface} from '../interfaces/Vector2';
import {VectorObject} from './types';

class Vector2 implements Vector2Interface {
  public x: number = 0;
  public y: number = 0;
  static readonly ZERO = new Vector2();

  constructor(xOrVector2: number | Vector2 = 0, y = 0) {
    if (typeof xOrVector2 === 'number') {
      this.x = xOrVector2;
      this.y = y;
    } else if (typeof xOrVector2 === 'object') {
      this.x = xOrVector2.x;
      this.y = xOrVector2.y;
    }
  }

  add(other: Vector2Interface): Vector2 {
    return new Vector2(this.x + other.x, this.y + other.y);
  }

  sub(other: Vector2Interface): Vector2 {
    return new Vector2(this.x - other.x, this.y - other.y);
  }

  multS(s: number): Vector2 {
    return new Vector2(this.x * s, this.y * s);
  }

  mult(other: Vector2Interface): Vector2 {
    return new Vector2(this.x * other.x, this.y * other.y);
  }

  div(other: Vector2Interface): Vector2 {
    return new Vector2(this.x / other.x, this.y / other.y);
  }

  divS(s: number): Vector2 {
    return new Vector2(this.x / s, this.y / s);
  }

  dot(other: Vector2Interface): number {
    return this.x * other.x + this.y * other.y;
  }

  cross(other: Vector2Interface): number {
    return this.x * other.y - this.y * other.x;
  }

  mag(): number {
    return Math.sqrt(this.magSq());
  }

  magSq(): number {
    return this.dot(this);
  }

  madd(other: Vector2Interface, s: number): Vector2 {
    return new Vector2(this.x + s * other.x, this.y + s * other.y);
  }

  // Interpolação linear
  lerp(other: Vector2Interface, t: number): Vector2 {
    return this.madd(other.sub(this), t);
  }

  // Interpolação bilinear
  bilinear(other: Vector2Interface, bt: Vector2Interface | DOMPoint): Vector2 {
    return new Vector2(this.lerp(other, bt.x).x, this.lerp(other, bt.y).y);
  }

  equals(other: Vector2): boolean {
    return this.x === other.x && this.y === other.y;
  }

  min(other: Vector2): Vector2 {
    return new Vector2(Math.min(this.x, other.x), Math.min(this.y, other.y));
  }

  max(other: Vector2): Vector2 {
    return new Vector2(Math.max(this.x, other.x), Math.max(this.y, other.y));
  }

  rotate(angle: number): Vector2 {
    const sin = Math.sin(angle);
    const cos = Math.cos(angle);
    return new Vector2(
      this.x * cos - this.y * sin,
      this.x * sin + this.y * cos
    );
  }

  getAngle(other: Vector2): number {
    return Math.atan2(other.y - this.y, other.x - this.x);
  }

  normalize(): Vector2 {
    return this.divS(Math.sqrt(this.magSq()));
  }

  toPlainObject(): VectorObject {
    return {
      x: this.x,
      y: this.y,
    };
  }
}

export default Vector2;
