import Vector2 from '../types/Vector2i';
import {InputTypeObject, InputTypes} from '../types/types';

const SwitchInput: InputTypeObject = {
  id: InputTypes.SWITCH,
  connectionSlot: {
    id: 0,
    name: 'A',
    localPos: new Vector2(70, 25),
  },
  op(slotState) {
    return slotState.length > 0 ? slotState[0] : false;
  },
};

export {SwitchInput};
