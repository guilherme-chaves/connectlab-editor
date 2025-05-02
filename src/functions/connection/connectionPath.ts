import BoxCollision from '@connectlab-editor/collisionShapes/boxCollision';
import Vector2 from '@connectlab-editor/types/vector2';

export default {
  setCollisionShapeSize(
    v1: Vector2,
    v2: Vector2,
    ifEqualX = 0,
    ifDiffX = 0,
    ifEqualY = 0,
    ifDiffY = 0,
    precision = 1e-4
  ): Vector2 {
    if (v1.useInt && v2.useInt)
      return new Vector2(
        v1.x === v2.x ? ifEqualX : ifDiffX,
        v1.y === v2.y ? ifEqualY : ifDiffY
      );
    else
      return new Vector2(
        Math.abs(v1.x - v2.x) < precision ? ifEqualX : ifDiffX,
        Math.abs(v1.y - v2.y) < precision ? ifEqualY : ifDiffY,
        false
      );
  },

  generateCollisionShapes(
    position: Vector2,
    endPosition: Vector2,
    anchors: Vector2[]
  ): BoxCollision[] {
    if (anchors.length === 0) return [];
    const collisionArr = [];
    let pPos = position.copy();
    const nPos = new Vector2();
    // 0 => Ponto inicial à primeira âncora, length => última âncora à ponto final
    for (let i = 0; i <= anchors.length; i++) {
      if (i < anchors.length)
        Vector2.bilinear(position, endPosition, anchors[i], nPos);
      else Vector2.copy(endPosition, nPos);
      const size = this.setCollisionShapeSize(
        pPos,
        nPos,
        12,
        nPos.x - pPos.x,
        12,
        nPos.y - pPos.y
      );
      collisionArr.push(
        new BoxCollision(pPos.sub(new Vector2(6, 6)), size.x, size.y)
      );
      pPos = nPos.copy();
    }
    return collisionArr;
  },
};
