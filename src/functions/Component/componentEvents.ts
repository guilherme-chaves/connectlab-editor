import Point2i from '../../types/Point2i';
import {
  NodeList,
  InputList,
  OutputList,
  SlotList,
  TextList,
} from '../../types/types';

export default {
  checkComponentClick(
    position: Point2i,
    elementsList: NodeList | InputList | OutputList | SlotList | TextList
  ): number[] | undefined {
    let collided = false;
    const collidedWith: Array<number> = [];
    elementsList.forEach((component, key) => {
      const collision = component.collisionShape.collisionWithPoint(position);
      if (collision) collidedWith.push(key);
      collided = collided || collision;
    });
    return collided ? collidedWith : undefined;
  },
};
