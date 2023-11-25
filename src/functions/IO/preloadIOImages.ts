import INPUT_ON from '../../assets/gates/INPUT_ON.svg';
import INPUT_OFF from '../../assets/gates/INPUT_OFF.svg';

import LED_OFF from '../../assets/gates/LED_OFF.svg';
import LED_RED from '../../assets/gates/LED_RED_ON.svg';

import {inputTypes, outputTypes} from '../../types/types';
import preloadImage from '../preloadImage';
const inputImageList = [
  [`${inputTypes.SWITCH}_0`, INPUT_OFF],
  [`${inputTypes.SWITCH}_1`, INPUT_ON],
];

const outputImageList = [
  [`${outputTypes.MONO_LED_OFF}`, LED_OFF],
  [`${outputTypes.MONO_LED_RED}`, LED_RED],
];

export function preloadInputImages() {
  return preloadImage(inputImageList);
}

export function preloadOutputImages() {
  return preloadImage(outputImageList);
}
