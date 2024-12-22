import Vector2 from '@connectlab-editor/types/vector2';
import {SlotList} from '@connectlab-editor/types';
import {componentEvents} from '@connectlab-editor/events/componentEvents';

export default {
  // Busca na lista de slots quais possuem uma colisão com o ponto do mouse
  checkSlotClick(slots: SlotList, position: Vector2): number[] {
    return componentEvents.checkComponentClick(position, slots);
  },
};
