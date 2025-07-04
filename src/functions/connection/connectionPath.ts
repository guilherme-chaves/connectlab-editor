import BoxCollision from '@connectlab-editor/collisionShapes/boxCollision';
import Vector2 from '@connectlab-editor/interfaces/vector2Interface';
import Vector2f from '@connectlab-editor/types/vector2f';
import Vector2i from '@connectlab-editor/types/vector2i';

export default {
  setCollisionShapeSize(
    v1: Vector2,
    v2: Vector2,
    ifEqualX = 0,
    ifDiffX = 0,
    ifEqualY = 0,
    ifDiffY = 0,
    precision = 1e-4
  ): Vector2f {
    return new Vector2f(
      Math.abs(v1.x - v2.x) < precision ? ifEqualX : ifDiffX,
      Math.abs(v1.y - v2.y) < precision ? ifEqualY : ifDiffY
    );
  },

  generateCollisionShapes(
    position: Vector2i,
    endPosition: Vector2i,
    anchors: Array<Vector2f>
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
      else nPos.copy(endPosition);
      const size = this.setCollisionShapeSize(
        pPos,
        nPos,
        12,
        nPos.x - pPos.x,
        12,
        nPos.y - pPos.y
      );
      collisionArr.push(
        new BoxCollision(pPos.sub(collisionSize), size.x, size.y)
      );
      pPos.copy(nPos);
    }
    return collisionArr;
  },
};
