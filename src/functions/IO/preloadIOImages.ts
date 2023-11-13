import INPUT_ON from '../../assets/gates/INPUT_ON.svg';
import INPUT_OFF from '../../assets/gates/INPUT_OFF.svg';

import {inputTypes, outputTypes} from '../../types/types';
import preloadImage from '../preloadImage';
const imageList = [
  [`${inputTypes.SWITCH}_0`, INPUT_OFF],
  [`${inputTypes.SWITCH}_1`, INPUT_ON],
];

export default function preloadIOImages() {
  return preloadImage(imageList);
}
