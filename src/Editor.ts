import {
  ConnectionVertex,
  InputTypes,
  NodeTypes,
  OutputTypes,
} from './types/types';
import bgTexturePath from './assets/bg-texture.svg';
import {updateBackground, updateCanvas} from './functions/canvasDraw';
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
import Keyboard from './types/Keyboard';
import OutputComponent from './components/OutputComponent';

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
  ) {
    const slots: Array<SlotComponent> = [];
    const newNode = new NodeComponent(
      this.editorEnv.nextComponentId,
      new Vector2(x, y),
      type,
      this.canvasCtx.canvas.width,
      this.canvasCtx.canvas.height,
      slots,
      this.editorEnv.nodeImageList,
      this.editorEnv.signalGraph
    );
    const newNodeId = this.editorEnv.addComponent(newNode);
    NodeComponent.getNodeTypeObject(type).connectionSlot.forEach(slot => {
      const slotKey = this.slot(
        slot.localPos.x,
        slot.localPos.y,
        this.editorEnv.nodes.get(newNodeId)!,
        slot.in
      );
      slots.push(this.editorEnv.slots.get(slotKey)!);
    });
    this.editorEnv.nodes.get(newNodeId)!.slotComponents = slots;
    return newNodeId;
  }

  input(
    type = InputTypes.SWITCH,
    x = this.mouse.position.x,
    y = this.mouse.position.y
  ) {
    const newInput = new InputComponent(
      this.editorEnv.nextComponentId,
      new Vector2(x, y),
      this.canvasCtx.canvas.width,
      this.canvasCtx.canvas.height,
      type,
      undefined,
      this.editorEnv.inputImageList,
      this.editorEnv.signalGraph
    );
    const newInputId = this.editorEnv.addComponent(newInput);
    const slotInfo = InputComponent.getInputTypeObject(type).connectionSlot;
    const slotId = this.slot(
      slotInfo.localPos.x,
      slotInfo.localPos.y,
      this.editorEnv.inputs.get(newInputId)!,
      false
    );
    this.editorEnv.inputs.get(newInputId)!.slotComponents = [
      this.editorEnv.slots.get(slotId)!,
    ];
  }

  output(
    type = OutputTypes.MONO_LED_RED,
    x = this.mouse.position.x,
    y = this.mouse.position.y
  ) {
    const newOutput = new OutputComponent(
      this.editorEnv.nextComponentId,
      new Vector2(x, y),
      this.canvasCtx.canvas.width,
      this.canvasCtx.canvas.height,
      type,
      undefined,
      this.editorEnv.outputImageList,
      this.editorEnv.signalGraph
    );
    const newOutputId = this.editorEnv.addComponent(newOutput);
    const slotInfo =
      OutputComponent.getOutputTypeObject(type)[0].connectionSlot;
    const slotId = this.slot(
      slotInfo.localPos.x,
      slotInfo.localPos.y,
      this.editorEnv.outputs.get(newOutputId)!,
      true
    );
    this.editorEnv.outputs.get(newOutputId)!.slotComponents = [
      this.editorEnv.slots.get(slotId)!,
    ];
  }

  line(x1: number, y1: number, from?: ConnectionVertex, to?: ConnectionVertex) {
    const newLine = new ConnectionComponent(
      this.editorEnv.nextComponentId,
      new Vector2(x1, y1),
      new Vector2(x1, y1),
      {start: from, end: to}
    );
    return this.editorEnv.addComponent(newLine);
  }

  text(text: string, x: number, y: number, style?: string, parent?: Component) {
    const newText = new TextComponent(
      this.editorEnv.nextComponentId,
      new Vector2(x, y),
      text,
      style,
      parent,
      this.canvasCtx
    );
    return this.editorEnv.addComponent(newText);
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
      this.editorEnv.nextComponentId,
      new Vector2(x, y),
      parent,
      undefined,
      inSlot,
      radius,
      attractionRadius,
      color,
      colorActive
    );
    return this.editorEnv.addComponent(newSlot);
  }
}
