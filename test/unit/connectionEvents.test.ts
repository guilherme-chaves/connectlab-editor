// eslint-disable-next-line node/no-unpublished-import
import {expect, test, beforeAll, describe} from '@jest/globals';
import {addComponent} from '@connectlab-editor/functions/addComponent';
import EditorEnvironment from '@connectlab-editor/environment';
import preloadNodeImages from '@connectlab-editor/functions/preloadNodeImages';
import {NodeTypes} from '@connectlab-editor/types';
import Mouse from '@connectlab-editor/types/Mouse';
import MouseEvents from '@connectlab-editor/events/mouseEvents';
import {connectionEvents} from '@connectlab-editor/events/connectionEvents';
import Vector2 from '@connectlab-editor/types/Vector2';

let editorEnv: EditorEnvironment;
// let inputId: number;
let connectionId: number;
let connectionId2: number;
// let outputId: number;
let mouse: Mouse;
let mouseEvents: MouseEvents;

describe('Testes dos eventos relacionados à conexões', () => {
  beforeAll(() => {
    editorEnv = new EditorEnvironment('test-mode', 0, preloadNodeImages());
    mouse = new Mouse();
    mouseEvents = new MouseEvents(mouse);
    addComponent.input(
      undefined,
      editorEnv,
      800,
      600,
      NodeTypes.I_SWITCH,
      100,
      300
    );
    addComponent.output(
      undefined,
      editorEnv,
      800,
      600,
      NodeTypes.O_LED_RED,
      700,
      300
    );
    addComponent.input(
      undefined,
      editorEnv,
      800,
      600,
      NodeTypes.I_SWITCH,
      300,
      100
    );
    addComponent.output(
      undefined,
      editorEnv,
      800,
      600,
      NodeTypes.O_LED_RED,
      400,
      500
    );
    connectionId = addComponent.connection(
      undefined,
      editorEnv,
      170,
      325,
      723,
      364,
      {nodeId: 0, slotId: 1},
      {nodeId: 2, slotId: 3}
    );
    connectionId2 = addComponent.connection(
      undefined,
      editorEnv,
      editorEnv.slots.get(5)!.globalPosition.x,
      editorEnv.slots.get(5)!.globalPosition.y,
      editorEnv.slots.get(7)!.globalPosition.x,
      editorEnv.slots.get(7)!.globalPosition.y,
      {nodeId: 4, slotId: 5},
      {nodeId: 6, slotId: 7}
    );
  });

  test('Movimentar linha', () => {
    connectionEvents.editingLine = true;
    connectionEvents.editingLineId = connectionId;
    connectionEvents.lineStartSlot = 1;
    expect(
      connectionEvents.move(editorEnv, mouseEvents, new Vector2(700, 250))
    ).toBe(true);
    expect(editorEnv.connections.get(connectionId)!.endPosition).toEqual({
      _x: 700,
      _y: 250,
      useInt: true,
    });
  });

  test('Não movimentar a conexão quando o mouse estiver em outro estado', () => {
    mouseEvents.movingObject = 'node';
    expect(
      connectionEvents.move(editorEnv, mouseEvents, new Vector2(800, 400))
    ).toBe(false);
    expect(editorEnv.connections.get(connectionId)!.endPosition).toEqual({
      _x: 700,
      _y: 250,
      useInt: true,
    });
  });

  test('Não movimentar se a conexão não existir', () => {
    mouseEvents.movingObject = 'none';
    connectionEvents.editingLineId = 70;
    expect(
      connectionEvents.move(editorEnv, mouseEvents, new Vector2(800, 400))
    ).toBe(false);
  });

  test('Adicionar nova linha quando houver colisão com um slot', () => {
    connectionEvents.resetConnEventParams();
    mouse.position = editorEnv.slots.get(1)!.globalPosition;
    mouse.clicked = true;

    mouseEvents.onMouseClick(editorEnv);
    connectionEvents.resetConnEventParams();
    expect(connectionEvents.addLine(editorEnv, mouseEvents)).toBe(true);
  });

  test('Não adicionar nova linha quando não houver colisão com um slot', () => {
    connectionEvents.resetConnEventParams();
    mouse.position = new Vector2();
    mouse.clicked = true;

    mouseEvents.onMouseClick(editorEnv);
    connectionEvents.resetConnEventParams();
    expect(connectionEvents.addLine(editorEnv, mouseEvents)).toBe(false);
  });

  test('Fixar conexão com em um slot', () => {
    connectionEvents.resetConnEventParams();
    connectionEvents.editingLine = true;
    connectionEvents.lineStartSlot = 1;
    connectionEvents.editingLineId = connectionId;
    connectionEvents.slotCollision = 3;
    expect(
      connectionEvents.fixLine(
        editorEnv,
        editorEnv.slots.get(3)!.globalPosition
      )
    ).toBe(true);
  });

  test('Não fixar linha se não houver colisão com um slot', () => {
    connectionEvents.editingLineId = connectionId;
    connectionEvents.editingLine = true;
    expect(connectionEvents.fixLine(editorEnv, new Vector2())).toBe(false);
    expect(editorEnv.connections.get(connectionId)).toBeUndefined();
  });

  test('Não fixar linha se os slots inicial e final forem o mesmo', () => {
    connectionEvents.lineStartSlot = 5;
    connectionEvents.editingLineId = connectionId2;
    connectionEvents.editingLine = true;
    connectionEvents.slotCollision = 5;
    expect(
      connectionEvents.fixLine(
        editorEnv,
        editorEnv.slots.get(5)!.globalPosition
      )
    ).toBe(false);
    expect(editorEnv.connections.get(connectionId2)).toBeUndefined();
  });

  test('Não fixar linha se não estiver editando uma linha', () => {
    expect(connectionEvents.fixLine(editorEnv, new Vector2())).toBe(false);
  });
});
