// eslint-disable-next-line node/no-unpublished-import
import {describe, test, expect} from 'vitest';
import pathFinder from '@connectlab-editor/functions/pathFinder';
import Vector2 from '@connectlab-editor/types/vector2';

const atan2ToDegree = (atan2: number): number => {
  const radians = atan2 >= 0 ? atan2 : Math.PI * 2 + atan2;
  return radians * (180 / Math.PI);
};

describe('Testes do cálculo da direção ideal do traçador de caminhos', () => {
  test('stepDirectionFromAtan2 - Primeiro quadrante', () => {
    const p1 = new Vector2(10, 10);
    const p2 = new Vector2(130, 15);
    const a = Vector2.atan2(p1, p2);
    const step = pathFinder.stepDirectionFromAtan2(a);
    expect(step).toEqual(new Vector2(1, 0));
  });
  test('stepDirectionFromAtan2 - Segundo quadrante', () => {
    const p1 = new Vector2(10, 10);
    const p2 = new Vector2(22, 150);
    const a = Vector2.atan2(p1, p2);
    const step = pathFinder.stepDirectionFromAtan2(a);
    expect(step).toEqual(new Vector2(0, 1));
  });
  test('stepDirectionFromAtan2 - Terceiro quadrante', () => {
    const p1 = new Vector2(412, 100);
    const p2 = new Vector2(22, 73);
    const a = Vector2.atan2(p1, p2);
    const step = pathFinder.stepDirectionFromAtan2(a);
    expect(step).toEqual(new Vector2(-1, 0));
  });
  test('stepDirectionFromAtan2 - Quarto quadrante', () => {
    const p1 = new Vector2(155, 751);
    const p2 = new Vector2(100, 42);
    const a = Vector2.atan2(p1, p2);
    const step = pathFinder.stepDirectionFromAtan2(a);
    expect(step).toEqual(new Vector2(0, -1));
  });
  test('stepDirectionFromAtan2 - Valores randômicos', () => {
    for (let i = 0; i < 100; i++) {
      const p1 = new Vector2(155, 751);
      const p2 = new Vector2(100, 42);
      const a = Vector2.atan2(p1, p2);
      const step = pathFinder.stepDirectionFromAtan2(a);
      const deg = atan2ToDegree(a);
      const expected = new Vector2();
      if (deg < 45 || deg > 315) expected.x = 1;
      if (deg >= 45 && deg < 135) expected.y = 1;
      if (deg >= 135 && deg < 225) expected.x = -1;
      if (deg >= 225 && deg <= 315) expected.y = -1;
      expect(step).toEqual(expected);
    }
  });
});

describe('Testes da área para busca de caminhos', () => {
  test('getSearchArea - área pequena', () => {
    const p1 = new Vector2(50, 50);
    const p2 = new Vector2(75, 75);
    const searchArea = pathFinder.getSearchArea(p1, p2);
    expect(searchArea.position).toEqual(new Vector2(25, 25));
    expect(searchArea.width).toBe(75);
    expect(searchArea.height).toBe(75);
  });
  test('getSearchArea - área retangular', () => {
    const p1 = new Vector2(112, 50);
    const p2 = new Vector2(627, 288);
    const searchArea = pathFinder.getSearchArea(p1, p2);
    expect(searchArea.position).toEqual(new Vector2(-403, -188));
    expect(searchArea.width).toBe(1545);
    expect(searchArea.height).toBe(714);
  });
  test('getSearchArea - p1.x > p2.x', () => {
    const p1 = new Vector2(1002, 120);
    const p2 = new Vector2(400, 288);
    const searchArea = pathFinder.getSearchArea(p1, p2);
    expect(searchArea.position).toEqual(new Vector2(-202, -48));
    expect(searchArea.width).toBe(1806);
    expect(searchArea.height).toBe(504);
  });
  test('getSearchArea - p1.y > p2.y', () => {
    const p1 = new Vector2(27, 350);
    const p2 = new Vector2(480, 288);
    const searchArea = pathFinder.getSearchArea(p1, p2);
    expect(searchArea.position).toEqual(new Vector2(-426, 226));
    expect(searchArea.width).toBe(1359);
    expect(searchArea.height).toBe(186);
  });
  test('getSearchArea - p1 > p2', () => {
    const p1 = new Vector2(875, 540);
    const p2 = new Vector2(640, 350);
    const searchArea = pathFinder.getSearchArea(p1, p2);
    expect(searchArea.position).toEqual(new Vector2(405, 160));
    expect(searchArea.width).toBe(705);
    expect(searchArea.height).toBe(570);
  });
});
