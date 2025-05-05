import {VectorObject} from '@connectlab-editor/types/common';

export default class Vector2 {
  private _x: number = 0;
  private _y: number = 0;
  public useInt: boolean;
  static readonly ZERO = new Vector2();

  get x(): number {
    return this._x;
  }

  set x(nValue) {
    this._x = this.useInt ? Math.round(nValue) : nValue;
  }

  get y(): number {
    return this._y;
  }

  set y(nValue) {
    this._y = this.useInt ? Math.round(nValue) : nValue;
  }

  constructor(xOrVector2: number | Vector2 = 0, y = 0, useInt = true) {
    this.useInt = useInt;
    if (typeof xOrVector2 === 'number') {
      this.x = xOrVector2;
      this.y = y;
    } else if (typeof xOrVector2 === 'object') {
      this.x = xOrVector2.x;
      this.y = xOrVector2.y;
    }
  }

  add(other: Vector2 | number): Vector2 {
    if (other instanceof Vector2) {
      this.x += other.x;
      this.y += other.y;
    } else {
      this.x += other;
      this.y += other;
    }
    return this;
  }

  static add(
    v1: Vector2,
    v2OrS: Vector2 | number,
    out?: Vector2,
    useInt = true
  ): Vector2 {
    out ??= new Vector2(0, 0, useInt);
    if (v2OrS instanceof Vector2) {
      out.x = v1.x + v2OrS.x;
      out.y = v1.y + v2OrS.y;
    } else {
      out.x = v1.x + v2OrS;
      out.y = v1.y + v2OrS;
    }
    return out;
  }

  sub(other: Vector2 | number): Vector2 {
    if (other instanceof Vector2) {
      this.x -= other.x;
      this.y -= other.y;
    } else {
      this.x -= other;
      this.y -= other;
    }
    return this;
  }

  static sub(
    v1: Vector2,
    v2OrS: Vector2 | number,
    out?: Vector2,
    useInt = true
  ): Vector2 {
    out ??= new Vector2(0, 0, useInt);
    if (v2OrS instanceof Vector2) {
      out.x = v1.x - v2OrS.x;
      out.y = v1.y - v2OrS.y;
    } else {
      out.x = v1.x - v2OrS;
      out.y = v1.y - v2OrS;
    }
    return out;
  }

  mul(other: number | Vector2): Vector2 {
    if (other instanceof Vector2) {
      this.x *= other.x;
      this.y *= other.y;
    } else {
      this.x *= other;
      this.y *= other;
    }
    return this;
  }

  static mul(
    v1: Vector2,
    v2orS: number | Vector2,
    out?: Vector2,
    useInt = true
  ): Vector2 {
    out ??= new Vector2(0, 0, useInt);
    if (v2orS instanceof Vector2) {
      out.x = v1.x * v2orS.x;
      out.y = v1.y * v2orS.y;
    } else {
      out.x = v1.x * v2orS;
      out.y = v1.y * v2orS;
    }
    return out;
  }

  div(other: number | Vector2): Vector2 {
    if (other instanceof Vector2) {
      this.x /= other.x;
      this.y /= other.y;
    } else {
      this.x /= other;
      this.y /= other;
    }
    return this;
  }

