import Vector2 from '../types/Vector2';
import {SlotList} from '../types/types';
import componentEvents from './Component/componentEvents';

export default {
  // Busca na lista de slots quais possuem uma colisão com o ponto do mouse
  checkSlotClick(slots: SlotList, position: Vector2): number[] | undefined {
    return componentEvents.checkComponentClick(position, slots);
  },
};
