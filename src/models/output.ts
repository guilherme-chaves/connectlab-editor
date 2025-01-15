import Vector2 from '@connectlab-editor/types/vector2';
import {NodeModel, NodeTypes} from '@connectlab-editor/types/common';
import OUTPUT_LED_OFF from '@connectlab-editor/gates/LED_OFF.svg';
import OUTPUT_LED_RED from '@connectlab-editor/gates/LED_RED_ON.svg';

const LEDROutput: NodeModel = {
  id: NodeTypes.O_LED_RED,
  imgPath: [OUTPUT_LED_OFF, OUTPUT_LED_RED],
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
