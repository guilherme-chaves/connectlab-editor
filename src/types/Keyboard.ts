export default class Keyboard {
  private _lastKeyPressed = '';
  private _keyPressed = false;
  private _keyHolded = false;

  get key() {
    return this._lastKeyPressed;
  }

  set key(value: string) {
    this._lastKeyPressed = value;
  }

  get keyPressed() {
    return this._keyPressed;
  }

  set keyPressed(value: boolean) {
    this._keyPressed = value;
  }

  get keyHold() {
    return this._keyHolded;
  }

  set keyHold(value: boolean) {
    this._keyHolded = value;
  }
}
