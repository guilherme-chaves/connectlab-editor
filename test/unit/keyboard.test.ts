import { describe, test, expect } from 'vitest';
import Keyboard from '@connectlab-editor/types/keyboard';

const kbd = new Keyboard();

describe('Testes da classe Keyboard', () => {
  test('Pressionar tecla', () => {
    kbd.setKeyPressed('a', true);
    expect(kbd.getKeysPressed()['a']).toBe(true);
    expect(kbd.nKeysPressed).toBe(1);
  });
  test('Liberar tecla', () => {
    kbd.setKeyPressed('a', false);
    expect(kbd.getKeysPressed()['a']).toBe(false);
    expect(kbd.nKeysPressed).toBe(0);
  });
  test('Liberar tecla não pressionada anteriormente', () => {
    /* Em alguns casos o navegador pode não registrar corretamente
     * um botão pressionado ou liberado, podendo gerar comportamentos
     * não esperados
     */
    expect(kbd.getKeysPressed()['b']).toBeUndefined();
    kbd.setKeyPressed('b', false);
    expect(kbd.getKeysPressed()['b']).toBe(false);
    expect(kbd.nKeysPressed).toBe(0);
  });
});
