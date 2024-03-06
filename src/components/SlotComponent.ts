import CircleCollision from '../collision/CircleCollision';
import Component from '../interfaces/componentInterface';
import Vector2, {VectorObject} from '../types/Vector2';
import ComponentType from '../types/types';
import ConnectionComponent from './ConnectionComponent';

type SlotObject = {
  id: number;
  componentType: ComponentType;
  position: VectorObject;
  parentId: number;
  connectionIds: number[];
  inSlot: boolean;
  color: string;
  colorActive: string;
  radius: number;
  attractionRadius: number;
};

export default class SlotComponent implements Component {
  public readonly id: number;
  public position: Vector2;
  public readonly componentType: ComponentType;
  public readonly parent: Component;
  private _slotConnections: Array<ConnectionComponent>;
  private drawPath: Path2D;
  public selected: boolean;
  public readonly inSlot: boolean;
  private color: string;
  private colorActive: string;
  private radius: number;
  private attractionRadius: number; // Área de atração do slot para linhas a serem conectadas
  public collisionShape: CircleCollision;

  get globalPosition() {
    return this.position.add(this.parent.position);
  }

  get slotConnections() {
    return this._slotConnections;
  }

  set slotConnections(value: Array<ConnectionComponent>) {
    if (this.inSlot) {
      this._slotConnections.splice(0, this._slotConnections.length);
      this._slotConnections.push(value[0]);
    } else this._slotConnections = value;
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
    this.position = position;
    this.componentType = ComponentType.SLOT;
    this.parent = parent;
    this._slotConnections = connections;
    this.color = color;
    this.colorActive = colorActive;
    this.selected = false;
    this.inSlot = inSlot;
    this.radius = radius;
    this.attractionRadius = attractionRadius;
    this.collisionShape = new CircleCollision(
      this.globalPosition,
      this.attractionRadius
    );
    this.drawPath = this.generatePath();
  }

  move(v: Vector2, useDelta = true) {
    if (useDelta) this.position = this.position.add(v);
    else this.position = v;
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
    this.collisionShape.draw(ctx, this.selected);
  }

  toObject(): Object {
    const slotObj: SlotObject = {
      id: this.id,
      componentType: this.componentType,
      position: this.position.toPlainObject(),
      parentId: this.parent.id,
      connectionIds: this.slotConnections.map(value => value.id),
      inSlot: this.inSlot,
      color: this.color,
      colorActive: this.colorActive,
      radius: this.radius,
      attractionRadius: this.attractionRadius,
    };
    return slotObj;
  }
}
