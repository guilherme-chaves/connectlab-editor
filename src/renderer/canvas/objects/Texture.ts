import {Texture as TextureInterface} from '../../../interfaces/renderObjects';
import Point2i from '../../../types/Point2i';
import Vector2i from '../../../types/Vector2i';

export default class Texture implements TextureInterface {
  public position: Point2i;
  public image: ImageBitmap;
  private texture: CanvasPattern | null;
  public selected: boolean;
  public childElements: Set<number>;
  public repeat: 'repeat' | 'repeat-x' | 'repeat-y' | 'no-repeat';

  constructor(
    position: Point2i,
    imageSrc: string,
    repeat: 'repeat' | 'repeat-x' | 'repeat-y' | 'no-repeat',
    children: Set<number> = new Set()
  ) {
    this.position = position;
    this.childElements = children;
    this.repeat = repeat;
    this.image = this.loadImage(imageSrc);
    this.texture = null;
    this.selected = false;
  }

  private loadImage(src: string): ImageBitmap {
    let bitmap: ImageBitmap = new ImageBitmap();
    const image = new Image();
    image.onload = () => {
      Promise.all([createImageBitmap(image)]).then(bitmapArr => {
        bitmap = bitmapArr[0];
      });
    };
    image.src = src;
    return bitmap;
  }

  private loadTexture(ctx: CanvasRenderingContext2D): CanvasPattern | null {
    return ctx.createPattern(this.image, this.repeat);
  }

  draw(ctx: CanvasRenderingContext2D): void {
    this.texture ??= this.loadTexture(ctx);
    ctx.rect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = this.texture ?? '#ff0000';
    ctx.fill();
  }

  move(nPos: Point2i, isDelta: boolean): void {
    if (isDelta) {
      Vector2i.add(this.position, nPos, this.position);
    } else {
      Vector2i.sub(
        this.position,
        new Point2i(this.image.width / 2.0, this.image.height / 2.0),
        this.position
      );
    }
  }
}
