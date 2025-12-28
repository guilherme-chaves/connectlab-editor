import Editor from '@connectlab-editor/editor';
import Keyboard from '@connectlab-editor/types/keyboard';
import { saveToFile } from '@connectlab-editor/functions/editor';
import {
  NodeTypes,
} from '@connectlab-editor/types/enums';
import { EditorShortcuts as es } from '@connectlab-editor/types/keycodes';

export default class KeyboardEvents {
  private _keyboard: Keyboard;
  constructor(keyboard: Keyboard) {
    this._keyboard = keyboard;
  }

  onKeyDown(editor: Editor): void {
    if (this._keyboard.activeKeys.size === 0) return;
    const keys: Set<string> = new Set();
    for (const key of this._keyboard.activeKeys) {
      if (!this._keyboard.stateChangedKeys.has(key)) {
        this._keyboard.holdedKeys.add(key);
        continue;
      }
      this._keyboard.stateChangedKeys.delete(key);
      keys.add(key);
    }
    if (
      editor.isMouseInsideEditor()
    ) this.handleKeyPressed(keys, editor);
  }

  handleKeyPressed(keys: Set<string>, editor: Editor): void {
    if (keys.size === 1) {
      const key = keys.entries().next().value![0];
      switch (key) {
        case es.ADD:
        case es.ADD_u:
          editor.node(NodeTypes.G_AND);
          break;
        case es.NAND:
        case es.NAND_u:
          editor.node(NodeTypes.G_NAND);
          break;
        case es.OR:
        case es.OR_u:
          editor.node(NodeTypes.G_OR);
          break;
        case es.NOR:
        case es.NOR_u:
          editor.node(NodeTypes.G_NOR);
          break;
        case es.NOT:
        case es.NOT_u:
          editor.node(NodeTypes.G_NOT);
          break;
        case es.XOR:
        case es.XOR_u:
          editor.node(NodeTypes.G_XOR);
          break;
        case es.XNOR:
        case es.XNOR_u:
          editor.node(NodeTypes.G_XNOR);
          break;
        case es.BUTTON:
        case es.BUTTON_u:
          editor.input(NodeTypes.I_BUTTON);
          break;
        case es.SWITCH:
        case es.SWITCH_u:
          editor.input(NodeTypes.I_SWITCH);
          break;
        case es.CLOCK:
        case es.CLOCK_u:
          editor.input(NodeTypes.I_CLOCK);
          break;
        case es.SEGMENTS:
        case es.SEGMENTS_u:
          editor.output(NodeTypes.O_7_SEGMENTS);
          break;
        case es.LED_RED:
        case es.LED_RED_u:
          editor.output(NodeTypes.O_LED_RED);
          break;
        case es.DELETE:
        case es.BACKSPACE:
          editor.remove();
          break;
      }
      return;
    }
    if (keys.has(es.CTRL) && keys.has('s')) {
      saveToFile(editor.editorEnv);
    }
  }
}
