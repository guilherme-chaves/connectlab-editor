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
  // Aumenta a área de busca para caminhos
  getSearchArea(p1: Vector2, p2: Vector2, multiplier = 3): BoxCollision {
    const dist = Vector2.sub(p1, p2).abs();
    const minPoint = Vector2.min(p1, p2);
    return new BoxCollision(
      minPoint.sub(dist),
      dist.x * multiplier,
      dist.y * multiplier
    );
  },
};
