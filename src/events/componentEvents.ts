import Vector2 from '@connectlab-editor/types/Vector2';
import {NodeList, SlotList, TextList} from '@connectlab-editor/types';

export const componentEvents = {
  checkComponentClick(
    position: Vector2,
    elementsList: NodeList | SlotList | TextList
  ): number[] {
    const collidedWith: Array<number> = [];
    for (const [key, component] of elementsList.entries()) {
      const collision = component.collisionShape.collisionWithPoint(position);
      if (collision) collidedWith.push(key);
    }
    return collidedWith;
  },
};
