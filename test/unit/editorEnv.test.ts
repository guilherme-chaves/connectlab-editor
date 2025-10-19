import { expect, test, beforeEach, describe, vi } from 'vitest';
import preloadNodeImages from '@connectlab-editor/functions/preloadNodeImages';
import EditorEnvironment from '@connectlab-editor/environment';
import addComponent from '@connectlab-editor/functions/addComponent';
import { ComponentType, NodeTypes } from '@connectlab-editor/types/enums';
import { fileValidator } from '@connectlab-editor/types/file';
import Vector2i from '@connectlab-editor/types/vector2i';

const images = preloadNodeImages();
let editorEnv = new EditorEnvironment('test-mode', 0, images);
const canvas = document.createElement('canvas');
canvas.width = 800;
canvas.height = 600;
const ctx = canvas.getContext('2d');

const newNode = () => {
  return addComponent.node(
    undefined,
    editorEnv,
    canvas.width,
    canvas.height,
    NodeTypes.G_AND,
    400,
    300,
  );
};

const newInput = () => {
  return addComponent.input(
    undefined,
    editorEnv,
    canvas.width,
    canvas.height,
    NodeTypes.I_SWITCH,
    25,
    80,
  );
};

const newText = () => {
  return addComponent.text(
    undefined,
    editorEnv,
    ctx!,
    'Olá mundo!',
    50,
    50,
    undefined,
  );
};

const newConnection = () => {
  const slot1Pos = editorEnv.nodes.get(4)!.slots[0].position;
  const slot2Pos = editorEnv.nodes.get(0)!.slots[0].position;
  return addComponent.connection(
    undefined,
    editorEnv,
    slot1Pos.x,
    slot1Pos.y,
    slot2Pos.x,
    slot2Pos.y,
    { nodeId: 4, slotId: 5 },
    { nodeId: 0, slotId: 1 },
  );
};

describe(
  'Conjunto de testes de criação de elementos a partir do ambiente do editor',
  () => {
    beforeEach(() => {
      editorEnv = new EditorEnvironment('test-mode', 0, images);
    });
    test('Criar node', () => {
      const nodeId = newNode();
      expect(nodeId).toBeDefined();
      expect(editorEnv?.nodes.get(nodeId)).toBeDefined();
      expect(editorEnv?.nodes.get(nodeId)?.slots.length).toBe(3);
      expect(nodeId).toBe(0);
    });
    test('Criar texto', () => {
      const textId = newText();
      expect(textId).toBe(0);
      expect(editorEnv.texts.get(textId)).toBeDefined();
      expect(editorEnv.texts.get(textId)!.text).toBe('Olá mundo!');
      expect(editorEnv.texts.get(textId)!.position)
        .toEqual(new Vector2i(42, 42));
    });
    test('Criar node de entrada', () => {
      const inputId = newInput();
      expect(inputId).toBe(0);
      expect(editorEnv.nodes.get(inputId)).toBeDefined();
      expect(editorEnv.nodes.get(inputId)!.slots.length).toBe(1);
    });
    test('Criar conexão entre dois nodes', () => {
      newNode();
      newInput();
      const connectionId = newConnection();
      expect(connectionId).toBe(6);
      expect(editorEnv?.connections.get(connectionId)).toBeDefined();
    });
    test('Salvar ambiente em objeto', () => {
      const envObject = editorEnv.saveAsJson();
      expect(envObject.length).toBeGreaterThan(0);
      expect(envObject.indexOf('{')).toBe(0);
      expect(envObject.indexOf('}')).toBeGreaterThan(1);
    });
    test('Carregar um novo ambiente a partir de um objeto', () => {
      vi.spyOn(window, 'structuredClone').mockImplementation(() => 'mocked');
      newNode();
      newInput();
      newConnection();
      newText();
      const envObject = editorEnv.saveAsJson();
      const envJSON: unknown = JSON.parse(envObject);
      if (fileValidator(envJSON)) {
        const editorEnv2 = EditorEnvironment.createFromJson(
          envJSON,
          ctx!,
          editorEnv.nodeImageList,
        );
        expect(editorEnv2.signalGraph).toEqual(editorEnv.signalGraph);
        expect(editorEnv2.documentId).toBe(editorEnv.documentId);
        expect(editorEnv2.nextComponentId).toBe(editorEnv.nextComponentId);
      }
      else {
        console.log(fileValidator.errors);
        expect(fileValidator(envJSON)).toBe(true);
      }
    });
    test('Obter o ID do ambiente do editor', () => {
      expect(editorEnv.getDocumentId()).toBe('test-mode');
    });
    test('Remover conexão do editor', () => {
      newNode();
      newInput();
      newConnection();
      newText();
      expect(editorEnv.removeComponent(6, ComponentType.LINE)).toBe(true);
      expect(editorEnv.removeComponent(19, ComponentType.LINE)).toBe(false);
    });
    test('Remover nó do editor', () => {
      newNode();
      expect(editorEnv.removeComponent(0, ComponentType.NODE)).toBe(true);
      expect(editorEnv.removeComponent(50, ComponentType.NODE)).toBe(false);
    });
    test('Remover caixa de texto do editor', () => {
      newNode();
      newInput();
      newConnection();
      newText();
      expect(editorEnv.removeComponent(7, ComponentType.TEXT)).toBe(true);
    });
    test('Remover um componente sem indicar o tipo', () => {
      newNode();
      newInput();
      newConnection();
      newText();
      expect(editorEnv.removeComponent(7)).toBe(true);
      expect(editorEnv.removeComponent(70)).toBe(false);
    });
  },
);
