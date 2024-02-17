import BBCollision from '../collision/BBCollision';
import Node from '../interfaces/nodeInterface';
import {LEDROutput} from '../objects/outputTypeObjects';
import ComponentType, {OutputTypeObject, OutputTypes} from '../types/types';
import SlotComponent from './SlotComponent';
import Point2i from '../types/Point2i';

class OutputComponent implements Node {
  public readonly id: number;
  public position: Point2i;
  public readonly componentType: ComponentType;
  public readonly nodeType: OutputTypeObject;
  private _slotComponent: SlotComponent | undefined;
  private _collisionShape: BBCollision;
  public isLEDOutput: boolean;

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
    outputType: OutputTypes,
    slot: SlotComponent | undefined,
    width: number,
    height: number
  ) {
    this.id = id;
    this.position = position;
    this.componentType = ComponentType.OUTPUT;
    [this.nodeType, this.isLEDOutput] =
      OutputComponent.getOutputTypeObject(outputType);
    this._slotComponent = slot;
    this._collisionShape = new BBCollision(this.position, width, height);
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
