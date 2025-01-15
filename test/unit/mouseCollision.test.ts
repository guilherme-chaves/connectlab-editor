// eslint-disable-next-line node/no-unpublished-import
import {expect, test, beforeAll, describe} from 'vitest';
import EditorEnvironment from '@connectlab-editor/environment';
import {addComponent} from '@connectlab-editor/functions/addComponent';
import {NodeTypes} from '@connectlab-editor/types/common';
import nodeEvents from '@connectlab-editor/events/nodeEvents';
import Vector2 from '@connectlab-editor/types/vector2';
import slotEvents from '@connectlab-editor/events/slotEvents';
import textEvents from '@connectlab-editor/events/textEvents';
import {connectionEvents} from '@connectlab-editor/events/connectionEvents';

const editorEnv = new EditorEnvironment('test-collision', 0, {});
const canvas = document.createElement('canvas');
canvas.width = 1920;
canvas.height = 1080;
const ctx = canvas.getContext('2d');

describe('Testes de detecção de colisão entre o mouse e componentes', () => {
  beforeAll(() => {
    addComponent.node(
      undefined,
      editorEnv,
      canvas.width,
      canvas.height,
      NodeTypes.G_NOR,
      674,
      328
    );
    addComponent.input(
      undefined,
      editorEnv,
      canvas.width,
      canvas.height,
      NodeTypes.I_SWITCH,
      200,
      439
    );
    addComponent.text(undefined, editorEnv, ctx!, 'Olá mundo!', 1400, 900);
    addComponent.connection(
      undefined,
      editorEnv,
      220,
      414,
      624,
      293,
      {nodeId: 4, slotId: 5},
      {nodeId: 0, slotId: 1}
    );
  });
  test('Colisão do mouse com um node', () => {
    const collisions = nodeEvents.checkNodeClick(
      editorEnv.nodes,
      new Vector2(300, 200)
    );
    const collisions2 = nodeEvents.checkNodeClick(
      editorEnv.nodes,
      new Vector2(685, 340)
    );
    const collisions3 = nodeEvents.checkNodeClick(
      editorEnv.nodes,
      new Vector2(230, 460)
    );
    expect(collisions).toEqual([]);
    expect(collisions2).toEqual([0]);
    expect(collisions3).toEqual([4]);
  });
  test('Colisão do mouse com um slot', () => {
    const collisions = slotEvents.checkSlotClick(
      editorEnv.slots,
      new Vector2(540, 50)
    );
    const collisions2 = slotEvents.checkSlotClick(
      editorEnv.slots,
      new Vector2(220, 414)
    );
    expect(collisions).toEqual([]);
    expect(collisions2).toEqual([5]);
  });
  test('Colisão do mouse com uma caixa de texto', () => {
    const collisions = textEvents.checkTextClick(
      editorEnv.texts,
      new Vector2(10, 10)
    );
    const collisions2 = textEvents.checkTextClick(
      editorEnv.texts,
      new Vector2(1400, 900)
    );
    expect(collisions).toEqual([]);
    expect(collisions2).toEqual([6]);
  });
  test('Colisão do mouse com uma conexão', () => {
    const collisions = connectionEvents.checkConnectionClick(
      editorEnv.connections,
      new Vector2(250, 1000)
    );
    const collisions2 = connectionEvents.checkConnectionClick(
      editorEnv.connections,
      new Vector2(380, 295)
    );
    expect(collisions).toEqual([]);
    expect(collisions2).toEqual([7]);
  });
});
