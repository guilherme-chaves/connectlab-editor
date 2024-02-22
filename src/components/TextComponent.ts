import ComponentType from '../types/types';
import BBCollision from '../collision/BBCollision';
import Component from '../interfaces/componentInterface';
import Point2i from '../types/Point2i';
import RenderObject from '../interfaces/renderObjects';
import Renderer from '../interfaces/renderer';

export default class TextComponent implements Component {
  public readonly id: number;
  public position: Point2i;
  public readonly componentType: ComponentType;
  public collisionShape: BBCollision;
  public drawShape?: RenderObject | undefined;

  constructor(
    id: number,
    position: Point2i,
    label: string,
    textDimensions: Point2i,
    textSize?: number,
    textFont?: string,
    textColor?: string,
    renderer?: Renderer
  ) {
    this.id = id;
    this.position = position;
    this.componentType = ComponentType.TEXT;
    this.drawShape = renderer?.makeText(
      this.id,
      this.position,
      label,
      textSize,
      textColor,
      textFont
    );
    this.collisionShape = new BBCollision(
      this.id,
      this.position,
      textDimensions.x,
      textDimensions.y,
      renderer
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
