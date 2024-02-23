import Vector2 from './Vector2';

export default class Mouse {
  public position = Vector2.ZERO;
  private _mouseClicked = false;
  public clickStartPosition = Vector2.ZERO;
  public stateChanged = false;
  private _mouseClickThreshold = new Vector2(6, 6); // pixels

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
