import Point from '../interfaces/Point';

export default class Point2f implements Point {
  private readonly point: Float32Array;
  constructor(x: number = 0, y: number = 0) {
    this.point = new Float32Array(2);
    this.point[0] = x;
    this.point[1] = y;
  }

  get x(): number {
    return this.point[0];
  }

  set x(newValue: number) {
    this.point[0] = newValue;
  }

  get y(): number {
    return this.point[1];
  }

  set y(newValue: number) {
    this.point[1] = newValue;
  }
}
