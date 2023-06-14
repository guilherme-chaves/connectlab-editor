import {nodeTypes} from '../types/types';
import NodeType from '../types/NodeType';
import {ADDNode, NOTNode, ORNode} from '../types/NodeTypes';
import Position from '../types/Position';
import Component from './Component';
import BBCollision from '../collision/BBCollision';
import ComponentsList from './ComponentsList';

class NodeComponent extends Component {
  public readonly nodeType: NodeType;
  private nodeImage: HTMLImageElement;
  private slotComponents: Array<number>;
  protected declare collisionShape: BBCollision;
  public ready: Promise<any>;

  constructor(
    id: number,
    position: Position,
    nodeType: nodeTypes,
    canvasWidth: number,
    canvasHeight: number,
    slotKeys: Array<number>,
    componentsList: ComponentsList
  ) {
    super(id, position);
    this.nodeType = NodeComponent.getNodeTypeObject(nodeType);
    this.slotComponents = slotKeys;
    this.nodeImage = new Image();
    this.ready = new Promise((resolve, reject) => {
      this.nodeImage.addEventListener('load', () => {
        let halfImgPos = new Position(-this.nodeImage.width/2.0, -this.nodeImage.height/2.0)
        this.position = this.position.add(halfImgPos)
        const canvasBound = new Position(canvasWidth, canvasHeight);
        canvasBound.minus(
          new Position(this.nodeImage.width, this.nodeImage.height)
        );
        this.position = this.position.inBounds(
          0,
          0,
          canvasBound.y,
          canvasBound.x
        );
        this.collisionShape = new BBCollision(
          this.position,
          new Position(0, 0),
          this.nodeImage.width,
          this.nodeImage.height
        );
        for (let i = 0; i < slotKeys.length; i++) {
          componentsList.getComponents().slots[slotKeys[i]].setParentPosition(this.position)
        }
        resolve(undefined);
      });
      this.nodeImage.src = this.nodeType.imgPath;
    });
  }

  static getNodeTypeObject(type: nodeTypes): NodeType {
    // Carrega o objeto do tipo de Node solicitado
    switch (type) {
      case nodeTypes.ADD:
        return ADDNode;
      case nodeTypes.OR:
        return ORNode;
      case nodeTypes.NOT:
        return NOTNode;
      default:
        return NOTNode;
    }
  }

  addSlotComponents(slotKeys: Array<number>) {
    this.slotComponents = slotKeys;
  }

  getSlotComponents() {
    return this.slotComponents;
  }

  changePosition(delta: Position): void {
    this.position = this.position.add(delta)
    this.collisionShape.moveShape(delta, true)
  }

  getNodeImage() {
    return this.nodeImage;
  }

  getNodeType() {
    return this.nodeType;
  }

  setSlotId(slotId: number, index: number) {
    this.nodeType.connectionSlots[index].slotId = slotId;
  }

  getConnectionSlots() {
    return this.nodeType.connectionSlots;
  }

  getCollisionShape(): BBCollision {
    return this.collisionShape;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.drawImage(this.nodeImage, this.position.x, this.position.y);
    if (this.collisionShape !== undefined)
      this.collisionShape.draw(ctx, true);
  }
}

export default NodeComponent;
