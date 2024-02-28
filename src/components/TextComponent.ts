import ComponentType from '../types/types';
import BBCollision from '../collision/BBCollision';
import Component from '../interfaces/componentInterface';
import {Vector} from 'two.js/src/vector';
import {Text} from 'two.js/src/text';
import Two from 'two.js';

export default class TextComponent implements Component {
  public readonly id: number;
  private _position: Vector;
  public readonly componentType: ComponentType;
  public text: string;
  private textSize: Vector;
  public style: string;
  public collisionShape: BBCollision;
  private _selected: boolean;
  public drawShape: Text | undefined;

  get position(): Vector {
    return this.drawShape?.position ?? this._position;
  }

  set position(value: Vector) {
    if (this.drawShape) this.drawShape.position.copy(value);
    else this._position.copy(value);
  }

  get selected(): boolean {
    return this._selected;
  }

  set selected(value: boolean) {
    this._selected = value;
    if (this.collisionShape.drawShape)
      this.collisionShape.drawShape.visible = this._selected;
  }

  constructor(
    id: number,
    position: Vector,
    text = '',
    style = '12px sans-serif',
    renderer: Two | undefined = undefined
  ) {
    this.id = id;
    this._position = position;
    this.componentType = ComponentType.TEXT;
    this.text = text;
    this.style = style;
    this.drawShape = renderer?.makeText(
      this.text,
      this._position.x,
      this._position.y,
      this.style
    );
    this.textSize = this.measureText(this.text, this.style, renderer);
    this.collisionShape = new BBCollision(
      position,
      this.textSize.x,
      this.textSize.y,
      undefined,
      renderer
    );
    this._selected = false;
  }

  private measureText(text: string, style: string, renderer?: Two): Vector {
    if (renderer === undefined) return new Vector();
    const canvas = new OffscreenCanvas(renderer.width, renderer.height);
    const ctx = canvas.getContext('2d');
    if (!ctx) return new Vector();
    ctx.font = style;
    ctx.textBaseline = 'top';
    ctx.textAlign = 'left';
    const textDimensions = ctx.measureText(text);
    return new Vector(
      textDimensions.width,
      textDimensions.actualBoundingBoxDescent -
        textDimensions.actualBoundingBoxAscent
    );
  }

  move(v: Vector, useDelta = true) {
    if (useDelta) this.position.add(v);
    else this.position.copy(v);
    this.collisionShape.moveShape(v, useDelta);
  }

  destroy(): void {
    this.drawShape?.remove();
    this.collisionShape.drawShape?.remove();
  }
}
