import Vector2 from './Vector2';

export default class Mouse {
  private static _mousePosition: Vector2 = Vector2.ZERO;
  private _mouseClicked: boolean;
  private _mouseStateChanged: boolean;

  static get position() {
    return this._mousePosition;
  }

  static set position(value: Vector2) {
    this._mousePosition = value;
  }

  get clicked() {
    return this._mouseClicked;
  }

  set clicked(value: boolean) {
    this._mouseClicked = value;
    this.stateChanged = true;
  }

  get stateChanged() {
    return this._mouseStateChanged;
  }

  set stateChanged(value: boolean) {
    this._mouseStateChanged = value;
  }

  constructor() {
    this._mouseClicked = false;
    this._mouseStateChanged = false;
  }
}
