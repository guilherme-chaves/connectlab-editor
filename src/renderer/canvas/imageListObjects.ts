// Node images imports
import ADDPath from '../../assets/gates/AND_ANSI.svg';
import NANDPath from '../../assets/gates/NAND_ANSI.svg';
import NORPath from '../../assets/gates/NOR_ANSI.svg';
import NOTPath from '../../assets/gates/NOT_ANSI.svg';
import ORPath from '../../assets/gates/OR_ANSI.svg';
import XNORPath from '../../assets/gates/XNOR_ANSI.svg';
import XORPath from '../../assets/gates/XOR_ANSI.svg';

// Input images imports
import INPUT_ON from '../../assets/gates/INPUT_ON.svg';
import INPUT_OFF from '../../assets/gates/INPUT_OFF.svg';

// Output images imports
import LED_OFF from '../../assets/gates/LED_OFF.svg';
import LED_RED from '../../assets/gates/LED_RED_ON.svg';

export const nodeImageList: string[] = [
  ADDPath,
  NANDPath,
  NORPath,
  NOTPath,
  ORPath,
  XNORPath,
  XORPath,
];

export const inputImageList: string[] = [INPUT_OFF, INPUT_ON];

export const outputImageList: string[] = [LED_OFF, LED_RED];
