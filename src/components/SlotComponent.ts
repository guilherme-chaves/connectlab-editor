import CircleCollision from '../collision/CircleCollision';
import Component from '../interfaces/componentInterface';
import Point2i from '../types/Point2i';
import ComponentType from '../types/types';
import ConnectionComponent from './ConnectionComponent';

export default class SlotComponent implements Component {
  public readonly id: number;
  public position: Point2i;
  public readonly componentType: ComponentType;
  private _parent: Component;
  private _slotConnections: Array<ConnectionComponent>;
  public readonly inSlot: boolean;
  private attractionRadius: number; // Área de atração do slot para linhas a serem conectadas
  private _collisionShape: CircleCollision;

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
    position: Point2i,
    parent: Component,
    connections: Array<ConnectionComponent> = [],
    inSlot = true,
    attractionRadius = 12
  ) {
    this.id = id;
    this.position = position;
    this.componentType = ComponentType.SLOT;
    this._parent = parent;
    this._slotConnections = connections;
    this.inSlot = inSlot;
    this.attractionRadius = attractionRadius;
    this._collisionShape = new CircleCollision(
      this.position,
      this.attractionRadius
    );
  }
}
