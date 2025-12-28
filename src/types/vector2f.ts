import Vector2 from '@connectlab-editor/interfaces/vector2Interface';
import { VectorObject } from '@connectlab-editor/types/common';
import Vector2i from './vector2i';

export default class Vector2f implements Vector2 {
  type: 'int' | 'float' = 'float';
  public _x: number = 0;
  public _y: number = 0;

  static readonly ZERO = Object.freeze(new Vector2f());

  static readonly ONE = Object.freeze(new Vector2f(1, 1));

  static readonly MINUS_ONE = Object.freeze(new Vector2f(-1, -1));

  static readonly UP = Object.freeze(new Vector2f(0, -1));

  static readonly DOWN = Object.freeze(new Vector2f(0, 1));

  static readonly LEFT = Object.freeze(new Vector2f(-1, 0));

  static readonly RIGHT = Object.freeze(new Vector2f(1, 0));

  get x(): number {
    return this._x;
  }

  set x(nValue: number) {
    this._x = nValue;
  }

  get y(): number {
    return this._y;
  }

  set y(nValue: number) {
    this._y = nValue;
  }

  constructor(xOrVector2?: number | Vector2, y = 0) {
    if (typeof xOrVector2 === 'number') {
      this._x = xOrVector2;
      this._y = y;
    }
    else if (xOrVector2 !== undefined) {
      this._x = xOrVector2.x;
      this._y = xOrVector2.y;
    }
  }

  static add(
    a: Vector2f | Vector2i,
    b: Vector2f | Vector2i | number,
    out?: Vector2f,
  ): Vector2f {
    out ??= new Vector2f();
    if (typeof b === 'number') {
      out._x = a._x + b;
      out._y = a._y + b;
    }
    else {
      out._x = a._x + b._x;
      out._y = a._y + b._y;
    }
    return out;
  }

  static sub(
    a: Vector2f | Vector2i,
    b: Vector2f | Vector2i | number,
    out?: Vector2f,
  ): Vector2f {
    out ??= new Vector2f();
    if (typeof b === 'number') {
      out._x = a._x - b;
      out._y = a._y - b;
    }
    else {
      out._x = a._x - b._x;
      out._y = a._y - b._y;
    }
    return out;
  }

  static mul(
    a: Vector2f | Vector2i,
    b: Vector2f | Vector2i | number,
    out?: Vector2f,
  ): Vector2f {
    out ??= new Vector2f();
    if (typeof b === 'number') {
      out._x = a._x * b;
      out._y = a._y * b;
    }
    else {
      out._x = a._x * b._x;
      out._y = a._y * b._y;
    }
    return out;
  }

  static div(
    a: Vector2f | Vector2i,
    b: Vector2f | Vector2i | number,
    out?: Vector2f,
  ): Vector2f {
    out ??= new Vector2f();
    if (typeof b === 'number') {
      out._x = a._x / b;
      out._y = a._y / b;
    }
    else {
      out._x = a._x / b._x;
      out._y = a._y / b._y;
    }
    return out;
  }

  static dot(a: Vector2f | Vector2i, b: Vector2f | Vector2i) {
    return a._x * b._x + a._y * b._y;
  }

  static cross(a: Vector2f | Vector2i, b: Vector2f | Vector2i) {
    return a._x * b._y - a._y * b._x;
  }

  static len(v: Vector2f | Vector2i) {
    return Math.sqrt(Vector2f.lenSquared(v));
  }

  static lenSquared(v: Vector2f | Vector2i) {
    return v._x * v._x + v._y * v._y;
  }

  static madd(
    a: Vector2f | Vector2i,
    b: Vector2f | Vector2i,
    s: number,
    out?: Vector2f,
  ) {
    out ??= new Vector2f();
    out._x = a._x + b._x * s;
    out._y = a._y + b._y * s;
    return out;
  }

  static lerp(
    a: Vector2f | Vector2i,
    b: Vector2f | Vector2i,
    t: number,
    out?: Vector2f,
  ) {
    out ??= new Vector2f();
    out._x = a._x + (b._x - a._x) * t;
    out._y = a._y + (b._y - a._y) * t;
    return out;
  }

  static bilinear(
    a: Vector2f | Vector2i,
    b: Vector2f | Vector2i,
    bt: Vector2f,
    out?: Vector2f,
  ) {
    out ??= new Vector2f();
    out._x = a._x + (b._x - a._x) * bt._x;
    out._y = a._y + (b._y - a._y) * bt._y;
    return out;
  }

  static equals(
    a: Vector2f | Vector2i,
    b: Vector2f | Vector2i,
    precision = 1e-4,
  ): boolean {
    return Math.abs(a._x - b._x) <= precision
      && Math.abs(a._y - b._y) <= precision;
  }

  static min(a: Vector2f | Vector2i, b: Vector2f | Vector2i, out?: Vector2f) {
    out ??= new Vector2f();
    out._x = Math.min(a._x, b._x);
    out._y = Math.min(a._y, b._y);
    return out;
  }

  static max(a: Vector2f | Vector2i, b: Vector2f | Vector2i, out?: Vector2f) {
    out ??= new Vector2f();
    out._x = Math.max(a._x, b._x);
    out._y = Math.max(a._y, b._y);
    return out;
  }

  static rotate(v: Vector2f | Vector2i, rad: number, out?: Vector2f): Vector2f {
    out ??= new Vector2f();
    const sin = Math.sin(rad);
    const cos = Math.cos(rad);
    out._x = v._x * cos - v._y * sin;
    out._y = v._x * sin + v._y * cos;
    return out;
  }

  static atan2(a: Vector2f | Vector2i, b: Vector2f | Vector2i): number {
    return Math.atan2(b._y - a._y, b._x - a._x);
  }

  static normalize(v: Vector2f | Vector2i, out?: Vector2f) {
    out ??= new Vector2f();
    const len = Vector2f.len(v);
    out._x = v._x / len;
    out._y = v._y / len;
    return out;
  }

  static abs(v: Vector2f | Vector2i, out?: Vector2f): Vector2f {
    out ??= new Vector2f();
    out._x = Math.abs(v._x);
    out._y = Math.abs(v._y);
    return out;
  }

  static copy(from: Vector2f | Vector2i, to: Vector2f) {
    to._x = from._x;
    to._y = from._y;
    return to;
  }

  clone(): Vector2f {
    return new Vector2f(this);
  }

  toPlainObject(): VectorObject {
    return {
      x: this._x,
      y: this._y,
    };
  }
}
