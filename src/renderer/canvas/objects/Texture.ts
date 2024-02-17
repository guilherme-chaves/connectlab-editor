import {
  CollisionShape,
  Texture as TextureInterface,
} from '../../../interfaces/renderObjects';
import Point2i from '../../../types/Point2i';
import Vector2i from '../../../types/Vector2i';
import CanvasRenderer from '../renderer';

export default class Texture implements TextureInterface {
  public position: Point2i;
  public image: ImageBitmap | undefined;
  private texture: CanvasPattern | null;
  public selected: boolean;
  public collisionShapes: Set<CollisionShape>;
  public repeat: 'repeat' | 'repeat-x' | 'repeat-y' | 'no-repeat';

  constructor(
    position: Point2i,
    imageSrc: string,
    render: CanvasRenderer,
    repeat: 'repeat' | 'repeat-x' | 'repeat-y' | 'no-repeat',
    collisionShapes: Set<CollisionShape> = new Set()
  ) {
    this.position = position;
    this.collisionShapes = collisionShapes;
    this.repeat = repeat;
    this.loadImage(imageSrc, render);
    this.texture = null;
    this.selected = false;
  }

  private loadImage(src: string, render: CanvasRenderer): void {
    const image = new Image();
    image.onload = () => {
      Promise.all([createImageBitmap(image)]).then(bitmapArr => {
        this.image = bitmapArr[0];
        this.texture = render.ctx.createPattern(this.image, this.repeat);
        render.draw();
      });
    };
    image.src = src;
  }

  private loadTexture(ctx: CanvasRenderingContext2D): CanvasPattern | null {
    if (this.image === undefined) return null;
    return ctx.createPattern(this.image, this.repeat);
  }

  draw(ctx: CanvasRenderingContext2D): void {
    this.texture ??= this.loadTexture(ctx);
    ctx.rect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = this.texture ?? '#C0C0C0';
    ctx.fill();
    for (const cShape of this.collisionShapes) {
      cShape.draw(ctx);
    }
  }

  move(nPos: Point2i, isDelta: boolean): void {
    if (!this.image) return;
    if (isDelta) {
      Vector2i.add(this.position, nPos, this.position);
    } else {
      Vector2i.sub(
        this.position,
        new Point2i(this.image.width / 2.0, this.image.height / 2.0),
        this.position
      );
    }
    for (const cShape of this.collisionShapes) {
      cShape.move(nPos, isDelta);
    }
  }
}
