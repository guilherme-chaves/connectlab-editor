import BBCollision from '../collision/BBCollision';
import Node from '../interfaces/nodeInterface';
import {LEDROutput} from '../objects/outputTypeObjects';
import ComponentType, {OutputTypeObject, OutputTypes} from '../types/types';
import SlotComponent from './SlotComponent';
import Point2i from '../types/Point2i';
import Renderer from '../interfaces/renderer';
import {Sprite} from '../interfaces/renderObjects';

class OutputComponent implements Node {
  public readonly id: number;
  public position: Point2i;
  public readonly componentType: ComponentType;
  public readonly nodeType: OutputTypeObject;
  private _slotComponent: SlotComponent | undefined;
  public collisionShape: BBCollision;
  public drawShape?: Sprite | undefined;

  get slotComponents() {
    return this._slotComponent !== undefined ? [this._slotComponent] : [];
  }

  set slotComponents(value: Array<SlotComponent>) {
    this._slotComponent = value[0];
  }

  constructor(
    id: number,
    position: Point2i,
    outputType: OutputTypes,
    slot: SlotComponent | undefined,
    width: number,
    height: number,
    renderer?: Renderer
  ) {
    this.id = id;
    this.position = position;
    this.componentType = ComponentType.OUTPUT;
    this.nodeType = OutputComponent.getOutputTypeObject(outputType);
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
      this.drawShape?.imageWidth ?? width,
      this.drawShape?.imageHeight ?? height,
      renderer
    );
  }

  static getOutputTypeObject(type: OutputTypes): OutputTypeObject {
    switch (type) {
      case OutputTypes.MONO_LED_RED:
        return LEDROutput;
      default:
        return LEDROutput;
    }
  }
}

export default OutputComponent;
