import {VectorObject} from '../types/types';

export interface Vector2 {
  x: number;
  y: number;
  add(other: Vector2): Vector2;
  sub(other: Vector2): Vector2;
  multS(s: number): Vector2;
  mult(other: Vector2): Vector2;
  div(other: Vector2): Vector2;
  dot(other: Vector2): number;
  cross(other: Vector2): number;
  mag(): number;
  magSq(): number;
  madd(other: Vector2, s: number): Vector2;
  lerp(other: Vector2, t: number): Vector2;
  bilinear(other: Vector2, bt: Vector2): Vector2;
  equals(other: Vector2): boolean;
  min(other: Vector2): Vector2;
  max(other: Vector2): Vector2;
  rotate(angle: number): Vector2;
  getAngle(other: Vector2): number;
  normalize(): Vector2;
  toPlainObject(): VectorObject;
}
