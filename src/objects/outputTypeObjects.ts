import Vector2 from '../types/Vector2';
import {OutputTypeObject, outputTypes} from '../types/types';

const LEDROutput: OutputTypeObject = {
  id: outputTypes.MONO_LED_RED,
  connectionSlot: {
    id: 0,
    name: 'A',
    localPos: new Vector2(23, 64),
  },
};

export {LEDROutput};
