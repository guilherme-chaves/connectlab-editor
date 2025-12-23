import { describe, test, expect, beforeEach } from 'vitest';
import EditorEnvironment from '@connectlab-editor/environment';
import preloadNodeImages from '@connectlab-editor/functions/preloadNodeImages';
import addComponent from '@connectlab-editor/functions/addComponent';
import { ComponentType, EditorEvents, NodeTypes } from '@connectlab-editor/types/enums';
import Vector2i from '@connectlab-editor/types/vector2i';
import ClockInput from '@connectlab-editor/components/nodes/clockInput';

const images = preloadNodeImages();
let editorEnv = new EditorEnvironment('7d918d4f-d937-4daa-af88-43712ecb6139', 'test-mode', 0, images);
const canvas = document.createElement('canvas');
canvas.width = 800;
canvas.height = 600;
// const ctx = canvas.getContext('2d');

const newInput = (t: NodeTypes) => {
  return addComponent.input(
    undefined,
    editorEnv,
    canvas.width,
    canvas.height,
    t,
    400,
    300,
    undefined,
    false,
  );
};

const newNode = (t: NodeTypes) => {
  return addComponent.node(
    undefined,
    editorEnv,
    canvas.width,
    canvas.height,
    t,
    400,
    300,
    undefined,
    false,
  );
};

const newOutput = (t: NodeTypes) => {
  return addComponent.output(
    undefined,
    editorEnv,
    canvas.width,
    canvas.height,
    t,
    400,
    300,
    undefined,
    false,
  );
};

describe('Testes da classe ButtonInput', () => {
  beforeEach(() => {
    editorEnv = new EditorEnvironment('7d918d4f-d937-4daa-af88-43712ecb6139', 'test-mode', 0, images);
    expect(newInput(NodeTypes.I_BUTTON)).toBe(0);
  });
  test('Criar um ButtonInput', () => {
    const node = editorEnv.nodes.get(0);
    expect(node).toBeDefined();
    expect(node?.position).toEqual({ _x: 400, _y: 300, type: 'int' });
    expect(node?.nodeType.id).toEqual(NodeTypes.I_BUTTON);
    expect(node?.nodeType.connectionSlot.length).toBe(1);
    expect(node?.nodeType.connectionSlot[0].in).toBe(false);
  });
  test('Definir estado lógico do nó', () => {
    const node = editorEnv.nodes.get(0);
    expect(node).toBeDefined();
    node!.state = true;
    expect(editorEnv.signalGraph[node!.id].output).toBe(true);
  });
  test('Movimentar nó (delta)', () => {
    const node = editorEnv.nodes.get(0);
    expect(node).toBeDefined();
    node!.move(new Vector2i(100, 100), true);
    expect(node!.position).toEqual({ _x: 500, _y: 400, type: 'int' });
  });
  test('Movimentar nó (absoluto)', () => {
    const node = editorEnv.nodes.get(0);
    expect(node).toBeDefined();
    node!.move(new Vector2i(100, 100), false);
    expect(node!.position).toEqual({ _x: 100, _y: 100, type: 'int' });
  });
  test('Alterar estado lógico ao pressionar ou liberar o botão do mouse', () => {
    const node = editorEnv.nodes.get(0);
    expect(node).toBeDefined();
    expect(node!.state).toBe(false);
    expect(node!.onEvent(EditorEvents.MOUSE_CLICKED)).toBe(true);
    expect(node!.state).toBe(true);
    expect(node!.onEvent(EditorEvents.MOUSE_RELEASED)).toBe(true);
    expect(node!.state).toBe(false);
  });
  test('Eventos de selecionar e desselecionar um nó', () => {
    const node = editorEnv.nodes.get(0);
    expect(node).toBeDefined();
    expect(node!.onEvent(EditorEvents.FOCUS_IN)).toBe(true);
    expect(node!.selected).toBe(true);
    expect(node!.onEvent(EditorEvents.FOCUS_OUT)).toBe(true);
    expect(node!.selected).toBe(false);
  });
  test('Não disparar nenhum evento caso não seja definido', () => {
    const node = editorEnv.nodes.get(0);
    expect(node).toBeDefined();
    expect(node!.onEvent(EditorEvents.KEY_RELEASED)).toBe(false);
  });
  test('Conversão do nó para objeto plano', () => {
    const node = editorEnv.nodes.get(0);
    expect(node).toBeDefined();
    expect(node!.toObject()).toEqual({
      id: 0,
      componentType: ComponentType.INPUT,
      nodeType: NodeTypes.I_BUTTON,
      position: { x: 400, y: 300 },
      slotIds: [1],
      state: false,
    });
  });
});

