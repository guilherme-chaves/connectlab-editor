import INPUT_OFF from '../assets/gates/INPUT_OFF.svg';
import INPUT_ON from '../assets/gates/INPUT_ON.svg';
import {Vector} from 'two.js/src/vector';
import {InputTypeObject, InputTypes} from '../types/types';

const SwitchInput: InputTypeObject = {
  id: InputTypes.SWITCH,
  imgPaths: [INPUT_OFF, INPUT_ON],
  connectionSlot: {
    id: 0,
    name: 'A',
    localPos: new Vector(70, 25),
  },
  op(slotState) {
    return slotState.length > 0 ? slotState[0] : false;
  },
};

export {SwitchInput};
