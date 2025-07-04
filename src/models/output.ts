import Vector2i from '@connectlab-editor/types/vector2i';
import {NodeModel} from '@connectlab-editor/types/common';
import {NodeTypes} from '@connectlab-editor/types/enums';
import OUTPUT_LED_OFF from '@connectlab-editor/gates/LED_OFF.svg';
import OUTPUT_LED_RED from '@connectlab-editor/gates/LED_RED_ON.svg';
import SEGMENTS_OFF from '@connectlab-editor/gates/7segment/7segment-off.svg';
import SEGMENTS_A from '@connectlab-editor/gates/7segment/7segment-a.svg';
import SEGMENTS_B from '@connectlab-editor/gates/7segment/7segment-b.svg';
import SEGMENTS_C from '@connectlab-editor/gates/7segment/7segment-c.svg';
import SEGMENTS_D from '@connectlab-editor/gates/7segment/7segment-d.svg';
import SEGMENTS_E from '@connectlab-editor/gates/7segment/7segment-e.svg';
import SEGMENTS_F from '@connectlab-editor/gates/7segment/7segment-f.svg';
import SEGMENTS_G from '@connectlab-editor/gates/7segment/7segment-g.svg';

export const LEDROutput: NodeModel = {
  id: NodeTypes.O_LED_RED,
  imgPath: [OUTPUT_LED_OFF, OUTPUT_LED_RED],
  connectionSlot: [
    {
      id: 0,
      in: true,
      name: 'In',
      localPos: new Vector2i(23, 66),
    },
  ],
};

export const SegmentsOutput: NodeModel = {
  id: NodeTypes.O_7_SEGMENTS,
  imgPath: [
    SEGMENTS_OFF,
    SEGMENTS_A,
    SEGMENTS_B,
    SEGMENTS_C,
    SEGMENTS_D,
    SEGMENTS_E,
    SEGMENTS_F,
    SEGMENTS_G,
  ],
  connectionSlot: [
    {
      id: 0,
      in: true,
      name: 'A',
      localPos: new Vector2i(-4, 17),
    },
    {
      id: 1,
      in: true,
      name: 'B',
      localPos: new Vector2i(-4, 32),
    },
    {
      id: 2,
      in: true,
      name: 'C',
      localPos: new Vector2i(-4, 46),
    },
    {
      id: 3,
      in: true,
      name: 'D',
      localPos: new Vector2i(-4, 60),
    },
    {
      id: 4,
      in: true,
      name: 'E',
      localPos: new Vector2i(-4, 75),
    },
    {
      id: 5,
      in: true,
      name: 'F',
      localPos: new Vector2i(-4, 89),
    },
    {
      id: 6,
      in: true,
      name: 'G',
      localPos: new Vector2i(-4, 103),
    },
  ],
};
