import Vector2i from '@connectlab-editor/types/vector2i';
import {NodeList, SlotList, TextList} from '@connectlab-editor/types/common';

export const componentEvents = {
  checkComponentClick(
    position: Vector2i,
    elementsList: NodeList | SlotList | TextList
  ): number[] {
    const collidedWith: Array<number> = [];
    for (const [key, component] of elementsList.entries()) {
      if (component.collisionShape instanceof Array) {
        console.warn(
          'Não utilize a função checkComponentClick para checar colisões com conexões!'
        );
        return [];
      }
      const collision = component.collisionShape.collisionWithPoint(position);
      if (collision) collidedWith.push(key);
    }
    return collidedWith;
  },
};
