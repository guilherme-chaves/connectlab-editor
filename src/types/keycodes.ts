// TECLAS
export const enum keyboardMode {
  ADD_NODE = 0,
  EDIT_TEXT = 1,
}

// *_u = uppercase/letras maiúsuculas
export const EditorShortcuts = Object.freeze({
  ADD: 'a',
  ADD_u: 'A',
  NAND: 'd',
  NAND_u: 'D',
  NOR: 'r',
  NOR_u: 'R',
  NOT: 'n',
  NOT_u: 'N',
  OR: 'o',
  OR_u: 'O',
  XNOR: 'v',
  XNOR_u: 'V',
  XOR: 'x',
  XOR_u: 'X',
  SWITCH: 's',
  SWITCH_u: 'S',
  BUTTON: 'b',
  BUTTON_u: 'B',
  CLOCK: 'k',
  CLOCK_u: 'K',
  LED_RED: 'l',
  LED_RED_u: 'L',
  SEGMENTS: 'e',
  SEGMENTS_u: 'E',
  DELETE: 'Delete',
  BACKSPACE: 'Backspace',
  CTRL: 'Control',
});
