import {
  ImageListObject,
  SignalGraph,
  SignalGraphData,
} from '@connectlab-editor/types/common';
import {
  ComponentType,
  EditorEvents,
  NodeTypes,
} from '@connectlab-editor/types/enums';
import {NodeModel} from '@connectlab-editor/types/common';
import Vector2 from '@connectlab-editor/types/vector2';
import BoxCollision from '@connectlab-editor/collisionShapes/boxCollision';
import Node, {NodeObject} from '@connectlab-editor/interfaces/nodeInterface';
import {getImageSublist} from '@connectlab-editor/functions/preloadImage';
import SlotComponent from '@connectlab-editor/components/slotComponent';
import {nodeModels} from '@connectlab-editor/models/node';

class DefaultGate implements Node {
  public readonly id: number;
  public position: Vector2;
  public readonly componentType: ComponentType;
  public readonly nodeType: NodeModel;
  public slots: Array<SlotComponent>;
  public collisionShape: BoxCollision;
  private _images: ImageListObject;
  private imageWidth: number;
  private imageHeight: number;
  private readonly _signalData: SignalGraphData;
  public selected: boolean;

  get image(): ImageBitmap | null {
    if (Object.keys(this._images).length === 0) return null;
    return this._images[0];
  }

  get state() {
    return this._signalData.state ?? false;
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
    this.nodeType = DefaultGate.getNodeModel(nodeType);
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
    this.collisionShape = new BoxCollision(
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
        return nodeModels.ADDNode;
      case NodeTypes.G_NAND:
        return nodeModels.NANDNode;
      case NodeTypes.G_NOR:
        return nodeModels.NORNode;
      case NodeTypes.G_NOT:
        return nodeModels.NOTNode;
      case NodeTypes.G_OR:
        return nodeModels.ORNode;
      case NodeTypes.G_XNOR:
        return nodeModels.XNORNode;
      case NodeTypes.G_XOR:
        return nodeModels.XORNode;
      default:
        return nodeModels.NOTNode;
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

  draw(ctx: CanvasRenderingContext2D): void {
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onEvent(_ev: EditorEvents): boolean {
    return false;
  }
}

export default DefaultGate;
