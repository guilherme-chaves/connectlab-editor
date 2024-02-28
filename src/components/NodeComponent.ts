import ComponentType, {
  NodeTypes,
  SignalGraph,
  SignalGraphData,
} from '../types/types';
import {NodeTypeObject} from '../types/types';
import {
  ADDNode,
  NANDNode,
  NORNode,
  NOTNode,
  ORNode,
  XNORNode,
  XORNode,
} from '../objects/nodeTypeObjects';
import BBCollision from '../collision/BBCollision';
import Node from '../interfaces/nodeInterface';
import SlotComponent from './SlotComponent';
import {Vector} from 'two.js/src/vector';
import {ImageSequence} from 'two.js/src/effects/image-sequence';
import Two from 'two.js';

export default class NodeComponent implements Node {
  public readonly id: number;
  private _position: Vector;
  public readonly componentType: ComponentType;
  public readonly nodeType: NodeTypeObject;
  public slotComponents: Array<SlotComponent>;
  public collisionShape: BBCollision;
  private readonly _signalNode: SignalGraphData;
  private _selected: boolean;
  public drawShape: ImageSequence | undefined;

  get position(): Vector {
    return this.drawShape?.position ?? this._position;
  }

  set position(value: Vector) {
    if (this.drawShape) this.drawShape.position.copy(value);
    else this._position.copy(value);
  }

  get state() {
    return this._signalNode.state;
  }

  set state(value: boolean) {
    this._signalNode.state = value;
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
    nodeType: NodeTypes,
    slots: Array<SlotComponent>,
    signalGraph: SignalGraph,
    renderer: Two | undefined
  ) {
    this.id = id;
    this._position = position;
    this.componentType = ComponentType.NODE;
    this.nodeType = NodeComponent.getNodeTypeObject(nodeType);
    this.slotComponents = slots;
    this._signalNode = signalGraph.get(this.id)!;
    this.drawShape = renderer?.makeImageSequence(
      this.nodeType.imgPaths,
      this._position.x,
      this._position.y,
      0,
      false
    );
    this.collisionShape = new BBCollision(
      this.position,
      this.drawShape?.width ?? 88,
      this.drawShape?.height ?? 50,
      undefined,
      renderer
    );
    this._selected = false;
  }

  static getNodeTypeObject(type: NodeTypes): NodeTypeObject {
    // Carrega o objeto do tipo de Node solicitado
    switch (type) {
      case NodeTypes.ADD:
        return ADDNode;
      case NodeTypes.NAND:
        return NANDNode;
      case NodeTypes.NOR:
        return NORNode;
      case NodeTypes.NOT:
        return NOTNode;
      case NodeTypes.OR:
        return ORNode;
      case NodeTypes.XNOR:
        return XNORNode;
      case NodeTypes.XOR:
        return XORNode;
      default:
        return NOTNode;
    }
  }

  move(v: Vector, useDelta = true): void {
    if (useDelta) {
      this.position.add(v);
      this.collisionShape.moveShape(v);
    } else {
      this.position.copy(
        v.sub(
          (this.drawShape?.width ?? 0) / 2.0,
          (this.drawShape?.height ?? 0) / 2.0
        )
      );
      this.collisionShape.moveShape(this.position, false);
    }
  }

  destroy(): void {
    this.drawShape?.remove();
    this.collisionShape.drawShape?.remove();
  }
}
