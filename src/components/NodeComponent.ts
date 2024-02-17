import ComponentType, {NodeTypes} from '../types/types';
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
import Point2i from '../types/Point2i';

class NodeComponent implements Node {
  public readonly id: number;
  public position: Point2i;
  public readonly componentType: ComponentType;
  public readonly nodeType: NodeTypeObject;
  private _slotComponents: Array<SlotComponent>;
  private _collisionShape: BBCollision;

  get slotComponents() {
    return this._slotComponents;
  }

  set slotComponents(value: Array<SlotComponent>) {
    this._slotComponents = value;
  }

  get collisionShape() {
    return this._collisionShape;
  }

  set collisionShape(value: BBCollision) {
    this._collisionShape = value;
  }

  constructor(
    id: number,
    position: Point2i,
    nodeType: NodeTypes,
    slots: Array<SlotComponent>,
    width: number,
    height: number
  ) {
    this.id = id;
    this.position = position;
    this.componentType = ComponentType.NODE;
    this.nodeType = NodeComponent.getNodeTypeObject(nodeType);
    this._slotComponents = slots;
    this._collisionShape = new BBCollision(this.position, width, height);
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
}

export default NodeComponent;
