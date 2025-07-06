import {VectorObject} from '@connectlab-editor/types/common';

export default interface Vector2 {
  type: 'int' | 'float';
  x: number;
  y: number;
  add(other: Vector2 | number): Vector2;
  sub(other: Vector2 | number): Vector2;
  mul(other: Vector2 | number): Vector2;
  div(other: Vector2 | number): Vector2;
  dot(other: Vector2): number;
  cross(other: Vector2): number;
  len(): number;
  lenSquared(): number;
  madd(mul: Vector2 | number, add: Vector2 | number): Vector2;
  lerp(other: Vector2, t: number): Vector2;
  bilinear(other: Vector2, bt: Vector2): Vector2;
  equals(other: Vector2, precision?: number): boolean;
  min(other: Vector2): Vector2;
  max(other: Vector2): Vector2;
  rotate(radians: number): Vector2;
  atan2(other: Vector2): number;
  normalize(): Vector2;
  abs(): Vector2;
  copy(from: Vector2): Vector2;
  clone(): Vector2;
  toPlainObject(): VectorObject;
}
