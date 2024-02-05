import Point2f from '../types/Point2f';
import Point from './Point';

export default interface Vector2Interface {
  point: Point;
  add(other: Vector2Interface): Vector2Interface;
  sub(other: Vector2Interface): Vector2Interface;
  multS(s: number): Vector2Interface;
  mult(other: Vector2Interface): Vector2Interface;
  div(other: Vector2Interface): Vector2Interface;
  abs(): Vector2Interface;
  dot(other: Vector2Interface): number;
  cross(other: Vector2Interface): number;
  mag(): number;
  magSq(): number;
  madd(other: Vector2Interface, s: number): Vector2Interface;
  lerp(other: Vector2Interface, t: number): Vector2Interface;
  bilinear(other: Vector2Interface, bt: Point2f): Vector2Interface;
  equals(other: Vector2Interface): boolean;
  min(other: Vector2Interface): Vector2Interface;
  max(other: Vector2Interface): Vector2Interface;
  rotate(angle: number): Vector2Interface;
  getAngle(other: Vector2Interface): number;
  normalize(): Vector2Interface;
}
