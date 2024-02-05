import BBCollision from '../collision/BBCollision';
import Node from '../interfaces/nodeInterface';
import {SwitchInput} from '../objects/inputTypeObjects';
import Point2i from '../types/Point2i';
import Vector2i from '../types/Vector2i';
import ComponentType, {
  ImageListObject,
  InputTypeObject,
  InputTypes,
} from '../types/types';
import SlotComponent from './SlotComponent';

class InputComponent implements Node {
  public readonly id: number;
  public position: Point2i;
  public readonly componentType: ComponentType;
  public readonly nodeType: InputTypeObject;
  private _slotComponent: SlotComponent | undefined;
  private _collisionShape: BBCollision;
  private imageWidth: number;
  private imageHeight: number;
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
    inputType: InputTypes,
    slot: SlotComponent | undefined,
    images: ImageListObject
  ) {
    this.id = id;
    this.position = position;
    this.componentType = ComponentType.INPUT;
    this.nodeType = InputComponent.getInputTypeObject(inputType);
    this._slotComponent = slot;
    this.imageWidth = images.get(this.nodeType.id * 10)!.width;
    this.imageHeight = images.get(this.nodeType.id * 10)!.height;
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

  static getInputTypeObject(type: InputTypes): InputTypeObject {
    switch (type) {
      case InputTypes.SWITCH:
        return SwitchInput;
      default:
        return SwitchInput;
    }
  }
}

export default InputComponent;