describe('Testes da classe SwitchInput', () => {
  beforeEach(() => {
    editorEnv = new EditorEnvironment('7d918d4f-d937-4daa-af88-43712ecb6139', 'test-mode', 0, images);
    expect(newInput(NodeTypes.I_SWITCH)).toBe(0);
  });
  test('Criar um SwitchInput', () => {
    const node = editorEnv.nodes.get(0);
    expect(node).toBeDefined();
    expect(node?.position).toEqual({ _x: 400, _y: 300, type: 'int' });
    expect(node?.nodeType.id).toEqual(NodeTypes.I_SWITCH);
    expect(node?.nodeType.connectionSlot.length).toBe(1);
    expect(node?.nodeType.connectionSlot[0].in).toBe(false);
  });
  test('Definir estado lógico do nó', () => {
    const node = editorEnv.nodes.get(0);
    expect(node).toBeDefined();
    node!.state = true;
    expect(editorEnv.signalGraph[node!.id].output).toBe(true);
  });
  test('Movimentar nó (delta)', () => {
    const node = editorEnv.nodes.get(0);
    expect(node).toBeDefined();
    node!.move(new Vector2i(100, 100), true);
    expect(node!.position).toEqual({ _x: 500, _y: 400, type: 'int' });
  });
  test('Movimentar nó (absoluto)', () => {
    const node = editorEnv.nodes.get(0);
    expect(node).toBeDefined();
    node!.move(new Vector2i(100, 100), false);
    expect(node!.position).toEqual({ _x: 100, _y: 100, type: 'int' });
  });
  test('Alterar estado lógico ao liberar o botão do mouse', () => {
    const node = editorEnv.nodes.get(0);
    expect(node).toBeDefined();
    expect(node!.state).toBe(false);
    expect(node!.onEvent(EditorEvents.MOUSE_RELEASED)).toBe(true);
    expect(node!.state).toBe(true);
  });
  test('Eventos de selecionar e desselecionar um nó', () => {
    const node = editorEnv.nodes.get(0);
    expect(node).toBeDefined();
    expect(node!.onEvent(EditorEvents.FOCUS_IN)).toBe(true);
    expect(node!.selected).toBe(true);
    expect(node!.onEvent(EditorEvents.FOCUS_OUT)).toBe(true);
    expect(node!.selected).toBe(false);
  });
  test('Não disparar nenhum evento caso não seja definido', () => {
    const node = editorEnv.nodes.get(0);
    expect(node).toBeDefined();
    expect(node!.onEvent(EditorEvents.KEY_RELEASED)).toBe(false);
  });
  test('Conversão do nó para objeto plano', () => {
    const node = editorEnv.nodes.get(0);
    expect(node).toBeDefined();
    expect(node!.toObject()).toEqual({
      id: 0,
      componentType: ComponentType.INPUT,
      nodeType: NodeTypes.I_SWITCH,
      position: { x: 400, y: 300 },
      slotIds: [1],
      state: false,
    });
  });
});

