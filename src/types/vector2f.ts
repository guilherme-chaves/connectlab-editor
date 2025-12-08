import Vector2 from '@connectlab-editor/interfaces/vector2Interface';
import { VectorObject } from '@connectlab-editor/types/common';

export default class Vector2f implements Vector2 {
  type: 'int' | 'float' = 'float';
  private _x: number = 0;
  private _y: number = 0;

  static get ZERO(): Vector2f {
    return new Vector2f();
  }

  static get ONE(): Vector2f {
    return new Vector2f(1, 1);
  }

  static get UP(): Vector2f {
    return new Vector2f(0, -1);
  }

  static get DOWN(): Vector2f {
    return new Vector2f(0, 1);
  }

  static get LEFT(): Vector2f {
    return new Vector2f(-1, -0);
  }

  static get RIGHT(): Vector2f {
    return new Vector2f(1, 0);
  }

  get x(): number {
    return this._x;
  }

  set x(nVal: number) {
    this._x = nVal;
  }

  get y(): number {
    return this._y;
  }

  set y(nVal: number) {
    this._y = nVal;
  }

  constructor(xOrVector2: number | Vector2 = 0, y = 0) {
    if (typeof xOrVector2 === 'number') {
      this._x = xOrVector2;
      this._y = y;
    }
    else {
      this._x = xOrVector2.x;
      this._y = xOrVector2.y;
    }
  }

  add(other: Vector2 | number): Vector2f {
    if (typeof other === 'number') {
      this._x = this._x + other;
      this._y = this._y + other;
    }
    else {
      this._x = this._x + other.x;
      this._y = this._y + other.y;
    }
    return this;
  }

  static add(a: Vector2, b: Vector2 | number, out?: Vector2f): Vector2f {
    out ??= Vector2f.ZERO;
    if (typeof b === 'number') {
      out.x = a.x + b;
      out.y = a.y + b;
    }
    else {
      out.x = a.x + b.x;
      out.y = a.y + b.y;
    }
    return out;
  }

  sub(other: Vector2 | number): Vector2f {
    if (typeof other === 'number') {
      this._x = this._x - other;
      this._y = this._y - other;
    }
    else {
      this._x = this._x - other.x;
      this._y = this._y - other.y;
    }
    return this;
  }

  static sub(a: Vector2, b: Vector2 | number, out?: Vector2f): Vector2f {
    out ??= Vector2f.ZERO;
    if (typeof b === 'number') {
      out.x = a.x - b;
      out.y = a.y - b;
    }
    else {
      out.x = a.x - b.x;
      out.y = a.y - b.y;
    }
    return out;
  }

  mul(other: number | Vector2): Vector2f {
    if (typeof other === 'number') {
      this._x = this._x * other;
      this._y = this._y * other;
    }
    else {
      this._x = this._x * other.x;
      this._y = this._y * other.y;
    }
    return this;
  }

  static mul(a: Vector2, b: number | Vector2, out?: Vector2f): Vector2f {
    out ??= Vector2f.ZERO;
    if (typeof b === 'number') {
      out.x = a.x * b;
      out.y = a.y * b;
    }
    else {
      out.x = a.x * b.x;
      out.y = a.y * b.y;
    }
    return out;
  }

  div(other: number | Vector2): Vector2f {
    if (typeof other === 'number') {
      this._x = this._x / other;
      this._y = this._y / other;
    }
    else {
      this._x = this._x / other.x;
      this._y = this._y / other.y;
    }
    return this;
  }

  static div(a: Vector2, b: number | Vector2, out?: Vector2f): Vector2f {
    out ??= Vector2f.ZERO;
    if (typeof b === 'number') {
      out.x = a.x / b;
      out.y = a.y / b;
    }
    else {
      out.x = a.x / b.x;
      out.y = a.y / b.y;
    }
    return out;
  }

  dot(other: Vector2): number {
    return this._x * other.x + this._y * other.y;
  }

  static dot(a: Vector2, b: Vector2) {
    return a.x * b.x + a.y * b.y;
  }

  cross(other: Vector2): number {
    return this._x * other.y - this._y * other.x;
  }

  static cross(a: Vector2, b: Vector2) {
    return a.x * b.y - a.y * b.x;
  }

  len(): number {
    return Math.sqrt(this.lenSquared());
  }

  static len(v: Vector2) {
    return Math.sqrt(Vector2f.lenSquared(v));
  }

  lenSquared(): number {
    return this._x * this._x + this._y * this._y;
  }

  static lenSquared(v: Vector2) {
    return v.x * v.x + v.y * v.y;
  }

  madd(other: Vector2, s: number): Vector2f {
    this._x = this._x + other.x * s;
    this._y = this._y + other.y * s;
    return this;
  }

