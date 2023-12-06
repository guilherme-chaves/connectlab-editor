import EditorEnvironment from '../EditorEnvironment';
import BBCollision from '../collision/BBCollision';
import Component from '../interfaces/componentInterface';
import {LEDROutput} from '../objects/outputTypeObjects';
import Vector2 from '../types/Vector2';
import ComponentType, {OutputTypeObject, OutputTypes} from '../types/types';
import SlotComponent from './SlotComponent';

class OutputComponent implements Component {
  public readonly id: string;
  private _position: Vector2;
  public readonly componentType: ComponentType;
  public readonly outputType: OutputTypeObject;
  private _slotComponent: SlotComponent | undefined;
  private _collisionShape: BBCollision;
  private imageWidth: number;
  private imageHeight: number;
  private _state: boolean;
  private _isLEDOutput: boolean;

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
    id: string,
    position: Vector2,
    canvasWidth: number,
    canvasHeight: number,
    outputType: OutputTypes,
    slot: SlotComponent | undefined
  ) {
    this.id = id;
    this._position = position;
    this.componentType = ComponentType.OUTPUT;
    [this.outputType, this._isLEDOutput] =
      OutputComponent.getOutputTypeObject(outputType);
    this._slotComponent = slot;
    this.imageWidth =
      EditorEnvironment.OutputImageList[`${this.outputType.id}`].width;
    this.imageHeight =
      EditorEnvironment.OutputImageList[`${this.outputType.id}`].height;
    this._position = this._position.sub(
      new Vector2(this.imageWidth / 2.0, this.imageHeight / 2.0)
    );
    const canvasBound = new Vector2(canvasWidth, canvasHeight).sub(
      new Vector2(this.imageWidth, this.imageHeight)
    );
    this.position = this.position.min(canvasBound).max(Vector2.ZERO);
    this._collisionShape = new BBCollision(
      this.position,
      this.imageWidth,
      this.imageHeight
    );
    this._state = false;
  }

  static getOutputTypeObject(type: OutputTypes): [OutputTypeObject, boolean] {
    switch (type) {
      case OutputTypes.MONO_LED_RED:
        return [LEDROutput, true];
      default:
        return [LEDROutput, true];
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
    let imgId = `${this.outputType.id}`;
    if (this._isLEDOutput && !this.state) {
      imgId = `${OutputTypes.MONO_LED_OFF}`;
    }

    ctx.drawImage(
      EditorEnvironment.OutputImageList[imgId],
      this.position.x,
      this.position.y
    );
    if (this.collisionShape !== undefined) this.collisionShape.draw(ctx, true);
  }
}

export default OutputComponent;
