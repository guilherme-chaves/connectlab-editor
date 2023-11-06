export default class Keyboard {
  private static _lastKeyPressed = '';
  private static _keyPressed = false;
  private static _keyHolded = false;

  static get key() {
    return this._lastKeyPressed;
  }

  static set key(value: string) {
    Keyboard._lastKeyPressed = value;
  }

  static get keyPressed() {
    return Keyboard._keyPressed;
  }

  static set keyPressed(value: boolean) {
    Keyboard._keyPressed = value;
  }

  static get keyHold() {
    return Keyboard._keyHolded;
  }

  static set keyHold(value: boolean) {
    Keyboard._keyHolded = value;
  }
}
