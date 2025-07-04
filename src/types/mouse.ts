import Vector2i from '@connectlab-editor/types/vector2i';

export default class Mouse {
  public position = new Vector2i();
  private mouseClicked = false;
  public doubleClicked = false;
  public clickStartPosition = new Vector2i();
  private mouseStateChanged = false;
  public readonly clickToDragThreshold = 6; // pixels
  public readonly doubleClickTimer = 300; // ms
  private alreadyClicked = false;
  private mouseDragged = false;

  get clicked(): boolean {
    return this.mouseClicked;
  }

  set clicked(value: boolean) {
    this.mouseClicked = value;
    this.mouseStateChanged = true;
    if (value) this.clickStartPosition.copy(this.position);
    else this.mouseDragged = false;
  }

  get dragged(): boolean {
    const mouseMovement = Vector2i.sub(this.position, this.clickStartPosition);
    this.mouseDragged =
      this.mouseDragged ||
      mouseMovement.x > this.clickToDragThreshold ||
      mouseMovement.x < -this.clickToDragThreshold ||
      mouseMovement.y > this.clickToDragThreshold ||
      mouseMovement.y < -this.clickToDragThreshold;
    return this.mouseDragged;
  }

  get stateChanged(): boolean {
    return this.mouseStateChanged;
  }

  set stateChanged(value: boolean) {
    this.mouseStateChanged = value;
    if (this.alreadyClicked) {
      this.doubleClicked = this.mouseClicked;
    } else {
      this.alreadyClicked = true;
      setTimeout(() => (this.alreadyClicked = false), this.doubleClickTimer);
    }
  }
}
