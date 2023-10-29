import Vector2 from './Vector2';

export default class Mouse {
  private static _mousePosition = Vector2.ZERO;
  private static _mouseClicked = false;
  private static _mouseStateChanged = false;

  static get position() {
    return this._mousePosition;
  }

  static set position(value: Vector2) {
    this._mousePosition = value;
  }

  static get clicked() {
    return this._mouseClicked;
  }

  static set clicked(value: boolean) {
    this._mouseClicked = value;
    this.stateChanged = true;
  }

  static get stateChanged() {
    return this._mouseStateChanged;
  }

  static set stateChanged(value: boolean) {
    this._mouseStateChanged = value;
  }
}
