import Vector2 from '../types/Vector2';
import {InputTypeObject, InputTypes} from '../types/types';

const SwitchInput: InputTypeObject = {
  id: InputTypes.SWITCH,
  connectionSlot: {
    id: 0,
    name: 'A',
    localPos: new Vector2(70, 25),
  },
  op(slotsState) {
    return slotsState;
  },
};

export {SwitchInput};
