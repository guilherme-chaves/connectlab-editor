import Editor from '@connectlab-editor/editor';
import Keyboard from '@connectlab-editor/types/keyboard';
import {saveToFile} from '@connectlab-editor/functions/editor';
import {
  inputKeycodes,
  nodeKeycodes,
  outputKeycodes,
  specialKeycodes,
  NodeTypes,
} from '@connectlab-editor/types/enums';

export default class KeyboardEvents {
  private _keyboard: Keyboard;
  constructor(keyboard: Keyboard) {
    this._keyboard = keyboard;
  }
  onKeyDown(editor: Editor): void {
    if (this._keyboard.nKeysPressed === 0) return;
    if (this._keyboard.keyPressed) {
      this._keyboard.keyHold = true;
    } else {
      this._keyboard.keyPressed = true;
      this._keyboard.keyHold = false;
    }
    if (!this._keyboard.keyHold) this.handleKeyPressed(editor);
  }

  handleKeyPressed(editor: Editor): void {
    const keys = this._keyboard.getKeysPressed();
    if (keys[nodeKeycodes.ADD] || keys[nodeKeycodes.ADD_u])
      editor.node(NodeTypes.G_AND);
    else if (keys[nodeKeycodes.NAND] || keys[nodeKeycodes.NAND_u])
      editor.node(NodeTypes.G_NAND);
    else if (keys[nodeKeycodes.NOR] || keys[nodeKeycodes.NOR_u])
      editor.node(NodeTypes.G_NOR);
    else if (keys[nodeKeycodes.NOT] || keys[nodeKeycodes.NOT_u])
      editor.node(NodeTypes.G_NOT);
    else if (keys[nodeKeycodes.OR] || keys[nodeKeycodes.OR_u])
      editor.node(NodeTypes.G_OR);
    else if (keys[nodeKeycodes.XNOR] || keys[nodeKeycodes.XNOR_u])
      editor.node(NodeTypes.G_XNOR);
    else if (keys[nodeKeycodes.XOR] || keys[nodeKeycodes.XOR_u])
      editor.node(NodeTypes.G_XOR);
    else if (keys[inputKeycodes.SWITCH] || keys[inputKeycodes.SWITCH_u])
      editor.input(NodeTypes.I_SWITCH);
    else if (keys[inputKeycodes.BUTTON] || keys[inputKeycodes.BUTTON_u])
      editor.input(NodeTypes.I_BUTTON);
    else if (keys[outputKeycodes.LED_RED] || keys[outputKeycodes.LED_RED_u])
      editor.output(NodeTypes.O_LED_RED);
    else if (keys[outputKeycodes.SEGMENTS] || keys[outputKeycodes.SEGMENTS_u])
      editor.output(NodeTypes.O_7_SEGMENTS);
    else if (keys[specialKeycodes.DELETE]) editor.remove();
    else if (keys[specialKeycodes.INSERT]) saveToFile(editor.editorEnv);
  }

  onKeyUp(): void {
    if (this._keyboard.keyPressed && this._keyboard.nKeysPressed === 0) {
      this._keyboard.keyPressed = false;
      this._keyboard.keyHold = false;
    }
  }
}
