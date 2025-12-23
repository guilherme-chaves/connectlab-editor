import { describe, test, expect, beforeAll } from 'vitest';
import Mouse from '@connectlab-editor/types/mouse';
import MouseEvents from '@connectlab-editor/events/mouseEvents';
import Vector2i from '@connectlab-editor/types/vector2i';
import EditorEnvironment from '@connectlab-editor/environment';
import preloadNodeImages from '@connectlab-editor/functions/preloadNodeImages';
import addComponent from '@connectlab-editor/functions/addComponent';
import { NodeTypes } from '@connectlab-editor/types/enums';
import { beforeEach } from 'node:test';
import { ConnectionEvents } from '@connectlab-editor/events/connectionEvents';

const images = preloadNodeImages();
const editorEnv = new EditorEnvironment('test-env', 'Teste', 0, images);
const canvas = document.createElement('canvas');
canvas.width = 800;
canvas.height = 600;
const ctx = canvas.getContext('2d');
const mouse = new Mouse();
const mouseEvents = new MouseEvents(mouse);

const newNode = (t: NodeTypes, x: number, y: number) => {
  return addComponent.node(
    undefined,
    editorEnv,
    canvas.width,
    canvas.height,
    t,
    x,
    y,
    undefined,
    false,
  );
};

const newConnection = (slotStartId: number, slotEndId: number) => {
  const slotStart = editorEnv.slots.get(slotStartId)!;
  const slotEnd = editorEnv.slots.get(slotEndId)!;
  return addComponent.connection(
    undefined,
    editorEnv,
    slotStart.globalPosition.x,
    slotStart.globalPosition.y,
    slotEnd.globalPosition.x,
    slotEnd.globalPosition.y,
    { nodeId: slotStart.parent.id, slotId: slotStart.id },
    { nodeId: slotEnd.parent.id, slotId: slotEnd.id },
  );
};

const newText = (x: number, y: number) => {
  return addComponent.text(
    undefined,
    editorEnv,
    ctx!,
    'Olá mundo!',
    x,
    y,
  );
};

describe('Testes de eventos do mouse', () => {
  beforeAll(() => {
    expect(newNode(NodeTypes.G_NOT, 300, 300)).not.toBe(-1);
    expect(newNode(NodeTypes.G_AND, 500, 600)).not.toBe(-1);
    expect(newNode(NodeTypes.G_NOR, 120, 1000)).not.toBe(-1);
    expect(newConnection(2, 4)).not.toBe(-1);
    expect(newText(1000, 1000)).not.toBe(-1);
  });
  beforeEach(() => {
    mouse.clicked = false;
    mouse.stateChanged = false;
  });
  test('Clique do mouse em uma área sem colisões', () => {
    mouse.position.copy(new Vector2i(150, 150));
    mouse.clicked = true;
    mouseEvents.onMouseClick(editorEnv);
    expect(mouseEvents.getCollisionList().nodes).toEqual([]);
    expect(mouse.stateChanged).toBe(false);
  });
  test('Clique do mouse em cima de um nó', () => {
    mouse.position.copy(new Vector2i(505, 605));
    mouse.clicked = true;
    mouseEvents.onMouseClick(editorEnv);
    expect(mouseEvents.getCollisionList().nodes).toEqual([3]);
    expect(editorEnv.nodes.get(3)!.selected).toBe(true);
    expect(mouse.stateChanged).toBe(false);
  });
  test('Clique do mouse em cima de um slot', () => {
    mouse.position.copy(new Vector2i(295, 326));
    mouse.clicked = true;
    mouseEvents.onMouseClick(editorEnv);
    expect(mouseEvents.getCollisionList().slots).toEqual([1]);
    expect(editorEnv.slots.get(1)!.selected).toBe(true);
    expect(mouse.stateChanged).toBe(false);
  });
  test('Clique do mouse em cima de uma caixa de texto', () => {
    mouse.position.copy(new Vector2i(1000, 1000));
    mouse.clicked = true;
    mouseEvents.onMouseClick(editorEnv);
    expect(mouseEvents.getCollisionList().texts).toEqual([12]);
    expect(editorEnv.texts.get(12)!.selected).toBe(true);
    expect(mouse.stateChanged).toBe(false);
  });
  test('Movimentar o mouse sem estar pressionado', () => {
    ConnectionEvents.reset();
    MouseEvents.movingObject = 'none';
    expect(mouseEvents.onMouseMove(editorEnv)).toBe(false);
  });
  test('Movimentar o mouse dentro do limite de detecção de arrasto', () => {
    ConnectionEvents.reset();
    MouseEvents.movingObject = 'none';
    mouse.position.copy(new Vector2i(505, 605));
    mouse.clicked = true;
    mouse.position.add(Vector2i.ONE);
    expect(mouseEvents.onMouseMove(editorEnv)).toBe(false);
  });
  test('Movimentar o mouse além do limite de detecção de arrasto', () => {
    ConnectionEvents.reset();
    MouseEvents.movingObject = 'none';
    mouse.position.copy(new Vector2i(505, 605));
    mouse.clicked = true;
    mouseEvents.onMouseClick(editorEnv);
    mouse.position.add(100);
    expect(mouseEvents.onMouseMove(editorEnv)).toBe(true);
    expect(editorEnv.nodes.get(3)?.position).toEqual(
      { _x: 605, _y: 705, type: 'int' },
    );
  });
  test('Movimentar uma caixa de texto', () => {
    ConnectionEvents.reset();
    MouseEvents.movingObject = 'none';
    mouse.position.copy(new Vector2i(1000, 1000));
    mouse.clicked = true;
    mouseEvents.onMouseClick(editorEnv);
    mouse.position.add(100);
    expect(mouseEvents.onMouseMove(editorEnv)).toBe(true);
    expect(editorEnv.texts.get(12)!.position).toEqual(
      { _x: 1092, _y: 1092, type: 'int' },
    );
    expect(MouseEvents.movingObject).toBe('text');
  });
  test('Liberar o botão do mouse', () => {
    ConnectionEvents.reset();
    MouseEvents.movingObject = 'none';
    mouse.position.copy(new Vector2i(302, 302));
    mouse.clicked = true;
    mouseEvents.onMouseClick(editorEnv);
    mouse.position.copy(new Vector2i(400, 400));
    expect(mouseEvents.onMouseMove(editorEnv)).toBe(true);
    expect(MouseEvents.movingObject).toBe('node');
    mouse.clicked = false;
    mouseEvents.onMouseRelease(editorEnv);
    expect(MouseEvents.movingObject).toBe('none');
  });
});
