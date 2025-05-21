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
import BUTTON_OFF from '@connectlab-editor/assets/gates/BUTTON_OFF.svg';
import BUTTON_ON from '@connectlab-editor/assets/gates/BUTTON_ON.svg';
import CLOCK from '@connectlab-editor/assets/gates/CLOCK.svg';

import OUTPUT_LED_OFF from '@connectlab-editor/gates/LED_OFF.svg';
import OUTPUT_LED_RED from '@connectlab-editor/gates/LED_RED_ON.svg';

import SEGMENTS_OFF from '@connectlab-editor/gates/7segment/7segment-off.svg';
import SEGMENTS_A from '@connectlab-editor/gates/7segment/7segment-a.svg';
import SEGMENTS_B from '@connectlab-editor/gates/7segment/7segment-b.svg';
import SEGMENTS_C from '@connectlab-editor/gates/7segment/7segment-c.svg';
import SEGMENTS_D from '@connectlab-editor/gates/7segment/7segment-d.svg';
import SEGMENTS_E from '@connectlab-editor/gates/7segment/7segment-e.svg';
import SEGMENTS_F from '@connectlab-editor/gates/7segment/7segment-f.svg';
import SEGMENTS_G from '@connectlab-editor/gates/7segment/7segment-g.svg';

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
  BUTTON_OFF,
  BUTTON_ON,
  CLOCK,
  OUTPUT_LED_OFF,
  OUTPUT_LED_RED,
  SEGMENTS_OFF,
  SEGMENTS_A,
  SEGMENTS_B,
  SEGMENTS_C,
  SEGMENTS_D,
  SEGMENTS_E,
  SEGMENTS_F,
  SEGMENTS_G,
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
