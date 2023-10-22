import {nodeTypes} from '../types/types';
import {NodeTypeInterface} from '../types/types';
import {
  ADDNode,
  NANDNode,
  NORNode,
  NOTNode,
  ORNode,
  XNORNode,
  XORNode,
} from '../types/NodeTypes';
import Vector2 from '../types/Vector2';
import Component from './Component';
import BBCollision from '../collision/BBCollision';
import Editor from '../Editor';
import EditorEnvironment from '../EditorEnvironment';

class NodeComponent extends Component {
  public readonly nodeType: NodeTypeInterface;
  private slotComponents: Array<number>;
  protected declare collisionShape: BBCollision;
  private imageWidth: number;
  private imageHeight: number;

  constructor(
    id: number,
    position: Vector2,
    nodeType: nodeTypes,
    canvasWidth: number,
    canvasHeight: number,
    slotKeys: Array<number>
  ) {
    super(id, position);
    this.nodeType = NodeComponent.getNodeTypeObject(nodeType);
    this.slotComponents = slotKeys;
    this.imageWidth =
      EditorEnvironment.nodeImageList[`${this.nodeType.id}`].width;
    this.imageHeight =
      EditorEnvironment.nodeImageList[`${this.nodeType.id}`].height;
    this.position = this.position.minus(
      new Vector2(this.imageWidth / 2.0, this.imageHeight / 2.0)
    );
    const canvasBound = new Vector2(canvasWidth, canvasHeight);
    canvasBound.minus(new Vector2(this.imageWidth, this.imageHeight));
    this.position = this.position.inBounds(0, 0, canvasBound.y, canvasBound.x);
    this.collisionShape = new BBCollision(
      this.position,
      new Vector2(0, 0),
      this.imageWidth,
      this.imageHeight
    );
    for (let i = 0; i < slotKeys.length; i++) {
      Editor.editorEnv
        .getComponents()
        .slots[slotKeys[i]].setParentPosition(this.position);
    }
  }

  static getNodeTypeObject(type: nodeTypes): NodeTypeInterface {
    // Carrega o objeto do tipo de Node solicitado
    switch (type) {
      case nodeTypes.ADD:
        return ADDNode;
      case nodeTypes.NAND:
        return NANDNode;
      case nodeTypes.NOR:
        return NORNode;
      case nodeTypes.NOT:
        return NOTNode;
      case nodeTypes.OR:
        return ORNode;
      case nodeTypes.XNOR:
        return XNORNode;
      case nodeTypes.XOR:
        return XORNode;
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

  changePosition(delta: Vector2): void {
    this.position = this.position.add(delta);
    this.collisionShape.moveShape(delta, true);
  }

  getNodeImage() {
    return EditorEnvironment.nodeImageList[`${this.nodeType.id}`];
  }

  getNodeType() {
    return this.nodeType;
  }

  setSlotId(slotId: number, index: number) {
    this.slotComponents[index] = slotId;
  }

  getConnectionSlots() {
    return this.nodeType.connectionSlots;
  }

  getCollisionShape(): BBCollision {
    return this.collisionShape;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.drawImage(
      EditorEnvironment.nodeImageList[`${this.nodeType.id}`],
      this.position.x,
      this.position.y
    );
    if (this.collisionShape !== undefined) this.collisionShape.draw(ctx, true);
  }
}

export default NodeComponent;
