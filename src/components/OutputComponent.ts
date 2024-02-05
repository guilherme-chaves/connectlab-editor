import BBCollision from '../collision/BBCollision';
import Node from '../interfaces/nodeInterface';
import {LEDROutput} from '../objects/outputTypeObjects';
import ComponentType, {
  ImageListObject,
  OutputTypeObject,
  OutputTypes,
} from '../types/types';
import SlotComponent from './SlotComponent';
import Point2i from '../types/Point2i';
import Vector2i from '../types/Vector2i';

class OutputComponent implements Node {
  public readonly id: number;
  public position: Point2i;
  public readonly componentType: ComponentType;
  public readonly nodeType: OutputTypeObject;
  private _slotComponent: SlotComponent | undefined;
  private _collisionShape: BBCollision;
  private imageWidth: number;
  private imageHeight: number;
  public isLEDOutput: boolean;
  public selected: boolean;

  get slotComponents() {
    return this._slotComponent !== undefined ? [this._slotComponent] : [];
  }

  set slotComponents(value: Array<SlotComponent>) {
    this._slotComponent = value[0];
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
    canvasWidth: number,
    canvasHeight: number,
    outputType: OutputTypes,
    slot: SlotComponent | undefined,
    images: ImageListObject
  ) {
    this.id = id;
    this.position = position;
    this.componentType = ComponentType.OUTPUT;
    [this.nodeType, this.isLEDOutput] =
      OutputComponent.getOutputTypeObject(outputType);
    this._slotComponent = slot;
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

  static getOutputTypeObject(type: OutputTypes): [OutputTypeObject, boolean] {
    switch (type) {
      case OutputTypes.MONO_LED_RED:
        return [LEDROutput, true];
      default:
        return [LEDROutput, true];
    }
  }
}

export default OutputComponent;
