import BoxCollision from '@connectlab-editor/collisionShapes/boxCollision';
import {NodeList} from '@connectlab-editor/types/common';
import * as angles from '@connectlab-editor/types/consts';
import Vector2 from '@connectlab-editor/types/vector2';

type scoreList = Record<
  string, // x:y
  {
    t: Vector2;
    fromT: Vector2 | null;
    score: number;
  }
>;

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
  stepCollisionExists(
    start: Vector2,
    end: Vector2,
    current: Vector2,
    nextT: Vector2,
    nodeList: NodeList
  ): boolean {
    const next = Vector2.bilinear(start, end, nextT);
    for (const node of nodeList.values()) {
      if (node.collisionShape.collisionWithLine(current, next)) return true;
    }
    return false;
  },
  manhattanDistance(p1: Vector2, p2: Vector2): number {
    return Math.abs(p1.x - p2.x) + Math.abs(p1.y + p2.y);
  },
  computeStepScore(start: Vector2, current: Vector2, end: Vector2): number {
    return (
      this.manhattanDistance(start, current) +
      this.manhattanDistance(current, end)
    );
  },
  createPathFromScores(scores: scoreList): Array<Vector2> {
    let current = scores['1:1'] ?? null;
    const list: Array<Vector2> = [];
    if (current === null) return [];
    while (current.fromT !== null) {
      list.unshift(current.t);
      current = scores[`${current.fromT.x}:${current.fromT.y}`];
    }
    return list;
  },
  complexPathFinder(
    start: Vector2,
    end: Vector2,
    nodeList: NodeList,
    stepDivisor: Vector2 = new Vector2(2, 1)
  ) {
    const list: Array<Vector2> = [];
    if (start.equals(end)) return list; // Não calcular se os vetores forem iguais
    const current = start.copy();
    const currentT = new Vector2(0, 0, false);
    const scores: Record<
      string, // x:y
      {
        t: Vector2;
        fromT: Vector2 | null;
        score: number;
      }
    > = {};
    scores['0:0'] = {
      t: new Vector2(0, 0, false),
      fromT: null,
      score: this.computeStepScore(start, start, end),
    };
    let runs = 0;
    while (!current.equals(end)) {
      if (runs > 127) break;
      runs++;
      const atan2 = end.atan2(current);
      const desiredStep = this.stepDirectionFromAtan2(atan2);
      const nextT = desiredStep.abs().div(stepDivisor).add(currentT);
      if (!this.stepCollisionExists(start, end, current, nextT, nodeList)) {
        const next = Vector2.bilinear(start, end, nextT, undefined, true);
        const nextScore = this.computeStepScore(start, current, end);
        if (
          scores[`${nextT.x}:${nextT.y}`] === undefined ||
          scores[`${nextT.x}:${nextT.y}`].score > nextScore
        ) {
          scores[`${nextT.x}:${nextT.y}`] = {
            t: nextT,
            fromT: currentT,
            score: nextScore,
          };
        }
        Vector2.copy(next, current);
        Vector2.copy(nextT, currentT);
        continue;
      }
    }
    return this.createPathFromScores(scores);
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
