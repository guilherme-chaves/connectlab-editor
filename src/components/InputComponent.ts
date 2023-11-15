import EditorEnvironment from '../EditorEnvironment';
import BBCollision from '../collision/BBCollision';
import Component from '../interfaces/componentInterface';
import {SwitchInput} from '../objects/inputTypeObjects';
import Vector2 from '../types/Vector2';
import ComponentType, {InputTypeObject, inputTypes} from '../types/types';
import SlotComponent from './SlotComponent';

class InputComponent implements Component {
  public readonly id: number;
  private _position: Vector2;
  public readonly componentType: ComponentType;
  public readonly inputType: InputTypeObject;
  private _slotComponent: SlotComponent | undefined;
  private _collisionShape: BBCollision;
  private imageWidth: number;
  private imageHeight: number;
  private _state: boolean;

  get position(): Vector2 {
    return this._position;
  }

  set position(value: Vector2) {
    this._position = value;
  }

  get slotComponent() {
    return this._slotComponent;
  }

  set slotComponent(value: SlotComponent | undefined) {
    this._slotComponent = value;
  }

  get collisionShape() {
    return this._collisionShape;
  }

  set collisionShape(value: BBCollision) {
    this._collisionShape = value;
  }

  get state() {
    return this._state;
  }

  set state(value: boolean) {
    this._state = value;
  }

  constructor(
    id: number,
    position: Vector2,
    canvasWidth: number,
    canvasHeight: number,
    inputType: inputTypes,
    slot: SlotComponent | undefined
  ) {
    this.id = id;
    this._position = position;
    this.componentType = ComponentType.INPUT;
    this.inputType = InputComponent.getInputTypeObject(inputType);
    this._slotComponent = slot;
    this.imageWidth =
      EditorEnvironment.IOImageList[`${this.inputType.id}_0`].width;
    this.imageHeight =
      EditorEnvironment.IOImageList[`${this.inputType.id}_0`].height;
    this._position = this._position.sub(
      new Vector2(this.imageWidth / 2.0, this.imageHeight / 2.0)
    );
    const canvasBound = new Vector2(canvasWidth, canvasHeight);
    canvasBound.sub(new Vector2(this.imageWidth, this.imageHeight));
    this.position = this.position.min(canvasBound).max(Vector2.ZERO);
    this._collisionShape = new BBCollision(
      this.position,
      this.imageWidth,
      this.imageHeight
    );
    this._state = false;
  }

  static getInputTypeObject(type: inputTypes): InputTypeObject {
    switch (type) {
      case inputTypes.SWITCH:
        return SwitchInput;
      default:
        return SwitchInput;
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
    let imgId = '';
    if (this._state) imgId = `${this.inputType.id}_1`;
    else imgId = `${this.inputType.id}_0`;

    ctx.drawImage(
      EditorEnvironment.IOImageList[imgId],
      this.position.x,
      this.position.y
    );
    if (this.collisionShape !== undefined) this.collisionShape.draw(ctx, true);
  }
}

export default InputComponent;
