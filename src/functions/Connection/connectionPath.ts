import BBCollision from '../../collision/BBCollision';
import Vector2i from '../../types/Vector2i';
import {QUARTER_PI, THREE_QUARTER_PI} from '../../types/consts';
import Point2f from '../../types/Point2f';
import Vector2f from '../../types/Vector2f';
import {Line} from '../../interfaces/renderObjects';
import Point2i from '../../types/Point2i';
import ConnectionComponent from '../../components/ConnectionComponent';

export default {
  alignConnectionWithAxis(
    p1: Point2i,
    p2: Point2i,
    trueXSize = 0,
    falseXSize = 0,
    trueYSize = 0,
    falseYSize = 0
  ) {
    return new Point2i(
      p1.x === p2.x ? trueXSize : falseXSize,
      p1.y === p2.y ? trueYSize : falseYSize
    );
  },

  // checkAnchorCollision(p1: Vector2) {
  //   //Teste
  // },

  generateAnchors(connection: Line): Array<Point2f> {
    const anchorsArr: Array<Point2f> = [];
    let lastAnchorAdded: Point2f = new Point2f();
    const startPos = connection.position;
    const currentPos = connection.position;
    const endPosition = connection.endPosition;
    // const defaultXStepDivisor = 2.0;
    // const defaultYStepDivisor = 1.0;
    const stepDivisor = new Point2f(2.0, 1.0);
    const stepTo = new Point2i();
    let loopRuns = 0;
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const headedTowards = Vector2i.getAngle(currentPos, endPosition);
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
      const newAnchor = new Point2f();
      if (anchorsArr.length === 0) {
        Vector2f.div(Vector2i.abs(stepTo, stepTo), stepDivisor, newAnchor);
      } else {
        Vector2f.add(
          Vector2f.div(Vector2i.abs(stepTo, stepTo), stepDivisor),
          lastAnchorAdded,
          newAnchor
        );
      }
      Vector2i.bilinear(startPos, endPosition, newAnchor, currentPos);
      anchorsArr.push(newAnchor);
      lastAnchorAdded = newAnchor;

      if (Vector2i.equals(currentPos, endPosition)) break;
      if (loopRuns > 64) {
        console.error(
          'O código atingiu o limite de iterações!! Saída forçada.'
        );
        break;
      }
      loopRuns += 1;
    }
    // console.log(anchorsArr);
    return anchorsArr;
  },

  generateCollisionShapes(connection: ConnectionComponent) {
    if (connection.anchors.length === 0) return [];

    const collisionArr = [];
    let pPos = connection.position;
    // 0 => Ponto inicial à primeira âncora, length => última âncora à ponto final
    for (let i = 0; i <= connection.anchors.length; i++) {
      let nPos = new Point2i();
      if (i < connection.anchors.length)
        Vector2i.bilinear(
          connection.position,
          connection.endPosition,
          connection.anchors[i],
          nPos
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
        new BBCollision(Vector2i.sub(pPos, new Point2i(1, 1)), size.x, size.y)
      );
      pPos = nPos;
    }
    return collisionArr;
  },
};
