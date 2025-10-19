import Vector2i from '@connectlab-editor/types/vector2i';
import { TextList } from '@connectlab-editor/types/common';
import { componentEvents } from '@connectlab-editor/events/componentEvents';
import MouseEvents from '@connectlab-editor/events/mouseEvents';

export default {
  // Busca na lista de textos quais possuem uma colisão com o ponto do mouse
  checkTextClick(texts: TextList, position: Vector2i): number[] {
    return componentEvents.checkComponentClick(position, texts);
  },
  move(
    texts: TextList,
    mouseEvents: MouseEvents,
    v: Vector2i,
    useDelta = true,
  ): boolean {
    const textCollisions = mouseEvents.getCollisionList().texts;
    if (
      textCollisions.length === 0
      || !(
        MouseEvents.movingObject === 'none'
        || MouseEvents.movingObject === 'text'
      )
    )
      return false;

    MouseEvents.movingObject = 'text';
    const text = texts.get(textCollisions[0]);
    if (text === undefined) return false;
    text.move(v, useDelta);
    return true;
  },
};
