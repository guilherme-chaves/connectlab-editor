import {Line as LineInterface} from '../../../interfaces/renderObjects';
import Point2f from '../../../types/Point2f';
import Point2i from '../../../types/Point2i';
import Vector2i from '../../../types/Vector2i';
import ConnectionPathFunctions from '../../../functions/Connection/connectionPath';
import CanvasRenderer from '../renderer';

export default class Line implements LineInterface {
  public position: Point2i;
  public endPosition: Point2i;
  private _anchors: Point2f[];
  public selected: boolean;
  public renderer: CanvasRenderer;
  private path: Path2D;
  private regenConnectionPath: boolean;

  get anchors(): Point2f[] {
    return this._anchors;
  }

  set anchors(value: Point2f[]) {
    this._anchors = value;
    this.regenConnectionPath = true;
  }

  constructor(
    renderer: CanvasRenderer,
    position: Point2i,
    endPosition: Point2i,
    anchors: Point2f[] = []
  ) {
    this.renderer = renderer;
    this.position = position;
    this.endPosition = endPosition;
    this._anchors = anchors;
    this.selected = false;
    this.regenConnectionPath = false;
    this.path = this.generatePath();
  }

  move(nPos: Point2i, isDelta: boolean, movePoint: 0 | 1 | 2): void {
    if (isDelta) {
      if (movePoint !== 1) Vector2i.add(this.position, nPos, this.position);
      if (movePoint !== 0)
        Vector2i.add(this.endPosition, nPos, this.endPosition);
    } else {
      if (movePoint !== 1) Vector2i.copy(this.position, nPos);
      if (movePoint !== 0) Vector2i.copy(this.endPosition, nPos);
    }
    this.anchors = ConnectionPathFunctions.generateAnchors(this);
    this.regenConnectionPath = true;
  }

  draw(): void {
    if (Vector2i.equals(this.endPosition, this.position)) return;
    if (this.regenConnectionPath) this.path = this.generatePath();
    this.renderer.ctx.strokeStyle = '#101010';
    this.renderer.ctx.lineWidth = 2;
    this.renderer.ctx.lineJoin = 'round';
    this.renderer.ctx.stroke(this.path);
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
