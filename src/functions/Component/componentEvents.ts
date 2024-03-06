import Vector2 from '../../types/Vector2';
import {NodeList, SlotList, TextList} from '../../types/types';

export default {
  checkComponentClick(
    position: Vector2,
    elementsList: NodeList | SlotList | TextList
  ): number[] {
    const collidedWith: Array<number> = [];
    elementsList.forEach((component, key) => {
      const collision = component.collisionShape.collisionWithPoint(position);
      if (collision) collidedWith.push(key);
    });
    return collidedWith;
  },
};
