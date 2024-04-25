import {
  ComponentType,
  ImageListObject,
  NodeTypes,
  SignalGraph,
  SignalGraphData,
  VectorObject,
  slotStates,
} from '@connectlab-editor/types';
import {NodeModel} from '@connectlab-editor/types';
import {
  ADDNode,
  NANDNode,
  NORNode,
  NOTNode,
  ORNode,
  XNORNode,
  XORNode,
} from '@connectlab-editor/models/node';
import Vector2 from '@connectlab-editor/types/Vector2';
import BBCollision from '@connectlab-editor/collisionShapes/BBCollision';
import Node from '@connectlab-editor/interfaces/nodeInterface';
import {SwitchInput} from '@connectlab-editor/models/input';
import {LEDROutput} from '@connectlab-editor/models/output';
import {getImageSublist} from '@connectlab-editor/functions/preloadImage';
import {ComponentObject} from '@connectlab-editor/interfaces/componentInterface';
import SlotComponent from './SlotComponent';

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
  public readonly nodeType: NodeModel;
  public slots: Array<SlotComponent>;
  public collisionShape: BBCollision;
  private _images: ImageListObject;
  private imageWidth: number;
  private imageHeight: number;
  private readonly _signalData: SignalGraphData;
  public selected: boolean;

  get image(): ImageBitmap | null {
    if (Object.keys(this._images).length === 0) return null;
    if (this.componentType === ComponentType.NODE) return this._images[0];
    return this._images[this.state ? 1 : 0];
  }

  get state() {
    return this._signalData.state ?? false;
  }

  set state(value: slotStates) {
    this._signalData.state = value;
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
    this.nodeType = NodeComponent.getNodeModel(nodeType);
    this._signalData = signalGraph[this.id];
    this.slots = slots;
    this._images = getImageSublist(images, this.nodeType.imgPath);
    this.imageWidth = this.image?.width ?? 100;
    this.imageHeight = this.image?.height ?? 100;
    if (shiftPosition) {
      this.position.sub(
        new Vector2(this.imageWidth / 2.0, this.imageHeight / 2.0)
      );
      const canvasBound = new Vector2(canvasWidth, canvasHeight).sub(
        new Vector2(this.imageWidth, this.imageHeight)
      );
      this.position.min(canvasBound).max(Vector2.ZERO);
    }
    this.collisionShape = new BBCollision(
      this.position,
      this.imageWidth,
      this.imageHeight
    );
    this.selected = false;
  }

  static getNodeModel(type: NodeTypes): NodeModel {
    // Carrega o objeto do tipo de Node solicitado
    switch (type) {
      case NodeTypes.G_AND:
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
      this.position.add(v);
      this.collisionShape.moveShape(this.position, false);
    } else {
      Vector2.sub(
        v,
        new Vector2(this.imageWidth / 2.0, this.imageHeight / 2.0),
        this.position
      );
      this.collisionShape.moveShape(this.position, false);
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (!this.image) return;
    ctx.drawImage(this.image, this.position.x, this.position.y);
    if (this.collisionShape !== undefined)
      this.collisionShape.draw(ctx, this.selected);
  }

  toObject(): NodeObject {
    const nodeObj: NodeObject = {
      id: this.id,
      componentType: this.componentType,
      nodeType: this.nodeType.id,
      position: this.position.toPlainObject(),
      slotIds: this.slots.map(slot => slot.id),
      state: this.state,
    };
    return nodeObj;
  }
}

export default NodeComponent;
