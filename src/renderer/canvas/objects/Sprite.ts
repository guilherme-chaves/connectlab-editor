import {Sprite as SpriteInterface} from '../../../interfaces/renderObjects';
import Point2i from '../../../types/Point2i';
import Vector2i from '../../../types/Vector2i';
import {ImageListObject} from '../../../types/types';

export default class Sprite implements SpriteInterface {
  public position: Point2i;
  public childElements: Set<number>;
  public selected: boolean;
  public imageSet: ImageListObject;
  public currentSpriteId: number;

  constructor(
    position: Point2i,
    imageSet: ImageListObject,
    currentSpriteId: number = 0,
    children: Set<number> = new Set()
  ) {
    this.position = position;
    this.childElements = children;
    this.imageSet = imageSet;
    this.currentSpriteId = currentSpriteId;
    this.selected = false;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.drawImage(
      this.imageSet.get(this.currentSpriteId)!,
      this.position.x,
      this.position.y
    );
  }

  move(nPos: Point2i, isDelta: boolean): void {
    if (isDelta) {
      Vector2i.add(this.position, nPos, this.position);
    } else {
      Vector2i.sub(
        this.position,
        new Point2i(
          this.imageSet.get(this.currentSpriteId)!.width / 2.0,
          this.imageSet.get(this.currentSpriteId)!.height / 2.0
        ),
        this.position
      );
    }
  }
}
