import INPUT_ON from '../../assets/gates/INPUT_ON.svg';
import INPUT_OFF from '../../assets/gates/INPUT_OFF.svg';

import LED_OFF from '../../assets/gates/LED_OFF.svg';
import LED_RED from '../../assets/gates/LED_RED_ON.svg';

import {InputTypes, OutputTypes} from '../../types/types';
import preloadImage from '../preloadImage';

// Valores de ID das imagens são arbitrariamente multiplicados para permitir multiplas imagens para o mesmo componente
const inputImageList: Map<number, string> = new Map([
  [InputTypes.SWITCH * 10, INPUT_OFF],
  [InputTypes.SWITCH * 10 + 1, INPUT_ON],
]);

const outputImageList: Map<number, string> = new Map([
  [OutputTypes.MONO_LED_OFF, LED_OFF],
  [OutputTypes.MONO_LED_RED, LED_RED],
]);

export function preloadInputImages() {
  return preloadImage(inputImageList);
}

export function preloadOutputImages() {
  return preloadImage(outputImageList);
}
