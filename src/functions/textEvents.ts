import Editor from '../Editor';
import Vector2 from '../types/Vector2';
import componentEvents from './Component/componentEvents';

export default {
  // Busca na lista de textos quais possuem uma colisão com o ponto do mouse
  checkTextClick(position: Vector2): string[] | undefined {
    return componentEvents.checkComponentClick(
      position,
      Editor.editorEnv.texts
    );
  },
};
