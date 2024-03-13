import ComponentType from '../types/types';
import Vector2, {VectorObject} from '../types/Vector2';
import BBCollision from '../collision/BBCollision';
import Component, {ComponentObject} from '../interfaces/componentInterface';

export interface TextObject extends ComponentObject {
  id: number;
  componentType: ComponentType;
  position: VectorObject;
  text: string;
  parentId: number | undefined;
  style: string;
}

class TextComponent implements Component {
  public readonly id: number;
  public position: Vector2;
  public readonly componentType: ComponentType;
  public text: string;
  public parentNode: Component | null;
  public style: string;
  private textSize: Vector2;
  public collisionShape: BBCollision;
  private canvasContext: CanvasRenderingContext2D;
  public selected: boolean;

  constructor(
    id: number,
    position: Vector2,
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
    this.collisionShape = new BBCollision(
      position,
      this.textSize.x,
      this.textSize.y
    );
    this.selected = false;
  }

  private measureText(text: string, style: string): Vector2 {
    this.canvasContext.font = style;
    this.canvasContext.textBaseline = 'top';
    this.canvasContext.textAlign = 'left';
    const textDimensions = this.canvasContext.measureText(text);
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
    this.collisionShape.draw(ctx, this.selected);
  }

  move(v: Vector2, useDelta = true) {
    if (useDelta) this.position = this.position.add(v);
    else this.position = v;
    this.collisionShape.moveShape(v, useDelta);
  }

  toObject(): TextObject {
    const textObj: TextObject = {
      id: this.id,
      componentType: this.componentType,
      position: this.position.toPlainObject(),
      text: this.text,
      parentId: this.parentNode?.id,
      style: this.style,
    };
    return textObj;
  }
}

export default TextComponent;
