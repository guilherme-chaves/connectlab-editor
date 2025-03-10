// TECLAS
export enum keyboardMode {
  ADD_NODE = 0,
  EDIT_TEXT = 1,
}

// *_u = uppercase/letras maiúsuculas
export enum nodeKeycodes {
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

export enum inputKeycodes {
  SWITCH = 's',
  SWITCH_u = 'S',
}

export enum outputKeycodes {
  LED_RED = 'l',
  LED_RED_u = 'L',
  SEGMENTS = 'e',
  SEGMENTS_u = 'E',
}

export enum specialKeycodes {
  DELETE = 'Delete',
  BACKSPACE = 'Backspace',
  INSERT = 'Insert',
}

// OUTROS
export const enum ComponentType {
  LINE = 1,
  NODE = 2,
  TEXT = 3,
  SLOT = 4,
  INPUT = 5,
  OUTPUT = 6,
}

// G(ate)_*, I(nput)_*, O(utput)_*
export const enum NodeTypes {
  G_AND = 0,
  G_NAND = 1,
  G_NOR = 2,
  G_NOT = 3,
  G_OR = 4,
  G_XNOR = 5,
  G_XOR = 6,
  I_SWITCH = 100,
  O_LED_RED = 200,
  O_7_SEGMENTS = 201,
}

export const enum EditorMode {
  ADD = 0,
  MOVE = 1,
  SELECT = 2,
  PROP = 3,
}

export const enum EditorEvents {
  MOUSE_CLICKED = 0,
  MOUSE_RELEASED = 1,
  MOUSE_DRAGGED = 2,
  KEY_PRESSED = 10,
  KEY_RELEASED = 11,
  KEY_HOLDED = 12,
}
