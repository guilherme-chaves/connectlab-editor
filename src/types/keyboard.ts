export default class Keyboard {
  private keys: Record<string, boolean> = {};
  public keyPressed = false;
  public keyHold = false;
  public stateChange = false;
  public nKeysPressed = 0;

  public setKeyPressed(key: string, state: boolean): void {
    this.nKeysPressed += state ? 1 : this.keys[key] ? -1 : 0;
    this.keys[key] = state;
  }

  public getKeysPressed(): Record<string, boolean> {
    return this.keys;
  }
}
