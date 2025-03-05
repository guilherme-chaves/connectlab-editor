import loadImage from '@connectlab-editor/functions/preloadImage';
import {ImageListObject} from '@connectlab-editor/types/common';
import GATE_AND from '@connectlab-editor/gates/AND_ANSI.svg';
import GATE_NAND from '@connectlab-editor/gates/NAND_ANSI.svg';
import GATE_NOR from '@connectlab-editor/gates/NOR_ANSI.svg';
import GATE_NOT from '@connectlab-editor/gates/NOT_ANSI.svg';
import GATE_OR from '@connectlab-editor/gates/OR_ANSI.svg';
import GATE_XNOR from '@connectlab-editor/gates/XNOR_ANSI.svg';
import GATE_XOR from '@connectlab-editor/gates/XOR_ANSI.svg';

import INPUT_OFF from '@connectlab-editor/gates/INPUT_OFF.svg';
import INPUT_ON from '@connectlab-editor/gates/INPUT_ON.svg';

import OUTPUT_LED_OFF from '@connectlab-editor/gates/LED_OFF.svg';
import OUTPUT_LED_RED from '@connectlab-editor/gates/LED_RED_ON.svg';

const imageList = [
  GATE_AND,
  GATE_NAND,
  GATE_NOR,
  GATE_NOT,
  GATE_OR,
  GATE_XNOR,
  GATE_XOR,
  INPUT_OFF,
  INPUT_ON,
  OUTPUT_LED_OFF,
  OUTPUT_LED_RED,
];

export default function preloadNodeImages(): ImageListObject {
  const images: ImageListObject = {};
  for (const imgPath of imageList) {
    loadImage(imgPath).then(image => {
      images[imgPath] = image;
    });
  }
  return images;
}
