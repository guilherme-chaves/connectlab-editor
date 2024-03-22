import Vector2 from '../types/Vector2';
import {NodeTypeObject, NodeTypes} from '../types/types';
import LED_OFF from '../assets/gates/LED_OFF.svg';
import LED_RED from '../assets/gates/LED_RED_ON.svg';

const LEDROutput: NodeTypeObject = {
  id: NodeTypes.O_LED_RED,
  imgPath: [LED_OFF, LED_RED],
  connectionSlot: [
    {
      id: 0,
      in: true,
      name: 'A',
      localPos: new Vector2(23, 64),
    },
  ],
};

export {LEDROutput};
