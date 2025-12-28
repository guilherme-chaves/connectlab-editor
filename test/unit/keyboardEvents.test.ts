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
    Vector2i.copy(new Vector2i(40, 50), editor.mouse.position);
    editor.keyboard.setKeyState('a', true);
    expect(editor.keyboard.activeKeys.has('a')).toBe(true);
    editor.keyboardEvents.onKeyDown(editor);
    const andNode = editor.editorEnv.nodes.get(0);
    expect(andNode).toBeDefined();
    expect(andNode!.nodeType.id).toBe(NodeTypes.G_AND);
    editor.keyboard.setKeyState('a', false);
    expect(editor.keyboard.activeKeys.has('a')).toBe(false);
  });
  test('Remover nó ao pressionar a tecla Delete', () => {
    Vector2i.add(editor.mouse.position, Vector2i.ONE, editor.mouse.position);
    editor.mouse.clicked = true;
    editor.mouseEvents.onMouseClick(editor.editorEnv);
    editor.keyboard.setKeyState('Delete', true);
    editor.keyboardEvents.onKeyDown(editor);
    expect(editor.keyboard.activeKeys.size).toBe(1);
    expect(editor.keyboard.activeKeys.has('Delete')).toBe(true);
    const andNode = editor.editorEnv.nodes.get(0);
    expect(andNode).toBeUndefined();
    editor.keyboard.setKeyState('Delete', false);
  });
});
