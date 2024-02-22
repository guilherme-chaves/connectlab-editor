import Point from '../interfaces/Point';

export default class Point2f implements Point {
  public x: number;
  public y: number;
  constructor(x: number = 0, y: number = 0) {
    this.x = x;
    this.y = y;
  }
}
