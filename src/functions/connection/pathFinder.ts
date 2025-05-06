import BoxCollision from '@connectlab-editor/collisionShapes/boxCollision';
import {NodeList} from '@connectlab-editor/types/common';
import * as angles from '@connectlab-editor/types/consts';
import Vector2 from '@connectlab-editor/types/vector2';

export default {
  stepDirectionFromAtan2(atan2: number): Vector2 {
    const result = new Vector2(0, 0, false);
    if (atan2 <= angles.Rad45Deg && atan2 >= -angles.Rad45Deg) {
      result.x = 1;
    }
    if (atan2 > angles.Rad45Deg && atan2 < angles.Rad135Deg) {
      result.y = 1;
    }
    if (atan2 >= angles.Rad135Deg || atan2 <= -angles.Rad135Deg) {
      result.x = -1;
    }
    if (atan2 < -angles.Rad45Deg && atan2 > -angles.Rad135Deg) {
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
  floatEquals(a: number, b: number, precision: number) {
    return Math.abs(a - b) < precision;
  },
  currentDirection(
    previous: Vector2,
    next: Vector2,
    precision: number
  ): 'x' | 'y' | 'e' | 'c' {
    const diff = Vector2.sub(next, previous, undefined, false);
    const len = diff.len();
    if (diff.equals(Vector2.ZERO) && len === 0) return 'e';
    const atan2 = Vector2.atan2(previous, next);
    if (this.floatEquals(atan2, angles.HALF_PI, precision)) return 'y';
    if (this.floatEquals(atan2, 0, precision)) return 'x';
    return 'c';
  },
  optimizePath(pathList: Array<Vector2>, precision = 1e-5): Array<Vector2> {
    const result = [];
    let lastDirection: 'x' | 'y' | 'e' | 'c' = 'c';
    for (let i = 0; i < pathList.length; i++) {
      const direction = this.currentDirection(
        pathList[Math.max(0, i - 1)],
        pathList[Math.min(i, pathList.length - 1)],
        precision
      );

      if (
        direction === 'c' ||
        (direction !== lastDirection && lastDirection !== 'e')
      ) {
        result.push(pathList[i]);
      } else {
        if (direction === 'x') {
          result[result.length - 1].x = pathList[i].x;
        } else if (direction === 'y') {
          result[result.length - 1].y = pathList[i].y;
        }
      }
      lastDirection = direction;
    }
    return result.filter(v => !v.equals(Vector2.ONE));
  },
  simplePathFinder(
    start: Vector2,
    end: Vector2,
    stepDivisor: Vector2 = new Vector2(2, 1)
  ): Array<Vector2> {
    const list: Array<Vector2> = [];
    if (start.equals(end)) return list; // Não calcular se os vetores forem iguais
    const current = start.copy();
    const currentT = new Vector2(0, 0, false);
    let runs = 0;
    while (!current.equals(end)) {
      if (runs > 15) break;
      runs++;
      const atan2 = end.atan2(current);
      const step = this.stepDirectionFromAtan2(atan2);
      const nextT = step.abs().div(stepDivisor).add(currentT);
      list.push(nextT);
      Vector2.bilinear(start, end, nextT, current, true);
      Vector2.copy(nextT, currentT);
    }
    return list;
  },
  // Função principal
  find(start: Vector2, end: Vector2, nodeList: NodeList) {
    const simpleSearchArea = this.getSearchArea(start, end, 1);
    const collisions = this.getCollisionsInArea(nodeList, simpleSearchArea);
    let path: Array<Vector2> = [];
    if (collisions.size === 0) {
      path = this.simplePathFinder(start, end);
    } else {
      // Todo: return busca complexa
    }
    return this.optimizePath(path);
  },
};
