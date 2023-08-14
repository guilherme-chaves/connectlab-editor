import ComponentType, {connectionSlotsInterface} from '../types/types';
import Vector2 from '../types/Vector2';
import Component from './Component';
import BBCollision from '../collision/BBCollision';

class ConnectionComponent extends Component {
  public endPosition: Vector2;
  // Pesos relativos ao ponto inicial e final
  public anchors: Array<Vector2>;
  public connectedTo: connectionSlotsInterface;
  private connectionPath: Path2D;
  private regenConnectionPath: boolean;
  private attractionBias: number; // Tendência de um ponto a assumir uma das coordenadas de seu antecessor
  private slotComponents: Array<number>;
  private minDistFromConnection: number;
  protected declare collisionShape: BBCollision;
  protected collisionShapes: BBCollision[];

  constructor(
    id: number,
    startPoint: Vector2,
    endPosition: Vector2,
    connections: connectionSlotsInterface = {start: undefined, end: undefined}
  ) {
    // A variável position funciona como startPoint
    super(id, startPoint, ComponentType.LINE);
    this.endPosition = endPosition;
    // As âncoras funcionam como porcentagens de interpolação entre os dois pontos
    this.anchors = [
      new Vector2(0.25, 0, true),
      new Vector2(0.25, 0.5, true),
      new Vector2(0.5, 0.5, true),
      new Vector2(0.5, 1, true),
    ];
    this.connectedTo = connections;
    this.attractionBias = 0.075;
    this.slotComponents = [];
    this.minDistFromConnection = 64;
    this.connectionPath = this.generatePath();
    this.regenConnectionPath = false;
    this.collisionShape = new BBCollision(
      new Vector2(0, 0),
      new Vector2(0, 0),
      0,
      0
    );
    this.collisionShapes = this.generateCollisionShapes();
  }

  // Gera um objeto Path2D contendo a figura a ser desenhada, armazenando-a em uma variável
  generatePath() {
    const path = new Path2D();
    path.moveTo(this.position.x, this.position.y);
    for (let i = 0; i < this.anchors.length; i++) {
      const globalPos = this.position.bilinear(
        this.endPosition,
        this.anchors[i]
      );
      path.lineTo(globalPos.x, globalPos.y);
    }
    path.lineTo(this.endPosition.x, this.endPosition.y);
    this.regenConnectionPath = false;
    return path;
  }

  generateCollisionShape() {
    this.collisionShape.b = this.endPosition.minus(this.position);
    this.collisionShape.moveShape(this.position, false);
  }

  generateCollisionShapes() {
    // Precisa refatorar esse método...
    if (this.anchors.length < 1) return [];
    const newCollisionSet = [];
    let pPos = this.position
      .bilinear(this.endPosition, this.anchors[0])
      .minus(this.position);
    newCollisionSet.push(
      new BBCollision(this.position, new Vector2(0, 0), pPos.x, 2)
    );
    for (let i = 1; i <= this.anchors.length; i++) {
      let nPos = new Vector2(0, 0);
      if (i < this.anchors.length)
        nPos = this.position
          .bilinear(this.endPosition, this.anchors[i])
          .minus(this.position);
      else nPos = this.endPosition.minus(this.position);
      const offset = new Vector2(
        pPos.x === nPos.x ? pPos.x : -1 + pPos.x,
        pPos.y === nPos.y ? pPos.y : -1 + pPos.y
      );
      const size = new Vector2(
        pPos.x === nPos.x ? 2 : i === 1 ? nPos.x : nPos.x / 2,
        pPos.y === nPos.y ? 2 : i === 1 ? nPos.y : nPos.y / 2
      );
      newCollisionSet.push(
        new BBCollision(this.position, offset, size.x, size.y)
      );
      pPos = nPos;
    }
    return newCollisionSet;
  }

  generateAnchors(): Vector2[] {
    return [];
  }

  getCollisionShape(): BBCollision {
    return this.collisionShape;
  }

  getCollisionShapes(): BBCollision[] {
    return this.collisionShapes;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    if (this.endPosition === this.position) return;
    if (this.regenConnectionPath) this.connectionPath = this.generatePath();
    ctx.strokeStyle = '#101010';
    ctx.lineWidth = 2;
    ctx.lineJoin = 'round';
    ctx.stroke(this.connectionPath);
    this.collisionShapes.forEach(shape => shape.draw(ctx, true));
  }

  addAnchor(point: Vector2, arrIndex: number = this.anchors.length): void {
    this.anchors.splice(arrIndex, 0, point);
    this.regenConnectionPath = true;
  }

  removePoint(index: number = this.anchors.length - 1) {
    if (index < 0 || index >= this.anchors.length) {
      console.error(
        'ConnectionComponent.removePoint - index is out of bounds!'
      );
      return;
    }
    this.anchors.splice(index, 1);
    this.regenConnectionPath = true;
  }

  // Recebe um delta entre a posição anterior e a atual
  // movePoint -> 0 = position, 1 = endPosition, 2 (ou qualquer outro) = ambos
  changePosition(delta: Vector2, movePoint = 2, useDelta = true) {
    if (useDelta) {
      if (movePoint !== 1) this.position = this.position.add(delta);
      if (movePoint !== 0) this.endPosition = this.endPosition.add(delta);
    } else {
      if (movePoint !== 1) this.position = delta;
      if (movePoint !== 0) this.endPosition = delta;
    }
    this.collisionShapes = this.generateCollisionShapes();
    this.regenConnectionPath = true;
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
    this.anchors[index] = position
      .minus(this.position)
      .div(this.endPosition.minus(this.position), true);
    this.regenConnectionPath = true;
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
