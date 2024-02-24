import {Text as TextInterface} from '../../../interfaces/renderObjects';
import CanvasRenderer from '../renderer';
import Point2i from '../../../types/Point2i';
import Vector2i from '../../../types/Vector2i';

export default class Text implements TextInterface {
  public renderer: CanvasRenderer;
  public position: Point2i;
  public label: string;
  public textSize: number;
  public color: string;
  public font: string;
  public selected: boolean;

  constructor(
    renderer: CanvasRenderer,
    position: Point2i,
    label: string,
    textSize: number = 12,
    color: string = '#000000',
    font: string = 'sans-serif'
  ) {
    this.renderer = renderer;
    this.position = position;
    this.label = label;
    this.textSize = textSize;
    this.color = color;
    this.font = font;
    this.selected = false;
  }

  draw(): void {
    const oldFillStyle = this.renderer.ctx.fillStyle;
    this.renderer.ctx.font = `${this.textSize}px ${this.font}`;
    this.renderer.ctx.fillStyle = this.color;
    this.renderer.ctx.textBaseline = 'top';
    this.renderer.ctx.textAlign = 'left';
    this.renderer.ctx.fillText(this.label, this.position.x, this.position.y);
    this.renderer.ctx.fillStyle = oldFillStyle;
  }

  move(nPos: Point2i, isDelta: boolean): void {
    if (isDelta) Vector2i.add(this.position, nPos, this.position);
    else Vector2i.copy(this.position, nPos);
  }
}
