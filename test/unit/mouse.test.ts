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
    Vector2i.copy(new Vector2i(100, 100), mouse.position);
    expect(mouse.dragged).toBe(false);
    mouse.clicked = true;
    Vector2i.add(mouse.position, new Vector2i(7, 6), mouse.position);
    expect(mouse.dragged).toBe(true);
  });
  test('Arrastar o mouse enquanto pressionado (NE)', () => {
    Vector2i.copy(new Vector2i(100, 100), mouse.position);
    expect(mouse.dragged).toBe(false);
    mouse.clicked = true;
    Vector2i.add(mouse.position, new Vector2i(6, -7), mouse.position);
    expect(mouse.dragged).toBe(true);
  });
  test('Arrastar o mouse enquanto pressionado (NO)', () => {
    Vector2i.copy(new Vector2i(100, 100), mouse.position);
    expect(mouse.dragged).toBe(false);
    mouse.clicked = true;
    Vector2i.add(mouse.position, new Vector2i(-7, -6), mouse.position);
    expect(mouse.dragged).toBe(true);
  });
  test('Arrastar o mouse enquanto pressionado (SO)', () => {
    Vector2i.copy(new Vector2i(100, 100), mouse.position);
    expect(mouse.dragged).toBe(false);
    mouse.clicked = true;
    Vector2i.add(mouse.position, new Vector2i(-6, 7), mouse.position);
    expect(mouse.dragged).toBe(true);
  });
});
