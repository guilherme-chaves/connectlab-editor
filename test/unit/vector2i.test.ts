// eslint-disable-next-line node/no-unpublished-import
import {expect, test, beforeEach, describe} from 'vitest';

import Vector2i from '@connectlab-editor/types/vector2i';
import Vector2f from '@connectlab-editor/types/vector2f';

let v1: Vector2i;
let v2: Vector2i;

beforeEach(() => {
  v1 = new Vector2i(3, 3);
  v2 = new Vector2i(2, 2);
});

describe('Teste de operações com vetores', () => {
  test('Adicionar dois vetores (estático)', () => {
    expect(Vector2i.add(v1, v2)).toEqual(new Vector2i(5, 5));
  });

  test('Adicionar dois vetores (instância)', () => {
    expect(v1.add(v2)).toEqual(new Vector2i(5, 5));
  });

  test('Subtrair dois vetores (estático)', () => {
    expect(Vector2i.sub(v1, v2)).toEqual(new Vector2i(1, 1));
  });

  test('Subtrair dois vetores (instância)', () => {
    expect(v1.sub(v2)).toEqual(new Vector2i(1, 1));
  });

  test('Multiplicar dois vetores (estático)', () => {
    expect(Vector2i.mul(v1, v2)).toEqual(new Vector2i(6, 6));
  });

  test('Multiplicar dois vetores (instância)', () => {
    expect(v1.mul(v2)).toEqual(new Vector2i(6, 6));
  });

  test('Multiplicar vetor por valor escalar (estático)', () => {
    expect(Vector2i.mul(v1, 5)).toEqual(new Vector2i(15, 15));
  });

  test('Multiplicar vetor por valor escalar (instância)', () => {
    expect(v1.mul(5)).toEqual(new Vector2i(15, 15));
  });

  test('Dividir dois vetores (estático)', () => {
    expect(Vector2i.div(v1, v2)).toEqual(new Vector2i(1.5, 1.5));
  });

  test('Dividir dois vetores (instância)', () => {
    expect(v1.div(v2)).toEqual(new Vector2i(1.5, 1.5));
  });

  test('Dividir vetor por valor escalar (estático)', () => {
    expect(Vector2i.div(v1, 3)).toEqual(new Vector2i(1, 1));
  });

  test('Dividir vetor por valor escalar (instância)', () => {
    expect(v1.div(3)).toEqual(new Vector2i(1, 1));
  });

  test('Calcular produto escalar entre dois vetores (estático)', () => {
    expect(Vector2i.dot(v1, v2)).toBeCloseTo(12);
  });

  test('Calcular produto escalar entre dois vetores (instância)', () => {
    expect(v1.dot(v2)).toBeCloseTo(12);
  });

  test('Calcular o produto vetorial entre dois vetores (estático)', () => {
    expect(Vector2i.cross(v1, v2)).toBeCloseTo(0);
  });

  test('Calcular o produto vetorial entre dois vetores (instância)', () => {
    expect(v1.cross(v2)).toBeCloseTo(0);
  });

  test('Calcular o comprimento de um vetor (estático)', () => {
    expect(Vector2i.len(v1)).toBeCloseTo(Math.sqrt(18));
  });

  test('Calcular o comprimento de um vetor (instância)', () => {
    expect(v1.len()).toBeCloseTo(Math.sqrt(18));
  });

  test('Calcular a interpolação linear entre dois vetores (estático)', () => {
    expect(Vector2i.lerp(new Vector2i(4, 4), v2, 0.5)).toEqual(v1);
  });

  test('Calcular a interpolação linear entre dois vetores (instância)', () => {
    expect(new Vector2i(4, 4).lerp(v2, 0.5)).toEqual(v1);
  });

  test('Calcular a interpolação bilinear entre dois vetores (estático)', () => {
    expect(
      Vector2i.bilinear(
        new Vector2i(),
        new Vector2i(10, 10),
        new Vector2f(0.7, 0.3)
      )
    ).toEqual(new Vector2i(7, 3));
  });

  test('Calcular a interpolação bilinear entre dois vetores (instância)', () => {
    expect(
      new Vector2i().bilinear(new Vector2i(10, 10), new Vector2f(0.7, 0.3))
    ).toEqual(new Vector2i(7, 3));
  });

  test('Calcular a equalidade entre vetores (inteiros - estático)', () => {
    expect(Vector2i.equals(v1, v2)).toBe(false);
    expect(Vector2i.equals(new Vector2i(3, 3), v1)).toBe(true);
  });

  test('Calcular a equalidade entre vetores (inteiros - instância)', () => {
    expect(v1.equals(v2)).toBe(false);
    expect(new Vector2i(3, 3).equals(v1)).toBe(true);
  });

  test('Calcular a equalidade entre vetores (floats - estático)', () => {
    expect(
      Vector2i.equals(new Vector2i(0.3 / 0.1, 0), new Vector2i(3.0, 0))
    ).toBe(true);
  });

  test('Calcular a equalidade entre vetores (floats - instância)', () => {
    expect(new Vector2i(0.3 / 0.1, 0).equals(new Vector2i(3.0, 0))).toBe(true);
  });

  test('Calcular o mínimo entre dois vetores (estático)', () => {
    expect(Vector2i.min(new Vector2i(3, 0), new Vector2i(2, 5))).toEqual(
      new Vector2i(2, 0)
    );
  });

  test('Calcular o máximo entre dois vetores (instância)', () => {
    const vec1 = new Vector2i(100, -3);
    const vec2 = new Vector2i(23, 30);
    vec1.min(vec2);
    expect(vec1).toEqual(new Vector2i(23, -3));
  });

  test('Calcular o máximo entre dois vetores (estático)', () => {
    expect(Vector2i.max(new Vector2i(3, 0), new Vector2i(2, 5))).toEqual(
      new Vector2i(3, 5)
    );
  });

  test('Calcular o máximo entre dois vetores (instância)', () => {
    const vec1 = new Vector2i(100, -3);
    const vec2 = new Vector2i(23, 30);
    vec1.max(vec2);
    expect(vec1).toEqual(new Vector2i(100, 30));
  });

  test('Rotacionar vetor (estático)', () => {
    expect(Vector2i.rotate(v1, Math.PI)).toEqual({
      type: 'int',
      _x: -3,
      _y: -3,
    });
  });

  test('Rotacionar vetor (instância)', () => {
    expect(v1.rotate(Math.PI)).toEqual({
      type: 'int',
      _x: -3,
      _y: -3,
    });
  });

  test('Calcular ângulo do vetor entre dois vetores (estático)', () => {
    expect(Vector2i.atan2(v2, v1)).toBeCloseTo(Math.PI / 4);
  });

  test('Calcular ângulo do vetor entre dois vetores (instância)', () => {
    expect(v2.atan2(v1)).toBeCloseTo(Math.PI / 4);
  });

  test('Normalizar vetor (estático)', () => {
    expect(Vector2i.normalize(new Vector2i(3, 4))).toEqual({
      type: 'float',
      _x: expect.closeTo(3 / 5),
      _y: expect.closeTo(4 / 5),
    });
  });

  test('Normalizar vetor (instância)', () => {
    expect(new Vector2i(3, 4).normalize()).toEqual({
      type: 'float',
      _x: expect.closeTo(3 / 5),
      _y: expect.closeTo(4 / 5),
    });
  });

  test('Obter vetor em valores absolutos (estático)', () => {
    expect(Vector2i.abs(new Vector2i(-3, -76.2312))).toEqual({
      type: 'int',
      _x: 3,
      _y: 76,
    });
  });

  test('Obter vetor em valores absolutos (instância)', () => {
    expect(new Vector2i(-21, 4.587).abs()).toEqual({
      type: 'int',
      _x: 21,
      _y: 5,
    });
  });

  test('Copiar valores de um vetor (estático)', () => {
    Vector2i.copy(v1, v2);
    expect(v2).toEqual(v1);
    expect(v2).not.toBe(v1); // Não deve ser o mesmo objeto
  });

  test('Copiar valores de um vetor (instância)', () => {
    const v3 = v1.clone();
    expect(v3).toEqual(v1);
    expect(v1).toBe(v1);
    expect(v3).not.toBe(v1); // Não deve ser o mesmo objeto
  });
});
