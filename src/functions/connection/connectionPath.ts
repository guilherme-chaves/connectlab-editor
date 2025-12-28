import BoxCollision from '@connectlab-editor/collisionShapes/boxCollision';
import Vector2f from '@connectlab-editor/types/vector2f';
import Vector2i from '@connectlab-editor/types/vector2i';

export default {
  setCollisionShapeSize(
    v1: Vector2i,
    v2: Vector2i,
    ifEqualX = 0,
    ifDiffX = 0,
    ifEqualY = 0,
    ifDiffY = 0,
    precision = 1e-4,
  ): Vector2i {
    return new Vector2i(
      Math.abs(v1._x - v2._x) < precision ? ifEqualX : ifDiffX,
      Math.abs(v1._y - v2._y) < precision ? ifEqualY : ifDiffY,
    );
  },

  generateCollisionShapes(
    position: Vector2i,
    endPosition: Vector2i,
    anchors: Array<Vector2f>,
  ): BoxCollision[] {
    if (anchors.length === 0) return [];
    const collisionArr = [];
    const collisionSize = new Vector2i(6, 6);
    const pPos = position.clone();
    const nPos = new Vector2i();
    // 0 => Ponto inicial à primeira âncora, length => última âncora à ponto final
    for (let i = 0; i <= anchors.length; i++) {
      if (i < anchors.length)
        Vector2i.bilinear(position, endPosition, anchors[i], nPos);
      else Vector2i.copy(endPosition, nPos);
      const size = this.setCollisionShapeSize(
        pPos,
        nPos,
        12,
        nPos._x - pPos._x,
        12,
        nPos._y - pPos._y,
      );
      collisionArr.push(
        new BoxCollision(
          Vector2i.sub(pPos, collisionSize),
          size._x,
          size._y,
        ),
      );
      Vector2i.copy(nPos, pPos);
    }
    return collisionArr;
  },
};
