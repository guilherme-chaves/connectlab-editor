// eslint-disable-next-line node/no-unpublished-import
import {expect, test, beforeEach} from '@jest/globals';

import Vector2 from '@connectlab-editor/types/vector2';

let v1: Vector2;
let v2: Vector2;

beforeEach(() => {
  v1 = new Vector2(3, 3);
  v2 = new Vector2(2, 2);
});

describe('Teste de operações com vetores', () => {
  test('Adicionar dois vetores (estático)', () => {
    expect(Vector2.add(v1, v2)).toEqual(new Vector2(5, 5));
  });

  test('Adicionar dois vetores (instância)', () => {
    expect(v1.add(v2)).toEqual(new Vector2(5, 5));
  });

  test('Subtrair dois vetores (estático)', () => {
    expect(Vector2.sub(v1, v2)).toEqual(new Vector2(1, 1));
  });

  test('Subtrair dois vetores (instância)', () => {
    expect(v1.sub(v2)).toEqual(new Vector2(1, 1));
  });

  test('Multiplicar dois vetores (estático)', () => {
    expect(Vector2.mul(v1, v2)).toEqual(new Vector2(6, 6));
  });

  test('Multiplicar dois vetores (instância)', () => {
    expect(v1.mul(v2)).toEqual(new Vector2(6, 6));
  });

  test('Multiplicar vetor por valor escalar (estático)', () => {
    expect(Vector2.mul(v1, 5)).toEqual(new Vector2(15, 15));
  });

  test('Multiplicar vetor por valor escalar (instância)', () => {
    expect(v1.mul(5)).toEqual(new Vector2(15, 15));
  });

  test('Dividir dois vetores (estático)', () => {
    expect(Vector2.div(v1, v2)).toEqual(new Vector2(1.5, 1.5));
  });

  test('Dividir dois vetores (instância)', () => {
    expect(v1.div(v2)).toEqual(new Vector2(1.5, 1.5));
  });

  test('Dividir vetor por valor escalar (estático)', () => {
    expect(Vector2.div(v1, 3)).toEqual(new Vector2(1, 1));
  });

  test('Dividir vetor por valor escalar (instância)', () => {
    expect(v1.div(3)).toEqual(new Vector2(1, 1));
  });

  test('Calcular produto escalar entre dois vetores (estático)', () => {
    expect(Vector2.dot(v1, v2)).toBeCloseTo(12);
  });

  test('Calcular produto escalar entre dois vetores (instância)', () => {
    expect(v1.dot(v2)).toBeCloseTo(12);
  });

  test('Calcular o produto vetorial entre dois vetores (estático)', () => {
    expect(Vector2.cross(v1, v2)).toBeCloseTo(0);
  });

  test('Calcular o produto vetorial entre dois vetores (instância)', () => {
    expect(v1.cross(v2)).toBeCloseTo(0);
  });

  test('Calcular o comprimento de um vetor (estático)', () => {
    expect(Vector2.len(v1)).toBeCloseTo(Math.sqrt(18));
  });

  test('Calcular o comprimento de um vetor (instância)', () => {
    expect(v1.len()).toBeCloseTo(Math.sqrt(18));
  });

  test('Calcular a interpolação linear entre dois vetores (estático)', () => {
    expect(Vector2.lerp(new Vector2(4, 4), v2, 0.5)).toEqual(v1);
  });

  test('Calcular a interpolação linear entre dois vetores (instância)', () => {
    expect(new Vector2(4, 4).lerp(v2, 0.5)).toEqual(v1);
  });

  test('Calcular a interpolação bilinear entre dois vetores (estático)', () => {
    expect(
      Vector2.bilinear(
        new Vector2(),
        new Vector2(10, 10),
        new Vector2(0.7, 0.3, false)
      )
    ).toEqual(new Vector2(7, 3));
  });

  test('Calcular a interpolação bilinear entre dois vetores (instância)', () => {
    expect(
      new Vector2().bilinear(new Vector2(10, 10), new Vector2(0.7, 0.3, false))
    ).toEqual(new Vector2(7, 3));
  });

  test('Calcular a equalidade entre vetores (inteiros - estático)', () => {
    expect(Vector2.equals(v1, v2)).toBe(false);
    expect(Vector2.equals(new Vector2(3, 3), v1)).toBe(true);
  });

  test('Calcular a equalidade entre vetores (inteiros - instância)', () => {
    expect(v1.equals(v2)).toBe(false);
    expect(new Vector2(3, 3).equals(v1)).toBe(true);
  });

  test('Calcular a equalidade entre vetores (floats - estático)', () => {
    expect(
      Vector2.equals(
        new Vector2(0.3 / 0.1, 0, false),
        new Vector2(3.0, 0, false)
      )
    ).toBe(true);
  });

  test('Calcular a equalidade entre vetores (floats - instância)', () => {
    expect(
      new Vector2(0.3 / 0.1, 0, false).equals(new Vector2(3.0, 0, false))
    ).toBe(true);
  });

  test('Calcular o mínimo entre dois vetores (estático)', () => {
    expect(Vector2.min(new Vector2(3, 0), new Vector2(2, 5))).toEqual(
      new Vector2(2, 0)
    );
  });

  test('Calcular o máximo entre dois vetores (instância)', () => {
    const vec1 = new Vector2(100, -3);
    const vec2 = new Vector2(23, 30);
    vec1.min(vec2);
    expect(vec1).toEqual(new Vector2(23, -3));
  });

  test('Calcular o máximo entre dois vetores (estático)', () => {
    expect(Vector2.max(new Vector2(3, 0), new Vector2(2, 5))).toEqual(
      new Vector2(3, 5)
    );
  });

  test('Calcular o máximo entre dois vetores (instância)', () => {
    const vec1 = new Vector2(100, -3);
    const vec2 = new Vector2(23, 30);
    vec1.max(vec2);
    expect(vec1).toEqual(new Vector2(100, 30));
  });

  test('Rotacionar vetor (estático)', () => {
    expect(Vector2.rotate(v1, Math.PI)).toEqual({
      _x: expect.closeTo(-3),
      _y: expect.closeTo(-3),
      useInt: true,
    });
  });

  test('Rotacionar vetor (instância)', () => {
    expect(v1.rotate(Math.PI)).toEqual({
      _x: expect.closeTo(-3),
      _y: expect.closeTo(-3),
      useInt: true,
    });
  });

  test('Calcular ângulo do vetor entre dois vetores (estático)', () => {
    expect(Vector2.angleBetween(v2, v1)).toBeCloseTo(Math.PI / 4);
  });

  test('Calcular ângulo do vetor entre dois vetores (instância)', () => {
    expect(v2.angleBetween(v1)).toBeCloseTo(Math.PI / 4);
  });

  test('Normalizar vetor (estático)', () => {
    expect(Vector2.normalize(new Vector2(3, 4))).toEqual({
      _x: expect.closeTo(3 / 5),
      _y: expect.closeTo(4 / 5),
      useInt: false,
    });
  });

  test('Normalizar vetor (instância)', () => {
    expect(new Vector2(3, 4).normalize()).toEqual({
      _x: expect.closeTo(3 / 5),
      _y: expect.closeTo(4 / 5),
      useInt: false,
    });
  });

  test('Obter vetor em valores absolutos (estático)', () => {
    expect(
      Vector2.abs(new Vector2(-3, -76.2312, false), undefined, false)
    ).toEqual({
      _x: expect.closeTo(3),
      _y: expect.closeTo(76.2312),
      useInt: false,
    });
  });

  test('Obter vetor em valores absolutos (instância)', () => {
    expect(new Vector2(-21, 4.587, false).abs()).toEqual({
      _x: expect.closeTo(21),
      _y: expect.closeTo(4.587),
      useInt: false,
    });
  });

  test('Copiar valores de um vetor (estático)', () => {
    Vector2.copy(v1, v2);
    expect(v2).toEqual(v1);
    expect(v2).not.toBe(v1); // Não deve ser o mesmo objeto
  });

  test('Copiar valores de um vetor (instância)', () => {
    const v3 = v1.copy();
    expect(v3).toEqual(v1);
    expect(v3).not.toBe(v1); // Não deve ser o mesmo objeto
  });
});
