import Point from '../interfaces/Point';

export default class Point2i implements Point {
  private _x: number;
  private _y: number;
  constructor(x: number = 0, y: number = 0) {
    this._x = Math.floor(x);
    this._y = Math.floor(y);
  }

  get x(): number {
    return this._x;
  }

  set x(newValue: number) {
    this._x = Math.floor(newValue);
  }

  get y(): number {
    return this._y;
  }

  set y(newValue: number) {
    this._y = Math.floor(newValue);
  }
}
