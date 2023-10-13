import BBCollision from '../../collision/BBCollision';
import Vector2 from '../../types/Vector2';
import ConnectionComponent from '../../components/ConnectionComponent';
import {HALF_PI, QUARTER_PI, THREE_QUARTER_PI} from '../../types/consts';
import Editor from '../../Editor';

export default {
  getConnectionDimensions(
    v1: Vector2,
    v2: Vector2,
    trueXSize = 0,
    falseXSize = 0,
    trueYSize = 0,
    falseYSize = 0
  ) {
    return new Vector2(
      v1.x === v2.x ? trueXSize : falseXSize,
      v1.y === v2.y ? trueYSize : falseYSize
    );
  },

  checkAnchorCollision(
    p1: Vector2,
    p2: Vector2,
    connection: ConnectionComponent
  ) {
    const vDiff = p1.max(p2).minus(p1.min(p2));
    const size = this.getConnectionDimensions(p1, p2, 2, vDiff.x, 2, vDiff.y);
    if (size.max(new Vector2(16, 16)).equals(new Vector2(16, 16))) return false;
    const tempBB = new BBCollision(p1, new Vector2(), size.x, size.y);
    const nodeKeys = Object.keys(Editor.editorEnv.getComponents().nodes).map(
      key => {
        return parseInt(key);
      }
    );
    for (let i = 0; i < nodeKeys.length; i++) {
      if (
        Editor.editorEnv
          .getComponents()
          .nodes[nodeKeys[i]].getCollisionShape()
          .collisionWithBB(tempBB)
      ) {
        // const startSlotNodeId = Editor.editorEnv
        //   .getComponents()
        //   .slots[connection.connectedTo.start!.id].getParentId();
        // if (startSlotNodeId !== nodeKeys[i]) return true;
        return true;
      }
    }
    return false;
  },

  getStepDirection(currentPosition: Vector2, endPosition: Vector2) {
    const angle = currentPosition.atan2(endPosition);
    return new Vector2(
      // eixo X
      angle <= QUARTER_PI && angle >= -QUARTER_PI
        ? 1
        : angle > THREE_QUARTER_PI || angle < -THREE_QUARTER_PI
        ? -1
        : 0,
      // eixo Y
      angle > QUARTER_PI && angle <= THREE_QUARTER_PI
        ? 1
        : angle < -QUARTER_PI && angle >= -THREE_QUARTER_PI
        ? -1
        : 0
    );
  },

  getPreferredRotatedStepDirection(
    startPosition: Vector2,
    currentPosition: Vector2,
    endPosition: Vector2,
    originalStep: Vector2,
    stepDivisor: Vector2,
    lastAnchor: Vector2 | undefined
  ) {
    const originalAnchor = this.setAnchorCoordinates(
      originalStep,
      stepDivisor,
      lastAnchor
    );
    // 90 graus
    const s1 = originalAnchor.rotateZ(HALF_PI);
    // 180 graus
    const s2 = originalAnchor.rotateZ(Math.PI);
    // 270 graus
    const s3 = originalAnchor.rotateZ(-HALF_PI);
    const l1 = startPosition.bilinear(endPosition, s1).magSq();
    const l2 = startPosition.bilinear(endPosition, s2).magSq();
    const l3 = startPosition.bilinear(endPosition, s3).magSq();
    const sOrder = [];
    if (l1 < l2 && l1 < l3) {
      sOrder.push(s1);
      if (l2 < l3) sOrder.push(s2, s3);
      else sOrder.push(s3, s2);
    } else if (l2 < l3) {
      sOrder.push(s2);
      if (l1 < l3) sOrder.push(s1, s3);
      else sOrder.push(s3, s1);
    } else {
      sOrder.push(s3);
      if (l1 < l2) sOrder.push(s1, s2);
      else sOrder.push(s2, s1);
    }
    return sOrder;
  },

  setAnchorCoordinates(
    step: Vector2,
    stepDivisor: Vector2,
    lastAnchor: Vector2 | undefined
  ) {
    const newAnchor: Vector2 = new Vector2(0, 0, true);
    if (lastAnchor === undefined) {
      newAnchor.x = Math.abs(step.x) / stepDivisor.x;
      newAnchor.y = Math.abs(step.y) / stepDivisor.y;
    } else {
      newAnchor.x = lastAnchor.x + Math.abs(step.x) / stepDivisor.x;
      newAnchor.y = lastAnchor.y + Math.abs(step.y) / stepDivisor.y;
    }
    return newAnchor;
  },

  directAnchorPath(
    startPosition: Vector2,
    currentPosition: Vector2,
    endPosition: Vector2,
    stepDivisor: Vector2,
    connection: ConnectionComponent,
    lastAnchor: Vector2 | undefined
  ) {
    const step = this.getStepDirection(currentPosition, endPosition);
    return this.shortenedAnchorPath(
      startPosition,
      currentPosition,
      endPosition,
      step,
      stepDivisor,
      connection,
      lastAnchor
    );
  },

  shortenedAnchorPath(
    startPosition: Vector2,
    currentPosition: Vector2,
    endPosition: Vector2,
    step: Vector2,
    stepDivisor: Vector2,
    connection: ConnectionComponent,
    lastAnchor: Vector2 | undefined,
    recursiveDepth = 0
  ): Vector2 {
    const nextAnchor = this.setAnchorCoordinates(step, stepDivisor, lastAnchor);
    const nextAnchorPosition = startPosition.bilinear(endPosition, nextAnchor);
    if (recursiveDepth < 4) {
      if (
        this.checkAnchorCollision(
          currentPosition,
          nextAnchorPosition,
          connection
        )
      )
        return this.shortenedAnchorPath(
          startPosition,
          currentPosition,
          endPosition,
          step,
          stepDivisor.multS(2),
          connection,
          lastAnchor,
          (recursiveDepth += 1)
        );
      else return nextAnchor;
    } else return new Vector2(-1, -1);
  },

  rotatedAnchorPath(
    startPosition: Vector2,
    currentPosition: Vector2,
    endPosition: Vector2,
    stepDivisor: Vector2,
    connection: ConnectionComponent,
    lastAnchor: Vector2 | undefined
  ) {
    const originalStep = this.getStepDirection(currentPosition, endPosition);
    const prefferedSteps = this.getPreferredRotatedStepDirection(
      startPosition,
      currentPosition,
      endPosition,
      originalStep,
      stepDivisor,
      lastAnchor
    );
    for (let i = 0; i < prefferedSteps.length; i++) {
      const anchor = this.shortenedAnchorPath(
        startPosition,
        currentPosition,
        endPosition,
        prefferedSteps[i],
        stepDivisor,
        connection,
        lastAnchor
      );
      if (!anchor.equals(new Vector2(-1, -1))) return anchor;
    }
    return new Vector2(-1, -1);
  },

  generateAnchors(connection: ConnectionComponent) {
    const anchorsArr: Vector2[] = [];
    let lastAnchor: Vector2 | undefined = undefined;
    const startPosition = connection.position;
    let currentPosition = connection.position;
    const endPosition = connection.endPosition;
    const initialStepDivisor = new Vector2(2.0, 1.0, true);
    const stepDivisor = initialStepDivisor;
    let usedRotation = false;
    let marchingLoopRuns = 0;
    // eslint-disable-next-line no-constant-condition
    while (true) {
      // Evita que o código nunca saia do loop
      marchingLoopRuns += 1;
      if (currentPosition.equals(endPosition)) break;
      if (marchingLoopRuns > 64) {
        console.error(
          'O código atingiu o limite de iterações!! Saída forçada.'
        );
        break;
      }
      let nextAnchor;

      if (!usedRotation)
        nextAnchor = this.directAnchorPath(
          startPosition,
          currentPosition,
          endPosition,
          stepDivisor,
          connection,
          lastAnchor
        );

      if (nextAnchor?.equals(new Vector2(-1, -1)) || usedRotation) {
        nextAnchor = this.rotatedAnchorPath(
          startPosition,
          currentPosition,
          endPosition,
          stepDivisor,
          connection,
          lastAnchor
        );
        usedRotation = true;
      }
      if (nextAnchor?.equals(new Vector2(-1, -1))) {
        const lastAnchorPosition = startPosition.bilinear(
          endPosition,
          lastAnchor ?? new Vector2()
        );
        nextAnchor = this.rotatedAnchorPath(
          startPosition,
          lastAnchorPosition,
          endPosition,
          stepDivisor,
          connection,
          anchorsArr.slice(-2)[0]
        );
        if (nextAnchor.equals(new Vector2(-1, -1))) {
          console.error(
            'Erro fatal! Não foi possível encontrar caminhos válidos!!'
          );
          break;
        } else {
          usedRotation = true;
          currentPosition = lastAnchorPosition;
          lastAnchor = anchorsArr.slice(-2)[0];
          anchorsArr.pop();
          nextAnchor = this.fixAnchorSize(nextAnchor);
          anchorsArr.push(nextAnchor);
          continue;
        }
      }
      usedRotation = false;
      if (nextAnchor !== undefined) {
        nextAnchor = this.fixAnchorSize(nextAnchor);
        anchorsArr.push(nextAnchor);
        currentPosition = startPosition.bilinear(endPosition, nextAnchor);
        lastAnchor = nextAnchor;
      }
    }
    return anchorsArr;
  },

  generateCollisionShapes(connection: ConnectionComponent) {
    if (connection.anchors.length === 0) return [];

    const collisionArr = [];
    let pPos = connection.position;
    // 0 => Ponto inicial à primeira âncora, length => última âncora à ponto final
    for (let i = 0; i <= connection.anchors.length; i++) {
      let nPos = new Vector2(0, 0);
      if (i < connection.anchors.length)
        nPos = connection.position.bilinear(
          connection.endPosition,
          connection.anchors[i]
        );
      else nPos = connection.endPosition;
      const size = this.getConnectionDimensions(
        pPos,
        nPos,
        2,
        nPos.x - pPos.x,
        2,
        nPos.y - pPos.y
      );
      collisionArr.push(
        new BBCollision(
          pPos.minus(new Vector2(1, 1)),
          new Vector2(0, 0),
          size.x,
          size.y
        )
      );
      pPos = nPos;
    }
    return collisionArr;
  },

  // workaround
  fixAnchorSize(anchor: Vector2) {
    return new Vector2(1, 1, true).min(
      anchor.max(new Vector2(0, 0, true), true, true),
      true,
      true
    );
  },
};
