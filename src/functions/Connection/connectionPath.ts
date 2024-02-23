import BBCollision from '../../collision/BBCollision';
import {Vector} from 'two.js/src/vector';
import ConnectionComponent from '../../components/ConnectionComponent';
import {QUARTER_PI, THREE_QUARTER_PI} from '../../types/consts';
import {Anchor} from 'two.js/src/anchor';

export default {
  alignConnectionWithAxis(
    v1: Vector,
    v2: Vector,
    trueXSize = 0,
    falseXSize = 0,
    trueYSize = 0,
    falseYSize = 0
  ) {
    return new Vector(
      v1.x === v2.x ? trueXSize : falseXSize,
      v1.y === v2.y ? trueYSize : falseYSize
    );
  },

  // checkAnchorCollision(p1: Vector2) {
  //   //Teste
  // },

  generateAnchors(connection: ConnectionComponent): Array<Anchor> {
    const anchorsArr: Array<Anchor> = [];
    const lastAnchorAdded: Vector = new Vector();
    const startPos = connection.position;
    const currentPosition = connection.position.clone();
    const endPosition = connection.endPosition;
    const stepDivisor = new Vector(2, 1);
    const stepTo = Vector.zero;
    let loopRuns = 0;
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const headedTowards = Vector.angleBetween(currentPosition, endPosition);
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
      const newAnchor = new Vector();
      if (anchorsArr.length === 0) {
        newAnchor.x = Math.abs(stepTo.x) / stepDivisor.x;
        newAnchor.y = Math.abs(stepTo.y) / stepDivisor.y;
      } else {
        newAnchor.x = lastAnchorAdded.x + Math.abs(stepTo.x) / stepDivisor.x;
        newAnchor.y = lastAnchorAdded.y + Math.abs(stepTo.y) / stepDivisor.y;
      }
      const newPos = new Vector(
        startPos.lerp(endPosition, newAnchor.x).x,
        startPos.lerp(endPosition, newAnchor.y).y
      );
      anchorsArr.push(
        new Anchor(
          currentPosition.x,
          currentPosition.y,
          undefined,
          undefined,
          newPos.x,
          newPos.y
        )
      );
      currentPosition.copy(newPos);
      lastAnchorAdded.copy(newAnchor);

      if (currentPosition.equals(endPosition)) break;
      if (loopRuns > 64) {
        console.error(
          'O código atingiu o limite de iterações!! Saída forçada.'
        );
        break;
      }
      loopRuns += 1;
    }
    return anchorsArr;
  },

  generateCollisionShapes(connection: ConnectionComponent) {
    if (connection.anchors.length === 0) return [];

    const collisionArr = [];
    for (let i = 1; i <= connection.anchors.length; i++) {
      const size = this.alignConnectionWithAxis(
        connection.anchors[i - 1],
        connection.anchors[i],
        2,
        connection.anchors[i].x - connection.anchors[i - 1].x,
        2,
        connection.anchors[i].y - connection.anchors[i - 1].y
      );
      collisionArr.push(
        new BBCollision(
          connection.anchors[i - 1],
          size.x,
          size.y,
          undefined,
          connection.drawShape?.renderer
        )
      );
    }
    return collisionArr;
  },
};
