import Vector2 from '@connectlab-editor/types/Vector2';
import {TextList} from '@connectlab-editor/types';
import componentEvents from '@connectlab-editor/events/componentEvents';
import MouseEvents from '@connectlab-editor/events/mouseEvents';

export default {
  // Busca na lista de textos quais possuem uma colisão com o ponto do mouse
  checkTextClick(texts: TextList, position: Vector2): number[] {
    return componentEvents.checkComponentClick(position, texts);
  },
  move(
    texts: TextList,
    mouseEvents: MouseEvents,
    v: Vector2,
    useDelta = true
  ): boolean {
    const textCollisions = mouseEvents.getCollisionList().texts;
    if (
      textCollisions.length === 0 ||
      !(
        mouseEvents.movingObject === 'none' ||
        mouseEvents.movingObject === 'text'
      )
    )
      return false;

    mouseEvents.movingObject = 'text';
    const text = texts.get(textCollisions[0]);
    if (text === undefined) return false;
    text.move(v, useDelta);
    return true;
  },
};
