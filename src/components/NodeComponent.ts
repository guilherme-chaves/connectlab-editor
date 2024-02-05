import ComponentType, {ImageListObject, NodeTypes} from '../types/types';
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
import Vector2i from '../types/Vector2i';

class NodeComponent implements Node {
  public readonly id: number;
  public position: Point2i;
  public readonly componentType: ComponentType;
  public readonly nodeType: NodeTypeObject;
  private _slotComponents: Array<SlotComponent>;
  private _collisionShape: BBCollision;
  private imageWidth: number;
  private imageHeight: number;
  public selected: boolean;

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
    canvasWidth: number,
    canvasHeight: number,
    slots: Array<SlotComponent>,
    images: ImageListObject
  ) {
    this.id = id;
    this.position = position;
    this.componentType = ComponentType.NODE;
    this.nodeType = NodeComponent.getNodeTypeObject(nodeType);
    this._slotComponents = slots;
    this.imageWidth = images.get(this.nodeType.id)!.width;
    this.imageHeight = images.get(this.nodeType.id)!.height;
    Vector2i.sub(
      this.position,
      new Point2i(this.imageWidth / 2.0, this.imageHeight / 2.0),
      this.position
    );
    const canvasBound = Vector2i.sub(
      new Point2i(canvasWidth, canvasHeight),
      new Point2i(this.imageWidth, this.imageHeight)
    );
    Vector2i.min(this.position, canvasBound, this.position);
    Vector2i.max(this.position, Vector2i.ZERO.point, this.position);
    this._collisionShape = new BBCollision(
      this.position,
      this.imageWidth,
      this.imageHeight
    );
    this.selected = false;
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
