import CircleCollision
  from '@connectlab-editor/collisionShapes/circleCollision';
import Component, {
  ComponentObject,
} from '@connectlab-editor/interfaces/componentInterface';
import Vector2i from '@connectlab-editor/types/vector2i';
import { VectorObject } from '@connectlab-editor/types/common';
import { ComponentType, EditorEvents } from '@connectlab-editor/types/enums';
import ConnectionComponent
  from '@connectlab-editor/components/connectionComponent';
import NodeInterface from '@connectlab-editor/interfaces/nodeInterface';

export interface SlotObject extends ComponentObject {
  id: number
  componentType: ComponentType
  position: VectorObject
  parentId: number
  slotIdAtParent: number
  connectionIds: number[]
  inSlot: boolean
  color: string
  colorActive: string
  radius: number
  attractionRadius: number
}

export default class SlotComponent implements Component {
  public readonly id: number;
  public position: Vector2i;
  public globalPosition: Vector2i;
  public readonly componentType: ComponentType;
  public readonly parent: NodeInterface;
  public slotIdAtParent: number;
  private _slotConnections: Array<ConnectionComponent>;
  private drawPath: Path2D | undefined;
  private regenPath: boolean;
  public selected: boolean;
  public readonly inSlot: boolean;
  private color: string;
  private colorActive: string;
  private radius: number;
  // Área de atração do slot para linhas a serem conectadas
  private attractionRadius: number;
  public collisionShape: CircleCollision;

  get slotConnections(): Array<ConnectionComponent> {
    return this._slotConnections;
  }

  set slotConnections(value: Array<ConnectionComponent>) {
    if (this.inSlot) {
      this._slotConnections.splice(0, this._slotConnections.length);
      this._slotConnections.push(value[0]);
    }
    else this._slotConnections = value;
  }

  constructor(
    id: number,
    position: Vector2i,
    parent: NodeInterface,
    slotIdAtParent: number,
    connections: Array<ConnectionComponent> = [],
    inSlot = true,
    radius = 4,
    attractionRadius = 12,
    color = '#0880FF',
    colorActive = '#FF0000',
  ) {
    this.id = id;
    this.position = position;
    this.globalPosition = Vector2i.add(position, parent.position);
    this.componentType = ComponentType.SLOT;
    this.parent = parent;
    this.slotIdAtParent = slotIdAtParent;
    this._slotConnections = connections;
    this.color = color;
    this.colorActive = colorActive;
    this.selected = false;
    this.inSlot = inSlot;
    this.radius = radius;
    this.attractionRadius = attractionRadius;
    this.collisionShape = new CircleCollision(
      this.globalPosition,
      this.attractionRadius,
    );
    this.regenPath = false;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  move(_v?: Vector2i, _useDelta = true): void {
    Vector2i.add(this.position, this.parent.position, this.globalPosition);
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
      Math.PI * 2,
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

  toObject(): SlotObject {
    const slotObj: SlotObject = {
      id: this.id,
      componentType: this.componentType,
      position: this.position.toPlainObject(),
      parentId: this.parent.id,
      slotIdAtParent: this.slotIdAtParent,
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
