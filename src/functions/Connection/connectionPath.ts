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

  checkAnchorCollision(p1: Vector2, p2: Vector2) {
    const size = p1.max(p2).minus(p1.min(p2));
    const tempBB = new BBCollision(p1, new Vector2(0, 0), size.x, size.y);
    Object.keys(Editor.editorEnv.getComponents().nodes).forEach(key => {
      if (
        Editor.editorEnv
          .getComponents()
          .nodes[parseInt(key)].getCollisionShape()
          .collisionWithBB(tempBB)
      )
        return true;
    });
    return false;
  },

  getStepDirection(angle: number) {
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

  setAnchorCoordinates(
    stepTo: Vector2,
    xDivisor: number,
    yDivisor: number,
    lastAnchor: Vector2 | undefined
  ) {
    const newAnchor: Vector2 = new Vector2(0, 0);
    if (lastAnchor === undefined) {
      newAnchor.x = Math.abs(stepTo.x) / xDivisor;
      newAnchor.y = Math.abs(stepTo.y) / yDivisor;
    } else {
      newAnchor.x = lastAnchor.x + Math.abs(stepTo.x) / xDivisor;
      newAnchor.y = lastAnchor.y + Math.abs(stepTo.y) / yDivisor;
    }
    return newAnchor;
  },

  generateAnchors(connection: ConnectionComponent) {
    const anchorsArr: Vector2[] = [];
    let lastAnchorAdded: Vector2 | undefined = undefined;
    const startPos = connection.position;
    let lastPosition = connection.position;
    let currentPosition = connection.position;
    const endPosition = connection.endPosition;
    const initialXStepDivisor = 2.0;
    const initialYStepDivisor = 1.0;
    // eslint-disable-next-line prefer-const
    let xStepDivisor = initialXStepDivisor;
    // eslint-disable-next-line prefer-const
    let yStepDivisor = initialYStepDivisor;
    let stepTo = new Vector2(0, 0);
    let lastStepTo = stepTo;
    let lastStepWasRotated = false;
    let marchingLoopRuns = 0;
    // eslint-disable-next-line no-constant-condition
    while (true) {
      if (!lastStepWasRotated) {
        const headedTowards = currentPosition.atan2(endPosition);
        console.log(headedTowards);
        stepTo = this.getStepDirection(headedTowards);
      } else {
        stepTo = stepTo.rotateZ(-HALF_PI);
      }
      const newAnchor = this.setAnchorCoordinates(
        stepTo,
        xStepDivisor,
        yStepDivisor,
        lastAnchorAdded
      );
      lastPosition = currentPosition;
      currentPosition = startPos.bilinear(endPosition, newAnchor);
      if (this.checkAnchorCollision(lastPosition, currentPosition))
        console.log('Colisão ocorrida: ', currentPosition);
      anchorsArr.push(newAnchor);
      lastAnchorAdded = newAnchor;

      if (currentPosition.equals(endPosition)) break;
      if (marchingLoopRuns > 64) {
        console.error(
          'O código atingiu o limite de iterações!! Saída forçada.'
        );
        break;
      }
      marchingLoopRuns += 1;
    }
    console.log(anchorsArr);
    return anchorsArr;
    /*
    let doXStep = true;
    let doYStep = true;
    // eslint-disable-next-line prefer-const
    let reachedEndPos = false;
    while (!reachedEndPos) {
      //debugger;
      const n = connection.endPosition.minus(currentPos).normalize();
      if (Math.abs(n.x) > stepBias && doXStep) {
        stepTo.x = Math.sign(n.x);
        stepTo.y = 0;
        doXStep = false;
        doYStep = true;
      } else if (Math.abs(n.y) > stepBias && doYStep) {
        stepTo.x = 0;
        stepTo.y = Math.sign(n.y);
        doXStep = true;
        doYStep = false;
      }
      console.log(stepTo);
      if (connection.endPosition.equals(currentPos)) break;
      if (stepTo.x === 0 && stepTo.y === 0) break;
      const newAnchor = new Vector2(0, 0, true);
      if (anchorsArr.length > 0) {
        newAnchor.x =
          stepTo.x !== 0
            ? anchorsArr[anchorsArr.length - 1].x + stepTo.x / xStepDivisor
            : anchorsArr[anchorsArr.length - 1].x;
        newAnchor.y =
          stepTo.y !== 0
            ? anchorsArr[anchorsArr.length - 1].y + stepTo.y / yStepDivisor
            : anchorsArr[anchorsArr.length - 1].y;
      } else {
        newAnchor.x = stepTo.x !== 0 ? stepTo.x / xStepDivisor : 0;
        newAnchor.y = stepTo.y !== 0 ? stepTo.y / yStepDivisor : 0;
      }
      currentPos = connection.position.bilinear(
        connection.endPosition,
        newAnchor
      );

      anchorsArr.push(newAnchor);
    }
    return anchorsArr;
    */
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
};
