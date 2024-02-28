import {Vector} from 'two.js/src/vector';
import {
  NodeList,
  InputList,
  OutputList,
  SlotList,
  TextList,
} from '../../types/types';

export default {
  checkComponentClick(
    position: Vector,
    elementsList: NodeList | InputList | OutputList | SlotList | TextList
  ): number[] {
    const collidedWith: Array<number> = [];
    elementsList.forEach((component, key) => {
      const collision = component.collisionShape.collisionWithPoint(
        position.x,
        position.y
      );
      if (collision) collidedWith.push(key);
    });
    return collidedWith;
  },
};
