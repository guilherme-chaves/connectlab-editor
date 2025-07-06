import Vector2 from '@connectlab-editor/interfaces/vector2Interface';
import {VectorObject} from '@connectlab-editor/types/common';

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
      this.x = xOrVector2;
      this.y = y;
    } else if (Vector2f.isVector2(xOrVector2)) {
      this.x = xOrVector2.x;
      this.y = xOrVector2.y;
    }
  }

  static isVector2(obj: unknown): obj is Vector2 {
    return (
      typeof obj === 'object' &&
      obj !== null &&
      '_x' in obj &&
      '_y' in obj &&
      'type' in obj &&
      (obj.type === 'int' || obj.type === 'float')
    );
  }

  add(other: Vector2 | number): Vector2f {
    if (Vector2f.isVector2(other)) {
      this.x += other.x;
      this.y += other.y;
    } else {
      this.x += other;
      this.y += other;
    }
    return this;
  }

  static add(v1: Vector2, v2OrS: Vector2 | number, out?: Vector2f): Vector2f {
    out ??= Vector2f.ZERO;
    if (Vector2f.isVector2(v2OrS)) {
      out.x = v1.x + v2OrS.x;
      out.y = v1.y + v2OrS.y;
    } else {
      out.x = v1.x + v2OrS;
      out.y = v1.y + v2OrS;
    }
    return out;
  }

  sub(other: Vector2 | number): Vector2f {
    if (Vector2f.isVector2(other)) {
      this.x -= other.x;
      this.y -= other.y;
    } else {
      this.x -= other;
      this.y -= other;
    }
    return this;
  }

  static sub(v1: Vector2, v2OrS: Vector2 | number, out?: Vector2f): Vector2f {
    out ??= Vector2f.ZERO;
    if (Vector2f.isVector2(v2OrS)) {
      out.x = v1.x - v2OrS.x;
      out.y = v1.y - v2OrS.y;
    } else {
      out.x = v1.x - v2OrS;
      out.y = v1.y - v2OrS;
    }
    return out;
  }

  mul(other: number | Vector2): Vector2f {
    if (Vector2f.isVector2(other)) {
      this.x *= other.x;
      this.y *= other.y;
    } else {
      this.x *= other;
      this.y *= other;
    }
    return this;
  }

  static mul(v1: Vector2, v2orS: number | Vector2, out?: Vector2f): Vector2f {
    out ??= Vector2f.ZERO;
    if (Vector2f.isVector2(v2orS)) {
      out.x = v1.x * v2orS.x;
      out.y = v1.y * v2orS.y;
    } else {
      out.x = v1.x * v2orS;
      out.y = v1.y * v2orS;
    }
    return out;
  }

  div(other: number | Vector2): Vector2f {
    if (Vector2f.isVector2(other)) {
      this.x /= other.x;
      this.y /= other.y;
    } else {
      this.x /= other;
      this.y /= other;
    }
    return this;
  }

  static div(v1: Vector2, v2orS: number | Vector2, out?: Vector2f): Vector2f {
    out ??= Vector2f.ZERO;
    if (Vector2f.isVector2(v2orS)) {
      out.x = v1.x / v2orS.x;
      out.y = v1.y / v2orS.y;
    } else {
      out.x = v1.x / v2orS;
      out.y = v1.y / v2orS;
    }
    return out;
  }

  dot(other: Vector2): number {
    return this.x * other.x + this.y * other.y;
  }

  static dot(v1: Vector2, v2: Vector2) {
    return v1.x * v2.x + v1.y * v2.y;
  }

  cross(other: Vector2): number {
    return this.x * other.y - this.y * other.x;
  }

  static cross(v1: Vector2, v2: Vector2) {
    return v1.x * v2.y - v1.y * v2.x;
  }

  len(): number {
    return Math.sqrt(this.lenSquared());
  }

  static len(v1: Vector2) {
    return Math.sqrt(Vector2f.lenSquared(v1));
  }

  lenSquared(): number {
    return this.dot(this);
  }

  static lenSquared(v1: Vector2) {
    return Vector2f.dot(v1, v1);
  }

  madd(other: Vector2, s: number): Vector2f {
    this.x += other.x * s;
    this.y += other.y * s;
    return this;
  }

  static madd(v1: Vector2, v2: Vector2, s: number, out?: Vector2f) {
    out ??= new Vector2f(0, 0);
    out.x = v1.x + v2.x * s;
    out.y = v1.y + v2.y * s;
    return out;
  }

  // Interpolação linear
  lerp(other: Vector2, t: number): Vector2f {
    return this.madd(Vector2f.sub(other, this), t);
  }

  static lerp(v1: Vector2, v2: Vector2, t: number, out?: Vector2f) {
    return Vector2f.madd(v1, Vector2f.sub(v2, v1), t, out);
  }

  // Interpolação bilinear
  bilinear(other: Vector2, bt: Vector2f): Vector2f {
    this.x = Vector2f.lerp(this, other, bt.x).x;
    this.y = Vector2f.lerp(this, other, bt.y).y;
    return this;
  }

  static bilinear(v1: Vector2, v2: Vector2, bt: Vector2f, out?: Vector2f) {
    out ??= new Vector2f(0, 0);
    out.x = Vector2f.lerp(v1, v2, bt.x, undefined).x;
    out.y = Vector2f.lerp(v1, v2, bt.y, undefined).y;
    return out;
  }

  equals(other: Vector2, precision = 1e-4): boolean {
    return (
      Math.abs(this.x - other.x) < precision &&
      Math.abs(this.y - other.y) < precision
    );
  }

  static equals(v1: Vector2, v2: Vector2, precision = 1e-4): boolean {
    return (
      Math.abs(v1.x - v2.x) < precision && Math.abs(v1.y - v2.y) < precision
    );
  }

  min(other: Vector2): Vector2f {
    this.x = Math.min(this.x, other.x);
    this.y = Math.min(this.y, other.y);
    return this;
  }

  static min(v1: Vector2, v2: Vector2, out?: Vector2f) {
    out ??= new Vector2f(0, 0);
    out.x = Math.min(v1.x, v2.x);
    out.y = Math.min(v1.y, v2.y);
    return out;
  }

  max(other: Vector2): Vector2f {
    this.x = Math.max(this.x, other.x);
    this.y = Math.max(this.y, other.y);
    return this;
  }

  static max(v1: Vector2, v2: Vector2, out?: Vector2f) {
    out ??= new Vector2f(0, 0);
    out.x = Math.max(v1.x, v2.x);
    out.y = Math.max(v1.y, v2.y);
    return out;
  }

  rotate(angle: number): Vector2f {
    const sin = Math.sin(angle);
    const cos = Math.cos(angle);
    this.x = this.x * cos - this.y * sin;
    this.y = this.x * sin + this.y * cos;
    return this;
  }

  static rotate(v1: Vector2, rad: number, out?: Vector2f): Vector2f {
    out ??= new Vector2f(0, 0);
    const sin = Math.sin(rad);
    const cos = Math.cos(rad);
    out.x = v1.x * cos - v1.y * sin;
    out.y = v1.x * sin + v1.y * cos;
    return out;
  }

  atan2(other: Vector2): number {
    return Math.atan2(other.y - this.y, other.x - this.x);
  }

  static atan2(v1: Vector2, v2: Vector2): number {
    return Math.atan2(v2.y - v1.y, v2.x - v1.x);
  }

  normalize(): Vector2f {
    return this.div(this.len());
  }

  static normalize(v1: Vector2, out?: Vector2f) {
    return Vector2f.div(v1, v1.len(), out);
  }

  abs(): Vector2f {
    this.x = Math.abs(this.x);
    this.y = Math.abs(this.y);
    return this;
  }

  static abs(v1: Vector2, out?: Vector2f): Vector2f {
    out ??= new Vector2f(0, 0);
    out.x = Math.abs(v1.x);
    out.y = Math.abs(v1.y);
    return out;
  }

  copy(from: Vector2): Vector2f {
    this.x = from.x;
    this.y = from.y;
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

  static clone(v1: Vector2f) {
    return new Vector2f(v1);
  }

  toPlainObject(): VectorObject {
    return {
      x: this.x,
      y: this.y,
    };
  }
}
