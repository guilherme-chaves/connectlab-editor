import {Sprite as SpriteInterface} from '../../../interfaces/renderObjects';
import CanvasRenderer from '../renderer';
import Point2f from '../../../types/Point2f';
import Point2i from '../../../types/Point2i';
import Vector2i from '../../../types/Vector2i';
import {ImageListObject} from '../../../types/types';

export default class Sprite implements SpriteInterface {
  public renderer: CanvasRenderer;
  public position: Point2i;
  public selected: boolean;
  public imageSet: ImageListObject;
  public currentSpriteId: string;
  public imageWidth: number;
  public imageHeight: number;

  constructor(
    renderer: CanvasRenderer,
    position: Point2i,
    imageSet: ImageListObject,
    currentSpriteId: string,
    canvasWidth: number,
    canvasHeight: number
  ) {
    this.renderer = renderer;
    this.position = position;
    this.imageSet = imageSet;
    this.currentSpriteId = currentSpriteId;
    this.selected = false;

    this.imageWidth = imageSet[currentSpriteId].width;
    this.imageHeight = imageSet[currentSpriteId].height;
    Vector2i.sub(
      this.position,
      new Point2f(this.imageWidth / 2.0, this.imageHeight / 2.0),
      this.position
    );
    const canvasBound = Vector2i.sub(
      new Point2i(canvasWidth, canvasHeight),
      new Point2i(this.imageWidth, this.imageHeight)
    );
    Vector2i.min(this.position, canvasBound, this.position);
    Vector2i.max(this.position, new Point2i(), this.position);
  }

  draw(): void {
    this.renderer.ctx.drawImage(
      this.imageSet[this.currentSpriteId],
      this.position.x,
      this.position.y
    );
  }

  move(nPos: Point2i, isDelta: boolean): void {
    if (isDelta) {
      Vector2i.add(this.position, nPos, this.position);
    } else {
      Vector2i.sub(
        nPos,
        new Point2f(this.imageWidth / 2.0, this.imageHeight / 2.0),
        this.position
      );
    }
  }
}
