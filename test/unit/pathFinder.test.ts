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

});
