import BBCollision from '../collision/BBCollision';
import Node from '../interfaces/nodeInterface';
import {Sprite} from '../interfaces/renderObjects';
import Renderer from '../interfaces/renderer';
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
  public collisionShape: BBCollision;
  public drawShape: Sprite | undefined;

  get slotComponents() {
    return this._slotComponent !== undefined ? [this._slotComponent] : [];
  }

  set slotComponents(value: Array<SlotComponent>) {
    this._slotComponent = value[0];
  }

  constructor(
    id: number,
    position: Point2i,
    inputType: InputTypes,
    slot: SlotComponent | undefined,
    width: number,
    height: number,
    renderer?: Renderer
  ) {
    this.id = id;
    this.position = position;
    this.componentType = ComponentType.INPUT;
    this.nodeType = InputComponent.getInputTypeObject(inputType);
    this._slotComponent = slot;
    this.drawShape = renderer?.makeSprite(
      this.id,
      this.componentType,
      this.nodeType.imgPaths,
      this.position,
      this.nodeType.imgPaths[0]
    );
    this.collisionShape = new BBCollision(
      this.id,
      this.position,
      this.drawShape?.imageSet[this.nodeType.imgPaths[0]].width ?? width,
      this.drawShape?.imageSet[this.nodeType.imgPaths[0]].height ?? height,
      renderer
    );
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
