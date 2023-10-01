import BBCollision from '../../collision/BBCollision';
import Vector2 from '../../types/Vector2';
import ConnectionComponent from '../../components/ConnectionComponent';
import {QUARTER_PI, THREE_QUARTER_PI} from '../../types/consts';

export default {
  alignConnectionWithAxis(
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

  checkAnchorCollision(p1: Vector2) {
    //Teste
  },

  generateAnchors(connection: ConnectionComponent) {
    const anchorsArr: Vector2[] = [];
    let lastAnchorAdded: Vector2 = new Vector2(0, 0, true);
    const startPos = connection.position;
    let currentPos = connection.position;
    const endPosition = connection.endPosition;
    const defaultXStepDivisor = 2.0;
    const defaultYStepDivisor = 1.0;
    // eslint-disable-next-line prefer-const
    let xStepDivisor = defaultXStepDivisor;
    // eslint-disable-next-line prefer-const
    let yStepDivisor = defaultYStepDivisor;
    const stepTo = new Vector2(0, 0);
    let loopRuns = 0;
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const headedTowards = currentPos.getAngle(endPosition);
      console.log(headedTowards);
      stepTo.x =
        headedTowards <= QUARTER_PI && headedTowards >= -QUARTER_PI
          ? 1
          : headedTowards > THREE_QUARTER_PI ||
            headedTowards < -THREE_QUARTER_PI
          ? -1
          : 0;
      stepTo.y =
        headedTowards > QUARTER_PI && headedTowards <= THREE_QUARTER_PI
          ? 1
          : headedTowards < -QUARTER_PI && headedTowards >= -THREE_QUARTER_PI
          ? -1
          : 0;
      const newAnchor = new Vector2(0, 0, true);
      if (anchorsArr.length === 0) {
        newAnchor.x = Math.abs(stepTo.x) / xStepDivisor;
        newAnchor.y = Math.abs(stepTo.y) / yStepDivisor;
      } else {
        newAnchor.x = lastAnchorAdded.x + Math.abs(stepTo.x) / xStepDivisor;
        newAnchor.y = lastAnchorAdded.y + Math.abs(stepTo.y) / yStepDivisor;
      }
      currentPos = startPos.bilinear(endPosition, newAnchor);
      anchorsArr.push(newAnchor);
      lastAnchorAdded = newAnchor;

      if (currentPos.equals(endPosition)) break;
      if (loopRuns > 64) {
        console.error(
          'O código atingiu o limite de iterações!! Saída forçada.'
        );
        break;
      }
      loopRuns += 1;
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
      const size = this.alignConnectionWithAxis(
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
