import ComponentType from '../types/types';
import BBCollision from '../collision/BBCollision';
import Component from '../interfaces/componentInterface';
import Point2i from '../types/Point2i';

export default class TextComponent implements Component {
  public readonly id: number;
  public position: Point2i;
  public readonly componentType: ComponentType;
  public text: string;
  public parentNode: Component | null;
  public style: string;
  private textSize: Point2i;
  private _collisionShape: BBCollision;
  private canvasContext: CanvasRenderingContext2D;
  public selected: boolean;

  get collisionShape() {
    return this._collisionShape;
  }

  set collisionShape(value: BBCollision) {
    this._collisionShape = value;
  }

  constructor(
    id: number,
    position: Point2i,
    text = '',
    style = '12px sans-serif',
    parent: Component | null = null,
    ctx: CanvasRenderingContext2D
  ) {
    this.id = id;
    this.position = position;
    this.componentType = ComponentType.TEXT;
    this.text = text;
    this.style = style;
    this.parentNode = parent;
    this.canvasContext = ctx;
    this.textSize = this.measureText(text, style);
    this._collisionShape = new BBCollision(
      position,
      this.textSize.x,
      this.textSize.y
    );
    this.selected = false;
  }

  private measureText(text: string, style: string): Point2i {
    this.canvasContext.font = style;
    this.canvasContext.textBaseline = 'top';
    this.canvasContext.textAlign = 'left';
    const textDimensions = this.canvasContext.measureText(text);
    return new Point2i(
      textDimensions.width,
      textDimensions.actualBoundingBoxDescent -
        textDimensions.actualBoundingBoxAscent
    );
  }
}
