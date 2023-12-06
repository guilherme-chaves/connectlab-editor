import Editor from '../Editor';
import Vector2 from '../types/Vector2';
import componentEvents from './Component/componentEvents';

export default {
  // Busca na lista de slots quais possuem uma colisão com o ponto do mouse
  checkSlotClick(position: Vector2): string[] | undefined {
    return componentEvents.checkComponentClick(
      position,
      Editor.editorEnv.slots
    );
  },
};
