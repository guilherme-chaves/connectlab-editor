import Point2i from '../types/Point2i';
import {SlotList} from '../types/types';
import componentEvents from './Component/componentEvents';

export default {
  // Busca na lista de slots quais possuem uma colisão com o ponto do mouse
  checkSlotClick(slots: SlotList, position: Point2i): number[] {
    return componentEvents.checkComponentClick(position, slots);
  },
};
