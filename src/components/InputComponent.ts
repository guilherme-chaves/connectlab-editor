import BBCollision from '../collision/BBCollision';
import Node from '../interfaces/nodeInterface';
import {SwitchInput} from '../objects/inputTypeObjects';
import Point2i from '../types/Point2i';
import ComponentType, {InputTypeObject, InputTypes} from '../types/types';
import SlotComponent from './SlotComponent';

class InputComponent implements Node {
  public readonly id: number;
  public position: Point2i;
  public readonly componentType: ComponentType;
  public readonly nodeType: InputTypeObject;
  private _slotComponent: SlotComponent | undefined;
  private _collisionShape: BBCollision;

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
    inputType: InputTypes,
    slot: SlotComponent | undefined,
    width: number,
    height: number
  ) {
    this.id = id;
    this.position = position;
    this.componentType = ComponentType.INPUT;
    this.nodeType = InputComponent.getInputTypeObject(inputType);
    this._slotComponent = slot;
    this._collisionShape = new BBCollision(this.position, width, height);
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
