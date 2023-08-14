import ComponentType, {componentAssocInterface, nodeTypes} from './types/types';
import bgTexturePath from './assets/bg-texture.svg';
import updateAll, {
  updateBackground,
  updateCanvas,
} from './functions/canvasDraw';
import ComponentsList from './components/ComponentsList';
import ConnectionComponent from './components/ConnectionComponent';
import TextComponent from './components/TextComponent';
import NodeComponent from './components/NodeComponent';
import Vector2 from './types/Vector2';
import Component from './components/Component';
import SlotComponent from './components/SlotComponent';
import EditorEvents from './functions/events';

export default class Editor {
  // Lista de componentes
  private editorEnv: ComponentsList;
  // Controle de eventos do canvas
  private editorEvents: EditorEvents;
  // Contextos dos canvas
  private canvasCtx: CanvasRenderingContext2D;
  private backgroundCtx: CanvasRenderingContext2D;
  // Propriedades dos canvas
  private canvasArea: Vector2; // [0, 1] dentro dos dois eixos, representa a porcentagem da tela a ser ocupada
  private backgroundPattern: CanvasPattern | null;
  public readonly frameRate: number;

  constructor(
    documentId: string,
    canvasDOM: HTMLCanvasElement,
    backgroundDOM: HTMLCanvasElement,
    canvasVw: number,
    canvasVh: number
  ) {
    this.editorEnv = new ComponentsList(documentId);
    this.editorEvents = new EditorEvents();
    this.canvasCtx = this.createContext(canvasDOM);
    this.backgroundCtx = this.createContext(backgroundDOM);
    this.backgroundPattern = null;
    this.canvasArea = new Vector2(canvasVw, canvasVh, true);
    this.loadPattern(bgTexturePath);
    this.frameRate = 60.0;
    this.compute();
  }

  // static loadFile(jsonData): Editor

  // saveToFile()

  private createContext(
    domElement: HTMLCanvasElement
  ): CanvasRenderingContext2D {
    return domElement.getContext('2d')!;
  }

  getEnviroment(): ComponentsList {
    return this.editorEnv;
  }

  getContext(canvas = true): CanvasRenderingContext2D {
    if (canvas) return this.canvasCtx;
    return this.backgroundCtx;
  }

  loadPattern(bgPath: string) {
    const backgroundImg = new Image();
    backgroundImg.onload = () => {
      this.backgroundPattern = this.backgroundCtx.createPattern(
        backgroundImg,
        'repeat'
      );
    };
    backgroundImg.src = bgPath;
  }

  draw(canvas = true, background = false) {
    if (background)
      updateBackground(this.backgroundCtx, this.backgroundPattern);
    if (canvas) updateCanvas(this.canvasCtx, this.editorEnv.getComponents());
  }

  update = () => {
    requestAnimationFrame(this.update);
    this.draw(true);
    this.move();
    // this.checkConnections()
    // this.checkCollisions()
    // To-Do -> Adicionar as seguintes partes:
    // eventos e adição de componentes
    // colisão(this.editorEnv)
  };

  compute = () => {
    setInterval(() => {
      this.onclick();
      this.mouseReleased();
    }, 1000.0 / this.frameRate);
  };

  move = () => {
    this.editorEvents.mouseMove(this, this.editorEnv);
  };

  onclick = () => {
    this.editorEvents.mouseClick(this.editorEnv);
  };

  ondrag = () => {};

  resize = () => {
    this.canvasCtx.canvas.width = window.innerWidth * this.canvasArea.x;
    this.canvasCtx.canvas.height = window.innerHeight * this.canvasArea.y;
    this.backgroundCtx.canvas.width = window.innerWidth * this.canvasArea.x;
    this.backgroundCtx.canvas.height = window.innerHeight * this.canvasArea.y;
    requestAnimationFrame.bind(
      updateAll(
        this.canvasCtx,
        this.editorEnv.getComponents(),
        this.backgroundCtx,
        this.backgroundPattern
      )
    );
  };

  async node(
    x: number = this.editorEvents.getMousePosition().x,
    y: number = this.editorEvents.getMousePosition().y,
    type: nodeTypes = nodeTypes.NOT
  ) {
    const slotKeys: Array<number> = [];
    const newNode = new NodeComponent(
      this.editorEnv.getLastComponentId(),
      new Vector2(x, y),
      type,
      this.canvasCtx.canvas.width,
      this.canvasCtx.canvas.height,
      slotKeys,
      this.editorEnv
    );
    const newNodeId = this.editorEnv.addComponent(newNode);
    await newNode.ready;
    NodeComponent.getNodeTypeObject(type).connectionSlots.forEach(
      (slot, index) => {
        const key = this.slot(
          slot.localPos.x,
          slot.localPos.y,
          ComponentType.NODE,
          newNodeId,
          newNode.position,
          slot.in
        );
        NodeComponent.getNodeTypeObject(type).connectionSlots[index].slotId =
          key;
        slotKeys.push(key);
      }
    );
    this.editorEnv.getComponents().nodes[newNodeId].addSlotComponents(slotKeys);
    this.draw(true, false);
    return newNodeId;
  }

  line(
    x1: number,
    y1: number,
    from?: componentAssocInterface,
    to?: componentAssocInterface
  ) {
    const newLine = new ConnectionComponent(
      this.editorEnv.getLastComponentId(),
      new Vector2(x1, y1),
      new Vector2(x1, y1),
      {start: from, end: to}
    );
    return this.editorEnv.addComponent(newLine);
  }

  text(text: string, x: number, y: number, style?: string, parent?: Component) {
    const newText = new TextComponent(
      this.editorEnv.getLastComponentId(),
      new Vector2(x, y),
      text,
      style,
      parent
    );
    return this.editorEnv.addComponent(newText);
  }

  slot(
    x: number,
    y: number,
    parentType: ComponentType,
    parentId: number,
    parentPosition: Vector2,
    inSlot?: boolean,
    radius?: number,
    attractionRadius?: number,
    color?: string,
    colorActive?: string
  ) {
    const newSlot = new SlotComponent(
      this.editorEnv.getLastComponentId(),
      new Vector2(x, y),
      parentType,
      parentId,
      parentPosition,
      undefined,
      inSlot,
      radius,
      attractionRadius,
      color,
      colorActive
    );
    return this.editorEnv.addComponent(newSlot);
  }

  setMousePosition(clientX: number, clientY: number) {
    const rect = this.canvasCtx.canvas.getBoundingClientRect();
    this.editorEvents.setMousePosition(
      new Vector2(clientX - rect.left, clientY - rect.top)
    );
  }

  getMousePosition() {
    return this.editorEvents.getMousePosition();
  }

  setMouseClicked(state: boolean) {
    this.editorEvents.setMouseClicked(state);
  }

  mouseReleased() {
    this.editorEvents.mouseRelease(this.editorEnv);
  }

  clearCollision(onlyDragCollisions = true) {
    if (onlyDragCollisions) this.editorEvents.clearDragCollisions();
  }
}
