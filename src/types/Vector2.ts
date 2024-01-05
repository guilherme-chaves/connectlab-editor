interface Vector2Interface {
  add(other: Vector2, forceFloat: boolean): Vector2;
  sub(other: Vector2, forceFloat: boolean): Vector2;
  multS(s: number, forceFloat: boolean): Vector2;
  mult(other: Vector2, forceFloat: boolean): Vector2;
  div(other: Vector2, forceFloat: boolean): Vector2;
  dot(other: Vector2): number;
  cross(other: Vector2): number;
  mag(): number;
  magSq(): number;
  madd(other: Vector2, s: number, forceFloat: boolean): Vector2;
  lerp(other: Vector2, t: number, forceFloat: boolean): Vector2;
  bilinear(other: Vector2, bt: Vector2, forceFloat: boolean): Vector2;
  equals(other: Vector2): boolean;
  min(other: Vector2): Vector2;
  max(other: Vector2): Vector2;
  rotate(angle: number): Vector2;
  getAngle(other: Vector2): number;
  normalize(): Vector2;
}

class Vector2 implements Vector2Interface {
  private forceFloat: boolean;
  private _x = 0;
  private _y = 0;
  static readonly ZERO = new Vector2();

  constructor(xOrVector2: number | Vector2 = 0, y = 0, forceFloat = false) {
    this.forceFloat = forceFloat;
    if (typeof xOrVector2 === 'number') {
      this.x = xOrVector2;
      this.y = y;
    } else if (typeof xOrVector2 === 'object') {
      this.x = xOrVector2.x;
      this.y = xOrVector2.y;
    }
  }

  get x(): number {
    return this._x;
  }

  set x(value: number) {
    this._x = this.forceFloat ? value : Math.floor(value);
  }

  get y(): number {
    return this._y;
  }

  set y(value: number) {
    this._y = this.forceFloat ? value : Math.floor(value);
  }

  add(other: Vector2, forceFloat = false): Vector2 {
    return new Vector2(this.x + other.x, this.y + other.y, forceFloat);
  }

  sub(other: Vector2, forceFloat = false): Vector2 {
    return new Vector2(this.x - other.x, this.y - other.y, forceFloat);
  }

  multS(s: number, forceFloat = false): Vector2 {
    return new Vector2(this.x * s, this.y * s, forceFloat);
  }

  mult(other: Vector2, forceFloat = false): Vector2 {
    return new Vector2(this.x * other.x, this.y * other.y, forceFloat);
  }

  div(other: Vector2, forceFloat = false): Vector2 {
    return new Vector2(this.x / other.x, this.y / other.y, forceFloat);
  }

  divS(s: number, forceFloat = false): Vector2 {
    return new Vector2(this.x / s, this.y / s, forceFloat);
  }

  dot(other: Vector2): number {
    return this.x * other.x + this.y * other.y;
  }

  cross(other: Vector2): number {
    return this.x * other.y - this.y * other.x;
  }

  mag(): number {
    return Math.sqrt(this.magSq());
  }

  magSq(): number {
    return this.dot(this);
  }

  madd(other: Vector2, s: number, forceFloat = false): Vector2 {
    return new Vector2(this.x + s * other.x, this.y + s * other.y, forceFloat);
  }

  // Interpolação linear
  lerp(other: Vector2, t: number, forceFloat = false): Vector2 {
    return this.madd(other.sub(this), t, forceFloat);
  }

  // Interpolação bilinear
  bilinear(
    other: Vector2,
    bt: Vector2 | DOMPoint,
    forceFloat = false
  ): Vector2 {
    return new Vector2(
      this.lerp(other, bt.x, forceFloat).x,
      this.lerp(other, bt.y, forceFloat).y,
      forceFloat
    );
  }

  equals(other: Vector2): boolean {
    return this.x === other.x && this.y === other.y;
  }

  min(other: Vector2, forceFloat = false): Vector2 {
    return new Vector2(
      Math.min(this.x, other.x),
      Math.min(this.y, other.y),
      forceFloat
    );
  }

  max(other: Vector2, forceFloat = false): Vector2 {
    return new Vector2(
      Math.max(this.x, other.x),
      Math.max(this.y, other.y),
      forceFloat
    );
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
    return Math.atan2(other.y - this.y, other.x - this._x);
  }

  normalize(): Vector2 {
    return this.divS(Math.sqrt(this.magSq()), true);
  }
}

export default Vector2;
