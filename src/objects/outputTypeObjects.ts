import {Vector} from 'two.js/src/vector';
import {OutputTypeObject, OutputTypes} from '../types/types';
import LED_OFF from '../assets/gates/LED_OFF.svg';
import LED_RED from '../assets/gates/LED_RED_ON.svg';

const LEDROutput: OutputTypeObject = {
  id: OutputTypes.MONO_LED_RED,
  imgPaths: [LED_OFF, LED_RED],
  connectionSlot: {
    id: 0,
    name: 'A',
    localPos: new Vector(23, 64),
  },
  op(slotState) {
    return slotState.length > 0 ? slotState[0] : false;
  },
};

export {LEDROutput};
