import BoxCollision from '@connectlab-editor/collisionShapes/boxCollision';
import LineCollision from '@connectlab-editor/collisionShapes/lineCollision';
import { NodeList } from '@connectlab-editor/types/common';
import * as angles from '@connectlab-editor/types/consts';
import Vector2 from '@connectlab-editor/interfaces/vector2Interface';
import Vector2f from '@connectlab-editor/types/vector2f';
import Vector2i from '@connectlab-editor/types/vector2i';
import Heap from 'heap';

type PathNode = {
  position: Vector2i
  t: Vector2f
  from: Vector2i | undefined // tx::ty
  score: number
};
type PathGraph = Map<string, PathNode>; // x::y
enum NodeUpdateStatus {
  NO_CHANGE = 0,
  CHANGE = 1,
  SAME_POSITION = 2,
  INVALID = 3,
  LOOP = 4,
}

export default {
  collisionList: <NodeList>(new Map()),
  stepDirectionFromAtan2(atan2: number): Vector2f {
    const result = Vector2f.ZERO;
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
    const dist = Vector2f.sub(p1, p2).abs();
    const size: Vector2f = dist.clone().mul(multiplier);
    const minPoint = Vector2i.min(p1, p2);
    const maxPoint = Vector2i.max(p1, p2);
    const center = Vector2f.add(minPoint, maxPoint).div(2);
    Vector2i.sub(center, Vector2f.div(size, 2), minPoint);
    return new BoxCollision(minPoint, size.x, size.y);
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
    precision: number,
  ): 'x' | 'y' | 'e' | 'c' {
    const diff = Vector2f.sub(next, previous);
    const len = diff.len();
    if (diff.equals(Vector2f.ZERO) && len === 0) return 'e';
    const atan2 = previous.atan2(next);
    if (this.floatEquals(atan2, angles.Rad90Deg, precision)) return 'y';
    if (this.floatEquals(atan2, 0, precision)) return 'x';
    return 'c';
  },
  optimizePath(pathList: Array<Vector2f>, precision = 1e-5): Array<Vector2f> {
    const result: Array<Vector2f> = [];
    let lastDirection: 'x' | 'y' | 'e' | 'c' = 'c';
    for (let i = 0; i < pathList.length; i++) {
      const direction = this.currentDirection(
        pathList[Math.max(0, i - 1)],
        pathList[Math.min(i, pathList.length - 1)],
        precision,
      );

      if (
        direction === 'c'
        || (direction !== lastDirection && lastDirection !== 'e')
      ) {
        result.push(pathList[i]);
      }
      else {
        if (direction === 'x') {
          result[result.length - 1].x = pathList[i].x;
        }
        else if (direction === 'y') {
          result[result.length - 1].y = pathList[i].y;
        }
      }
      lastDirection = direction;
    }
    return result.filter(v => !v.equals(Vector2f.ONE));
  },
  simplePathFinder(
    start: Vector2i,
    end: Vector2i,
    stepSize: Vector2f = new Vector2f(0.5, 1),
  ): Array<Vector2f> {
    const list: Array<Vector2f> = [];
    // Não calcular se os vetores forem iguais
    if (start.equals(end)) return list;
    const current = start.clone();
    const currentT = Vector2f.ZERO;
    let runs = 0;
    while (!current.equals(end)) {
      if (runs > 15) break;
      runs++;
      const atan2 = end.atan2(current);
      const step = this.stepDirectionFromAtan2(atan2);
      const nextT = step.abs().mul(stepSize).add(currentT);
      list.push(nextT);
      Vector2i.bilinear(start, end, nextT, current);
      currentT.copy(nextT);
    }
    return list;
  },
  stepCollisionExists(
    start: Vector2i,
    end: Vector2i,
    current: Vector2i,
    nextT: Vector2f,
    nodeList: NodeList,
  ): boolean {
    const next = Vector2i.bilinear(start, end, nextT);
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
  computeStepScore(start: Vector2i, current: Vector2i, end: Vector2i): number {
    return (
      this.manhattanDistance(start, current)
      + this.manhattanDistance(current, end)
    );
  },
  createPathFromScores(scores: PathGraph, end: Vector2i): Array<Vector2f> {
    let current: PathNode | undefined = scores.get(`${end.x}::${end.y}`);
    const path: Array<Vector2f> = [];
    while (current !== undefined) {
      path.push(current.t.clone());
      current
        = current.from !== undefined
          ? scores.get(`${current.from.x}::${current.from.y}`)
          : undefined;
    }
    scores.clear();
    return path.reverse();
  },
  setNodeScore(
    pathGraph: PathGraph,
    start: Vector2i,
    end: Vector2i,
    nodePosition: Vector2i,
    nodeKey: string,
    nodeT: Vector2f,
    from: Vector2i | undefined,
  ): NodeUpdateStatus {
    let fromKey = undefined;
    const nodeScore = pathGraph.get(nodeKey)?.score ?? Infinity;
    if (isNaN(nodeScore)) return NodeUpdateStatus.INVALID;
    if (from !== undefined) {
      fromKey = `${from.x}::${from.y}`;
      const fromNode = pathGraph.get(fromKey);
      if (nodePosition.equals(from)) return NodeUpdateStatus.SAME_POSITION;
      if (fromNode?.from?.equals(from)) return NodeUpdateStatus.LOOP;
    }
    const tmpScore = this.computeStepScore(start, nodePosition, end);

    if (tmpScore < nodeScore) {
      pathGraph.set(nodeKey, {
        position: nodePosition,
        t: nodeT,
        from,
        score: tmpScore,
      });
      return NodeUpdateStatus.CHANGE;
    }
    return NodeUpdateStatus.NO_CHANGE;
  },
  testStep(
    start: Vector2i,
    end: Vector2i,
    current: Vector2i,
    currentT: Vector2f,
    step: Vector2f,
    nodeList: NodeList,
    minStepSize: Vector2f,
    currentStepSize: Vector2f,
  ): [boolean, Vector2i, Vector2f] {
    const nextT = Vector2f.mul(step, currentStepSize).add(currentT);
    const next = Vector2i.bilinear(start, end, nextT);
    while (Vector2f.min(currentStepSize, minStepSize).equals(minStepSize)) {
      if (this.stepCollisionExists(start, end, current, nextT, nodeList)) {
        currentStepSize.sub(0.075);
        continue;
      }
      return [true, next, nextT];
    }
    return [false, Vector2i.ZERO, Vector2f.ZERO];
  },
  getPossibleNextSteps(
    start: Vector2i,
    end: Vector2i,
    current: Vector2i,
    currentT: Vector2f,
    nodeList: NodeList,
    maxStepSize: Vector2f,
    minStepSize: Vector2f,
  ): Array<[Vector2i, Vector2f]> {
    const nextSteps: Array<[Vector2i, Vector2f]> = [];
    const preferredStep = this.stepDirectionFromAtan2(current.atan2(end));
    const directions: Array<Vector2f> = [
      preferredStep,
      Vector2f.rotate(preferredStep, angles.Rad90Deg),
      Vector2f.rotate(preferredStep, angles.Rad270Deg),
    ];
    for (const direction of directions) {
      const [stepFound, position, t] = this.testStep(
        start,
        end,
        current,
        currentT,
        direction,
        nodeList,
        minStepSize,
        maxStepSize.clone(),
      );
      if (stepFound) {
        nextSteps.push([position, t]);
      }
    }
    return nextSteps;
  },
  complexPathFinder(
    start: Vector2i,
    end: Vector2i,
    nodeList: NodeList,
  ): [boolean, Array<Vector2f>] {
    const pathGraph: PathGraph = new Map();
    this.setNodeScore(
      pathGraph,
      start,
      end,
      start,
      `${start.x}::${start.y}`,
      new Vector2f(0, 0),
      undefined,
    );
    const openSet: Heap<{ key: Vector2i, score: number }> = new Heap(
      (a, b) => a.score - b.score,
    );
    openSet.push({
      key: start,
      score: pathGraph.get(`${start.x}::${start.y}`)!.score,
    });

    const distance = Vector2f.sub(start, end).abs().max(Vector2f.ONE);
    // Maior passo possível = metade da distância entre os dois pontos
    const maxStepSize = new Vector2f(0.5, 0.5);
    // Menor passo possível = 8 pixels
    const minStepSize: Vector2f = new Vector2f(4, 4)
      .div(distance)
      .min(maxStepSize);

    let runCount = 0;
    while (runCount <= 512 && openSet.size() > 0) {
      runCount++;
      const current = openSet.pop()!;

      const currentNode = pathGraph.get(`${current.key.x}::${current.key.y}`)!;
      const currentNodeKey = `${current.key.x}::${current.key.y}`;
      const currentPosition = currentNode.position;
      const currentT = currentNode.t;
      if (currentPosition.equals(end, 16)) {
        this.setNodeScore(
          pathGraph,
          start,
          end,
          end,
          currentNodeKey,
          new Vector2f(1, 1),
          currentPosition,
        );
        return [true, this.createPathFromScores(pathGraph, end)];
      }
      const nextSteps = this.getPossibleNextSteps(
        start,
        end,
        currentPosition,
        currentT,
        nodeList,
        maxStepSize,
        minStepSize,
      );
      if (nextSteps.length === 0) {
        pathGraph.set(currentNodeKey, {
          position: currentPosition,
          t: currentT,
          from: currentNode.from,
          score: NaN,
        });
        if (currentNode.from !== undefined) {
          openSet.push({
            key: currentNode.from,
            score: pathGraph.get(currentNodeKey)!.score,
          });
        }
        continue;
      }
      for (const next of nextSteps) {
        switch (
          this.setNodeScore(
            pathGraph,
            start,
            end,
            next[0],
            currentNodeKey,
            next[1],
            currentPosition,
          )
        ) {
          case NodeUpdateStatus.CHANGE:
            openSet.push({
              key: next[0],
              score: pathGraph.get(`${next[0].x}::${next[0].y}`)!.score,
            });
            break;
          case NodeUpdateStatus.SAME_POSITION:
          case NodeUpdateStatus.LOOP:
            if (currentNode.from !== undefined)
              openSet.push({
                key: currentNode.from,
                score:
                  pathGraph.get(currentNodeKey)?.score ?? Infinity,
              });
            currentNode.score = NaN;
            break;
        }
      }
    }
    return [false, []];
  },
  // Função principal
  find(start: Vector2i, end: Vector2i, nodeList: NodeList) {
    if (start.equals(end, 8)) return [];
    const simpleSearchArea = this.getSearchArea(start, end, 1);
    this.collisionList = this.getCollisionsInArea(nodeList, simpleSearchArea);
    if (this.collisionList.size === 0) {
      return this.simplePathFinder(start, end);
    }
    else {
      const complexSearchArea = this.getSearchArea(start, end, 3);
      this.collisionList
        = this.getCollisionsInArea(nodeList, complexSearchArea);
      const [success, path] = this.complexPathFinder(
        start,
        end,
        this.collisionList,
      );
      return success ? path : this.simplePathFinder(start, end);
    }
  },
};
