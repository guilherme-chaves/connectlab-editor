import {
  ConnectionVertex,
  InputTypes,
  NodeTypes,
  OutputTypes,
  RendererType,
  SignalGraph,
} from './types/types';
import bgTexturePath from './assets/bg-texture.svg';
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
import Point2i from './types/Point2i';
import Point2f from './types/Point2f';
import Renderer from './interfaces/renderer';
import CanvasRenderer from './renderer/canvas/renderer';

export default class Editor {
  // Lista de componentes
  public readonly editorEnv: EditorEnvironment;
  public readonly signalGraph: SignalGraph;
  public readonly renderers: {editor: Renderer; background: Renderer} | null;
  // Controle de eventos do canvas
  private readonly mouse: Mouse;
  private readonly keyboard: Keyboard;
  private readonly mouseEvents: MouseEvents;
  private readonly keyboardEvents: KeyboardEvents;
  // Canvas DOM
  private readonly canvasDOM: HTMLCanvasElement;
  private readonly backgroundDOM: HTMLCanvasElement;
  // Propriedades dos canvas
  private canvasArea: Point2f; // [0, 1] dentro dos dois eixos, representa a porcentagem da tela a ser ocupada
  private windowArea: Point2i;
  private windowResized: boolean;
  public readonly frameRate: number;

  constructor(
    documentId: string,
    canvasID: string,
    backgroundID: string,
    renderer: RendererType,
    canvasVw = 1,
    canvasVh = 1,
    frameRate = 60.0
  ) {
    this.signalGraph = new Map();
    this.mouse = new Mouse();
    this.keyboard = new Keyboard();
    this.mouseEvents = new MouseEvents(this.mouse);
    this.keyboardEvents = new KeyboardEvents(this.keyboard);
    this.canvasDOM = <HTMLCanvasElement>document.getElementById(canvasID);
    this.backgroundDOM = <HTMLCanvasElement>(
      document.getElementById(backgroundID)
    );
    this.renderers = null;
    this.canvasArea = new Point2f(canvasVw, canvasVh);
    this.windowArea = new Point2i(window.innerWidth, window.innerHeight);
    this.windowResized = true;
    this.frameRate = frameRate;
    switch (renderer) {
      case RendererType.NONE:
        break;
      case RendererType.CANVAS:
        this.renderers = {
          background: new CanvasRenderer(this.backgroundDOM),
          editor: new CanvasRenderer(this.canvasDOM),
        };
        this.renderers.background.addElement(undefined, {
          src: bgTexturePath,
          position: new Point2i(),
          repeat: 'repeat',
        });
        break;
    }

    this.editorEnv = new EditorEnvironment(
      documentId,
      this.signalGraph,
      this.renderers?.editor
    );

    this.createEditorEvents(this.canvasDOM, this.backgroundDOM);
  }

  // static loadFile(jsonData): Editor

