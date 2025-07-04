import {
  ConnectionVertices,
  NodeList,
  VectorObject,
} from '@connectlab-editor/types/common';
import {ComponentType, EditorEvents} from '@connectlab-editor/types/enums';
import Vector2i from '@connectlab-editor/types/vector2i';
import Vector2f from '@connectlab-editor/types/vector2f';
import BoxCollision from '@connectlab-editor/collisionShapes/boxCollision';
import ConnectionPathFunctions from '@connectlab-editor/functions/connectionPath';
import Component, {
  ComponentObject,
} from '@connectlab-editor/interfaces/componentInterface';
import pathFinder from '@connectlab-editor/functions/pathFinder';

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
  public position: Vector2i;
  public readonly componentType: ComponentType;
  public endPosition: Vector2i;
  // Pesos (valores de 0 a 1) relativos a interpolação bilinear entre os pontos inicial e final
  public anchors: Array<Vector2f>;
  public connectedTo: ConnectionVertices;
  private drawPath: Path2D | undefined;
  private regenPath: boolean;
  public collisionShape: Array<BoxCollision>;
  public selected: boolean;

  constructor(
    id: number,
    startPoint: Vector2i,
    endPosition: Vector2i,
    connections: ConnectionVertices = {start: undefined, end: undefined},
    anchors?: Array<Vector2f>
  ) {
    // A variável position funciona como startPoint
    this.id = id;
    this.position = startPoint;
    this.componentType = ComponentType.LINE;
    this.endPosition = endPosition;
    this.anchors = anchors ?? [
      new Vector2f(0.25, 0),
      new Vector2f(0.25, 0.5),
      new Vector2f(0.5, 0.5),
      new Vector2f(0.5, 1),
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
    const globalPos = new Vector2i();
    for (let i = 0; i < this.anchors.length; i++) {
      Vector2i.bilinear(
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

  generateAnchors(nodeList: NodeList): Vector2f[] {
    return pathFinder.find(this.position, this.endPosition, nodeList);
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
    for (let i = 0; i < this.collisionShape.length; i++)
      this.collisionShape[i].draw(ctx, this.selected);
  }

  addAnchor(point: Vector2f, arrIndex: number = this.anchors.length): void {
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
    v: Vector2i,
    useDelta = true,
    movePoint = 2,
    updateCollisionShapes = true,
    nodeList: NodeList = new Map()
  ) {
    if (useDelta) {
      if (movePoint !== 1) this.position.add(v);
      if (movePoint !== 0) this.endPosition.add(v);
    } else {
      if (movePoint !== 1) this.position.copy(v);
      if (movePoint !== 0) this.endPosition.copy(v);
    }
    this.anchors = this.generateAnchors(nodeList);
    if (updateCollisionShapes)
      this.collisionShape = this.generateCollisionShapes();
    this.regenPath = true;
  }

  changeAnchor(
    position: Vector2i,
    index: number = this.anchors.length - 1
  ): void {
    if (index < 0 || index >= this.anchors.length) {
      console.error(
        'ConnectionComponent.changePosition - index is out of bounds!'
      );
      return;
    }
    this.anchors[index] = Vector2f.sub(position, this.position).div(
      Vector2f.sub(this.endPosition, this.position)
    );
    this.regenPath = true;
  }

  changeConnection(
    slotId: number | undefined,
    nodeId: number | undefined,
    end = false
  ) {
    if (slotId !== undefined && nodeId !== undefined) {
      if (end) this.connectedTo.end = {slotId, nodeId};
      else this.connectedTo.start = {slotId, nodeId};
    } else {
      if (end) this.connectedTo.end = undefined;
      else this.connectedTo.start = undefined;
    }
  }

  onEvent(ev: EditorEvents): boolean {
    switch (ev) {
      case EditorEvents.FOCUS_IN:
        this.selected = true;
        break;
      case EditorEvents.FOCUS_OUT:
        this.selected = false;
        break;
      default:
        return false;
    }
    return true;
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
