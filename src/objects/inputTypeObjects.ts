import Vector2 from '../types/Vector2';
import {NodeTypeObject, NodeTypes} from '../types/types';
import INPUT_ON from '../assets/gates/INPUT_ON.svg';
import INPUT_OFF from '../assets/gates/INPUT_OFF.svg';

export const SwitchInput: NodeTypeObject = {
  id: NodeTypes.I_SWITCH,
  imgPath: [INPUT_OFF, INPUT_ON],
  connectionSlot: [
    {
      id: 0,
      in: false,
      name: 'A',
      localPos: new Vector2(70, 25),
    },
  ],
};
