import Mouse from '@connectlab-editor/types/mouse';
import Vector2i from '@connectlab-editor/types/vector2i';
import { describe, test, expect, beforeEach } from 'vitest';

let mouse = new Mouse();

describe('Testes da classe Mouse', () => {
  beforeEach(() => {
    mouse = new Mouse();
  });
  test('Botão do mouse pressionado', () => {
    expect(mouse.clicked).toBe(false);
    mouse.clicked = true;
    expect(mouse.clicked).toBe(true);
    expect(mouse.stateChanged).toBe(true);
    expect(mouse.clickStartPosition).toEqual(mouse.position);
  });
  test('Botão do mouse liberado', () => {
    mouse.clicked = false;
    expect(mouse.clicked).toBe(false);
    expect(mouse.stateChanged).toBe(true);
  });
  test('Arrastar o mouse enquanto pressionado (SE)', () => {
    mouse.position.copy(new Vector2i(100, 100));
    expect(mouse.dragged).toBe(false);
    mouse.clicked = true;
    mouse.position.add(new Vector2i(7, 6));
    expect(mouse.dragged).toBe(true);
  });
  test('Arrastar o mouse enquanto pressionado (NE)', () => {
    mouse.position.copy(new Vector2i(100, 100));
    expect(mouse.dragged).toBe(false);
    mouse.clicked = true;
    mouse.position.add(new Vector2i(6, -7));
    expect(mouse.dragged).toBe(true);
  });
  test('Arrastar o mouse enquanto pressionado (NO)', () => {
    mouse.position.copy(new Vector2i(100, 100));
    expect(mouse.dragged).toBe(false);
    mouse.clicked = true;
    mouse.position.add(new Vector2i(-7, -6));
    expect(mouse.dragged).toBe(true);
  });
  test('Arrastar o mouse enquanto pressionado (SO)', () => {
    mouse.position.copy(new Vector2i(100, 100));
    expect(mouse.dragged).toBe(false);
    mouse.clicked = true;
    mouse.position.add(new Vector2i(-6, 7));
    expect(mouse.dragged).toBe(true);
  });
});
