import {Vector} from 'two.js/src/vector';
import CircleCollision from '../collision/CircleCollision';
import Component from '../interfaces/componentInterface';
import ComponentType from '../types/types';
import ConnectionComponent from './ConnectionComponent';
import {Circle} from 'two.js/src/shapes/circle';
import Two from 'two.js';

export default class SlotComponent implements Component {
  public readonly id: number;
  private _position: Vector;
  public readonly componentType: ComponentType;
  public readonly parent: Component;
  private _slotConnections: Array<ConnectionComponent>;
  private _selected: boolean;
  public readonly inSlot: boolean;
  private radius: number;
  private attractionRadius: number; // Área de atração do slot para linhas a serem conectadas
  public collisionShape: CircleCollision;
  public drawShape: Circle | undefined;

  get position(): Vector {
    return this.drawShape?.position ?? this._position;
  }

  set position(value: Vector) {
    if (this.drawShape) this.drawShape.position.copy(value);
    else this._position.copy(value);
  }

  get globalPosition() {
    return Vector.add(this.position, this.parent.position);
  }

  get slotConnections() {
    return this._slotConnections;
  }

  set slotConnections(value: Array<ConnectionComponent>) {
    if (this.inSlot) this._slotConnections = [value[0]];
    else this._slotConnections = value;
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
    parent: Component,
    connections: Array<ConnectionComponent> = [],
    inSlot = true,
    radius = 4,
    attractionRadius = 12,
    renderer: Two | undefined
  ) {
    this.id = id;
    this._position = position;
    this.componentType = ComponentType.SLOT;
    this.parent = parent;
    this._slotConnections = connections;
    this._selected = false;
    this.inSlot = inSlot;
    this.radius = radius;
    this.attractionRadius = attractionRadius;
    this.drawShape = renderer?.makeCircle(
      this._position.x,
      this._position.y,
      this.radius
    );
    this.collisionShape = new CircleCollision(
      this.globalPosition,
      this.attractionRadius,
      undefined,
      renderer
    );
  }

  move(v: Vector, useDelta = true) {
    if (useDelta) this.position.add(v);
    else this.position.copy(v);
    this.collisionShape.moveShape(this.globalPosition, false);
  }

  update() {
    this.collisionShape.moveShape(this.globalPosition, false);
  }

  destroy(): void {
    this.drawShape?.remove();
    this.collisionShape.drawShape?.remove();
  }
}
