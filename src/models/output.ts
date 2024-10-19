import Vector2 from '@connectlab-editor/types/vector2';
import {NodeModel, NodeTypes} from '@connectlab-editor/types';
import LED_OFF from '@connectlab-editor/gates/LED_OFF.svg';
import LED_RED from '@connectlab-editor/gates/LED_RED_ON.svg';

const LEDROutput: NodeModel = {
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