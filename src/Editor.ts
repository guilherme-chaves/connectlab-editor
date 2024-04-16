import {ConnectionVertex, NodeTypes} from '@connectlab-editor/types';
import bgTexturePath from '@connectlab-editor/assets/bg-texture.svg';
import updateAll from '@connectlab-editor/functions/canvasDraw';
import EditorEnvironment from '@connectlab-editor/environment';
import Vector2 from '@connectlab-editor/types/Vector2';
import Component from '@connectlab-editor/interfaces/componentInterface';
import MouseEvents from '@connectlab-editor/events/mouseEvents';
import Mouse from '@connectlab-editor/types/Mouse';
import KeyboardEvents from '@connectlab-editor/events/keyboardEvents';
import Keyboard from '@connectlab-editor/types/Keyboard';
import {
  addConnection,
  addInput,
  addNode,
  addOutput,
  addSlot,
  addText,
} from '@connectlab-editor/functions/addComponent';
import preloadNodeImages from '@connectlab-editor/functions/preloadNodeImages';
import createEditorEvents from '@connectlab-editor/events/editorEvents';

export default class Editor {
  // Lista de componentes
  public editorEnv;
  // Controle de eventos do canvas
  public readonly mouse: Mouse;
  public readonly keyboard: Keyboard;
  public readonly mouseEvents: MouseEvents;
  public readonly keyboardEvents: KeyboardEvents;
  // Contextos dos canvas
  private readonly canvasId: string;
  public readonly canvasCtx: CanvasRenderingContext2D;
  public readonly backgroundCtx: CanvasRenderingContext2D;
  // Propriedades dos canvas
  private backgroundPattern: CanvasPattern | null = null;
  private windowArea: Vector2;
  private windowResized: boolean;
  public readonly tickRate: number;

  constructor(
    documentId: string,
    canvasID: string,
    backgroundID: string,
    tickRate = 60.0
  ) {
    this.editorEnv = new EditorEnvironment(documentId, 0, preloadNodeImages());
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
    this.backgroundPattern = null;
    this.windowArea = new Vector2(window.innerWidth, window.innerHeight, false);
    this.loadBackgroundPattern(bgTexturePath);
    this.windowResized = true;
    this.tickRate = tickRate;
    createEditorEvents(this, canvasDOM, backgroundDOM);
  }

  private createContext(
    domElement: HTMLCanvasElement
  ): CanvasRenderingContext2D {
    return domElement.getContext('2d')!;
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
    if (canvasParentEl) {
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

  resize() {
    this.computeWindowArea();
    this.canvasCtx.canvas.width = this.windowArea.x;
    this.canvasCtx.canvas.height = this.windowArea.y;
    this.backgroundCtx.canvas.width = this.windowArea.x;
    this.backgroundCtx.canvas.height = this.windowArea.y;
    this.windowResized = true;
  }

  update = () => {
    requestAnimationFrame(this.update);
    updateAll(
      this.canvasCtx,
      this.editorEnv.components,
      this.windowResized ? this.backgroundCtx : null,
      this.backgroundPattern
    );

    if (this.windowResized) this.windowResized = false;
  };

  compute() {
    setInterval(() => {
      this.mouseEvents.onMouseMove(this.editorEnv);
    }, 1000.0 / this.tickRate);
  }

  node(
    type = NodeTypes.G_AND,
    x = this.mouse.position.x,
    y = this.mouse.position.y
  ): number {
    return addNode(
      undefined,
      this.editorEnv,
      this.canvasCtx.canvas.width,
      this.canvasCtx.canvas.height,
      type,
      x,
      y
    );
  }

  input(
    type = NodeTypes.I_SWITCH,
    x = this.mouse.position.x,
    y = this.mouse.position.y
  ): number {
    return addInput(
      undefined,
      this.editorEnv,
      this.canvasCtx.canvas.width,
      this.canvasCtx.canvas.height,
      type,
      x,
      y
    );
  }

  output(
    type = NodeTypes.O_LED_RED,
    x = this.mouse.position.x,
    y = this.mouse.position.y
  ): number {
    return addOutput(
      undefined,
      this.editorEnv,
      this.canvasCtx.canvas.width,
      this.canvasCtx.canvas.height,
      type,
      x,
      y
    );
  }

  line(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    from?: ConnectionVertex,
    to?: ConnectionVertex
  ): number {
    return addConnection(undefined, this.editorEnv, x1, y1, x2, y2, from, to);
  }

  text(
    text: string,
    x: number,
    y: number,
    style?: string,
    parent?: Component
  ): number {
    return addText(
      undefined,
      this.editorEnv,
      this.canvasCtx,
      text,
      x,
      y,
      style,
      parent
    );
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
      undefined,
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
    if (this.mouseEvents.getCollisionList().nodes.length !== 0)
      return this.editorEnv.removeComponent(
        this.mouseEvents.getCollisionList().nodes![0]
      );
    else if (this.mouseEvents.getCollisionList().connections.length !== 0)
      return this.editorEnv.removeComponent(
        this.mouseEvents.getCollisionList().connections![0]
      );
    else if (this.mouseEvents.getCollisionList().texts.length !== 0)
      return this.editorEnv.removeComponent(
        this.mouseEvents.getCollisionList().texts![0]
      );
    return false;
  }
}
