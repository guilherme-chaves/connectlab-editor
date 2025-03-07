import Vector2 from '@connectlab-editor/types/vector2';

export default class Mouse {
  public position = new Vector2();
  private _mouseClicked = false;
  public doubleClicked = false;
  public clickStartPosition = new Vector2();
  private _mouseStateChanged = false;
  public readonly clickToDragThreshold = 6; // pixels
  public readonly doubleClickTimer = 300; // ms
  private alreadyClicked = false;

  get clicked(): boolean {
    return this._mouseClicked;
  }

  set clicked(value: boolean) {
    this._mouseClicked = value;
    this._mouseStateChanged = true;
    if (value) this.clickStartPosition = this.position.copy();
  }

  get dragged(): boolean {
    const mouseMovement = Vector2.sub(this.position, this.clickStartPosition);
    return (
      mouseMovement.x > this.clickToDragThreshold ||
      mouseMovement.x < -this.clickToDragThreshold ||
      mouseMovement.y > this.clickToDragThreshold ||
      mouseMovement.y < -this.clickToDragThreshold
    );
  }

  get stateChanged(): boolean {
    return this._mouseStateChanged;
  }

  set stateChanged(value: boolean) {
    this._mouseStateChanged = value;
    if (this.alreadyClicked) {
      this.doubleClicked = this._mouseClicked;
    } else {
      this.alreadyClicked = true;
      setTimeout(() => (this.alreadyClicked = false), this.doubleClickTimer);
    }
  }
}
