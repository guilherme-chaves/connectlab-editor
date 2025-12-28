import { describe, test, expect } from 'vitest';
import Keyboard from '@connectlab-editor/types/keyboard';

const kbd = new Keyboard();

describe('Testes da classe Keyboard', () => {
  test('Pressionar tecla', () => {
    kbd.setKeyState('a', true);
    expect(kbd.activeKeys.has('a')).toBe(true);
    expect(kbd.activeKeys.size).toBe(1);
  });
  test('Liberar tecla', () => {
    kbd.setKeyState('a', false);
    expect(kbd.activeKeys.has('a')).toBe(false);
    expect(kbd.activeKeys.size).toBe(0);
  });
  test('Liberar tecla não pressionada anteriormente', () => {
    /* Em alguns casos o navegador pode não registrar corretamente
     * um botão pressionado ou liberado, podendo gerar comportamentos
     * não esperados
     */
    expect(kbd.activeKeys.has('b')).toBe(false);
    expect(kbd.activeKeys.size).toBe(0);
    kbd.setKeyState('b', true);
    expect(kbd.activeKeys.has('b')).toBe(true);
    expect(kbd.activeKeys.size).toBe(1);
  });
});
