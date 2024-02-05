// Node images imports
import ADDPath from '../../assets/gates/AND_ANSI.svg';
import NANDPath from '../../assets/gates/NAND_ANSI.svg';
import NORPath from '../../assets/gates/NOR_ANSI.svg';
import NOTPath from '../../assets/gates/NOT_ANSI.svg';
import ORPath from '../../assets/gates/OR_ANSI.svg';
import XNORPath from '../../assets/gates/XNOR_ANSI.svg';
import XORPath from '../../assets/gates/XOR_ANSI.svg';
import {NodeTypes} from '../../types/types';

// Input images imports
import INPUT_ON from '../../assets/gates/INPUT_ON.svg';
import INPUT_OFF from '../../assets/gates/INPUT_OFF.svg';

// Output images imports
import LED_OFF from '../../assets/gates/LED_OFF.svg';
import LED_RED from '../../assets/gates/LED_RED_ON.svg';

import {InputTypes, OutputTypes} from '../../types/types';

export const nodeImageList: Map<number, string> = new Map([
  [NodeTypes.ADD, ADDPath],
  [NodeTypes.NAND, NANDPath],
  [NodeTypes.NOR, NORPath],
  [NodeTypes.NOT, NOTPath],
  [NodeTypes.OR, ORPath],
  [NodeTypes.XNOR, XNORPath],
  [NodeTypes.XOR, XORPath],
]);

export const inputImageList: Map<number, string> = new Map([
  [InputTypes.SWITCH * 10, INPUT_OFF],
  [InputTypes.SWITCH * 10 + 1, INPUT_ON],
]);

export const outputImageList: Map<number, string> = new Map([
  [OutputTypes.MONO_LED_OFF, LED_OFF],
  [OutputTypes.MONO_LED_RED, LED_RED],
]);
