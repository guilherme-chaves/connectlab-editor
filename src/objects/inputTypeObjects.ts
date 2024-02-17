import Point2i from '../types/Point2i';
import {InputTypeObject, InputTypes} from '../types/types';
import INPUT_ON from '../assets/gates/INPUT_ON.svg';
import INPUT_OFF from '../assets/gates/INPUT_OFF.svg';

export const SwitchInput: InputTypeObject = {
  id: InputTypes.SWITCH,
  imgPaths: [INPUT_OFF, INPUT_ON],
  connectionSlot: {
    id: 0,
    name: 'A',
    localPos: new Point2i(70, 25),
  },
  op(slotState) {
    return slotState.length > 0 ? slotState[0] : false;
  },
};
