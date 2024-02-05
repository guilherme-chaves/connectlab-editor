import Point from '../interfaces/Point';

export default class Point2i implements Point {
  private readonly point: Int32Array;
  constructor(x: number = 0, y: number = 0) {
    this.point = new Int32Array(2);
    this.point[0] = Math.floor(x);
    this.point[1] = Math.floor(y);
  }

  get x(): number {
    return this.point[0];
  }

  set x(newValue: number) {
    this.point[0] = Math.floor(newValue);
  }

  get y(): number {
    return this.point[1];
  }

  set y(newValue: number) {
    this.point[1] = Math.floor(newValue);
  }
}
