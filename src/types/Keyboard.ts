export default class Keyboard {
  private keys: Record<string, boolean> = {};
  public keyPressed = false;
  public keyHold = false;
  public stateChange = false;
  private _nKeysPressed = 0;

  get nKeysPressed(): number {
    return this._nKeysPressed;
  }

  set nKeysPressed(nVal: number) {
    if (nVal < 0) console.warn('Número de teclas pressionadas é menor que 0!');
    this._nKeysPressed = Math.max(0, nVal);
  }

  public setKeyPressed(key: string, state: boolean) {
    this.keys[key] = state;
    this.nKeysPressed += state ? 1 : -1;
  }

  public getKeysPressed(): Record<string, boolean> {
    return this.keys;
  }
}
