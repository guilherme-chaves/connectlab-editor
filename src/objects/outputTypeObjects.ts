import Vector2 from '../types/Vector2';
import {OutputTypeObject, OutputTypes} from '../types/types';

const LEDROutput: OutputTypeObject = {
  id: OutputTypes.MONO_LED_RED,
  connectionSlot: {
    id: 0,
    name: 'A',
    localPos: new Vector2(23, 64),
  },
  op(slotState) {
    return slotState.length > 0 ? slotState[0] : false;
  },
};

export {LEDROutput};
