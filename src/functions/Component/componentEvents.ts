import Vector2 from '../../types/Vector2';
import {
  NodeList,
  InputList,
  OutputList,
  SlotList,
  TextList,
} from '../../types/types';

export default {
  checkComponentClick(
    position: Vector2,
    elementsList: NodeList | InputList | OutputList | SlotList | TextList
  ): number[] | undefined {
    let collided = false;
    const collidedWith = new Array<number>();
    elementsList.forEach((component, key) => {
      const collision = component.collisionShape.collisionWithPoint(position);
      if (collision) collidedWith.push(key);
      collided = collided || collision;
    });
    return collided ? collidedWith : undefined;
  },
};
