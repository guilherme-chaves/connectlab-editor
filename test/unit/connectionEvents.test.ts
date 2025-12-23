import { expect, test, beforeAll, describe, beforeEach } from 'vitest';
import addComponent from '@connectlab-editor/functions/addComponent';
import EditorEnvironment from '@connectlab-editor/environment';
import preloadNodeImages from '@connectlab-editor/functions/preloadNodeImages';
import { NodeTypes } from '@connectlab-editor/types/enums';
import Mouse from '@connectlab-editor/types/mouse';
import MouseEvents from '@connectlab-editor/events/mouseEvents';
import { ConnectionEvents } from '@connectlab-editor/events/connectionEvents';
import Vector2i from '@connectlab-editor/types/vector2i';
import { MovePointEnum } from '@connectlab-editor/components/connectionComponent';

const editorEnv: EditorEnvironment = new EditorEnvironment(
  '7d918d4f-d937-4daa-af88-43712ecb6139',
  'test',
  undefined,
  preloadNodeImages(),
);
const mouse: Mouse = new Mouse();

describe('Testes dos eventos relacionados à conexões', () => {
  beforeAll(() => {
    addComponent.input(
      undefined,
      editorEnv,
      800,
      600,
      NodeTypes.I_SWITCH,
      100,
      300,
    );
    addComponent.output(
      undefined,
      editorEnv,
      800,
      600,
      NodeTypes.O_LED_RED,
      700,
      300,
    );
    addComponent.input(
      undefined,
      editorEnv,
      800,
      600,
      NodeTypes.I_SWITCH,
      300,
      100,
    );
    addComponent.output(
      undefined,
      editorEnv,
      800,
      600,
      NodeTypes.O_LED_RED,
      400,
      500,
    );
    addComponent.connection(
      undefined,
      editorEnv,
      170,
      325,
      723,
      364,
      { nodeId: 0, slotId: 1 },
      { nodeId: 2, slotId: 3 },
    );
    addComponent.connection(
      undefined,
      editorEnv,
      editorEnv.slots.get(5)!.globalPosition.x,
      editorEnv.slots.get(5)!.globalPosition.y,
      editorEnv.slots.get(7)!.globalPosition.x,
      editorEnv.slots.get(7)!.globalPosition.y,
      { nodeId: 4, slotId: 5 },
      { nodeId: 6, slotId: 7 },
    );
  });
  beforeEach(() => {
    ConnectionEvents.reset();
    expect(ConnectionEvents.editingLine).toBeUndefined();
    expect(ConnectionEvents.movePoint).toBe(-1);
    expect(ConnectionEvents.startSlot).toBeUndefined();
    expect(ConnectionEvents.endSlot).toBeUndefined();
  });
  test('Adicionar uma nova conexão', () => {
    MouseEvents.movingObject = 'none';
    mouse.position = editorEnv.slots.get(1)!.globalPosition.clone();
    expect(ConnectionEvents.newConnection(editorEnv, 1)).toBe(true);
    expect(editorEnv.connections.size).toBe(3);
  });
  test('Adicionar uma nova conexão (slot final)', () => {
    MouseEvents.movingObject = 'none';
    mouse.position = editorEnv.slots.get(3)!.globalPosition.clone();
    expect(ConnectionEvents.newConnection(editorEnv, 3)).toBe(true);
    expect(editorEnv.connections.size).toBe(4);
  });
  test('Mover uma conexão', () => {
    MouseEvents.movingObject = 'none';
    mouse.position = editorEnv.slots.get(1)!.globalPosition.clone();
    expect(ConnectionEvents.newConnection(editorEnv, 1)).toBe(true);
    ConnectionEvents.movePoint = MovePointEnum.END;
    ConnectionEvents.move(editorEnv, new Vector2i(100, 100));
    expect(ConnectionEvents.editingLine!.endPosition).toEqual(
      { _x: 100, _y: 100, type: 'int' },
    );
  });
  test('Não adicionar uma nova conexão caso o ID do slot seja inválido', () => {
    MouseEvents.movingObject = 'none';
    mouse.position = editorEnv.slots.get(1)!.globalPosition.clone();
    expect(ConnectionEvents.newConnection(editorEnv, 0)).toBe(false);
  });
  test('Não adicionar uma nova conexão caso o mouse esteja realizando outra função', () => {
    MouseEvents.movingObject = 'connection';
    mouse.position = editorEnv.slots.get(1)!.globalPosition.clone();
    expect(ConnectionEvents.newConnection(editorEnv, 1)).toBe(false);
  });
  test('Colisão do mouse com uma conexão', () => {
    expect(editorEnv.connections.has(8)).toBe(true);
    mouse.position = editorEnv.connections.get(8)!.position.clone();
    expect(
      ConnectionEvents.checkConnectionClick(
        editorEnv.connections,
        mouse.position,
      ),
    ).toBeOneOf([[8], [8, 10]]);
    mouse.position = new Vector2i(240, 325);
    expect(
      ConnectionEvents.checkConnectionClick(
        editorEnv.connections,
        mouse.position,
      ),
    ).toEqual([8]);
    mouse.position = new Vector2i(240, 315);
    expect(
      ConnectionEvents.checkConnectionClick(
        editorEnv.connections,
        mouse.position,
      ),
    ).toEqual([]);
  });
  test('Fixar uma conexão a dois slots', () => {
    MouseEvents.movingObject = 'none';
    mouse.position = editorEnv.slots.get(1)!.globalPosition.clone();
    ConnectionEvents.newConnection(editorEnv, 1);
    ConnectionEvents.movePoint = MovePointEnum.END;
    ConnectionEvents.move(editorEnv, editorEnv.slots.get(3)!.globalPosition);
    expect(
      ConnectionEvents.bindLine(
        editorEnv,
        editorEnv.slots.get(3)!.globalPosition,
      )).toBe(true);
  });
  test('Não fixar uma conexão a dois slots se forem do mesmo tipo', () => {
    MouseEvents.movingObject = 'none';
    mouse.position = editorEnv.slots.get(1)!.globalPosition.clone();
    ConnectionEvents.newConnection(editorEnv, 1);
    ConnectionEvents.movePoint = MovePointEnum.END;
    ConnectionEvents.move(editorEnv, editorEnv.slots.get(5)!.globalPosition);
    expect(
      ConnectionEvents.bindLine(
        editorEnv,
        editorEnv.slots.get(5)!.globalPosition,
      )).toBe(false);
  });
  test('Não fixar uma conexão se um dos slots não forem definidos', () => {
    expect(ConnectionEvents.setConnectionProps(editorEnv)).toBe(false);
    ConnectionEvents.startSlot = editorEnv.slots.get(1);
    ConnectionEvents.endSlot = editorEnv.slots.get(3);
    expect(ConnectionEvents.setConnectionProps(editorEnv)).toBe(false);
  });
});
