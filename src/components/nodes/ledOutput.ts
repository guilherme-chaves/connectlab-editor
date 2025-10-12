import {
  ImageListObject,
  SignalGraph,
  SignalGraphData,
} from '@connectlab-editor/types/common';
import { ComponentType, EditorEvents } from '@connectlab-editor/types/enums';
import { NodeModel } from '@connectlab-editor/types/common';
import Vector2i from '@connectlab-editor/types/vector2i';
import BoxCollision from '@connectlab-editor/collisionShapes/boxCollision';
import Node, { NodeObject } from '@connectlab-editor/interfaces/nodeInterface';
import { LEDROutput } from '@connectlab-editor/models/output';
import { getImageSublist } from '@connectlab-editor/functions/preloadImage';
import SlotComponent from '@connectlab-editor/components/slotComponent';

class LedOutput implements Node {
  public readonly id: number;
  public position: Vector2i;
  public readonly componentType: ComponentType;
  public readonly nodeType: NodeModel;
  public slots: Array<SlotComponent>;
  public collisionShape: BoxCollision;
  private _images: ImageListObject;
  private imageSize: Vector2i;
  private halfImageSize: Vector2i;
  private imageMode: 'UP_LEFT' | 'CENTER' = 'UP_LEFT';
  private readonly _signalData: SignalGraphData;
  public selected: boolean;

  get image(): ImageBitmap | null {
    if (Object.keys(this._images).length === 0) return null;
    return this._images[this.state ? 1 : 0];
  }

  get state() {
    return this._signalData.output ?? false;
  }

  constructor(
    id: number,
    position: Vector2i,
    canvasWidth: number,
    canvasHeight: number,
    slots: Array<SlotComponent>,
    images: ImageListObject,
    signalGraph: SignalGraph,
    shiftPosition = true,
  ) {
    this.id = id;
    this.position = position;
    this.componentType = ComponentType.OUTPUT;
    this.nodeType = LEDROutput;
    this._signalData = signalGraph[this.id];
    this.slots = slots;
    this._images = getImageSublist(images, this.nodeType.imgPath);
    this.imageSize = new Vector2i(
      this.image?.width ?? 100,
      this.image?.height ?? 100,
    );
    this.halfImageSize = Vector2i.div(this.imageSize, 2);
    if (shiftPosition) {
      this.imageMode = 'CENTER';
      this.position.sub(this.halfImageSize);
      const canvasBound = new Vector2i(canvasWidth, canvasHeight).sub(
        this.imageSize,
      );
      this.position.min(canvasBound).max(Vector2i.ZERO);
    }
    this.collisionShape = new BoxCollision(
      this.position,
      this.imageSize.x,
      this.imageSize.y,
    );
    this.selected = false;
  }

  move(v: Vector2i, useDelta = true): void {
    if (useDelta) {
      this.position.add(v);
    }
    else if (this.imageMode === 'CENTER') {
      Vector2i.sub(v, this.halfImageSize, this.position);
    }
    else {
      this.position.copy(v);
    }
    this.collisionShape.moveShape(this.position, false);
  }

  draw(ctx: CanvasRenderingContext2D): void {
    if (!this.image) return;
    ctx.drawImage(this.image, this.position.x, this.position.y);
    if (this.collisionShape !== undefined)
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

export default LedOutput;
