/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { expect, test, beforeEach, describe } from 'vitest';

import Vector2i from '@connectlab-editor/types/vector2i';
import Vector2f from '@connectlab-editor/types/vector2f';

let v1: Vector2i;
let v2: Vector2i;

beforeEach(() => {
  v1 = new Vector2i(3, 3);
  v2 = new Vector2i(2, 2);
});

describe('Teste de operações com vetores', () => {
  test('Criar vetor sem passar parâmetros', () => {
    const a = new Vector2i();
    expect(a).toEqual({ _x: 0, _y: 0, type: 'int' });
  });

  test('Criar vetor passando outro vetor como parâmetro', () => {
    const a = new Vector2i(v1);
    expect(a).toEqual(v1);
    expect(a).not.toBe(v1);
  });

  test('Criar vetor passando dois números como parâmetros', () => {
    const a = new Vector2i(10.5, 25);
    expect(a).toEqual({ _x: 11, _y: 25, type: 'int' });
  });

  test('Adicionar dois vetores', () => {
    expect(Vector2i.add(v1, v2)).toEqual({ _x: 5, _y: 5, type: 'int' });
  });

  test('Adicionar um valor escalar a um vetor', () => {
    expect(Vector2i.add(v1, 5)).toEqual({ _x: 8, _y: 8, type: 'int' });
  });

  test('Subtrair dois vetores', () => {
    expect(Vector2i.sub(v1, v2)).toEqual({ _x: 1, _y: 1, type: 'int' });
  });

  test('Subtrair um valor escalar de um vetor', () => {
    expect(Vector2i.sub(v1, 5)).toEqual({ _x: -2, _y: -2, type: 'int' });
  });

  test('Multiplicar dois vetores', () => {
    expect(Vector2i.mul(v1, v2)).toEqual({ _x: 6, _y: 6, type: 'int' });
  });

  test('Multiplicar vetor por valor escalar', () => {
    expect(Vector2i.mul(v1, 5)).toEqual({ _x: 15, _y: 15, type: 'int' });
  });

  test('Dividir dois vetores', () => {
    expect(Vector2i.div(v1, v2)).toEqual({ _x: 2, _y: 2, type: 'int' });
  });

  test('Dividir vetor por valor escalar', () => {
    expect(Vector2i.div(v1, 3)).toEqual({ _x: 1, _y: 1, type: 'int' });
  });

  test('Calcular produto escalar entre dois vetores', () => {
    expect(Vector2i.dot(v1, v2)).toBeCloseTo(12);
  });

  test('Calcular o produto vetorial entre dois vetores', () => {
    expect(Vector2i.cross(v1, v2)).toBeCloseTo(0);
  });

  test('Calcular o comprimento de um vetor', () => {
    expect(Vector2i.len(v1)).toBeCloseTo(Math.sqrt(18));
  });

  test('Calcular a interpolação linear entre dois vetores', () => {
    expect(Vector2i.lerp(new Vector2i(4, 4), v2, 0.5)).toEqual(
      { _x: 3, _y: 3, type: 'int' },
    );
  });

  test('Calcular a interpolação bilinear entre dois vetores', () => {
    expect(
      Vector2i.bilinear(
        new Vector2i(),
        new Vector2i(10, 10),
        new Vector2f(0.7, 0.3),
      ),
    ).toEqual({ _x: 7, _y: 3, type: 'int' });
  });

  test('Calcular a equalidade entre vetores', () => {
    expect(Vector2i.equals(v1, v2)).toBe(false);
    expect(Vector2i.equals(new Vector2i(3, 3), v1)).toBe(true);
  });

  test('Calcular o mínimo entre dois vetores', () => {
    expect(Vector2i.min(new Vector2i(3, 0), new Vector2i(2, 5))).toEqual(
      { _x: 2, _y: 0, type: 'int' },
    );
  });

  test('Calcular o máximo entre dois vetores', () => {
    expect(Vector2i.max(new Vector2i(3, 0), new Vector2i(2, 5))).toEqual(
      { _x: 3, _y: 5, type: 'int' },
    );
  });

  test('Rotacionar vetor', () => {
    expect(Vector2i.rotate(v1, Math.PI)).toEqual({
      type: 'int',
      _x: -3,
      _y: -3,
    });
  });

  test('Calcular ângulo do vetor entre dois vetores', () => {
    expect(Vector2i.atan2(v2, v1)).toBeCloseTo(Math.PI / 4);
  });

  test('Normalizar vetor', () => {
    expect(Vector2i.normalize(new Vector2i(3, 4))).toEqual({
      type: 'float',
      _x: expect.closeTo(3 / 5),
      _y: expect.closeTo(4 / 5),
    });
  });

  test('Obter vetor em valores absolutos', () => {
    expect(Vector2i.abs(new Vector2i(-3, -76.2312))).toEqual({
      type: 'int',
      _x: 3,
      _y: 76,
    });
  });

  test('Copiar valores de um vetor', () => {
    Vector2i.copy(v1, v2);
    expect(v2).toEqual(v1);
    expect(v2).not.toBe(v1); // Não deve ser o mesmo objeto
  });

  test('Clonar vetor para um novo objeto', () => {
    const a = new Vector2i(1.5, 1.5);
    const b = a.clone();
    expect(b).toEqual(a);
    expect(b).not.toBe(a); // Não deve ser o mesmo objeto
  });

  test('Adicionar vetor A ao produto do vetor B com o valor escalar S', () => {
    expect(
      Vector2i.madd(v1, v2, 10),
    ).toEqual({ _x: 23, _y: 23, type: 'int' });
  });
});
