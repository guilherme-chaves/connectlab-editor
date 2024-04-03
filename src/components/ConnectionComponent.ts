import {ComponentType, ConnectionVertices, VectorObject} from '../types/types';
import Vector2 from '../types/Vector2';
import BBCollision from '../collision/BBCollision';
import ConnectionPathFunctions from '../functions/Connection/connectionPath';
import Component, {ComponentObject} from '../interfaces/componentInterface';

export interface ConnectionObject extends ComponentObject {
  id: number;
  componentType: ComponentType;
  position: VectorObject;
  endPosition: VectorObject;
  anchors: Array<VectorObject>;
  connectedTo: ConnectionVertices;
}

class ConnectionComponent implements Component {
  public readonly id: number;
  public position: Vector2;
  public readonly componentType: ComponentType;
  public endPosition: Vector2;
  // Pesos (valores de 0 a 1) relativos a interpolação bilinear entre os pontos inicial e final
  public anchors: Array<Vector2>;
  public connectedTo: ConnectionVertices;
  private drawPath: Path2D | undefined;
  private regenPath: boolean;
  public collisionShape: Array<BBCollision>;
  public selected: boolean;

  constructor(
    id: number,
    startPoint: Vector2,
    endPosition: Vector2,
    connections: ConnectionVertices = {start: undefined, end: undefined},
    anchors?: Array<Vector2>
  ) {
    // A variável position funciona como startPoint
    this.id = id;
    this.position = startPoint;
    this.componentType = ComponentType.LINE;
    this.endPosition = endPosition;
    this.anchors = anchors ?? [
      new Vector2(0.25, 0),
      new Vector2(0.25, 0.5),
      new Vector2(0.5, 0.5),
      new Vector2(0.5, 1),
    ];
    this.connectedTo = connections;
    this.regenPath = true;
    this.collisionShape = this.generateCollisionShapes();
    this.selected = false;
  }

  // Gera um objeto Path2D contendo a figura a ser desenhada, armazenando-a em uma variável
  generatePath() {
    const path = new Path2D();
    path.moveTo(this.position.x, this.position.y);
    const globalPos = new Vector2();
    for (let i = 0; i < this.anchors.length; i++) {
      Vector2.bilinear(
        this.position,
        this.endPosition,
        this.anchors[i],
        globalPos
      );
      path.lineTo(globalPos.x, globalPos.y);
    }
    path.lineTo(this.endPosition.x, this.endPosition.y);
    this.regenPath = false;
    return path;
  }

  generateCollisionShapes() {
    return ConnectionPathFunctions.generateCollisionShapes(
      this.position,
      this.endPosition,
      this.anchors
    );
  }

  generateAnchors(): Vector2[] {
    return ConnectionPathFunctions.generateAnchors(
      this.position,
      this.endPosition
    );
  }

  draw(ctx: CanvasRenderingContext2D): void {
    if (this.endPosition === this.position) return;
    if (this.regenPath || !this.drawPath) this.drawPath = this.generatePath();
    ctx.save();
    ctx.strokeStyle = '#101010';
    ctx.lineWidth = 2;
    ctx.lineJoin = 'round';
    ctx.stroke(this.drawPath);
    ctx.restore();
    this.collisionShape.forEach(shape => shape.draw(ctx, this.selected));
  }

  addAnchor(point: Vector2, arrIndex: number = this.anchors.length): void {
    this.anchors.splice(arrIndex, 0, point);
    this.regenPath = true;
  }

  removePoint(index: number = this.anchors.length - 1) {
    if (index < 0 || index >= this.anchors.length) {
      console.error(
        'ConnectionComponent.removePoint - index is out of bounds!'
      );
      return;
    }
    this.anchors.splice(index, 1);
    this.regenPath = true;
  }

  // Recebe um delta entre a posição anterior e a atual
  // movePoint -> 0 = position, 1 = endPosition, 2 (ou qualquer outro) = ambos
  move(
    v: Vector2,
    useDelta = true,
    movePoint = 2,
    updateCollisionShapes = true
  ) {
    if (useDelta) {
      if (movePoint !== 1) this.position.add(v);
      if (movePoint !== 0) this.endPosition.add(v);
    } else {
      if (movePoint !== 1) Vector2.copy(v, this.position);
      if (movePoint !== 0) Vector2.copy(v, this.endPosition);
    }
    this.anchors = this.generateAnchors();
    if (updateCollisionShapes)
      this.collisionShape = this.generateCollisionShapes();
    this.regenPath = true;
  }

  changeAnchor(
    position: Vector2,
    index: number = this.anchors.length - 1
  ): void {
    if (index < 0 || index >= this.anchors.length) {
      console.error(
        'ConnectionComponent.changePosition - index is out of bounds!'
      );
      return;
    }
    this.anchors[index] = Vector2.sub(
      position,
      this.position,
      undefined,
      false
    ).div(Vector2.sub(this.endPosition, this.position, undefined, false));
    this.regenPath = true;
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

  toObject(): ConnectionObject {
    const connectionObj: ConnectionObject = {
      id: this.id,
      componentType: this.componentType,
      position: this.position.toPlainObject(),
      endPosition: this.endPosition.toPlainObject(),
      anchors: [],
      connectedTo: this.connectedTo,
    };
    this.anchors.forEach(a => connectionObj.anchors.push(a.toPlainObject()));

    return connectionObj;
  }
}

export default ConnectionComponent;
