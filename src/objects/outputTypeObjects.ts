import Point2i from '../types/Point2i';
import {OutputTypeObject, OutputTypes} from '../types/types';

const LEDROutput: OutputTypeObject = {
  id: OutputTypes.MONO_LED_RED,
  connectionSlot: {
    id: 0,
    name: 'A',
    localPos: new Point2i(23, 64),
  },
  op(slotState) {
    return slotState.length > 0 ? slotState[0] : false;
  },
};

export {LEDROutput};
