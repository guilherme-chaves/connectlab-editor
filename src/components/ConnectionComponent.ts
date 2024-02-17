import ComponentType, {ConnectionVertices} from '../types/types';
import BBCollision from '../collision/BBCollision';
import ConnectionPathFunctions from '../functions/Connection/connectionPath';
import Component from '../interfaces/componentInterface';
import Point2i from '../types/Point2i';
import Point2f from '../types/Point2f';

class ConnectionComponent implements Component {
  public readonly id: number;
  public position: Point2i;
  public readonly componentType: ComponentType;
  public endPosition: Point2i;
  // Pesos (valores de 0 a 1) relativos a interpolação bilinear entre os pontos inicial e final
  public anchors: Array<Point2f>;
  public connectedTo: ConnectionVertices;
  private _collisionShape: Array<BBCollision>;
  public regenerateConnectionPath: boolean;

  get collisionShape() {
    return this._collisionShape;
  }

  set collisionShape(value: Array<BBCollision>) {
    this._collisionShape = value;
  }

  constructor(
    id: number,
    startPoint: Point2i,
    endPosition: Point2i,
    connections: ConnectionVertices = {start: undefined, end: undefined}
  ) {
    // A variável position funciona como startPoint
    this.id = id;
    this.position = startPoint;
    this.componentType = ComponentType.LINE;
    this.endPosition = endPosition;
    this.anchors = [
      new Point2f(0.25, 0),
      new Point2f(0.25, 0.5),
      new Point2f(0.5, 0.5),
      new Point2f(0.5, 1),
    ];
    this.connectedTo = connections;
    this.regenerateConnectionPath = false;
    this._collisionShape =
      ConnectionPathFunctions.generateCollisionShapes(this);
  }

  addAnchor(point: Point2f, arrIndex: number = this.anchors.length): void {
    this.anchors.splice(arrIndex, 0, point);
    this.regenerateConnectionPath = true;
  }

  updateAnchor(index: number = this.anchors.length - 1, newValue: Point2f) {
    if (index < 0 || index >= this.anchors.length) {
      console.error(
        'ConnectionComponent.removePoint - index is out of bounds!'
      );
      return;
    }
    this.anchors[index] = newValue;
  }

  removeAnchor(index: number = this.anchors.length - 1) {
    if (index < 0 || index >= this.anchors.length) {
      console.error(
        'ConnectionComponent.removePoint - index is out of bounds!'
      );
      return;
    }
    this.anchors.splice(index, 1);
    this.regenerateConnectionPath = true;
  }

  changeConnection(
    componentId: number | undefined,
    componentType: ComponentType | undefined,
    end = false
  ) {
    if (componentId !== undefined && componentType !== undefined) {
      if (end) {
        this.connectedTo.end = {type: componentType, id: componentId};
        return;
      }
      this.connectedTo.start = {type: componentType, id: componentId};
    }
  }
}

export default ConnectionComponent;
