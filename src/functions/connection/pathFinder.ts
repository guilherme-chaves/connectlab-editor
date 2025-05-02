import BoxCollision from '@connectlab-editor/collisionShapes/boxCollision';
import * as angles from '@connectlab-editor/types/consts';
import Vector2 from '@connectlab-editor/types/vector2';

export default {
  stepDirectionFromAtan2(atan2: number): Vector2 {
    const result = new Vector2();
    if (atan2 < angles.Rad45Deg && atan2 > -angles.Rad45Deg) {
      result.x = 1;
    }
    if (atan2 >= angles.Rad45Deg && atan2 < angles.Rad135Deg) {
      result.y = 1;
    }
    if (atan2 >= angles.Rad135Deg || atan2 <= -angles.Rad135Deg) {
      result.x = -1;
    }
    if (atan2 <= -angles.Rad45Deg && atan2 > -angles.Rad135Deg) {
      result.y = -1;
    }
    return result;
  },
};