  static madd(a: Vector2, b: Vector2, s: number, out?: Vector2f) {
    out ??= Vector2f.ZERO;
    out.x = a.x + b.x * s;
    out.y = a.y + b.y * s;
    return out;
  }

  // Interpolação linear
  lerp(other: Vector2, t: number): Vector2f {
    const diffX = other.x - this._x;
    const diffY = other.y - this._y;
    this._x = this._x + diffX * t;
    this._y = this._y + diffY * t;
    return this;
  }

  static lerp(a: Vector2, b: Vector2, t: number, out?: Vector2f) {
    out ??= Vector2f.ZERO;
    const diffX = b.x - a.x;
    const diffY = b.y - a.y;
    out.x = a.x + diffX * t;
    out.y = a.y + diffY * t;
    return out;
  }

  // Interpolação bilinear
  bilinear(other: Vector2, bt: Vector2f): Vector2f {
    const diffX = other.x - this._x;
    const diffY = other.y - this._y;
    this._x = this._x + diffX * bt.x;
    this._y = this._y + diffY * bt.y;
    return this;
  }

  static bilinear(a: Vector2, b: Vector2, bt: Vector2f, out?: Vector2f) {
    out ??= Vector2f.ZERO;
    const diffX = b.x - a.x;
    const diffY = b.y - a.y;
    out.x = a.x + diffX * bt.x;
    out.y = a.y + diffY * bt.y;
    return out;
  }

  equals(other: Vector2, precision = 1e-4): boolean {
    return (
      Math.abs(this._x - other.x) < precision
      && Math.abs(this._y - other.y) < precision
    );
  }

  static equals(a: Vector2, b: Vector2, precision = 1e-4): boolean {
    return (
      Math.abs(a.x - b.x) < precision && Math.abs(a.y - b.y) < precision
    );
  }

  min(other: Vector2): Vector2f {
    this._x = Math.min(this._x, other.x);
    this._y = Math.min(this._y, other.y);
    return this;
  }

  static min(a: Vector2, b: Vector2, out?: Vector2f) {
    out ??= new Vector2f(0, 0);
    out.x = Math.min(a.x, b.x);
    out.y = Math.min(a.y, b.y);
    return out;
  }

  max(other: Vector2): Vector2f {
    this._x = Math.max(this._x, other.x);
    this._y = Math.max(this._y, other.y);
    return this;
  }

  static max(a: Vector2, b: Vector2, out?: Vector2f) {
    out ??= new Vector2f(0, 0);
    out.x = Math.max(a.x, b.x);
    out.y = Math.max(a.y, b.y);
    return out;
  }

  rotate(angle: number): Vector2f {
    const sin = Math.sin(angle);
    const cos = Math.cos(angle);
    this._x = this._x * cos - this._y * sin;
    this._y = this._x * sin + this._y * cos;
    return this;
  }

  static rotate(v: Vector2, rad: number, out?: Vector2f): Vector2f {
    out ??= Vector2f.ZERO;
    const sin = Math.sin(rad);
    const cos = Math.cos(rad);
    out.x = v.x * cos - v.y * sin;
    out.y = v.x * sin + v.y * cos;
    return out;
  }

  atan2(other: Vector2): number {
    return Math.atan2(other.y - this._y, other.x - this._x);
  }

  static atan2(a: Vector2, b: Vector2): number {
    return Math.atan2(b.y - a.y, b.x - a.x);
  }

  normalize(): Vector2f {
    const len = this.len();
    this._x = this._x / len;
    this._y = this._y / len;
    return this;
  }

  static normalize(v: Vector2, out?: Vector2f) {
    out ??= Vector2f.ZERO;
    const len = v.len();
    out.x = v.x / len;
    out.y = v.y / len;
    return out;
  }

  abs(): Vector2f {
    this._x = Math.abs(this._x);
    this._y = Math.abs(this._y);
    return this;
  }

  static abs(v: Vector2, out?: Vector2f): Vector2f {
    out ??= Vector2f.ZERO;
    out.x = Math.abs(v.x);
    out.y = Math.abs(v.y);
    return out;
  }

  copy(from: Vector2): Vector2f {
    this._x = from.x;
    this._y = from.y;
    return this;
  }

  static copy(from: Vector2, to: Vector2) {
    to.x = from.x;
    to.y = from.y;
    return to;
  }

  clone(): Vector2f {
    return new Vector2f(this);
  }

  static clone(v: Vector2f) {
    return new Vector2f(v);
  }

  toPlainObject(): VectorObject {
    return {
      x: this._x,
      y: this._y,
    };
  }
}
