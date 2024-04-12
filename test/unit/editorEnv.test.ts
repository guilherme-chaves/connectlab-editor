import preloadNodeImages from '@connectlab-editor/functions/preloadNodeImages';
import EditorEnvironment, {
  EditorEnvironmentObject,
} from '@connectlab-editor/environment';
import {
  addConnection,
  addNode,
  addText,
} from '../../src/functions/component/addComponent';
import {ComponentType, NodeTypes} from '../../src/types/types';

let editorEnv: EditorEnvironment | undefined;
const canvas = document.createElement('canvas');
canvas.width = 800;
canvas.height = 600;
const ctx = canvas.getContext('2d');

describe('Conjunto de testes com a criação de elementos a partir do ambiente do editor', () => {
  beforeAll(() => {
    editorEnv = new EditorEnvironment('test-mode', 0, preloadNodeImages());
  });
  test('Criar node', () => {
    const nodeId = addNode(
      undefined,
      editorEnv!,
      canvas.width,
      canvas.height,
      NodeTypes.G_AND,
      400,
      300
    );
    expect(nodeId).toBeDefined();
    expect(editorEnv?.nodes.get(nodeId)).toBeDefined();
    expect(editorEnv?.nodes.get(nodeId)?.slots.length).toBe(3);
    expect(nodeId).toBe(0);
  });
  test('Criar texto', () => {
    const textId = addText(
      undefined,
      editorEnv!,
      ctx!,
      'Olá mundo!',
      50,
      50,
      undefined
    );
    expect(textId).toBe(4);
    expect(editorEnv?.texts.get(textId)).toBeDefined();
  });
  test('Criar node de entrada', () => {
    const inputId = addNode(
      undefined,
      editorEnv!,
      canvas.width,
      canvas.height,
      NodeTypes.I_SWITCH,
      25,
      80,
      ComponentType.INPUT
    );
    expect(inputId).toBe(5);
    expect(editorEnv?.nodes.get(inputId)).toBeDefined();
    expect(editorEnv?.nodes.get(inputId)!.slots.length).toBe(1);
  });
  test('Criar conexão entre dois nodes', () => {
    const slot1Pos = editorEnv!.nodes.get(5)!.slots[0].position;
    const slot2Pos = editorEnv!.nodes.get(0)!.slots[0].position;
    const connectionId = addConnection(
      undefined,
      editorEnv!,
      slot1Pos.x,
      slot1Pos.y,
      slot2Pos.x,
      slot2Pos.y,
      {nodeId: 5, slotId: 6},
      {nodeId: 0, slotId: 1}
    );
    expect(connectionId).toBe(7);
    expect(editorEnv?.connections.get(connectionId)).toBeDefined();
  });
  test('Salvar ambiente em objeto', () => {
    const envObject = editorEnv!.saveAsJson();
    expect(envObject).toBeInstanceOf<string>;
    expect(envObject.length).toBeGreaterThan(0);
    expect(JSON.parse(envObject)).toBeInstanceOf<EditorEnvironmentObject>;
  });
  test('Carregar um novo ambiente a partir de um objeto', () => {
    const envObject = editorEnv!.saveAsJson();
    const editorEnv2 = 
  });
});
