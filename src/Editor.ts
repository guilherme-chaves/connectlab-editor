import ComponentType, {componentAssocInterface, nodeTypes} from './types/types';
import bgTexturePath from './assets/bg-texture.svg';
import updateAll, {
  updateBackground,
  updateCanvas,
} from './functions/canvasDraw';
import EditorEnvironment from './EditorEnvironment';
import ConnectionComponent from './components/ConnectionComponent';
import TextComponent from './components/TextComponent';
import NodeComponent from './components/NodeComponent';
import Vector2 from './types/Vector2';
import Component from './components/Component';
import SlotComponent from './components/SlotComponent';
import EditorEvents from './functions/events';
import Mouse from './types/Mouse';

export default class Editor {
  // Lista de componentes
  public static readonly editorEnv = new EditorEnvironment('');
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
    canvasID: string,
    backgroundID: string,
    canvasVw: number,
    canvasVh: number,
    frameRate = 60.0
  ) {
    Editor.editorEnv.documentId = documentId;
    this.editorEvents = new EditorEvents();

    const canvasDOM = <HTMLCanvasElement>document.getElementById(canvasID);
    const backgroundDOM = <HTMLCanvasElement>(
      document.getElementById(backgroundID)
    );

    this.canvasCtx = this.createContext(canvasDOM);
    this.backgroundCtx = this.createContext(backgroundDOM);
    this.createEditorEvents(canvasDOM, backgroundDOM);
    this.backgroundPattern = null;
    this.canvasArea = new Vector2(canvasVw, canvasVh, true);
    this.loadPattern(bgTexturePath);
    this.frameRate = frameRate;
    this.compute();
  }

  // static loadFile(jsonData): Editor

  // saveToFile()

  private createContext(
    domElement: HTMLCanvasElement
  ): CanvasRenderingContext2D {
    return domElement.getContext('2d')!;
  }

  private createEditorEvents(
    canvasDOM: HTMLCanvasElement,
    _backgroundDOM: HTMLCanvasElement
  ) {
    window.addEventListener('load', () => {
      this.resize();
      this.update();
    });
    window.addEventListener('resize', () => {
      this.resize();
    });
    canvasDOM.addEventListener('mousedown', () => {
      Mouse.clicked = true;
    });
    canvasDOM.addEventListener('mouseup', () => {
      Mouse.clicked = false;
    });
    canvasDOM.addEventListener('mouseout', () => {
      Mouse.clicked = false;
    });
    window.addEventListener('mousemove', ({clientX, clientY}) => {
      const rect = this.canvasCtx.canvas.getBoundingClientRect();
      Mouse.position = new Vector2(clientX - rect.left, clientY - rect.top);
    });
    window.addEventListener('keyup', () => {
      this.node();
    });
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
    if (canvas) updateCanvas(this.canvasCtx, Editor.editorEnv.getComponents());
  }

  resize() {
    this.canvasCtx.canvas.width = window.innerWidth * this.canvasArea.x;
    this.canvasCtx.canvas.height = window.innerHeight * this.canvasArea.y;
    this.backgroundCtx.canvas.width = window.innerWidth * this.canvasArea.x;
    this.backgroundCtx.canvas.height = window.innerHeight * this.canvasArea.y;
    requestAnimationFrame.bind(
      updateAll(
        this.canvasCtx,
        Editor.editorEnv.getComponents(),
        this.backgroundCtx,
        this.backgroundPattern
      )
    );
  }

  update = () => {
    requestAnimationFrame(this.update);
    this.draw(true);
    this.editorEvents.mouseMove(this);
    // this.checkConnections()
    // this.checkCollisions()
    // To-Do -> Adicionar as seguintes partes:
    // eventos e adição de componentes
    // colisão(this.editorEnv)
  };

  compute() {
    setInterval(() => {
      this.editorEvents.onMouseClick();
      this.editorEvents.onMouseRelease();
    }, 1000.0 / this.frameRate);
  }

  node(
    type: nodeTypes = nodeTypes.ADD,
    x: number = Mouse.position.x,
    y: number = Mouse.position.y
  ) {
    const slotKeys: Array<number> = [];
    const newNode = new NodeComponent(
      Editor.editorEnv.getLastComponentId(),
      new Vector2(x, y),
      type,
      this.canvasCtx.canvas.width,
      this.canvasCtx.canvas.height,
      slotKeys
    );
    const newNodeId = Editor.editorEnv.addComponent(newNode);
    NodeComponent.getNodeTypeObject(type).connectionSlots.forEach(slot => {
      const key = this.slot(
        slot.localPos.x,
        slot.localPos.y,
        ComponentType.NODE,
        newNodeId,
        newNode.position,
        slot.in
      );
      slotKeys.push(key);
    });
    Editor.editorEnv
      .getComponents()
      .nodes[newNodeId].addSlotComponents(slotKeys);
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
      Editor.editorEnv.getLastComponentId(),
      new Vector2(x1, y1),
      new Vector2(x1, y1),
      {start: from, end: to}
    );
    return Editor.editorEnv.addComponent(newLine);
  }

  text(text: string, x: number, y: number, style?: string, parent?: Component) {
    const newText = new TextComponent(
      Editor.editorEnv.getLastComponentId(),
      new Vector2(x, y),
      text,
      style,
      parent
    );
    return Editor.editorEnv.addComponent(newText);
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
      Editor.editorEnv.getLastComponentId(),
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
    return Editor.editorEnv.addComponent(newSlot);
  }
}
