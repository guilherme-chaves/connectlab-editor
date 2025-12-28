export default class Keyboard {
  public activeKeys: Set<string> = new Set();
  public holdedKeys: Set<string> = new Set();
  public stateChangedKeys: Set<string> = new Set();

  public setKeyState(key: string, active: boolean): void {
    if (active) {
      if (!this.holdedKeys.has(key)) {
        this.activeKeys.add(key);
        this.stateChangedKeys.add(key);
      }
    }
    else {
      this.activeKeys.delete(key);
      this.holdedKeys.delete(key);
      this.stateChangedKeys.delete(key);
    }
  }
}
