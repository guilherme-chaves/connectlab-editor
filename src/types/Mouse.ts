import {Vector} from 'two.js/src/vector';

export default class Mouse {
  public position = new Vector();
  private _mouseClicked = false;
  public clickStartPosition = new Vector();
  public stateChanged = false;
  private _mouseClickThreshold = new Vector(6, 6); // pixels

  get clicked() {
    return this._mouseClicked;
  }

  set clicked(value: boolean) {
    this._mouseClicked = value;
    this.stateChanged = true;
  }

  get dragged() {
    if (!this._mouseClicked) return false;
    const mouseMovement = this.position.sub(this._mouseClickThreshold);
    return (
      mouseMovement.x > this._mouseClickThreshold.x ||
      mouseMovement.x < -this._mouseClickThreshold.x ||
      mouseMovement.y > this._mouseClickThreshold.y ||
      mouseMovement.y < -this._mouseClickThreshold.y
    );
  }

  get clickToDragThreshold() {
    return this._mouseClickThreshold;
  }
}
