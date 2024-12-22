import {ConnectionVertex, NodeTypes} from '@connectlab-editor/types';
import bgTexturePath from '@connectlab-editor/assets/bg-texture.svg';
import {
  updateBackground,
  updateCanvas,
} from '@connectlab-editor/functions/canvasDraw';
import EditorEnvironment from '@connectlab-editor/environment';
import Vector2 from '@connectlab-editor/types/vector2';
import Component from '@connectlab-editor/interfaces/componentInterface';
import MouseEvents from '@connectlab-editor/events/mouseEvents';
import Mouse from '@connectlab-editor/types/mouse';
import KeyboardEvents from '@connectlab-editor/events/keyboardEvents';
import Keyboard from '@connectlab-editor/types/keyboard';
import {addComponent} from '@connectlab-editor/functions/addComponent';
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
  private backgroundPattern: CanvasPattern | null;
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
    this.loadBackgroundPattern(bgTexturePath);
    this.windowResized = true;
    this.tickRate = tickRate;
    createEditorEvents(this, canvasDOM, backgroundDOM);
  }

  private createContext(
    domElement: HTMLCanvasElement
  ): CanvasRenderingContext2D {
    return domElement.getContext('2d', {desynchronized: true})!;
  }

  private loadBackgroundPattern(bgPath: string): void {
    const backgroundImg = new Image();
    backgroundImg.onload = () => {
      this.backgroundPattern = this.backgroundCtx.createPattern(
        backgroundImg,
        'repeat'
      );
    };
    backgroundImg.src = bgPath;
  }

  private getEditorArea(): Vector2 {
    const canvasParentEl = document.getElementById(
      this.canvasId
    )?.parentElement;
    const v = new Vector2(0, 0, false);
    if (canvasParentEl) {
      const computedStyle = window.getComputedStyle(canvasParentEl);
      v.x = parseFloat(
        computedStyle.width.substring(0, computedStyle.length - 2)
      );
      v.y = parseFloat(
        computedStyle.height.substring(0, computedStyle.length - 2)
      );
    } else {
      v.x = window.innerWidth;
      v.y = window.innerHeight;
    }
    return v;
  }

  setLocalMousePosition(x: number, y: number): void {
    const rect = this.canvasCtx.canvas.getBoundingClientRect();
    this.mouse.position = new Vector2(x - rect.left, y - rect.top);
  }

  resize(): void {
    const editorArea = this.getEditorArea();
    this.canvasCtx.canvas.width = editorArea.x;
    this.canvasCtx.canvas.height = editorArea.y;
    this.backgroundCtx.canvas.width = editorArea.x;
    this.backgroundCtx.canvas.height = editorArea.y;
    this.windowResized = true;
  }

  update = (): void => {
    updateCanvas(this.canvasCtx, this.editorEnv.components);
    if (this.windowResized) {
      updateBackground(this.backgroundCtx, this.backgroundPattern);
      this.windowResized = false;
    }
    requestAnimationFrame(this.update);
  };

  compute = (): void => {
    this.keyboardEvents.onKeyDown(this);
    this.keyboardEvents.onKeyUp();
    this.mouseEvents.onMouseClick(this.editorEnv);
    this.mouseEvents.onMouseMove(this.editorEnv);
    this.mouseEvents.onMouseRelease(this.editorEnv);
  };

  node(
    type = NodeTypes.G_AND,
    x = this.mouse.position.x,
    y = this.mouse.position.y
  ): number {
    return addComponent.node(
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
    return addComponent.input(
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
    return addComponent.output(
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
    return addComponent.connection(
      undefined,
      this.editorEnv,
      x1,
      y1,
      x2,
      y2,
      from,
      to
    );
  }

  text(
    text: string,
    x: number,
    y: number,
    style?: string,
    parent?: Component
  ): number {
    return addComponent.text(
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
  ): number {
    return addComponent.slot(
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
        this.mouseEvents.getCollisionList().nodes[0]
      );
    else if (this.mouseEvents.getCollisionList().connections.length !== 0)
      return this.editorEnv.removeComponent(
        this.mouseEvents.getCollisionList().connections[0]
      );
    else if (this.mouseEvents.getCollisionList().texts.length !== 0)
      return this.editorEnv.removeComponent(
        this.mouseEvents.getCollisionList().texts[0]
      );
    return false;
  }
}