describe('Testes da classe ClockInput', () => {
  beforeEach(() => {
    editorEnv = new EditorEnvironment('7d918d4f-d937-4daa-af88-43712ecb6139', 'test-mode', 0, images);
    expect(newInput(NodeTypes.I_CLOCK)).toBe(0);
  });
  test('Criar um ClockInput', () => {
    const node = editorEnv.nodes.get(0);
    expect(node).toBeDefined();
    expect(node?.position).toEqual({ _x: 400, _y: 300, type: 'int' });
    expect(node?.nodeType.id).toEqual(NodeTypes.I_CLOCK);
    expect(node?.nodeType.connectionSlot.length).toBe(1);
    expect(node?.nodeType.connectionSlot[0].in).toBe(false);
  });
  test('Definir estado lógico do nó', () => {
    const node = editorEnv.nodes.get(0);
    expect(node).toBeDefined();
    node!.state = true;
    expect(editorEnv.signalGraph[node!.id].output).toBe(true);
  });
  test('Movimentar nó (delta)', () => {
    const node = editorEnv.nodes.get(0);
    expect(node).toBeDefined();
    node!.move(new Vector2i(100, 100), true);
    expect(node!.position).toEqual({ _x: 500, _y: 400, type: 'int' });
  });
  test('Movimentar nó (absoluto)', () => {
    const node = editorEnv.nodes.get(0);
    expect(node).toBeDefined();
    node!.move(new Vector2i(100, 100), false);
    expect(node!.position).toEqual({ _x: 100, _y: 100, type: 'int' });
  });
  test('Alterar estado do nó após fim do temporizador', () => {
    const node = editorEnv.nodes.get(0) as ClockInput | undefined;
    expect(node).toBeDefined();
    expect(node!.state).toBe(false);
    for (let i = node!.clockDelay; i > -1; i--) {
      expect(node!.onEvent(EditorEvents.ENGINE_UPDATE)).toBe(true);
    }
    expect(node!.onEvent(EditorEvents.CLOCK_FINISHED)).toBe(true);
    expect(node!.state).toBe(true);
  });
  test('Eventos de selecionar e desselecionar um nó', () => {
    const node = editorEnv.nodes.get(0);
    expect(node).toBeDefined();
    expect(node!.onEvent(EditorEvents.FOCUS_IN)).toBe(true);
    expect(node!.selected).toBe(true);
    expect(node!.onEvent(EditorEvents.FOCUS_OUT)).toBe(true);
    expect(node!.selected).toBe(false);
  });
  test('Não disparar nenhum evento caso não seja definido', () => {
    const node = editorEnv.nodes.get(0);
    expect(node).toBeDefined();
    expect(node!.onEvent(EditorEvents.KEY_RELEASED)).toBe(false);
  });
  test('Conversão do nó para objeto plano', () => {
    const node = editorEnv.nodes.get(0);
    expect(node).toBeDefined();
    expect(node!.toObject()).toEqual({
      id: 0,
      componentType: ComponentType.INPUT,
      nodeType: NodeTypes.I_CLOCK,
      position: { x: 400, y: 300 },
      slotIds: [1],
      state: false,
    });
  });
});

