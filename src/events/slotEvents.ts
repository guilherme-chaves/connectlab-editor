import Vector2i from '@connectlab-editor/types/vector2i';
import {SlotList} from '@connectlab-editor/types/common';
import {componentEvents} from '@connectlab-editor/events/componentEvents';

export default {
  // Busca na lista de slots quais possuem uma colisão com o ponto do mouse
  checkSlotClick(slots: SlotList, position: Vector2i): number[] {
    return componentEvents.checkComponentClick(position, slots);
  },
};
