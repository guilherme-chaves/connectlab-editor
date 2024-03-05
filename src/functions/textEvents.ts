import Vector2 from '../types/Vector2';
import {TextList} from '../types/types';
import componentEvents from './Component/componentEvents';

export default {
  // Busca na lista de textos quais possuem uma colisão com o ponto do mouse
  checkTextClick(texts: TextList, position: Vector2): number[] {
    return componentEvents.checkComponentClick(position, texts);
  },
};