describe('Testes da classe DefaultGate', () => {
  beforeEach(() => {
    editorEnv = new EditorEnvironment('7d918d4f-d937-4daa-af88-43712ecb6139', 'test-mode', 0, images);
  });
  test('Criar uma porta lógica do tipo AND', () => {
    newNode(NodeTypes.G_AND);
    const node = editorEnv.nodes.get(0);
    expect(node).toBeDefined();
    expect(node?.position).toEqual({ _x: 400, _y: 300, type: 'int' });
    expect(node?.nodeType.id).toBe(NodeTypes.G_AND);
    expect(node?.nodeType.connectionSlot.length).toBe(3);
  });
  test('Criar uma porta lógica do tipo OR', () => {
    newNode(NodeTypes.G_OR);
    const node = editorEnv.nodes.get(0);
    expect(node).toBeDefined();
    expect(node?.position).toEqual({ _x: 400, _y: 300, type: 'int' });
    expect(node?.nodeType.id).toBe(NodeTypes.G_OR);
    expect(node?.nodeType.connectionSlot.length).toBe(3);
  });
  test('Criar uma porta lógica do tipo NOT', () => {
    newNode(NodeTypes.G_NOT);
    const node = editorEnv.nodes.get(0);
    expect(node).toBeDefined();
    expect(node?.position).toEqual({ _x: 400, _y: 300, type: 'int' });
    expect(node?.nodeType.id).toBe(NodeTypes.G_NOT);
    expect(node?.nodeType.connectionSlot.length).toBe(2);
  });
  test('Criar uma porta lógica do tipo NAND', () => {
    newNode(NodeTypes.G_NAND);
    const node = editorEnv.nodes.get(0);
    expect(node).toBeDefined();
    expect(node?.position).toEqual({ _x: 400, _y: 300, type: 'int' });
    expect(node?.nodeType.id).toBe(NodeTypes.G_NAND);
    expect(node?.nodeType.connectionSlot.length).toBe(3);
  });
  test('Criar uma porta lógica do tipo NOR', () => {
    newNode(NodeTypes.G_NOR);
    const node = editorEnv.nodes.get(0);
    expect(node).toBeDefined();
    expect(node?.position).toEqual({ _x: 400, _y: 300, type: 'int' });
    expect(node?.nodeType.id).toBe(NodeTypes.G_NOR);
    expect(node?.nodeType.connectionSlot.length).toBe(3);
  });
  test('Criar uma porta lógica do tipo XOR', () => {
    newNode(NodeTypes.G_XOR);
    const node = editorEnv.nodes.get(0);
    expect(node).toBeDefined();
    expect(node?.position).toEqual({ _x: 400, _y: 300, type: 'int' });
    expect(node?.nodeType.id).toBe(NodeTypes.G_XOR);
    expect(node?.nodeType.connectionSlot.length).toBe(3);
  });
  test('Criar uma porta lógica do tipo XNOR', () => {
    newNode(NodeTypes.G_XNOR);
    const node = editorEnv.nodes.get(0);
    expect(node).toBeDefined();
    expect(node?.position).toEqual({ _x: 400, _y: 300, type: 'int' });
    expect(node?.nodeType.id).toBe(NodeTypes.G_XNOR);
    expect(node?.nodeType.connectionSlot.length).toBe(3);
  });
  test('Movimentar nó (delta)', () => {
    newNode(NodeTypes.G_AND);
    const node = editorEnv.nodes.get(0);
    expect(node).toBeDefined();
    node!.move(new Vector2i(100, 100), true);
    expect(node!.position).toEqual({ _x: 500, _y: 400, type: 'int' });
  });
  test('Movimentar nó (absoluto)', () => {
    newNode(NodeTypes.G_AND);
    const node = editorEnv.nodes.get(0);
    expect(node).toBeDefined();
    node!.move(new Vector2i(100, 100), false);
    expect(node!.position).toEqual({ _x: 100, _y: 100, type: 'int' });
  });
  test('Eventos de selecionar e desselecionar um nó', () => {
    newNode(NodeTypes.G_AND);
    const node = editorEnv.nodes.get(0);
    expect(node).toBeDefined();
    expect(node!.onEvent(EditorEvents.FOCUS_IN)).toBe(true);
    expect(node!.selected).toBe(true);
    expect(node!.onEvent(EditorEvents.FOCUS_OUT)).toBe(true);
    expect(node!.selected).toBe(false);
  });
  test('Não disparar nenhum evento caso não seja definido', () => {
    newNode(NodeTypes.G_AND);
    const node = editorEnv.nodes.get(0);
    expect(node).toBeDefined();
    expect(node!.onEvent(EditorEvents.KEY_RELEASED)).toBe(false);
  });
  test('Conversão do nó para objeto plano', () => {
    newNode(NodeTypes.G_AND);
    const node = editorEnv.nodes.get(0);
    expect(node).toBeDefined();
    expect(node!.toObject()).toEqual({
      id: 0,
      componentType: ComponentType.NODE,
      nodeType: NodeTypes.G_AND,
      position: { x: 400, y: 300 },
      slotIds: [1, 2, 3],
      state: false,
    });
  });
});

