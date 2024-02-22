import CircleCollision from '../collision/CircleCollision';
import Component from '../interfaces/componentInterface';
import RenderObject from '../interfaces/renderObjects';
import Renderer from '../interfaces/renderer';
import Point2i from '../types/Point2i';
import ComponentType from '../types/types';
import ConnectionComponent from './ConnectionComponent';

export default class SlotComponent implements Component {
  public readonly id: number;
  public position: Point2i; // local
  public readonly componentType: ComponentType;
  public parent: Component;
  private _slotConnections: Array<ConnectionComponent>;
  public readonly inSlot: boolean;
  private attractionRadius: number; // Área de atração do slot para linhas a serem conectadas
  public collisionShape: CircleCollision;
  public drawShape?: RenderObject | undefined;

  get slotConnections() {
    return this._slotConnections;
  }

  set slotConnections(value: Array<ConnectionComponent>) {
    if (this.inSlot) this._slotConnections = [value[0]];
    else this._slotConnections = value;
  }

  constructor(
    id: number,
    position: Point2i,
    parent: Component,
    connections: Array<ConnectionComponent> = [],
    inSlot = true,
    attractionRadius = 12,
    color?: string,
    borderColor?: string,
    renderer?: Renderer
  ) {
    this.id = id;
    this.position = position;
    this.componentType = ComponentType.SLOT;
    this.parent = parent;
    this._slotConnections = connections;
    this.inSlot = inSlot;
    this.attractionRadius = attractionRadius;
    this.drawShape = renderer?.makePoint(
      this.id,
      this.position,
      this.parent.position,
      undefined,
      color,
      color
    );
    this.collisionShape = new CircleCollision(
      this.id,
      this.position,
      this.attractionRadius,
      borderColor,
      renderer
    );
  }
}
