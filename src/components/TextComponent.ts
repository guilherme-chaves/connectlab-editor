import ComponentType from '../types/types';
import BBCollision from '../collision/BBCollision';
import Component from '../interfaces/componentInterface';
import Point2i from '../types/Point2i';

export default class TextComponent implements Component {
  public readonly id: number;
  public position: Point2i;
  public readonly componentType: ComponentType;
  public parentNode: Component | null;
  private _collisionShape: BBCollision;

  get collisionShape() {
    return this._collisionShape;
  }

  set collisionShape(value: BBCollision) {
    this._collisionShape = value;
  }

  constructor(
    id: number,
    position: Point2i,
    parent: Component | null = null,
    textDimensions: Point2i
  ) {
    this.id = id;
    this.position = position;
    this.componentType = ComponentType.TEXT;
    this.parentNode = parent;
    this._collisionShape = new BBCollision(
      position,
      textDimensions.x,
      textDimensions.y
    );
  }

  static measureText(
    ctx: CanvasRenderingContext2D,
    text: string,
    style: string
  ): Point2i {
    ctx.font = style;
    ctx.textBaseline = 'top';
    ctx.textAlign = 'left';
    const textDimensions = ctx.measureText(text);
    return new Point2i(
      textDimensions.width,
      textDimensions.actualBoundingBoxDescent -
        textDimensions.actualBoundingBoxAscent
    );
  }
}
