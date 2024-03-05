import BBCollision from '../collision/BBCollision';
import signalEvents from '../functions/Signal/signalEvents';
import Node from '../interfaces/nodeInterface';
import {SwitchInput} from '../objects/inputTypeObjects';
import Vector2 from '../types/Vector2';
import ComponentType, {
  ImageListObject,
  InputTypeObject,
  InputTypes,
  SignalGraph,
} from '../types/types';
import SlotComponent from './SlotComponent';

class InputComponent implements Node {
  public readonly id: number;
  private _position: Vector2;
  public readonly componentType: ComponentType;
  public readonly nodeType: InputTypeObject;
  private _slotComponent: SlotComponent | undefined;
  private _collisionShape: BBCollision;
  private _images: ImageListObject;
  private imageWidth: number;
  private imageHeight: number;
  private readonly _signalGraph: SignalGraph;
  public selected: boolean;

  get position(): Vector2 {
    return this._position;
  }

  set position(value: Vector2) {
    this._position = value;
  }

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

  get state() {
    return signalEvents.getVertexState(this._signalGraph, this.id);
  }

  set state(value: boolean) {
    signalEvents.setVertexState(this._signalGraph, this.id, value);
  }

  get image() {
    return this._images.get(this.nodeType.id * 10);
  }

  get images() {
    // Valores de ID das imagens são arbitrariamente multiplicados para permitir multiplas imagens para o mesmo componente
    return [
      this._images.get(this.nodeType.id * 10),
      this._images.get(this.nodeType.id * 10 + 1),
    ];
  }

  constructor(
    id: number,
    position: Vector2,
    canvasWidth: number,
    canvasHeight: number,
    inputType: InputTypes,
    slot: SlotComponent | undefined,
    images: ImageListObject,
    signalGraph: SignalGraph
  ) {
    this.id = id;
    this._position = position;
    this.componentType = ComponentType.INPUT;
    this.nodeType = InputComponent.getInputTypeObject(inputType);
    this._slotComponent = slot;
    this._images = images;
    this._signalGraph = signalGraph;
    this.imageWidth = this.images[0]!.width;
    this.imageHeight = this.images[0]!.height;
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
    ctx.drawImage(
      this.images[this.state ? 1 : 0]!,
      this.position.x,
      this.position.y
    );
    if (this.collisionShape !== undefined)
      this.collisionShape.draw(ctx, this.selected);
  }
}

export default InputComponent;
