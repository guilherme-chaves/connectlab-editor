import ADDPath from '@connectlab-editor/gates/AND_ANSI.svg';
import NANDPath from '@connectlab-editor/gates/NAND_ANSI.svg';
import NORPath from '@connectlab-editor/gates/NOR_ANSI.svg';
import NOTPath from '@connectlab-editor/gates/NOT_ANSI.svg';
import ORPath from '@connectlab-editor/gates/OR_ANSI.svg';
import XNORPath from '@connectlab-editor/gates/XNOR_ANSI.svg';
import XORPath from '@connectlab-editor/gates/XOR_ANSI.svg';

import INPUT_ON from '@connectlab-editor/gates/INPUT_ON.svg';
import INPUT_OFF from '@connectlab-editor/gates/INPUT_OFF.svg';

import LED_OFF from '@connectlab-editor/gates/LED_OFF.svg';
import LED_RED from '@connectlab-editor/gates/LED_RED_ON.svg';

import preloadImage from '@connectlab-editor/functions/preloadImage';

const imageList: Array<string> = [
  ADDPath,
  NANDPath,
  NORPath,
  NOTPath,
  ORPath,
  XNORPath,
  XORPath,
  INPUT_ON,
  INPUT_OFF,
  LED_OFF,
  LED_RED,
];

export default function preloadNodeImages() {
  return preloadImage(imageList);
}
