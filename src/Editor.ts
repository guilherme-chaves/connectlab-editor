import {componentAssocInterface, inputTypes, nodeTypes} from './types/types';
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
import Component from './interfaces/componentInterface';
import SlotComponent from './components/SlotComponent';
import MouseEvents from './functions/mouseEvents';
import Mouse from './types/Mouse';
import KeyboardEvents from './functions/keyboardEvents';
import InputComponent from './components/InputComponent';

export default class Editor {
  // Lista de componentes
  public static readonly editorEnv = new EditorEnvironment('');
  // Controle de eventos do canvas
  private mouseEvents: MouseEvents;
  private keyboardEvents: KeyboardEvents;
  private canvasId: string;
  // Contextos dos canvas
  private canvasCtx: CanvasRenderingContext2D;
  private backgroundCtx: CanvasRenderingContext2D;
  // Propriedades dos canvas
  private canvasArea: DOMPoint; // [0, 1] dentro dos dois eixos, representa a porcentagem da tela a ser ocupada
  private backgroundPattern: CanvasPattern | null;
  private windowArea: DOMPoint;
  public readonly frameRate: number;

  constructor(
    documentId: string,
    canvasID: string,
    backgroundID: string,
    canvasVw = 1,
    canvasVh = 1,
    frameRate = 60.0
  ) {
    Editor.editorEnv.documentId = documentId;
    this.mouseEvents = new MouseEvents();
    this.keyboardEvents = new KeyboardEvents();

    const canvasDOM = <HTMLCanvasElement>document.getElementById(canvasID);
    const backgroundDOM = <HTMLCanvasElement>(
      document.getElementById(backgroundID)
    );
    this.canvasId = canvasID;
    this.canvasCtx = this.createContext(canvasDOM);
    this.backgroundCtx = this.createContext(backgroundDOM);
    this.createEditorEvents(canvasDOM, backgroundDOM);
    this.backgroundPattern = null;
    this.canvasArea = new DOMPoint(canvasVw, canvasVh);
    this.windowArea = new DOMPoint(window.innerWidth, window.innerHeight);
    this.loadBackgroundPattern(bgTexturePath);
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
    window.addEventListener('keydown', (ev: KeyboardEvent) => {
      this.keyboardEvents.onKeyDown(ev, this);
    });
    window.addEventListener('keyup', () => {
      this.keyboardEvents.onKeyUp();
    });
  }

  getContext(canvas = true): CanvasRenderingContext2D {
    if (canvas) return this.canvasCtx;
    return this.backgroundCtx;
  }

  loadBackgroundPattern(bgPath: string) {
    const backgroundImg = new Image();
    backgroundImg.onload = () => {
      this.backgroundPattern = this.backgroundCtx.createPattern(
        backgroundImg,
        'repeat'
      );
    };
    backgroundImg.src = bgPath;
  }

  computeWindowArea() {
    const canvasParentEl = document.getElementById(
      this.canvasId
    )?.parentElement;
    if (canvasParentEl !== undefined && canvasParentEl !== null) {
      const computedStyle = window.getComputedStyle(canvasParentEl);
      this.windowArea.x = parseFloat(
        computedStyle.width.substring(0, computedStyle.length - 2)
      );
      this.windowArea.y = parseFloat(
        computedStyle.height.substring(0, computedStyle.length - 2)
      );
    } else {
      this.windowArea.x = window.innerWidth;
      this.windowArea.y = window.innerHeight;
    }
  }

  draw(canvas = true, background = false) {
    if (background)
      updateBackground(this.backgroundCtx, this.backgroundPattern);
    if (canvas) updateCanvas(this.canvasCtx, Editor.editorEnv.components);
  }

  resize() {
    this.computeWindowArea();
    this.canvasCtx.canvas.width = this.windowArea.x * this.canvasArea.x;
    this.canvasCtx.canvas.height = this.windowArea.y * this.canvasArea.y;
    this.backgroundCtx.canvas.width = this.windowArea.x * this.canvasArea.x;
    this.backgroundCtx.canvas.height = this.windowArea.y * this.canvasArea.y;
    requestAnimationFrame.bind(
      updateAll(
        this.canvasCtx,
        Editor.editorEnv.components,
        this.backgroundCtx,
        this.backgroundPattern
      )
    );
  }

  update = () => {
    requestAnimationFrame(this.update);
    this.draw(true);
    // this.checkConnections()
    // this.checkCollisions()
    // To-Do -> Adicionar as seguintes partes:
    // eventos e adição de componentes
    // colisão(this.editorEnv)
  };

  compute() {
    setInterval(() => {
      this.mouseEvents.onMouseMove(this);
      this.mouseEvents.onMouseClick();
      this.mouseEvents.onMouseRelease();
    }, 1000.0 / this.frameRate);
  }

  node(type = nodeTypes.ADD, x = Mouse.position.x, y = Mouse.position.y) {
    const slots: Array<SlotComponent> = [];
    const newNode = new NodeComponent(
      Editor.editorEnv.nextComponentId,
      new Vector2(x, y),
      type,
      this.canvasCtx.canvas.width,
      this.canvasCtx.canvas.height,
      slots
    );
    const newNodeId = Editor.editorEnv.addComponent(newNode);
    NodeComponent.getNodeTypeObject(type).connectionSlots.forEach(slot => {
      const slotKey = this.slot(
        slot.localPos.x,
        slot.localPos.y,
        Editor.editorEnv.nodes[newNodeId],
        slot.in
      );
      slots.push(Editor.editorEnv.slots[slotKey]);
    });
    Editor.editorEnv.nodes[newNodeId].slotComponents = slots;
    this.draw(true, false);
    return newNodeId;
  }

  input(type = inputTypes.SWITCH, x = Mouse.position.x, y = Mouse.position.y) {
    const newInput = new InputComponent(
      Editor.editorEnv.nextComponentId,
      new Vector2(x, y),
      this.canvasCtx.canvas.width,
      this.canvasCtx.canvas.height,
      type,
      undefined
    );
    const newInputId = Editor.editorEnv.addComponent(newInput);
    const slotInfo = InputComponent.getInputTypeObject(type).connectionSlot;
    const slotId = this.slot(
      slotInfo.localPos.x,
      slotInfo.localPos.y,
      Editor.editorEnv.inputs[newInputId],
      false
    );
    Editor.editorEnv.inputs[newInputId].slotComponent =
      Editor.editorEnv.slots[slotId];
  }

  line(
    x1: number,
    y1: number,
    from?: componentAssocInterface,
    to?: componentAssocInterface
  ) {
    const newLine = new ConnectionComponent(
      Editor.editorEnv.nextComponentId,
      new Vector2(x1, y1),
      new Vector2(x1, y1),
      {start: from, end: to}
    );
    this.draw(true, false);
    return Editor.editorEnv.addComponent(newLine);
  }

  text(text: string, x: number, y: number, style?: string, parent?: Component) {
    const newText = new TextComponent(
      Editor.editorEnv.nextComponentId,
      new Vector2(x, y),
      text,
      style,
      parent,
      this.canvasCtx
    );
    this.draw(true, false);
    return Editor.editorEnv.addComponent(newText);
  }

  slot(
    x: number,
    y: number,
    parent: Component,
    inSlot?: boolean,
    radius?: number,
    attractionRadius?: number,
    color?: string,
    colorActive?: string
  ) {
    const newSlot = new SlotComponent(
      Editor.editorEnv.nextComponentId,
      new Vector2(x, y),
      parent,
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
