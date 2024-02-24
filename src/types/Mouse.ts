import Point2i from './Point2i';
import Vector2i from './Vector2i';

export default class Mouse {
  public position = new Point2i();
  private _mouseClicked = false;
  public clickStartPosition = new Point2i();
  public stateChanged = false;
  public readonly clickToDragThreshold = 6; // pixels

  get clicked() {
    return this._mouseClicked;
  }

  set clicked(value: boolean) {
    this._mouseClicked = value;
    this.stateChanged = true;
  }

  get dragged() {
    const mouseMovement = Vector2i.sub(this.position, this.clickStartPosition);
    return (
      mouseMovement.x > this.clickToDragThreshold ||
      mouseMovement.x < -this.clickToDragThreshold ||
      mouseMovement.y > this.clickToDragThreshold ||
      mouseMovement.y < -this.clickToDragThreshold
    );
  }
}
