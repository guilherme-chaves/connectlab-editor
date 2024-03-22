import Editor from '../Editor';
import Keyboard from '../types/Keyboard';
import {NodeTypes} from '../types/types';

export enum keyboardMode {
  ADD_NODE = 0,
  EDIT_TEXT = 1,
}

// *_u = uppercase/letras maiúsuculas
enum nodeKeycodes {
  ADD = 'a',
  ADD_u = 'A',
  NAND = 'd',
  NAND_u = 'D',
  NOR = 'r',
  NOR_u = 'R',
  NOT = 'n',
  NOT_u = 'N',
  OR = 'o',
  OR_u = 'O',
  XNOR = 'v',
  XNOR_u = 'V',
  XOR = 'x',
  XOR_u = 'X',
}

enum inputKeycodes {
  SWITCH = 's',
  SWITCH_u = 'S',
}

enum outputKeycodes {
  LED_RED = 'l',
  LED_RED_u = 'L',
}

enum specialKeycodes {
  DELETE = 'Delete',
  BACKSPACE = 'Backspace',
  INSERT = 'Insert',
}

export default class KeyboardEvents {
  private _keyboard: Keyboard;
  constructor(keyboard: Keyboard) {
    this._keyboard = keyboard;
  }
  onKeyDown(ev: KeyboardEvent, editor: Editor) {
    this._keyboard.key = ev.key;
    if (this._keyboard.keyPressed) {
      this._keyboard.keyHold = true;
    } else {
      this._keyboard.keyPressed = true;
      this._keyboard.keyHold = false;
    }
    if (!this._keyboard.keyHold) this.handleKeyPressed(editor);
  }

  handleKeyPressed(editor: Editor) {
    switch (this._keyboard.key) {
      case nodeKeycodes.ADD:
      case nodeKeycodes.ADD_u:
        editor.node(NodeTypes.G_AND);
        break;
      case nodeKeycodes.NAND:
      case nodeKeycodes.NAND_u:
        editor.node(NodeTypes.G_NAND);
        break;
      case nodeKeycodes.NOR:
      case nodeKeycodes.NOR_u:
        editor.node(NodeTypes.G_NOR);
        break;
      case nodeKeycodes.NOT:
      case nodeKeycodes.NOT_u:
        editor.node(NodeTypes.G_NOT);
        break;
      case nodeKeycodes.OR:
      case nodeKeycodes.OR_u:
        editor.node(NodeTypes.G_OR);
        break;
      case nodeKeycodes.XNOR:
      case nodeKeycodes.XNOR_u:
        editor.node(NodeTypes.G_XNOR);
        break;
      case nodeKeycodes.XOR:
      case nodeKeycodes.XOR_u:
        editor.node(NodeTypes.G_XOR);
        break;
      case inputKeycodes.SWITCH:
      case inputKeycodes.SWITCH_u:
        editor.input(NodeTypes.I_SWITCH);
        break;
      case outputKeycodes.LED_RED:
      case outputKeycodes.LED_RED_u:
        editor.output(NodeTypes.O_LED_RED);
        break;
      case specialKeycodes.DELETE:
      case specialKeycodes.BACKSPACE:
        editor.remove();
        break;
      case specialKeycodes.INSERT:
        editor.saveToFile(editor);
    }
  }

  onKeyUp() {
    this._keyboard.key = '';
    this._keyboard.keyPressed = false;
    this._keyboard.keyHold = false;
  }
}
