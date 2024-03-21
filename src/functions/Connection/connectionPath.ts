import BBCollision from '../../collision/BBCollision';
import Vector2 from '../../types/Vector2';
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

  // checkAnchorCollision(p1: Vector2) {
  //   //Teste
  // },

  generateAnchors(position: Vector2, endPosition: Vector2): Array<Vector2> {
    const anchorsArr: Array<Vector2> = [];
    let lastAnchorAdded = new Vector2();
    const currentPos = position.copy();
    const stepDivisor = new Vector2(2, 1, false);
    let newAnchor: Vector2;
    let loopRuns = 0;
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const stepTo = new Vector2(0, 0, false);
      const headedTowards = currentPos.angleBetween(endPosition);
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
      if (anchorsArr.length === 0) {
        newAnchor = stepTo.abs().div(stepDivisor);
      } else {
        newAnchor = stepTo.abs().div(stepDivisor).add(lastAnchorAdded);
      }
      Vector2.bilinear(position, endPosition, newAnchor, currentPos);
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
    // console.log(anchorsArr);
    return anchorsArr;
  },

  generateCollisionShapes(
    position: Vector2,
    endPosition: Vector2,
    anchors: Vector2[]
  ) {
    if (anchors.length === 0) return [];
    const collisionArr = [];
    let pPos = position.copy();
    const nPos = new Vector2();
    // 0 => Ponto inicial à primeira âncora, length => última âncora à ponto final
    for (let i = 0; i <= anchors.length; i++) {
      if (i < anchors.length)
        Vector2.bilinear(position, endPosition, anchors[i], nPos);
      else Vector2.copy(endPosition, nPos);
      const size = this.alignConnectionWithAxis(
        pPos,
        nPos,
        6,
        nPos.x - pPos.x,
        6,
        nPos.y - pPos.y
      );
      collisionArr.push(
        new BBCollision(pPos.sub(new Vector2(3, 3)), size.x, size.y)
      );
      pPos = nPos.copy();
    }
    return collisionArr;
  },
};
