import {
  ConnectionVertex,
  InputTypes,
  NodeTypes,
  OutputTypes,
  RendererType,
} from './types/types';
import EditorEnvironment from './EditorEnvironment';
import ConnectionComponent from './components/ConnectionComponent';
import TextComponent from './components/TextComponent';
import NodeComponent from './components/NodeComponent';
import Component from './interfaces/componentInterface';
import SlotComponent from './components/SlotComponent';
import MouseEvents from './functions/mouseEvents';
import Mouse from './types/Mouse';
import KeyboardEvents from './functions/keyboardEvents';
import InputComponent from './components/InputComponent';
import Keyboard from './types/Keyboard';
import OutputComponent from './components/OutputComponent';
import Two from 'two.js';
import {Texture} from 'two.js/src/effects/texture';
import BG_TEXTURE from './assets/bg-texture.svg';
import {Vector} from 'two.js/src/vector';

export default class Editor {
  // Lista de componentes
  public readonly editorEnv;
  // Controle de eventos do canvas
  private readonly mouse: Mouse;
  private readonly keyboard: Keyboard;
  private readonly mouseEvents: MouseEvents;
  private readonly keyboardEvents: KeyboardEvents;
  // Contextos dos canvas
  private readonly canvasRenderer: Two | undefined;
  private backgroundTexture: Texture | undefined;
  // Propriedades dos canvas
  public readonly tickRate: number;

  constructor(
    documentId: string,
    canvasID: string,
    backgroundID: string,
    renderer: RendererType,
    tickRate = 60.0
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
    this.createEditorEvents(canvasDOM, backgroundDOM);
    this.tickRate = tickRate;
    if (renderer !== RendererType.NONE) {
      try {
        this.canvasRenderer = new Two({
          autostart: false,
          domElement: canvasDOM,
          fitted: true,
          type: Two.Types.canvas,
        });
      } catch (err) {
        console.warn(
          'Não foi possível criar contexto utilizando WebGL. Renderização via Canvas2D será utilizada'
        );
        this.canvasRenderer = new Two({
          autostart: false,
          domElement: canvasDOM,
          fitted: true,
          type: Two.Types.canvas,
        });
      } finally {
        this.loadBackgroundPattern(BG_TEXTURE);
      }
    }
  }

  // static loadFile(jsonData): Editor

  // saveToFile()

  loadBackgroundPattern(bgPath: string) {
    const backgroundImg = new Image();
    backgroundImg.onload = () => {
      this.backgroundTexture = this.canvasRenderer?.makeTexture(backgroundImg);
    };
    backgroundImg.src = bgPath;
  }

  private createEditorEvents(
    canvasDOM: HTMLCanvasElement,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _backgroundDOM: HTMLCanvasElement
  ) {
    window.addEventListener('load', () => {
      this.compute();
      this.canvasRenderer?.play();
    });
    canvasDOM.addEventListener('mousedown', ({x, y}) => {
      this.mouse.clicked = true;
      if (this.mouse.stateChanged) {
        this.mouse.clickStartPosition = this.computePositionInCanvas(x, y);
        this.mouseEvents.onMouseClick(this);
      }
    });
    canvasDOM.addEventListener('mouseup', () => {
      this.mouse.clicked = false;
      this.mouseEvents.onMouseRelease(this.editorEnv);
    });
    canvasDOM.addEventListener('mouseout', () => {
      this.mouse.clicked = false;
      this.mouseEvents.onMouseRelease(this.editorEnv);
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

  computePositionInCanvas(x: number, y: number) {
    return new Vector(
      x - (this.canvasRenderer?.width ?? 0),
      y - (this.canvasRenderer?.height ?? 0)
    );
  }

  compute() {
    setInterval(() => {
      this.mouseEvents.onMouseMove(this.editorEnv);
    }, 1000.0 / this.tickRate);
  }

  node(
    type = NodeTypes.ADD,
    x = this.mouse.position.x,
    y = this.mouse.position.y
  ) {
    const slots: Array<SlotComponent> = [];
    const newNode = new NodeComponent(
      this.editorEnv.nextComponentId,
      new Vector(x, y),
      type,
      slots,
      this.editorEnv.signalGraph,
      this.canvasRenderer
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
      new Vector(x, y),
      type,
      undefined,
      this.editorEnv.signalGraph,
      this.canvasRenderer
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
      new Vector(x, y),
      type,
      undefined,
      this.editorEnv.signalGraph,
      this.canvasRenderer
    );
    const newOutputId = this.editorEnv.addComponent(newOutput);
    const slotInfo = OutputComponent.getOutputTypeObject(type).connectionSlot;
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

  line(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    from?: ConnectionVertex,
    to?: ConnectionVertex
  ) {
    const newLine = new ConnectionComponent(
      this.editorEnv.nextComponentId,
      new Vector(x1, y1),
      new Vector(x2, y2),
      {start: from, end: to},
      this.canvasRenderer
    );
    return this.editorEnv.addComponent(newLine);
  }

  text(text: string, x: number, y: number, style?: string) {
    const newText = new TextComponent(
      this.editorEnv.nextComponentId,
      new Vector(x, y),
      text,
      style,
      this.canvasRenderer
    );
    return this.editorEnv.addComponent(newText);
  }

  slot(
    x: number,
    y: number,
    parent: Component,
    inSlot?: boolean,
    radius?: number,
    attractionRadius?: number
  ) {
    const newSlot = new SlotComponent(
      this.editorEnv.nextComponentId,
      new Vector(x, y),
      parent,
      undefined,
      inSlot,
      radius,
      attractionRadius,
      this.canvasRenderer
    );
    return this.editorEnv.addComponent(newSlot);
  }
}
