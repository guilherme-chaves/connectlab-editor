import Vector2 from '@connectlab-editor/types/vector2';
import {NodeModel, NodeTypes} from '@connectlab-editor/types';

const LEDROutput: NodeModel = {
  id: NodeTypes.O_LED_RED,
  imgPath: [
    '/src/assets/gates/LED_OFF.svg',
    '/src/assets/gates/LED_RED_ON.svg',
  ],
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