  // saveToFile()

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
      if (this.mouse.clicked) return;
      this.mouse.clickStartPosition = this.computePositionInCanvas(
        x,
        y,
        this.mouse.clickStartPosition
      );
      this.mouse.position = this.computePositionInCanvas(
        x,
        y,
        this.mouse.position
      );
      this.mouse.clicked = true;
      this.mouseEvents.onMouseClick(this);
    });
    canvasDOM.addEventListener('mouseup', () => {
      this.mouseEvents.onMouseRelease(this.editorEnv);
      this.mouse.clicked = false;
    });
    canvasDOM.addEventListener('mouseout', () => {
      this.mouseEvents.onMouseRelease(this.editorEnv);
      this.mouse.clicked = false;
    });
    window.addEventListener('mousemove', ({x, y}) => {
      this.mouse.position = this.computePositionInCanvas(
        x,
        y,
        this.mouse.position
      );
    });
    window.addEventListener('keydown', (ev: KeyboardEvent) => {
      this.keyboardEvents.onKeyDown(ev, this);
    });
    window.addEventListener('keyup', () => {
      this.keyboardEvents.onKeyUp();
    });
  }

  computeWindowArea() {
    const canvasParentEl = this.canvasDOM.parentElement;
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

  computePositionInCanvas(x: number, y: number, out?: Point2i) {
    out ??= new Point2i();
    if (this.renderers === undefined) return out;
    const rect = this.renderers!.editor.ctx?.canvas.getBoundingClientRect();
    if (rect !== undefined) {
      out.x = x - rect.left;
      out.y = y - rect.top;
    }
    return out;
  }

  draw(canvas = true, background = false) {
    if (background) this.renderers?.background.draw();
    if (canvas) this.renderers?.editor.draw();
  }

  resize() {
    this.computeWindowArea();
    this.renderers?.editor.resize(
      this.windowArea.x * this.canvasArea.x,
      this.windowArea.y * this.canvasArea.y
    );
    this.renderers?.background.resize(
      this.windowArea.x * this.canvasArea.x,
      this.windowArea.y * this.canvasArea.y
    );
    this.windowResized = true;
  }

  update = () => {
    if (this.renderers === undefined) return;
    requestAnimationFrame(this.update);
    this.draw(true, this.windowResized);
    if (this.windowResized) this.windowResized = false;
  };

  compute() {
    setInterval(() => {
      this.mouseEvents.onMouseMove(this.editorEnv);
    }, 1000.0 / this.frameRate);
  }

  node(
    type = NodeTypes.ADD,
    x = this.mouse.position.x,
    y = this.mouse.position.y
  ): number {
    const slots: Array<SlotComponent> = [];
    const newNode = new NodeComponent(
      this.editorEnv.nextComponentId,
      new Point2i(x, y),
      type,
      slots,
      88,
      50
    );
    const newNodeId = this.editorEnv.addComponent(newNode);
    NodeComponent.getNodeTypeObject(type).connectionSlot.forEach(slot => {
      const slotKey = this.slot(
        slot.localPos.x,
        slot.localPos.y,
        this.editorEnv.nodes.get(newNodeId)!,
        slot.in
      );
      const slotComponent = this.editorEnv.slots.get(slotKey)!;
      this.renderers?.editor.addElement(slotComponent);
      slots.push(slotComponent);
    });
    this.editorEnv.nodes.get(newNodeId)!.slotComponents = slots;
    if (this.renderers !== null) {
      this.renderers.editor.addElement(newNode);
      // for (let i = 0; i < newNode.slotComponents.length; i++) {
      //   this.renderers.editor.addElement(newNode.slotComponents[i]);
      // }
      newNode.collisionShape.size.x = this.renderers.editor.nodeImages.get(
        newNode.nodeType.imgPaths[0]
      )!.width;
      newNode.collisionShape.size.y = this.renderers.editor.nodeImages.get(
        newNode.nodeType.imgPaths[0]
      )!.height;
      this.renderers.editor.addElement(
        undefined,
        undefined,
        undefined,
        undefined,
        {
          componentId: newNodeId,
          shapes: [[newNode.collisionShape], []],
        }
      );
    }
    return newNodeId;
  }

  input(
    type = InputTypes.SWITCH,
    x = this.mouse.position.x,
    y = this.mouse.position.y
  ): number {
    const newInput = new InputComponent(
      this.editorEnv.nextComponentId,
      new Point2i(x, y),
      type,
      undefined,
      this.renderers?.editor.ctx?.canvas.width ?? 1920,
      this.renderers?.editor.ctx?.canvas.height ?? 1080
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
    if (this.renderers !== null) {
      this.renderers.editor.addElement(newInput);
      newInput.collisionShape.size.x = this.renderers.editor.inputImages.get(
        newInput.nodeType.imgPaths[0]
      )!.width;
      newInput.collisionShape.size.y = this.renderers.editor.inputImages.get(
        newInput.nodeType.imgPaths[0]
      )!.height;
      for (let i = 0; i < newInput.slotComponents.length; i++) {
        this.renderers.editor.addElement(newInput.slotComponents[i]);
      }
      this.renderers.editor.addElement(
        undefined,
        undefined,
        undefined,
        undefined,
        {
          componentId: newInputId,
          shapes: [[newInput.collisionShape], []],
        }
      );
    }
    return newInputId;
  }

  output(
    type = OutputTypes.MONO_LED_RED,
    x = this.mouse.position.x,
    y = this.mouse.position.y
  ): number {
    const newOutput = new OutputComponent(
      this.editorEnv.nextComponentId,
      new Point2i(x, y),
      type,
      undefined,
      this.renderers?.editor.ctx?.canvas.width ?? 1920,
      this.renderers?.editor.ctx?.canvas.height ?? 1080
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
    if (this.renderers !== null) {
      this.renderers.editor.addElement(newOutput);
      newOutput.collisionShape.size.x = this.renderers.editor.outputImages.get(
        newOutput.nodeType.imgPaths[0]
      )!.width;
      newOutput.collisionShape.size.y = this.renderers.editor.outputImages.get(
        newOutput.nodeType.imgPaths[0]
      )!.height;
      for (let i = 0; i < newOutput.slotComponents.length; i++) {
        this.renderers.editor.addElement(newOutput.slotComponents[i]);
      }
      this.renderers.editor.addElement(
        undefined,
        undefined,
        undefined,
        undefined,
        {
          componentId: newOutputId,
          shapes: [[newOutput.collisionShape], []],
        }
      );
    }
    return newOutputId;
  }

  line(x1: number, y1: number, from?: ConnectionVertex, to?: ConnectionVertex) {
    const newLine = new ConnectionComponent(
      this.editorEnv.nextComponentId,
      new Point2i(x1, y1),
      new Point2i(x1, y1),
      {start: from, end: to}
    );
    const newLineId = this.editorEnv.addComponent(newLine);
    if (this.renderers !== null) {
      this.renderers.editor.addElement(newLine, undefined, undefined, newLine);
      this.renderers.editor.addElement(
        undefined,
        undefined,
        undefined,
        undefined,
        {
          componentId: newLineId,
          shapes: [
            [...this.editorEnv.connections.get(newLineId)!.collisionShape],
            [],
          ],
        }
      );
    }
    return newLineId;
  }

  text(
    text: string,
    x: number,
    y: number,
    size: number = 32,
    font: string = 'sans-serif',
    color: string = '#000000',
    parent?: Component
  ): number {
    if (this.renderers?.editor.ctx) {
      const newText = new TextComponent(
        this.editorEnv.nextComponentId,
        new Point2i(x, y),
        parent,
        TextComponent.measureText(
          this.renderers.editor.ctx,
          text,
          size + 'px ' + font
        )
      );
      this.renderers.editor.addElement(newText, undefined, {
        label: text,
        size,
        color,
        font,
      });
      this.renderers.editor.addElement(
        undefined,
        undefined,
        undefined,
        undefined,
        {
          componentId: newText.id,
          shapes: [[newText.collisionShape], []],
        }
      );
      return this.editorEnv.addComponent(newText);
    }
    return -1;
  }

  slot(
    x: number,
    y: number,
    parent: Component,
    inSlot?: boolean,
    attractionRadius?: number
  ) {
    const newSlot = new SlotComponent(
      this.editorEnv.nextComponentId,
      new Point2i(x, y),
      parent.position,
      parent,
      undefined,
      inSlot,
      attractionRadius
    );
    if (this.renderers !== null) {
      this.renderers.editor.addElement(newSlot);
      // this.renderers.editor.addElement(
      //   undefined,
      //   undefined,
      //   undefined,
      //   undefined,
      //   {
      //     componentId: newSlot.id,
      //     shapes: [[], [newSlot.collisionShape]],
      //   }
      // );
    }
    return this.editorEnv.addComponent(newSlot);
  }
}
