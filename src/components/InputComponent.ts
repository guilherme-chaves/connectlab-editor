import {Vector} from 'two.js/src/vector';
import BBCollision from '../collision/BBCollision';
import Node from '../interfaces/nodeInterface';
import {SwitchInput} from '../objects/inputTypeObjects';
import ComponentType, {
  InputTypeObject,
  InputTypes,
  SignalGraph,
  SignalGraphData,
} from '../types/types';
import SlotComponent from './SlotComponent';
import {ImageSequence} from 'two.js/src/effects/image-sequence';
import Two from 'two.js';

export default class InputComponent implements Node {
  public readonly id: number;
  private _position: Vector;
  public readonly componentType: ComponentType;
  public readonly nodeType: InputTypeObject;
  private _slotComponent: SlotComponent | undefined;
  public collisionShape: BBCollision;
  private readonly _signalNode: SignalGraphData;
  private _selected: boolean;
  public drawShape: ImageSequence | undefined;

  get position(): Vector {
    return this.drawShape?.position ?? this._position;
  }

  set position(value: Vector) {
    if (this.drawShape) this.drawShape.position.copy(value);
    else this._position.copy(value);
  }

  get slotComponents() {
    return this._slotComponent !== undefined ? [this._slotComponent] : [];
  }

  set slotComponents(value: Array<SlotComponent>) {
    this._slotComponent = value[0];
  }

  get state() {
    return this._signalNode.state;
  }

  set state(value: boolean) {
    this._signalNode.state = value;
  }

  get selected(): boolean {
    return this._selected;
  }

  set selected(value: boolean) {
    this._selected = value;
    if (this.collisionShape.drawShape)
      this.collisionShape.drawShape.visible = this._selected;
  }

  constructor(
    id: number,
    position: Vector,
    inputType: InputTypes,
    slot: SlotComponent | undefined,
    signalGraph: SignalGraph,
    renderer: Two | undefined
  ) {
    this.id = id;
    this._position = position;
    this.componentType = ComponentType.INPUT;
    this.nodeType = InputComponent.getInputTypeObject(inputType);
    this._slotComponent = slot;
    this._signalNode = signalGraph.get(this.id)!;
    this.drawShape = renderer?.makeImageSequence(
      this.nodeType.imgPaths,
      this._position.x,
      this._position.y,
      0,
      false
    );
    this.collisionShape = new BBCollision(
      this.position,
      this.drawShape?.width ?? 88,
      this.drawShape?.height ?? 50,
      undefined,
      renderer
    );
    this._selected = false;
  }

  static getInputTypeObject(type: InputTypes): InputTypeObject {
    switch (type) {
      case InputTypes.SWITCH:
        return SwitchInput;
      default:
        return SwitchInput;
    }
  }

  move(v: Vector, useDelta = true): void {
    if (useDelta) {
      this.position.add(v);
      this.collisionShape.moveShape(v);
    } else {
      this.position.copy(
        v.sub(
          (this.drawShape?.width ?? 0) / 2.0,
          (this.drawShape?.height ?? 0) / 2.0
        )
      );
      this.collisionShape.moveShape(this.position, false);
    }
  }

  destroy(): void {
    this.drawShape?.remove();
    this.collisionShape.drawShape?.remove();
  }
}
