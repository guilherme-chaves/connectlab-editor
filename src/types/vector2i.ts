import Vector2 from '@connectlab-editor/interfaces/vector2Interface';
import { VectorObject } from '@connectlab-editor/types/common';
import Vector2f from '@connectlab-editor/types/vector2f';

export default class Vector2i implements Vector2 {
  type: 'int' | 'float' = 'int';
  public _x: number = 0;
  public _y: number = 0;

  static readonly ZERO = Object.freeze(new Vector2i());

  static readonly ONE = Object.freeze(new Vector2i(1, 1));

  static readonly MINUS_ONE = Object.freeze(new Vector2i(-1, -1));

  static readonly UP = Object.freeze(new Vector2i(0, -1));

  static readonly DOWN = Object.freeze(new Vector2i(0, 1));

  static readonly LEFT = Object.freeze(new Vector2i(-1, 0));

  static readonly RIGHT = Object.freeze(new Vector2i(1, 0));

  get x(): number {
    return this._x;
  }

  set x(nValue) {
    this._x = Math.round(nValue);
  }

  get y(): number {
    return this._y;
  }

  set y(nValue) {
    this._y = Math.round(nValue);
  }

  constructor(xOrVector2?: number | Vector2, y = 0) {
    if (xOrVector2 === undefined) return;
    if (typeof xOrVector2 === 'number') {
      this.x = xOrVector2;
      this.y = y;
    }
    else {
      this.x = xOrVector2.x;
      this.y = xOrVector2.y;
    }
  }

  static add(
    a: Vector2i | Vector2f,
    b: Vector2i | Vector2f | number,
    out?: Vector2i,
  ): Vector2i {
    out ??= new Vector2i();
    if (typeof b === 'number') {
      out.x = a._x + b;
      out.y = a._y + b;
    }
    else {
      out.x = a._x + b._x;
      out.y = a._y + b._y;
    }
    return out;
  }

  static sub(
    a: Vector2i | Vector2f,
    b: Vector2i | Vector2f | number,
    out?: Vector2i,
  ): Vector2i {
    out ??= new Vector2i();
    if (typeof b === 'number') {
      out.x = a._x - b;
      out.y = a._y - b;
    }
    else {
      out.x = a._x - b._x;
      out.y = a._y - b._y;
    }
    return out;
  }

  static mul(
    a: Vector2i | Vector2f,
    b: Vector2i | Vector2f | number,
    out?: Vector2i,
  ): Vector2i {
    out ??= new Vector2i();
    if (typeof b === 'number') {
      out.x = a._x * b;
      out.y = a._y * b;
    }
    else {
      out.x = a._x * b._x;
      out.y = a._y * b._y;
    }
    return out;
  }

  static div(
    a: Vector2i | Vector2f,
    b: Vector2i | Vector2f | number,
    out?: Vector2i,
  ): Vector2i {
    out ??= new Vector2i();
    if (typeof b === 'number') {
      out.x = a._x / b;
      out.y = a._y / b;
    }
    else {
      out.x = a._x / b._x;
      out.y = a._y / b._y;
    }
    return out;
  }

  static dot(
    a: Vector2i | Vector2f,
    b: Vector2i | Vector2f,
  ) {
    return a._x * b._x + a._y * b._y;
  }

  static cross(
    a: Vector2i | Vector2f,
    b: Vector2i | Vector2f,
  ) {
    return a._x * b._y - a._y * b._x;
  }

  static len(v: Vector2i | Vector2f) {
    return Math.sqrt(Vector2i.lenSquared(v));
  }

  static lenSquared(v: Vector2i | Vector2f) {
    return v._x * v._x + v._y * v._y;
  }

  static madd(
    a: Vector2i | Vector2f,
    b: Vector2i | Vector2f,
    s: number,
    out?: Vector2i,
  ) {
    out ??= new Vector2i();
    out.x = a._x + b._x * s;
    out.y = a._y + b._y * s;
    return out;
  }

  static lerp(
    a: Vector2i | Vector2f,
    b: Vector2i | Vector2f,
    t: number,
    out?: Vector2i,
  ) {
    out ??= new Vector2i();
    out.x = a._x + (b._x - a._x) * t;
    out.y = a._y + (b._y - a._y) * t;
    return out;
  }

  static bilinear(
    a: Vector2i | Vector2f,
    b: Vector2i | Vector2f,
    bt: Vector2f,
    out?: Vector2i,
  ) {
    out ??= new Vector2i();
    out.x = a._x + (b._x - a._x) * bt._x;
    out.y = a._y + (b._y - a._y) * bt._y;
    return out;
  }

  static equals(
    a: Vector2i | Vector2f,
    b: Vector2i | Vector2f,
    precision = 0,
  ): boolean {
    if (precision === 0) return a._x === b._x && a._y === b._y;
    else {
      return Math.abs(a._x - b._x) <= precision
        && Math.abs(a._y - b._y) <= precision;
    }
  }

  static min(
    a: Vector2i | Vector2f,
    b: Vector2i | Vector2f,
    out?: Vector2i,
  ) {
    out ??= new Vector2i();
    out.x = Math.min(a._x, b._x);
    out.y = Math.min(a._y, b._y);
    return out;
  }

  static max(
    a: Vector2i | Vector2f,
    b: Vector2i | Vector2f,
    out?: Vector2i,
  ) {
    out ??= new Vector2i();
    out.x = Math.max(a._x, b._x);
    out.y = Math.max(a._y, b._y);
    return out;
  }

  static rotate(v: Vector2i | Vector2f, rad: number, out?: Vector2i): Vector2i {
    out ??= new Vector2i();
    const sin = Math.sin(rad);
    const cos = Math.cos(rad);
    out.x = v._x * cos - v._y * sin;
    out.y = v._x * sin + v._y * cos;
    return out;
  }

  static atan2(a: Vector2i | Vector2f, b: Vector2i | Vector2f): number {
    return Math.atan2(b._y - a._y, b._x - a._x);
  }

  static normalize(v: Vector2i | Vector2f, out?: Vector2f) {
    out ??= new Vector2f();
    const len = Vector2i.len(v);
    out._x = v._x / len;
    out._y = v._y / len;
    return out;
  }

  static abs(v: Vector2i | Vector2f, out?: Vector2i): Vector2i {
    out ??= new Vector2i();
    out.x = Math.abs(v._x);
    out.y = Math.abs(v._y);
    return out;
  }

  static copy(from: Vector2i | Vector2f, to: Vector2i) {
    to.x = from._x;
    to.y = from._y;
    return to;
  }

  clone(): Vector2i {
    return new Vector2i(this);
  }

  toPlainObject(): VectorObject {
    return {
      x: this._x,
      y: this._y,
    };
  }
}
