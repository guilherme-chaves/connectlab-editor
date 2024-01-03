import CircleCollision from '../collision/CircleCollision';
import Component from '../interfaces/componentInterface';
import Vector2 from '../types/Vector2';
import ComponentType from '../types/types';
import ConnectionComponent from './ConnectionComponent';

export default class SlotComponent implements Component {
  public readonly id: number;
  private _position: Vector2;
  public readonly componentType: ComponentType;
  private _parent: Component;
  private _slotConnections: Array<ConnectionComponent>;
  private drawPath: Path2D;
  public selected: boolean;
  public readonly inSlot: boolean;
  private color: string;
  private colorActive: string;
  private radius: number;
  private attractionRadius: number; // Área de atração do slot para linhas a serem conectadas
  private _collisionShape: CircleCollision;

  get position(): Vector2 {
    return this._position;
  }

  set position(value: Vector2) {
    this._position = value;
  }

  get globalPosition() {
    return this._position.add(this.parent.position);
  }

  get parent() {
    return this._parent;
  }

  get slotConnections() {
    return this._slotConnections;
  }

  set slotConnections(value: Array<ConnectionComponent>) {
    if (this.inSlot) this._slotConnections = [value[0]];
    else this._slotConnections = value;
  }

  get collisionShape() {
    return this._collisionShape;
  }

  set collisionShape(value: CircleCollision) {
    this._collisionShape = value;
  }

  constructor(
    id: number,
    position: Vector2,
    parent: Component,
    connections: Array<ConnectionComponent> = [],
    inSlot = true,
    radius = 4,
    attractionRadius = 12,
    color = '#0880FF',
    colorActive = '#FF0000'
  ) {
    this.id = id;
    this._position = position;
    this.componentType = ComponentType.SLOT;
    this._parent = parent;
    this._slotConnections = connections;
    this.color = color;
    this.colorActive = colorActive;
    this.selected = false;
    this.inSlot = inSlot;
    this.radius = radius;
    this.attractionRadius = attractionRadius;
    this._collisionShape = new CircleCollision(
      this.globalPosition,
      this.attractionRadius
    );
    this.drawPath = this.generatePath();
  }

  move(v: Vector2) {
    this._position = v;
    this.collisionShape.moveShape(this.globalPosition, false);
    this.drawPath = this.generatePath();
  }

  update() {
    this.collisionShape.moveShape(this.globalPosition, false);
    this.drawPath = this.generatePath();
  }

  // Gera um objeto Path2D contendo a figura a ser desenhada, armazenando-a em uma variável
  private generatePath(): Path2D {
    const path = new Path2D();
    path.arc(
      this.globalPosition.x,
      this.globalPosition.y,
      this.radius,
      0,
      Math.PI * 2
    );
    return path;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    const oldFillStyle = ctx.fillStyle;
    ctx.fillStyle = this.selected ? this.colorActive : this.color;
    ctx.fill(this.drawPath);
    ctx.fillStyle = oldFillStyle;
    this.collisionShape.draw(ctx, true);
  }
}