describe('Testes da classe LedOutput', () => {
  beforeEach(() => {
    editorEnv = new EditorEnvironment('7d918d4f-d937-4daa-af88-43712ecb6139', 'test-mode', 0, images);
    expect(newOutput(NodeTypes.O_LED_RED)).toBe(0);
  });
  test('Criar um LedOutput', () => {
    const node = editorEnv.nodes.get(0);
    expect(node).toBeDefined();
    expect(node?.position).toEqual({ _x: 400, _y: 300, type: 'int' });
    expect(node?.nodeType.id).toEqual(NodeTypes.O_LED_RED);
    expect(node?.nodeType.connectionSlot.length).toBe(1);
    expect(node?.nodeType.connectionSlot[0].in).toBe(true);
  });
  test('Movimentar nó (delta)', () => {
    const node = editorEnv.nodes.get(0);
    expect(node).toBeDefined();
    node!.move(new Vector2i(100, 100), true);
    expect(node!.position).toEqual({ _x: 500, _y: 400, type: 'int' });
  });
  test('Movimentar nó (absoluto)', () => {
    const node = editorEnv.nodes.get(0);
    expect(node).toBeDefined();
    node!.move(new Vector2i(100, 100), false);
    expect(node!.position).toEqual({ _x: 100, _y: 100, type: 'int' });
  });
  test('Eventos de selecionar e desselecionar um nó', () => {
    const node = editorEnv.nodes.get(0);
    expect(node).toBeDefined();
    expect(node!.onEvent(EditorEvents.FOCUS_IN)).toBe(true);
    expect(node!.selected).toBe(true);
    expect(node!.onEvent(EditorEvents.FOCUS_OUT)).toBe(true);
    expect(node!.selected).toBe(false);
  });
  test('Não disparar nenhum evento caso não seja definido', () => {
    const node = editorEnv.nodes.get(0);
    expect(node).toBeDefined();
    expect(node!.onEvent(EditorEvents.KEY_RELEASED)).toBe(false);
  });
  test('Conversão do nó para objeto plano', () => {
    const node = editorEnv.nodes.get(0);
    expect(node).toBeDefined();
    expect(node!.toObject()).toEqual({
      id: 0,
      componentType: ComponentType.OUTPUT,
      nodeType: NodeTypes.O_LED_RED,
      position: { x: 400, y: 300 },
      slotIds: [1],
      state: false,
    });
  });
});

describe('Testes da classe SegmentsOutput', () => {
  beforeEach(() => {
    editorEnv = new EditorEnvironment('7d918d4f-d937-4daa-af88-43712ecb6139', 'test-mode', 0, images);
    expect(newOutput(NodeTypes.O_7_SEGMENTS)).toBe(0);
  });
  test('Criar um SegmentsOutput', () => {
    const node = editorEnv.nodes.get(0);
    expect(node).toBeDefined();
    expect(node?.position).toEqual({ _x: 400, _y: 300, type: 'int' });
    expect(node?.nodeType.id).toEqual(NodeTypes.O_7_SEGMENTS);
    expect(node?.nodeType.connectionSlot.length).toBe(7);
    for (let i = 0; i < 7; i++) {
      expect(node?.nodeType.connectionSlot[i].in).toBe(true);
    }
  });
  test('Movimentar nó (delta)', () => {
    const node = editorEnv.nodes.get(0);
    expect(node).toBeDefined();
    node!.move(new Vector2i(100, 100), true);
    expect(node!.position).toEqual({ _x: 500, _y: 400, type: 'int' });
  });
  test('Movimentar nó (absoluto)', () => {
    const node = editorEnv.nodes.get(0);
    expect(node).toBeDefined();
    node!.move(new Vector2i(100, 100), false);
    expect(node!.position).toEqual({ _x: 100, _y: 100, type: 'int' });
  });
  test('Eventos de selecionar e desselecionar um nó', () => {
    const node = editorEnv.nodes.get(0);
    expect(node).toBeDefined();
    expect(node!.onEvent(EditorEvents.FOCUS_IN)).toBe(true);
    expect(node!.selected).toBe(true);
    expect(node!.onEvent(EditorEvents.FOCUS_OUT)).toBe(true);
    expect(node!.selected).toBe(false);
  });
  test('Não disparar nenhum evento caso não seja definido', () => {
    const node = editorEnv.nodes.get(0);
    expect(node).toBeDefined();
    expect(node!.onEvent(EditorEvents.KEY_RELEASED)).toBe(false);
  });
  test('Conversão do nó para objeto plano', () => {
    const node = editorEnv.nodes.get(0);
    expect(node).toBeDefined();
    expect(node!.toObject()).toEqual({
      id: 0,
      componentType: ComponentType.OUTPUT,
      nodeType: NodeTypes.O_7_SEGMENTS,
      position: { x: 400, y: 300 },
      slotIds: [1, 2, 3, 4, 5, 6, 7],
      state: false,
    });
  });
});
