import ComponentType, {ConnectionVertices} from '../types/types';
import {Vector} from 'two.js/src/vector';
import BBCollision from '../collision/BBCollision';
import ConnectionPathFunctions from '../functions/Connection/connectionPath';
import Component from '../interfaces/componentInterface';
import {Path} from 'two.js/src/path';
import {Anchor} from 'two.js/src/anchor';
import Two from 'two.js';

class ConnectionComponent implements Component {
  public readonly id: number;
  public position: Vector;
  public readonly componentType: ComponentType;
  public endPosition: Vector;
  public anchors: Anchor[];
  public drawShape: Path | undefined;
  public connectedTo: ConnectionVertices;
  public collisionShape: Array<BBCollision>;
  public selected: boolean;

  constructor(
    id: number,
    startPoint: Vector,
    endPosition: Vector,
    connections: ConnectionVertices = {start: undefined, end: undefined},
    renderer: Two | undefined
  ) {
    // A variável position funciona como startPoint
    this.id = id;
    this.anchors = [];
    this.position = startPoint;
    if (renderer) {
      this.anchors = ConnectionPathFunctions.generateAnchors(this);
      this.drawShape = renderer.makePath();
      this.position = this.drawShape.position;
    }
    this.componentType = ComponentType.LINE;
    this.endPosition = endPosition;
    this.connectedTo = connections;
    this.collisionShape = ConnectionPathFunctions.generateCollisionShapes(this);
    this.selected = false;
  }

  generateCollisionShapes() {
    return ConnectionPathFunctions.generateCollisionShapes(this);
  }

  // Recebe um delta entre a posição anterior e a atual
  // movePoint -> 0 = position, 1 = endPosition, 2 (ou qualquer outro) = ambos
  move(
    v: Vector,
    useDelta = true,
    movePoint = 2,
    updateCollisionShapes = true
  ) {
    if (useDelta) {
      if (movePoint !== 1) this.position.add(v);
      if (movePoint !== 0) this.endPosition.add(v);
    } else {
      if (movePoint !== 1) this.position.copy(v);
      if (movePoint !== 0) this.endPosition.copy(v);
    }
    if (updateCollisionShapes)
      this.collisionShape =
        ConnectionPathFunctions.generateCollisionShapes(this);
    this.anchors = ConnectionPathFunctions.generateAnchors(this);
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
