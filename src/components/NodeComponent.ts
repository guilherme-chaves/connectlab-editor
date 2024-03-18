import {
  ComponentType,
  ImageListObject,
  NodeTypes,
  SignalGraph,
  slotStates,
  VectorObject,
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
import Vector2 from '../types/Vector2';
import BBCollision from '../collision/BBCollision';
import Node from '../interfaces/nodeInterface';
import SlotComponent from './SlotComponent';
import signalEvents from '../functions/Signal/signalEvents';
import {SwitchInput} from '../objects/inputTypeObjects';
import {LEDROutput} from '../objects/outputTypeObjects';
import {getImageSublist} from '../functions/preloadImage';
import {ComponentObject} from '../interfaces/componentInterface';

export interface NodeObject extends ComponentObject {
  id: number;
  componentType: ComponentType;
  nodeType: NodeTypes;
  position: VectorObject;
  slotIds: number[];
  state: boolean;
}

class NodeComponent implements Node {
  public readonly id: number;
  public position: Vector2;
  public readonly componentType: ComponentType;
  public readonly nodeType: NodeTypeObject;
  public slotComponents: Array<SlotComponent>;
  public collisionShape: BBCollision;
  private _images: ImageListObject;
  private imageWidth: number;
  private imageHeight: number;
  private readonly _signalGraph: SignalGraph;
  public selected: boolean;

  get image(): ImageBitmap {
    if (this.componentType === ComponentType.NODE) return this._images[0];
    return this._images[this.state ? 1 : 0];
  }

  get state() {
    return signalEvents.getVertexState(this._signalGraph, this.id);
  }

  set state(value: slotStates) {
    signalEvents.setVertexState(this._signalGraph, this.id, value);
  }

  constructor(
    id: number,
    position: Vector2,
    componentType: ComponentType,
    nodeType: NodeTypes,
    canvasWidth: number,
    canvasHeight: number,
    slots: Array<SlotComponent>,
    images: ImageListObject,
    signalGraph: SignalGraph,
    shiftPosition = true
  ) {
    this.id = id;
    this.position = position;
    this.componentType = componentType;
    this.nodeType = NodeComponent.getNodeTypeObject(nodeType);
    this.slotComponents = slots;
    this._images = getImageSublist(images, this.nodeType.imgPath);
    this._signalGraph = signalGraph;
    this.imageWidth = this.image!.width;
    this.imageHeight = this.image!.height;
    if (shiftPosition) {
      this.position = this.position.sub(
        new Vector2(this.imageWidth / 2.0, this.imageHeight / 2.0)
      );
      const canvasBound = new Vector2(canvasWidth, canvasHeight).sub(
        new Vector2(this.imageWidth, this.imageHeight)
      );
      this.position = this.position.min(canvasBound).max(Vector2.ZERO);
    }
    this.collisionShape = new BBCollision(
      this.position,
      this.imageWidth,
      this.imageHeight
    );
    this.selected = false;
  }

  static getNodeTypeObject(type: NodeTypes): NodeTypeObject {
    // Carrega o objeto do tipo de Node solicitado
    switch (type) {
      case NodeTypes.G_ADD:
        return ADDNode;
      case NodeTypes.G_NAND:
        return NANDNode;
      case NodeTypes.G_NOR:
        return NORNode;
      case NodeTypes.G_NOT:
        return NOTNode;
      case NodeTypes.G_OR:
        return ORNode;
      case NodeTypes.G_XNOR:
        return XNORNode;
      case NodeTypes.G_XOR:
        return XORNode;
      case NodeTypes.I_SWITCH:
        return SwitchInput;
      case NodeTypes.O_LED_RED:
        return LEDROutput;
      default:
        return NOTNode;
    }
  }

  move(v: Vector2, useDelta = true): void {
    if (useDelta) {
      this.position = this.position.add(v);
      this.collisionShape.moveShape(v);
    } else {
      this.position = v.sub(
        new Vector2(this.imageWidth / 2.0, this.imageHeight / 2.0)
      );
      this.collisionShape.moveShape(this.position, false);
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.drawImage(this.image!, this.position.x, this.position.y);
    if (this.collisionShape !== undefined)
      this.collisionShape.draw(ctx, this.selected);
  }

  toObject(): NodeObject {
    const nodeObj: NodeObject = {
      id: this.id,
      componentType: this.componentType,
      nodeType: this.nodeType.id,
      position: this.position.toPlainObject(),
      slotIds: this.slotComponents.map(value => value.id),
      state: this.state,
    };
    return nodeObj;
  }
}

export default NodeComponent;
