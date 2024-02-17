import {
  CollisionShape,
  Line as LineInterface,
} from '../../../interfaces/renderObjects';
import Point2f from '../../../types/Point2f';
import Point2i from '../../../types/Point2i';
import Vector2i from '../../../types/Vector2i';
import ConnectionPathFunctions from '../../../functions/Connection/connectionPath';

export default class Line implements LineInterface {
  public position: Point2i;
  public endPosition: Point2i;
  public anchors: Point2f[];
  public collisionShapes: Set<CollisionShape>;
  public selected: boolean;
  private path: Path2D;
  private regenConnectionPath: boolean;

  constructor(
    position: Point2i,
    endPosition: Point2i,
    anchors: Point2f[] = [],
    collisionShapes: Set<CollisionShape> = new Set()
  ) {
    this.position = position;
    this.endPosition = endPosition;
    this.anchors = anchors;
    this.selected = false;
    this.collisionShapes = collisionShapes;
    this.regenConnectionPath = false;
    this.path = this.generatePath();
  }

  move(nPos: Point2i, isDelta: boolean, movePoint: 0 | 1 | 2): void {
    if (isDelta) {
      if (movePoint !== 1) Vector2i.add(this.position, nPos, this.position);
      if (movePoint !== 0)
        Vector2i.add(this.endPosition, nPos, this.endPosition);
    } else {
      if (movePoint !== 1) this.position = nPos;
      if (movePoint !== 0) this.endPosition = nPos;
    }
    for (const cShape of this.collisionShapes) {
      cShape.move(nPos, isDelta);
    }
    this.anchors = ConnectionPathFunctions.generateAnchors(this);
    this.regenConnectionPath = true;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    if (Vector2i.equals(this.endPosition, this.position)) return;
    if (this.regenConnectionPath) this.path = this.generatePath();
    ctx.strokeStyle = '#101010';
    ctx.lineWidth = 2;
    ctx.lineJoin = 'round';
    ctx.stroke(this.path);
    for (const cShape of this.collisionShapes) {
      cShape.draw(ctx);
    }
  }

  generatePath(): Path2D {
    const path = new Path2D();
    path.moveTo(this.position.x, this.position.y);
    for (let i = 0; i < this.anchors.length; i++) {
      const globalPos = Vector2i.bilinear(
        this.position,
        this.endPosition,
        this.anchors[i]
      );
      path.lineTo(globalPos.x, globalPos.y);
    }
    path.lineTo(this.endPosition.x, this.endPosition.y);
    this.regenConnectionPath = false;
    return path;
  }
}
