import ComponentType, {ConnectionVertices} from '../types/types';
import BBCollision from '../collision/BBCollision';
import ConnectionPathFunctions from '../functions/Connection/connectionPath';
import Component from '../interfaces/componentInterface';
import Point2i from '../types/Point2i';
import {Line} from '../interfaces/renderObjects';
import Renderer from '../interfaces/renderer';

class ConnectionComponent implements Component {
  public readonly id: number;
  public position: Point2i;
  public readonly componentType: ComponentType;
  public endPosition: Point2i;
  public connectedTo: ConnectionVertices;
  public collisionShape: Array<BBCollision>;
  public regenerateConnectionPath: boolean;
  public drawShape: Line | undefined;

  constructor(
    id: number,
    startPoint: Point2i,
    endPosition: Point2i,
    connections: ConnectionVertices = {start: undefined, end: undefined},
    renderer?: Renderer
  ) {
    // A variável position funciona como startPoint
    this.id = id;
    this.position = startPoint;
    this.componentType = ComponentType.LINE;
    this.endPosition = endPosition;
    this.connectedTo = connections;
    this.regenerateConnectionPath = false;
    this.collisionShape = ConnectionPathFunctions.generateCollisionShapes(this);
    this.drawShape = renderer?.makeLine(
      this.id,
      this.position,
      this.endPosition
    );
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
