import Editor from '../../Editor';
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
    elementList: NodeList | InputList | OutputList | SlotList | TextList
  ): string[] | undefined {
    let collided = false;
    const collidedWith = new Array<string>();
    Object.keys(elementList).forEach(key => {
      const collision =
        elementList[key].collisionShape.collisionWithPoint(position);
      if (collision) collidedWith.push(key);
      collided = collided || collision;
    });
    return collided ? collidedWith : undefined;
  },
};
