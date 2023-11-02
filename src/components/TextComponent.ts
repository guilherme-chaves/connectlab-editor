import ComponentType from '../types/types';
import Vector2 from '../types/Vector2';
import BBCollision from '../collision/BBCollision';
import Component from '../interfaces/componentInterface';

class TextComponent implements Component {
  public readonly id: number;
  private _position: Vector2;
  public readonly componentType: ComponentType;
  public text: string;
  public parentNode: Component | null;
  public style: string;
  private textSize: Vector2;
  private _collisionShape: BBCollision;
  private canvasContext: CanvasRenderingContext2D;

  get position(): Vector2 {
    return this._position;
  }

  set position(value: Vector2) {
    this._position = value;
  }

  get collisionShape() {
    return this._collisionShape;
  }

  set collisionShape(value: BBCollision) {
    this._collisionShape = value;
  }

  constructor(
    id: number,
    position: Vector2,
    text = '',
    style = '12px sans-serif',
    parent: Component | null = null,
    ctx: CanvasRenderingContext2D
  ) {
    this.id = id;
    this._position = position;
    this.componentType = ComponentType.TEXT;
    this.text = text;
    this.style = style;
    this.parentNode = parent;
    this.canvasContext = ctx;
    this.textSize = this.measureText(ctx, text, style);
    this._collisionShape = new BBCollision(
      position,
      this.textSize.x,
      this.textSize.y
    );
  }

  private measureText(
    ctx: CanvasRenderingContext2D,
    text: string,
    style: string
  ): Vector2 {
    ctx.font = style;
    ctx.textBaseline = 'top';
    ctx.textAlign = 'left';
    const textDimensions = ctx.measureText(text);
    return new Vector2(
      textDimensions.width,
      textDimensions.actualBoundingBoxDescent -
        textDimensions.actualBoundingBoxAscent
    );
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.font = this.style;
    ctx.textBaseline = 'top';
    ctx.textAlign = 'left';
    ctx.fillText(this.text, this.position.x, this.position.y);
    this.collisionShape.draw(ctx, true);
  }

  move(v: Vector2, useDelta = true) {
    if (useDelta) this.position = this.position.add(v);
    else this.position = v;
    this._collisionShape.moveShape(v, useDelta);
  }
}

export default TextComponent;
