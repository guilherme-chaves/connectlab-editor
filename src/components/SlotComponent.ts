import CircleCollision from '../collision/CircleCollision';
import Component, {ComponentObject} from '../interfaces/componentInterface';
import Vector2 from '../types/Vector2';
import {ComponentType, VectorObject} from '../types/types';
import ConnectionComponent from './ConnectionComponent';

export interface SlotObject extends ComponentObject {
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
}

export default class SlotComponent implements Component {
  public readonly id: number;
  public position: Vector2;
  public globalPosition: Vector2;
  public readonly componentType: ComponentType;
  public readonly parent: Component;
  private _slotConnections: Array<ConnectionComponent>;
  private drawPath: Path2D | undefined;
  private regenPath: boolean;
  public selected: boolean;
  public readonly inSlot: boolean;
  private color: string;
  private colorActive: string;
  private radius: number;
  private attractionRadius: number; // Área de atração do slot para linhas a serem conectadas
  public collisionShape: CircleCollision;

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
    this.globalPosition = Vector2.add(position, parent.position);
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
    this.regenPath = false;
  }

  move(v: Vector2, useDelta = true) {
    if (useDelta) this.position.add(v);
    else Vector2.copy(v, this.position);
    Vector2.add(this.position, this.parent.position, this.globalPosition);
    this.collisionShape.moveShape(this.globalPosition, false);
    this.regenPath = true;
  }

  update() {
    Vector2.add(this.position, this.parent.position, this.globalPosition);
    this.collisionShape.moveShape(this.globalPosition, false);
    this.regenPath = true;
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
    if (!this.drawPath || this.regenPath) this.drawPath = this.generatePath();
    ctx.save();
    ctx.fillStyle = this.selected ? this.colorActive : this.color;
    ctx.fill(this.drawPath);
    ctx.restore();
    this.collisionShape.draw(ctx, this.selected);
  }

  toObject(): SlotObject {
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
