import Vector2 from './Vector2';

export default class Mouse {
  private _mousePosition = Vector2.ZERO;
  private _mouseClicked = false;
  private _mouseDragged = false;
  private _mouseClickPosition = Vector2.ZERO;
  private _mouseStateChanged = false;
  private _mouseClickThreshold = 6; // pixels

  get position() {
    return this._mousePosition;
  }

  set position(value: Vector2) {
    this._mousePosition = value;
  }

  get clicked() {
    return this._mouseClicked;
  }

  set clicked(value: boolean) {
    this._mouseClicked = value;
    this._mouseStateChanged = true;
  }

  get dragged() {
    return this._mouseDragged;
  }

  set dragged(value: boolean) {
    this._mouseDragged = value;
  }

  get clickStartPosition() {
    return this._mouseClickPosition;
  }

  set clickStartPosition(value: Vector2) {
    this._mouseClickPosition = value;
  }

  get clickToDragThreshold() {
    return this._mouseClickThreshold;
  }

  get stateChanged() {
    return this._mouseStateChanged;
  }

  set stateChanged(value: boolean) {
    this._mouseStateChanged = value;
  }
}
