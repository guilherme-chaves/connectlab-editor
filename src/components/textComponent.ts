import {VectorObject} from '@connectlab-editor/types/common';
import {ComponentType, EditorEvents} from '@connectlab-editor/types/enums';
import Vector2i from '@connectlab-editor/types/vector2i';
import BoxCollision from '@connectlab-editor/collisionShapes/boxCollision';
import Component, {
  ComponentObject,
} from '@connectlab-editor/interfaces/componentInterface';

export interface TextObject extends ComponentObject {
  id: number;
  componentType: ComponentType;
  position: VectorObject;
  text: string;
  parent: {id: number; type: ComponentType} | null;
  style: string;
}

class TextComponent implements Component {
  public readonly id: number;
  public position: Vector2i;
  public readonly componentType: ComponentType;
  public text: string;
  public parent: {id: number; type: ComponentType} | null;
  public style: string;
  private textSize: Vector2i;
  public collisionShape: BoxCollision;
  private canvasContext: CanvasRenderingContext2D;
  public selected: boolean;

  constructor(
    id: number,
    position: Vector2i,
    text = '',
    style = '12px sans-serif',
    parent: {id: number; type: ComponentType} | null,
    ctx: CanvasRenderingContext2D
  ) {
    this.id = id;
    this.position = position;
    this.componentType = ComponentType.TEXT;
    this.text = text;
    this.style = style;
    this.parent = parent;
    this.canvasContext = ctx;
    this.textSize = this.measureText(text, style);
    this.position.sub(Vector2i.div(this.textSize, 2));
    this.collisionShape = new BoxCollision(
      this.position,
      this.textSize.x,
      this.textSize.y
    );
    this.selected = false;
  }

  private measureText(text: string, style: string): Vector2i {
    this.canvasContext.font = style;
    this.canvasContext.textBaseline = 'top';
    this.canvasContext.textAlign = 'left';
    const textDimensions = this.canvasContext.measureText(text);
    const textSize = new Vector2i(
      textDimensions.width,
      textDimensions.actualBoundingBoxDescent -
        textDimensions.actualBoundingBoxAscent
    ).max(new Vector2i(16, 16));
    return textSize;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    ctx.font = this.style;
    ctx.textBaseline = 'top';
    ctx.textAlign = 'left';
    ctx.fillText(this.text, this.position.x, this.position.y);
    ctx.restore();
    this.collisionShape.draw(ctx, this.selected);
  }

  move(v: Vector2i, useDelta = true): void {
    if (useDelta) this.position.add(v);
    else Vector2i.sub(v, Vector2i.div(this.textSize, 2), this.position);
    this.collisionShape.moveShape(this.position, false);
  }

  onEvent(ev: EditorEvents): boolean {
    switch (ev) {
      case EditorEvents.FOCUS_IN:
        this.selected = true;
        break;
      case EditorEvents.FOCUS_OUT:
        this.selected = false;
        break;
      default:
        return false;
    }
    return true;
  }

  toObject(): TextObject {
    const textObj: TextObject = {
      id: this.id,
      componentType: this.componentType,
      position: this.position.toPlainObject(),
      text: this.text,
      parent: this.parent,
      style: this.style,
    };
    return textObj;
  }
}

export default TextComponent;
