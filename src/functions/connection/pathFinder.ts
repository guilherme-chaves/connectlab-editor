import BoxCollision from '@connectlab-editor/collisionShapes/boxCollision';
import LineCollision from '@connectlab-editor/collisionShapes/lineCollision';
import {NodeList} from '@connectlab-editor/types/common';
import * as angles from '@connectlab-editor/types/consts';
import Vector2 from '@connectlab-editor/types/vector2';
import Heap from 'heap';

type ScoreNode = {
  position: Vector2;
  t: Vector2;
  from: string | undefined; // tx::ty
  score: number;
};
type ScoreGraph = Map<string, ScoreNode>; // x::y

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
      minPoint.sub(multiplier === 1 ? 0 : dist),
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
    if (this.floatEquals(atan2, angles.Rad90Deg, precision)) return 'y';
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
    stepSize: Vector2 = new Vector2(0.5, 1, false)
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
      const nextT = step.abs().mul(stepSize).add(currentT);
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
      if (
        node.collisionShape.collisionWithLine(new LineCollision(current, next))
      )
        return true;
    }
    return false;
  },
  manhattanDistance(p1: Vector2, p2: Vector2): number {
    return Math.abs(p1.x - p2.x) + Math.abs(p1.y - p2.y);
  },
  computeStepScore(start: Vector2, current: Vector2, end: Vector2): number {
    return (
      this.manhattanDistance(start, current) +
      this.manhattanDistance(current, end)
    );
  },
  createPathFromScores(scores: ScoreGraph, end: Vector2): Array<Vector2> {
    let current: ScoreNode | undefined = scores.get(`${end.x}::${end.y}`);
    const path: Array<Vector2> = [];
    while (current !== undefined) {
      path.unshift(new Vector2(current.t, undefined, false));
      current =
        current.from !== undefined ? scores.get(current.from) : undefined;
    }
    return path;
  },
  setNodeScore(
    scoreGraph: ScoreGraph,
    start: Vector2,
    end: Vector2,
    nodePosition: Vector2,
    nodeT: Vector2,
    from: Vector2 | undefined
  ): boolean {
    const key = `${nodePosition.x}::${nodePosition.y}`;
    const [fromKey, fromScore] =
      from !== undefined
        ? [
            `${from.x}::${from.y}`,
            scoreGraph.get(`${from.x}::${from.y}`)?.score ?? 0,
          ]
        : [undefined, 0];
    const nodeScore = scoreGraph.get(key)?.score ?? Infinity;
    if (isNaN(nodeScore)) return false;
    if (from !== undefined && nodePosition.equals(from)) return false;
    const tmpScore =
      this.computeStepScore(start, nodePosition, end) + fromScore;

    if (tmpScore < nodeScore) {
      scoreGraph.set(key, {
        position: nodePosition,
        t: nodeT,
        from: fromKey,
        score: tmpScore,
      });
      return true;
    }
    return false;
  },
  testStep(
    start: Vector2,
    end: Vector2,
    current: Vector2,
    currentT: Vector2,
    step: Vector2,
    nodeList: NodeList,
    maxStepSize: Vector2,
    minStepSize: Vector2,
    currentStepSize: Vector2
  ): [boolean, Vector2, Vector2] {
    // Não foi possível encontrar uma posição válida dentro dos limites
    if (
      !Vector2.min(minStepSize, currentStepSize, undefined, false).equals(
        minStepSize
      )
    )
      return [false, Vector2.ZERO, Vector2.ZERO];
    const nextT = Vector2.mul(step, currentStepSize, undefined, false).add(
      currentT
    );
    const next = Vector2.bilinear(start, end, nextT);
    if (this.stepCollisionExists(start, end, current, nextT, nodeList)) {
      const stepReduce = Vector2.mul(step, 2).abs().max(Vector2.ONE);
      return this.testStep(
        start,
        end,
        current,
        currentT,
        step,
        nodeList,
        maxStepSize,
        minStepSize,
        currentStepSize.div(stepReduce)
      );
    }
    return [true, next, nextT];
  },
  getPossibleNextSteps(
    start: Vector2,
    end: Vector2,
    current: Vector2,
    currentT: Vector2,
    nodeList: NodeList,
    maxStepSize: Vector2,
    minStepSize: Vector2
  ): Array<[Vector2, Vector2]> {
    const nextSteps: Array<[Vector2, Vector2]> = [];
    const preferredStep = this.stepDirectionFromAtan2(current.atan2(end));
    const directions: Array<['direct' | 'alt', Vector2]> = [
      ['direct', preferredStep],
      ['alt', Vector2.rotate(preferredStep, angles.Rad90Deg)],
      ['alt', Vector2.rotate(preferredStep, angles.Rad270Deg)],
    ];
    for (const direction of directions) {
      const [stepFound, position, t] = this.testStep(
        start,
        end,
        current,
        currentT,
        direction[1],
        nodeList,
        maxStepSize,
        minStepSize,
        direction[0] === 'direct'
          ? maxStepSize.copy()
          : maxStepSize.copy().div(2)
      );
      if (stepFound) {
        nextSteps.push([position, t]);
      }
    }
    return nextSteps;
  },
  complexPathFinder(
    start: Vector2,
    end: Vector2,
    nodeList: NodeList
  ): [boolean, Array<Vector2>] {
    const scoreGraph: ScoreGraph = new Map();
    this.setNodeScore(
      scoreGraph,
      start,
      end,
      start,
      new Vector2(0, 0, false),
      undefined
    );
    const openSet: Heap<{key: string; score: number}> = new Heap(
      (a, b) => a.score - b.score
    );
    openSet.push({
      key: `${start.x}::${start.y}`,
      score: scoreGraph.get(`${start.x}::${start.y}`)!.score,
    });

    const distance = Vector2.sub(start, end, undefined, false)
      .abs()
      .max(Vector2.ONE);
    // Maior passo possível = metade da distância entre os dois pontos
    const maxStepSize = new Vector2(0.5, 0.5, false);
    // Menor passo possível = 8 pixels
    const minStepSize: Vector2 = new Vector2(8, 8, false)
      .div(distance)
      .min(maxStepSize);

    let runCount = 0;
    while (runCount <= 1024 && openSet.size() > 0) {
      runCount++;
      const current = openSet.pop()!;

      const currentNode = scoreGraph.get(current.key)!;
      const currentPosition = currentNode.position;
      const currentT = currentNode.t;
      if (currentPosition.equals(end, 8)) {
        this.setNodeScore(
          scoreGraph,
          start,
          end,
          end,
          new Vector2(1, 1, false),
          currentPosition
        );
        return [true, this.createPathFromScores(scoreGraph, end)];
      }
      const nextSteps = this.getPossibleNextSteps(
        start,
        end,
        currentPosition,
        currentT,
        nodeList,
        maxStepSize,
        minStepSize
      );
      if (nextSteps.length === 0) {
        scoreGraph.set(current.key, {
          position: currentPosition,
          t: currentT,
          from: currentNode.from,
          score: NaN,
        });
        if (currentNode.from !== undefined) {
          openSet.push({
            key: currentNode.from,
            score: scoreGraph.get(currentNode.from)!.score,
          });
        }
        continue;
      }
      for (const next of nextSteps) {
        if (
          this.setNodeScore(
            scoreGraph,
            start,
            end,
            next[0],
            next[1],
            currentPosition
          )
        ) {
          openSet.push({
            key: `${next[0].x}::${next[0].y}`,
            score: scoreGraph.get(`${next[0].x}::${next[0].y}`)!.score,
          });
        }
      }
    }
    return [false, []];
  },
  // Função principal
  find(start: Vector2, end: Vector2, nodeList: NodeList) {
    const simpleSearchArea = this.getSearchArea(start, end, 1);
    let collisions = this.getCollisionsInArea(nodeList, simpleSearchArea);
    if (collisions.size === 0) {
      return this.simplePathFinder(start, end);
    } else {
      const complexSearchArea = this.getSearchArea(start, end, 3);
      collisions = this.getCollisionsInArea(nodeList, complexSearchArea);
      const [success, path] = this.complexPathFinder(start, end, collisions);
      return success ? path : this.simplePathFinder(start, end);
    }
  },
};
