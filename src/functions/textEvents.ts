import Point2i from '../types/Point2i';
import {TextList} from '../types/types';
import componentEvents from './Component/componentEvents';

export default {
  // Busca na lista de textos quais possuem uma colisão com o ponto do mouse
  checkTextClick(texts: TextList, position: Point2i): number[] {
    return componentEvents.checkComponentClick(position, texts);
  },
};
