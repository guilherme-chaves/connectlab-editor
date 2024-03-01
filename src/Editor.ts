import {
  ConnectionVertex,
  InputTypes,
  NodeTypes,
  OutputTypes,
} from './types/types';
import bgTexturePath from './assets/bg-texture.svg';
import {updateBackground, updateCanvas} from './functions/canvasDraw';
import EditorEnvironment from './EditorEnvironment';
import Vector2 from './types/Vector2';
import Component from './interfaces/componentInterface';
import MouseEvents from './functions/mouseEvents';
import Mouse from './types/Mouse';
import KeyboardEvents from './functions/keyboardEvents';
import Keyboard from './types/Keyboard';
import {
  addConnection,
  addInput,
  addNode,
  addOutput,
  addSlot,
  addText,
} from './functions/Component/addComponent';

export default class Editor {
  // Lista de componentes
  public readonly editorEnv;
  // Controle de eventos do canvas
  private readonly mouse: Mouse;
  private readonly keyboard: Keyboard;
  private readonly mouseEvents: MouseEvents;
  private readonly keyboardEvents: KeyboardEvents;
  // Contextos dos canvas
  private readonly canvasId: string;
  private readonly canvasCtx: CanvasRenderingContext2D;
  private readonly backgroundCtx: CanvasRenderingContext2D;
  // Propriedades dos canvas
  private canvasArea: DOMPoint; // [0, 1] dentro dos dois eixos, representa a porcentagem da tela a ser ocupada
  private backgroundPattern: CanvasPattern | null;
  private windowArea: DOMPoint;
  private windowResized: boolean;
  public readonly frameRate: number;

  constructor(
    documentId: string,
    canvasID: string,
    backgroundID: string,
    canvasVw = 1,
    canvasVh = 1,
    frameRate = 60.0
  ) {
    this.editorEnv = new EditorEnvironment(documentId);
    this.mouse = new Mouse();
    this.keyboard = new Keyboard();
    this.mouseEvents = new MouseEvents(this.mouse);
    this.keyboardEvents = new KeyboardEvents(this.keyboard);

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
    this.windowResized = true;
    this.frameRate = frameRate;
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _backgroundDOM: HTMLCanvasElement
  ) {
    window.addEventListener('load', () => {
      this.resize();
      this.compute();
      this.update();
    });
    window.addEventListener('resize', () => {
      this.resize();
    });
    canvasDOM.addEventListener('mousedown', ({x, y}) => {
      this.mouse.clicked = true;
      if (this.mouse.stateChanged)
        this.mouse.clickStartPosition = this.computePositionInCanvas(x, y);
    });
    canvasDOM.addEventListener('mouseup', () => {
      this.mouse.clicked = false;
    });
    canvasDOM.addEventListener('mouseout', () => {
      this.mouse.clicked = false;
    });
    window.addEventListener('mousemove', ({x, y}) => {
      this.mouse.position = this.computePositionInCanvas(x, y);
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

  computePositionInCanvas(x: number, y: number) {
    const rect = this.canvasCtx.canvas.getBoundingClientRect();
    return new Vector2(x - rect.left, y - rect.top);
  }

  draw(canvas = true, background = false) {
    if (background)
      updateBackground(this.backgroundCtx, this.backgroundPattern);
    if (canvas) updateCanvas(this.canvasCtx, this.editorEnv.components);
  }

  resize() {
    this.computeWindowArea();
    this.canvasCtx.canvas.width = this.windowArea.x * this.canvasArea.x;
    this.canvasCtx.canvas.height = this.windowArea.y * this.canvasArea.y;
    this.backgroundCtx.canvas.width = this.windowArea.x * this.canvasArea.x;
    this.backgroundCtx.canvas.height = this.windowArea.y * this.canvasArea.y;
    this.windowResized = true;
  }

  update = () => {
    requestAnimationFrame(this.update);
    this.draw(true, this.windowResized);
    if (this.windowResized) this.windowResized = false;
  };

  compute() {
    setInterval(() => {
      this.mouseEvents.onMouseMove(this.editorEnv);
      this.mouseEvents.onMouseClick(this);
      this.mouseEvents.onMouseRelease(this.editorEnv);
    }, 1000.0 / this.frameRate);
  }

  node(
    type = NodeTypes.ADD,
    x = this.mouse.position.x,
    y = this.mouse.position.y
  ): number {
    return addNode(this.editorEnv, this.canvasCtx, type, x, y);
  }

  input(
    type = InputTypes.SWITCH,
    x = this.mouse.position.x,
    y = this.mouse.position.y
  ): number {
    return addInput(this.editorEnv, this.canvasCtx, type, x, y);
  }

  output(
    type = OutputTypes.MONO_LED_RED,
    x = this.mouse.position.x,
    y = this.mouse.position.y
  ): number {
    return addOutput(this.editorEnv, this.canvasCtx, type, x, y);
  }

  line(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    from?: ConnectionVertex,
    to?: ConnectionVertex
  ): number {
    return addConnection(this.editorEnv, x1, y1, x2, y2, from, to);
  }

  text(
    text: string,
    x: number,
    y: number,
    style?: string,
    parent?: Component
  ): number {
    return addText(this.editorEnv, this.canvasCtx, text, x, y, style, parent);
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
    return addSlot(
      this.editorEnv,
      x,
      y,
      parent,
      inSlot,
      radius,
      attractionRadius,
      color,
      colorActive
    );
  }

  remove(): boolean {
    if (this.mouseEvents.getCollisionList().nodes !== undefined)
      return this.editorEnv.removeComponent(
        this.mouseEvents.getCollisionList().nodes![0]
      );
    else if (this.mouseEvents.getCollisionList().inputs !== undefined)
      return this.editorEnv.removeComponent(
        this.mouseEvents.getCollisionList().inputs![0]
      );
    else if (this.mouseEvents.getCollisionList().outputs !== undefined)
      return this.editorEnv.removeComponent(
        this.mouseEvents.getCollisionList().outputs![0]
      );
    else if (this.mouseEvents.getCollisionList().connections !== undefined)
      return this.editorEnv.removeComponent(
        this.mouseEvents.getCollisionList().connections![0]
      );
    else if (this.mouseEvents.getCollisionList().texts !== undefined)
      return this.editorEnv.removeComponent(
        this.mouseEvents.getCollisionList().texts![0]
      );
    return false;
  }
}
