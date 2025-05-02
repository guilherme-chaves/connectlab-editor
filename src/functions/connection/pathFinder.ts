import BoxCollision from '@connectlab-editor/collisionShapes/boxCollision';
import {NodeList} from '@connectlab-editor/types/common';
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
  // Filtra a lista de nodes e retorna apenas aqueles que existem dentro de uma área
  getCollisionsInArea(nodeList: NodeList, box: BoxCollision): NodeList {
    const list: NodeList = new Map();
    for (const node of nodeList.values()) {
      if (node.collisionShape.collisionWithBox(box)) list.set(node.id, node);
    }
    return list;
  },
  // Função principal
  find(p1: Vector2, p2: Vector2, nodeList: NodeList) {
    const simpleSearchArea = this.getSearchArea(p1, p2, 1);
    const collisions = this.getCollisionsInArea(nodeList, simpleSearchArea);
    if (collisions.size === 0) {
      // Todo: return busca simples
    } else {
      // Todo: return busca complexa
    }
  },
};
