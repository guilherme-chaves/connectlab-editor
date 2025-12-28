import BoxCollision from '@connectlab-editor/collisionShapes/boxCollision';
import LineCollision from '@connectlab-editor/collisionShapes/lineCollision';
import Collision from '@connectlab-editor/interfaces/collisionInterface';
import { NodeList } from '@connectlab-editor/types/common';
import * as angles from '@connectlab-editor/types/consts';
import Vector2f from '@connectlab-editor/types/vector2f';
import Vector2i from '@connectlab-editor/types/vector2i';
import Heap from 'heap';

type CollisionMap = Map<number, Collision>;
type PathNode = {
  id: string
  position: Vector2i
  t: Vector2f
  score: number
  from: Array<PathNode>
  to: Array<PathNode>
};
type PathGraph = Map<string, PathNode>; // x::y
const enum NodeUpdateStatus {
  NO_SCORE_CHANGE = 0,
  SCORE_CHANGE = 1,
  SAME_POSITION = 2,
  INVALID = 3,
  LOOP = 4,
}

const enum PathDirections {
  DOWN,
  UP,
  LEFT,
  RIGHT,
  SAME_POSITION,
  UNKNOWN,
}

export default {
  collisionList: new Map() as CollisionMap,
  currentLineCollisions: new Map() as CollisionMap,
  searchArea: new BoxCollision(Vector2i.ZERO, 100, 100),
  stepDirectionFromAtan2(atan2: number): Vector2f[] {
    if (atan2 <= angles.Rad45Deg && atan2 >= -angles.Rad45Deg) {
      return [Vector2f.RIGHT, Vector2f.UP, Vector2f.DOWN, Vector2f.LEFT];
    }
    if (atan2 > angles.Rad45Deg && atan2 < angles.Rad135Deg) {
      return [Vector2f.DOWN, Vector2f.RIGHT, Vector2f.LEFT, Vector2f.UP];
    }
    if (atan2 >= angles.Rad135Deg || atan2 <= -angles.Rad135Deg) {
      return [Vector2f.LEFT, Vector2f.DOWN, Vector2f.UP, Vector2f.RIGHT];
    }
    if (atan2 < -angles.Rad45Deg && atan2 > -angles.Rad135Deg) {
      return [Vector2f.UP, Vector2f.LEFT, Vector2f.RIGHT, Vector2f.DOWN];
    }
    return [Vector2f.ZERO];
  },
  // Aumenta a área de busca para caminhos
  getSearchArea(p1: Vector2i, p2: Vector2i, multiplier = 3): BoxCollision {
    const dist = Vector2f.abs(Vector2f.sub(p1, p2));
    const size = Vector2f.mul(dist, multiplier);
    const minPoint = Vector2i.min(p1, p2);
    const maxPoint = Vector2i.max(p1, p2);
    const center = Vector2f.div(Vector2f.add(minPoint, maxPoint), 2);
    Vector2i.sub(center, Vector2f.div(size, 2), minPoint);
    return new BoxCollision(minPoint, size.x, size.y);
  },
  // Filtra a lista de nodes e retorna apenas aqueles que existem dentro de uma área
  getCollisionsInArea(nodeList: NodeList, box: BoxCollision): CollisionMap {
    this.currentLineCollisions.clear();
    for (const node of nodeList.values()) {
      if (node.collisionShape.collisionWithBox(box))
        this.currentLineCollisions.set(node.id, node.collisionShape);
    }
    return this.currentLineCollisions;
  },
  currentDirection(
    previous: Vector2f,
    next: Vector2f,
    precision: number,
  ): PathDirections {
    const diff = Vector2f.sub(next, previous);
    if (Vector2f.equals(diff, Vector2f.ZERO, precision))
      return PathDirections.SAME_POSITION;
    const direction = this.stepDirectionFromAtan2(
      Vector2f.atan2(previous, next),
    )[0];
    if (Vector2i.equals(direction, Vector2i.RIGHT))
      return PathDirections.RIGHT;
    if (Vector2i.equals(direction, Vector2i.DOWN))
      return PathDirections.DOWN;
    if (Vector2i.equals(direction, Vector2i.LEFT))
      return PathDirections.LEFT;
    if (Vector2i.equals(direction, Vector2i.UP))
      return PathDirections.UP;

    return PathDirections.UNKNOWN;
  },
  optimizePath(pathList: Array<Vector2f>, precision = 1e-6): Array<Vector2f> {
    const result: Array<Vector2f> = [];
    let lastDirection = PathDirections.UNKNOWN;
    for (let i = 0; i < pathList.length; i++) {
      if (i === 0) {
        lastDirection = this.currentDirection(
          Vector2f.ZERO,
          pathList[i],
          precision,
        );
        result.push(pathList[i]);
        continue;
      }
      const direction = this.currentDirection(
        pathList[i - 1],
        pathList[i],
        precision,
      );

      if (direction !== lastDirection
        && direction !== PathDirections.SAME_POSITION
      ) {
        result.push(pathList[i]);
      }
      else {
        if (
          direction === PathDirections.RIGHT
          || direction === PathDirections.LEFT
        ) {
          result[result.length - 1].x = pathList[i]._x;
        }
        if (
          direction === PathDirections.UP
          || direction === PathDirections.DOWN
        ) {
          result[result.length - 1].y = pathList[i]._y;
        }
      }
      lastDirection = direction;
    }
    return result;
  },
  simplePathFinder(
    start: Vector2i,
    end: Vector2i,
    stepSize: Vector2f = new Vector2f(0.5, 1),
  ): Array<Vector2f> {
    const list: Array<Vector2f> = [];
    // Não calcular se os vetores forem iguais
    if (Vector2i.equals(start, end)) return list;
    const current = start.clone();
    const currentT = new Vector2f();
    let runs = 0;
    while (!Vector2i.equals(current, end, 4)) {
      if (runs > 15) break;
      runs++;
      const atan2 = Vector2i.atan2(end, current);
      const step = this.stepDirectionFromAtan2(atan2)[0];
      const nextT = Vector2f.add(
        Vector2f.mul(Vector2f.abs(step), stepSize),
        currentT,
      );
      list.push(nextT);
      Vector2i.bilinear(start, end, nextT, current);
      Vector2f.copy(nextT, currentT);
    }
    return list;
  },
  stepCollisionExists(
    start: Vector2i,
    end: Vector2i,
    current: Vector2i,
    nextT: Vector2f,
    cList: CollisionMap,
  ): boolean {
    const next = Vector2i.bilinear(start, end, nextT);
    const line = new LineCollision(current, next, undefined, false);
    for (const c of cList.values()) {
      if (
        c.collisionWithLine(line)
      )
        return true;
    }
    return false;
  },
  computeStepScore(start: Vector2i, current: Vector2i, end: Vector2i): number {
    return (
      Math.abs(start._x - current._x) + Math.abs(start._y - current._y)
      + Math.abs(current._x - end._x) + Math.abs(current._y - end._y)
    );
  },
  createPathFromScores(
    scores: PathGraph, start: Vector2i, end: Vector2i): Array<Vector2f> {
    let previous: PathNode | undefined;
    const startNode = scores.get(`${start._x}::${start.y}`);
    const endNode = scores.get(`${end._x}::${end.y}`);
    if (startNode === undefined || endNode === undefined) return [];
    let current: PathNode | undefined = startNode;
    const result: Array<Vector2f> = [];
    let runs = 0;
    while (current !== undefined && runs < 512) {
      runs++;
      const next = this.getSmallestPathNode(current.to);
      if (next === undefined) {
        current.score = NaN;
        previous = this.getSmallestPathNode(previous?.from ?? []);
        current = previous;
        continue;
      }
      if (next === endNode) {
        result.push(next.t);
        break;
      }
      const index = result.indexOf(next.t);
      if (index !== -1) {
        current.score = NaN;
        previous = this.getSmallestPathNode(previous?.from ?? []);
        current = previous;
        continue;
      }
      result.push(next.t);
      previous = current;
      current = next;
    }
    if (result[result.length - 1] !== endNode.t) {
      console.log(result);
      result.splice(0);
    }
    return result;
  },
  getSmallestPathNode(pNext: PathNode[]): PathNode | undefined {
    let next: PathNode | undefined;
    for (const node of pNext) {
      if (next === undefined) {
        next = node;
        continue;
      }
      if (!Number.isNaN(node.score) && node.score < next.score) next = node;
    }
    return next;
  },
  setNodeScore(
    pathGraph: PathGraph,
    nodePosition: Vector2i,
    nodeKey: string,
    nodeScore: number = Infinity,
    nodeT: Vector2f,
    fromNode: PathNode | undefined,
  ): NodeUpdateStatus {
    if (Number.isNaN(nodeScore)) return NodeUpdateStatus.INVALID;
    const cn = pathGraph.get(nodeKey);
    const nFrom = cn?.from ?? [];
    if (fromNode !== undefined) {
      nFrom.push(fromNode);
    }

    if (cn === undefined || (
      !Number.isNaN(cn.score) && nodeScore < cn.score
    )) {
      pathGraph.set(nodeKey, {
        id: nodeKey,
        position: nodePosition.clone(),
        t: nodeT.clone(),
        from: nFrom,
        to: cn?.to ?? [],
        score: nodeScore,
      });
      if (fromNode !== undefined) {
        fromNode.to.push(pathGraph.get(nodeKey)!);
      }
      return NodeUpdateStatus.SCORE_CHANGE;
    }
    else if (Number.isNaN(cn.score)) {
      if (fromNode === undefined)
        return NodeUpdateStatus.INVALID;
      if (cn.from.includes(fromNode))
        return NodeUpdateStatus.LOOP;
      pathGraph.set(nodeKey, {
        id: nodeKey,
        position: nodePosition.clone(),
        t: nodeT.clone(),
        score: nodeScore,
        from: nFrom,
        to: cn.to,
      });
      fromNode.to.push(cn);
      return NodeUpdateStatus.SCORE_CHANGE;
    }
    else if (fromNode !== undefined) {
      if (Vector2f.equals(nodePosition, fromNode.position))
        return NodeUpdateStatus.SAME_POSITION;
      if (cn !== undefined && fromNode.from.includes(cn))
        return NodeUpdateStatus.LOOP;
    }
    return NodeUpdateStatus.NO_SCORE_CHANGE;
  },
  testStep(
    start: Vector2i,
    end: Vector2i,
    current: Vector2i,
    currentT: Vector2f,
    step: Vector2f,
    cList: CollisionMap,
    minStepSize: Vector2f,
    currentStepSize: Vector2f,
  ): [boolean, Vector2i, Vector2f] {
    const nextT = Vector2f.add(Vector2f.mul(step, currentStepSize), currentT);
    const next = Vector2i.bilinear(start, end, nextT);
    while (currentStepSize._x >= minStepSize._x
      && currentStepSize._y >= minStepSize._y) {
      if (this.stepCollisionExists(start, end, current, nextT, cList)) {
        Vector2f.sub(currentStepSize, 0.015, currentStepSize);
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
    cList: CollisionMap,
    maxStepSize: Vector2f,
    minStepSize: Vector2f,
  ): Array<[Vector2i, Vector2f]> {
    const nextSteps: Array<[Vector2i, Vector2f]> = [];
    const directions = this.stepDirectionFromAtan2(
      Vector2i.atan2(current, end),
    );
    const stepSize = maxStepSize.clone();
    const halfStepSize = Vector2f.div(maxStepSize.clone(), 2);
    for (let i = 0; i < directions.length; i++) {
      const [stepFound, position, t] = this.testStep(
        start,
        end,
        current,
        currentT,
        directions[i],
        cList,
        minStepSize,
        stepSize,
      );
      if (stepFound) {
        nextSteps.push([position, t]);
        continue;
      }
      Vector2f.copy(halfStepSize, stepSize);
    }
    return nextSteps;
  },
  complexPathFinder(
    start: Vector2i,
    end: Vector2i,
  ): [boolean, Array<Vector2f>] {
    const pathGraph: PathGraph = new Map();
    this.setNodeScore(
      pathGraph,
      start,
      `${start._x}::${start._y}`,
      this.computeStepScore(start, start, end),
      Vector2f.ZERO,
      undefined,
    );
    const startNode = pathGraph.get(`${start._x}::${start._y}`)!;
    const openSet: Heap<{ key: Vector2i, score: number }> = new Heap(
      (a, b) => a.score - b.score,
    );
    openSet.push({
      key: start,
      score: startNode.score,
    });

    // Maior passo que um trecho da conexão pode realizar (porcentagem)
    const maxStepSize = new Vector2f(0.5, 0.5);
    // Menor passo que um trecho da conexão pode realizar (porcentagem)
    const minStepSize: Vector2f = new Vector2f(1e-3, 1e-3);
    let current: PathNode | undefined = startNode;
    let next: PathNode | undefined;

    let runCount = 0;
    while (runCount <= 512 && openSet.size() > 0) {
      runCount++;
      const heapKey = openSet.pop()!.key;
      const currentNodeKey = `${heapKey._x}::${heapKey._y}`;
      current = pathGraph.get(currentNodeKey);
      if (current === undefined) continue;
      if (Vector2i.equals(current.position, end, 16)) {
        this.setNodeScore(
          pathGraph,
          end,
          `${end._x}::${end._y}`,
          this.computeStepScore(start, end, end),
          Vector2f.ONE,
          current,
        );
        return [true, this.createPathFromScores(pathGraph, start, end)];
      }
      const nextSteps = this.getPossibleNextSteps(
        start,
        end,
        current.position,
        current.t,
        this.collisionList,
        maxStepSize,
        minStepSize,
      );
      if (nextSteps.length === 0) {
        current.score = NaN;
        continue;
      }
      for (let i = 0; i < nextSteps.length; i++) {
        const nNodeKey = `${nextSteps[i][0]._x}::${nextSteps[i][0]._y}`;
        const status = this.setNodeScore(
          pathGraph,
          nextSteps[i][0],
          nNodeKey,
          this.computeStepScore(start, nextSteps[i][0], end),
          nextSteps[i][1],
          current,
        );
        next = pathGraph.get(nNodeKey);
        switch (status) {
          case NodeUpdateStatus.SCORE_CHANGE:
            openSet.push({
              key: nextSteps[i][0],
              score: next!.score,
            });
            current.to.push(next!);
            break;
          case NodeUpdateStatus.SAME_POSITION:
          case NodeUpdateStatus.LOOP:
            current.score = NaN;
            break;
        }
      }
    }
    return [false, []];
  },
  // Função principal
  find(start: Vector2i, end: Vector2i, nodeList: NodeList) {
    if (Vector2i.equals(start, end, 8)) return [];
    let path = [] as Vector2f[];
    this.searchArea = this.getSearchArea(start, end, 1);
    this.collisionList = this.getCollisionsInArea(nodeList, this.searchArea);
    if (this.collisionList.size === 0) {
      path = this.simplePathFinder(start, end);
    }
    else {
      this.searchArea = this.getSearchArea(start, end, 3);
      this.collisionList
        = this.getCollisionsInArea(nodeList, this.searchArea);
      const [success, pathC] = this.complexPathFinder(
        start,
        end,
      );
      path = success && pathC.length !== 0
        ? pathC
        : this.simplePathFinder(start, end);
    }
    return this.optimizePath(path);
  },
};
