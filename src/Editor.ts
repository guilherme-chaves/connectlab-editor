import {ConnectionVertex, NodeTypes} from './types/types';
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
import {gzipSync, gunzipSync} from 'fflate';
import preloadNodeImages from './functions/Node/preloadNodeImages';

export default class Editor {
  // Lista de componentes
  public editorEnv;
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
  private canvasArea: DOMPoint | undefined; // [0, 1] dentro dos dois eixos, representa a porcentagem da tela a ser ocupada
  private backgroundPattern: CanvasPattern | null = null;
  private windowArea: DOMPoint | undefined;
  private windowResized: boolean | undefined;
  public readonly frameRate: number;

  constructor(
    documentId: string,
    canvasID: string,
    backgroundID: string,
    canvasVw = 1,
    canvasVh = 1,
    frameRate = 60.0,
    testMode = false
  ) {
    this.editorEnv = new EditorEnvironment(
      documentId,
      0,
      testMode ? undefined : preloadNodeImages()
    );
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
    if (!testMode) {
      this.createEditorEvents(canvasDOM, backgroundDOM);
      this.backgroundPattern = null;
      this.canvasArea = new DOMPoint(canvasVw, canvasVh);
      this.windowArea = new DOMPoint(window.innerWidth, window.innerHeight);
      this.loadBackgroundPattern(bgTexturePath);
      this.windowResized = true;
    }
    this.frameRate = frameRate;
  }

  loadFile(ev: Event): void {
    if (!ev.target) {
      console.error('Falha ao tentar carregar os dados da entrada de dados');
      return;
    }
    const input = ev.target as HTMLInputElement;
    if (!input.files) return;
    const reader = new FileReader();
    reader.readAsArrayBuffer(input.files[0]);
    reader.onload = () => {
      if (!reader.result || typeof reader.result === 'string') return;
      const unzipped = gunzipSync(new Uint8Array(reader.result));
      const jsonData = JSON.parse(new TextDecoder().decode(unzipped));
      this.editorEnv = EditorEnvironment.createFromJson(
        jsonData,
        this.canvasCtx,
        this.editorEnv.nodeImageList
      );
    };
  }

  saveToFile(editor: Editor) {
    const a = document.createElement('a');
    const file = new TextEncoder().encode(editor.editorEnv.saveAsJson());
    const compressed = gzipSync(file, {level: 6});
    a.href = URL.createObjectURL(
      new Blob([compressed], {type: 'application/gzip'})
    );
    a.download = `${this.editorEnv.documentId}-save-${Date.now()}.save`;
    a.click();
  }

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
      this.mouseEvents.onMouseClick(this);
      if (this.mouse.stateChanged)
        this.mouse.clickStartPosition = this.computePositionInCanvas(x, y);
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
    document
      .getElementById('save-editor')
      ?.addEventListener('click', () => this.saveToFile(this));
    document.getElementById('load-editor')?.addEventListener('click', () => {
      document.getElementById('load-editor-file')?.click();
      return;
    });
    document
      .getElementById('load-editor-file')
      ?.addEventListener('change', ev => this.loadFile(ev));
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
    if (this.windowArea === undefined) return;
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
    if (this.windowArea !== undefined && this.canvasArea !== undefined) {
      this.canvasCtx.canvas.width = this.windowArea.x * this.canvasArea.x;
      this.canvasCtx.canvas.height = this.windowArea.y * this.canvasArea.y;
      this.backgroundCtx.canvas.width = this.windowArea.x * this.canvasArea.x;
      this.backgroundCtx.canvas.height = this.windowArea.y * this.canvasArea.y;
      this.windowResized = true;
    }
  }

  update = () => {
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
    type = NodeTypes.G_ADD,
    x = this.mouse.position.x,
    y = this.mouse.position.y
  ): number {
    return addNode(undefined, this.editorEnv, this.canvasCtx, type, x, y);
  }

  input(
    type = NodeTypes.I_SWITCH,
    x = this.mouse.position.x,
    y = this.mouse.position.y
  ): number {
    return addInput(undefined, this.editorEnv, this.canvasCtx, type, x, y);
  }

  output(
    type = NodeTypes.O_LED_RED,
    x = this.mouse.position.x,
    y = this.mouse.position.y
  ): number {
    return addOutput(undefined, this.editorEnv, this.canvasCtx, type, x, y);
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
