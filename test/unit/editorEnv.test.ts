// eslint-disable-next-line node/no-unpublished-import
import {expect, test, beforeAll, describe, vi} from 'vitest';
import preloadNodeImages from '@connectlab-editor/functions/preloadNodeImages';
import EditorEnvironment from '@connectlab-editor/environment';
import addComponent from '../../src/functions/component/addComponent';
import {ComponentType, NodeTypes} from '../../src/types/enums';

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
    const nodeId = addComponent.node(
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
    const textId = addComponent.text(
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
    const inputId = addComponent.node(
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
    const connectionId = addComponent.connection(
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
    expect(envObject.length).toBeGreaterThan(0);
    expect(JSON.parse(envObject)).toHaveProperty('id', 'test-mode');
  });
  test('Carregar um novo ambiente a partir de um objeto', () => {
    vi.spyOn(window, 'structuredClone').mockImplementation(() => 'mocked');
    const envObject = editorEnv!.saveAsJson();
    const editorEnv2 = EditorEnvironment.createFromJson(
      JSON.parse(envObject),
      ctx!,
      editorEnv!.nodeImageList
    );
    expect(editorEnv2).toBeDefined();
    // TODO - Verificações das listas e do grafo de sinal
    expect(editorEnv2.signalGraph).toEqual(editorEnv!.signalGraph);
    expect(editorEnv2.documentId).toBe(editorEnv!.documentId);
    expect(editorEnv2.nextComponentId).toBe(editorEnv!.nextComponentId);
    // expectTypeOf(editorEnv2.nodes.get(0)!).toEqualTypeOf<Node>();
    expect(editorEnv2.slots.get(1)).toBeDefined();
    expect(editorEnv2.connections.get(7)).toBeDefined();
  });
  test('Obter o ID do ambiente do editor', () => {
    expect(editorEnv?.getDocumentId()).toBe('test-mode');
  });
  test('Remover conexão do editor', () => {
    expect(editorEnv?.removeComponent(7, ComponentType.LINE)).toBe(true);
    expect(editorEnv?.removeComponent(19, ComponentType.LINE)).toBe(false);
  });
  test('Remover nó do editor', () => {
    expect(editorEnv?.removeComponent(0, ComponentType.NODE)).toBe(true);
    expect(editorEnv?.removeComponent(50, ComponentType.NODE)).toBe(false);
  });
  test('Remover caixa de texto do editor', () => {
    expect(editorEnv?.removeComponent(4, ComponentType.TEXT)).toBe(true);
  });
  test('Remover um componente sem indicar o tipo', () => {
    expect(editorEnv?.removeComponent(5)).toBe(true);
    expect(editorEnv?.removeComponent(70)).toBe(false);
  });
});