  static div(
    v1: Vector2,
    v2orS: number | Vector2,
    out?: Vector2,
    useInt = true
  ): Vector2 {
    out ??= new Vector2(0, 0, useInt);
    if (v2orS instanceof Vector2) {
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
    return Math.sqrt(Vector2.lenSquared(v1));
  }

  lenSquared(): number {
    return this.dot(this);
  }

  static lenSquared(v1: Vector2) {
    return Vector2.dot(v1, v1);
  }

  madd(other: Vector2, s: number): Vector2 {
    this.x += other.x * s;
    this.y += other.y * s;
    return this;
  }

  static madd(
    v1: Vector2,
    v2: Vector2,
    s: number,
    out?: Vector2,
    useInt = true
  ) {
    out ??= new Vector2(0, 0, useInt);
    out.x = v1.x + v2.x * s;
    out.y = v1.y + v2.y * s;
    return out;
  }

  // Interpolação linear
  lerp(other: Vector2, t: number): Vector2 {
    return this.madd(other.sub(this), t);
  }

  static lerp(
    v1: Vector2,
    v2: Vector2,
    t: number,
    out?: Vector2,
    useInt = true
  ) {
    return Vector2.madd(v1, Vector2.sub(v2, v1), t, out, useInt);
  }

  // Interpolação bilinear
  bilinear(other: Vector2, bt: Vector2): Vector2 {
    this.x = Vector2.lerp(this, other, bt.x).x;
    this.y = Vector2.lerp(this, other, bt.y).y;
    return this;
  }

  static bilinear(
    v1: Vector2,
    v2: Vector2,
    bt: Vector2,
    out?: Vector2,
    useInt = true
  ) {
    out ??= new Vector2(0, 0, useInt);
    out.x = Vector2.lerp(v1, v2, bt.x, undefined, useInt).x;
    out.y = Vector2.lerp(v1, v2, bt.y, undefined, useInt).y;
    return out;
  }

  equals(other: Vector2, precision = 1e-4): boolean {
    if (this.useInt && other.useInt)
      return this.x === other.x && this.y === other.y;
    else
      return (
        Math.abs(this.x - other.x) < precision &&
        Math.abs(this.y - other.y) < precision
      );
  }

  static equals(v1: Vector2, v2: Vector2, precision = 1e-4): boolean {
    if (v1.useInt && v2.useInt) return v1.x === v2.x && v1.y === v2.y;
    else
      return (
        Math.abs(v1.x - v2.x) < precision && Math.abs(v1.y - v2.y) < precision
      );
  }

  min(other: Vector2): Vector2 {
    this.x = Math.min(this.x, other.x);
    this.y = Math.min(this.y, other.y);
    return this;
  }

  static min(v1: Vector2, v2: Vector2, out?: Vector2, useInt = true) {
    out ??= new Vector2(0, 0, useInt);
    out.x = Math.min(v1.x, v2.x);
    out.y = Math.min(v1.y, v2.y);
    return out;
  }

  max(other: Vector2): Vector2 {
    this.x = Math.max(this.x, other.x);
    this.y = Math.max(this.y, other.y);
    return this;
  }

  static max(v1: Vector2, v2: Vector2, out?: Vector2, useInt = true) {
    out ??= new Vector2(0, 0, useInt);
    out.x = Math.max(v1.x, v2.x);
    out.y = Math.max(v1.y, v2.y);
    return out;
  }

  rotate(angle: number): Vector2 {
    const sin = Math.sin(angle);
    const cos = Math.cos(angle);
    this.x = this.x * cos - this.y * sin;
    this.y = this.x * sin + this.y * cos;
    return this;
  }

  static rotate(
    v1: Vector2,
    rad: number,
    out?: Vector2,
    useInt = true
  ): Vector2 {
    out ??= new Vector2(0, 0, useInt);
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

  normalize(): Vector2 {
    this.useInt = false;
    return this.div(this.len());
  }

  static normalize(v1: Vector2, out?: Vector2, useInt = false) {
    return Vector2.div(v1, v1.len(), out, useInt);
  }

  abs(): Vector2 {
    this.x = Math.abs(this.x);
    this.y = Math.abs(this.y);
    return this;
  }

  static abs(v1: Vector2, out?: Vector2, useInt = true): Vector2 {
    out ??= new Vector2(0, 0, useInt);
    out.x = Math.abs(v1.x);
    out.y = Math.abs(v1.y);
    return out;
  }

  copy(): Vector2 {
    return new Vector2(this, undefined, this.useInt);
  }

  static copy(from: Vector2, to: Vector2) {
    to.useInt = from.useInt;
    to.x = from.x;
    to.y = from.y;
    return to;
  }

  toPlainObject(): VectorObject {
    return {
      x: this.x,
      y: this.y,
      useInt: this.useInt,
    };
  }
}
