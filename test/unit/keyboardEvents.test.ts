import Editor from '@connectlab-editor/editor';
import { NodeTypes } from '@connectlab-editor/types/enums';
import Vector2i from '@connectlab-editor/types/vector2i';
import { describe, test, expect } from 'vitest';

const canvas = document.createElement('canvas');
canvas.id = 'canvas-el';
const canvasBg = document.createElement('canvas');
canvasBg.id = 'canvas-bg-el';
const editor = new Editor('test-env', 'Teste', canvas, canvasBg, 60);

describe('Testes da classe KeyboardEvents', () => {
  test('Adicionar nó ao pressionar uma tecla', () => {
    editor.keyboard.setKeyPressed('a', true);
    editor.keyboardEvents.onKeyDown(editor);
    expect(editor.keyboard.keyPressed).toBe(true);
    expect(editor.keyboard.getKeysPressed()['a']).toBe(true);
    const andNode = editor.editorEnv.nodes.get(0);
    expect(andNode).toBeDefined();
    expect(andNode!.nodeType.id).toBe(NodeTypes.G_AND);
    editor.keyboard.setKeyPressed('a', false);
    editor.keyboardEvents.onKeyUp();
  });
  test('Remover nó ao pressionar a tecla Delete', () => {
    editor.mouse.clicked = true;
    editor.mouse.position.add(Vector2i.ONE);
    editor.mouseEvents.onMouseClick(editor.editorEnv);
    editor.keyboard.setKeyPressed('Delete', true);
    editor.keyboardEvents.onKeyDown(editor);
    expect(editor.keyboard.keyPressed).toBe(true);
    expect(editor.keyboard.getKeysPressed()['Delete']).toBe(true);
    const andNode = editor.editorEnv.nodes.get(0);
    expect(andNode).toBeUndefined();
    editor.keyboard.setKeyPressed('Delete', false);
    editor.keyboardEvents.onKeyUp();
  });
});
