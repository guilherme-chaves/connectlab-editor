// eslint-disable-next-line node/no-unpublished-import
import {describe, test, expect, beforeAll} from 'vitest';
import pathFinder from '@connectlab-editor/functions/pathFinder';
import Vector2 from '@connectlab-editor/types/vector2';
import EditorEnvironment from '@connectlab-editor/environment';
import preloadNodeImages from '@connectlab-editor/functions/preloadNodeImages';
import addComponent from '@connectlab-editor/functions/addComponent';
import {NodeTypes} from '@connectlab-editor/types/enums';

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
    expect(step).toEqual(new Vector2(1, 0, false));
  });
  test('stepDirectionFromAtan2 - Segundo quadrante', () => {
    const p1 = new Vector2(10, 10);
    const p2 = new Vector2(22, 150);
    const a = Vector2.atan2(p1, p2);
    const step = pathFinder.stepDirectionFromAtan2(a);
    expect(step).toEqual(new Vector2(0, 1, false));
  });
  test('stepDirectionFromAtan2 - Terceiro quadrante', () => {
    const p1 = new Vector2(412, 100);
    const p2 = new Vector2(22, 73);
    const a = Vector2.atan2(p1, p2);
    const step = pathFinder.stepDirectionFromAtan2(a);
    expect(step).toEqual(new Vector2(-1, 0, false));
  });
  test('stepDirectionFromAtan2 - Quarto quadrante', () => {
    const p1 = new Vector2(155, 751);
    const p2 = new Vector2(100, 42);
    const a = Vector2.atan2(p1, p2);
    const step = pathFinder.stepDirectionFromAtan2(a);
    expect(step).toEqual(new Vector2(0, -1, false));
  });
  test('stepDirectionFromAtan2 - Valores randômicos', () => {
    for (let i = 0; i < 100; i++) {
      const p1 = new Vector2(155, 751);
      const p2 = new Vector2(100, 42);
      const a = Vector2.atan2(p1, p2);
      const step = pathFinder.stepDirectionFromAtan2(a);
      const deg = atan2ToDegree(a);
      const expected = new Vector2(0, 0, false);
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

let testEnv: EditorEnvironment;

describe('Testes para verificar lista de nodes dentro da área de busca', () => {
  beforeAll(() => {
    testEnv = new EditorEnvironment('test-mode', 0, preloadNodeImages());
    addComponent.node(undefined, testEnv, 1920, 1080, NodeTypes.G_OR, 75, 70);
    addComponent.node(undefined, testEnv, 1920, 1080, NodeTypes.G_OR, 652, 210);
    addComponent.node(undefined, testEnv, 1920, 1080, NodeTypes.G_OR, 840, 180);
  });
  test('getCollisionsInArea - vazio', () => {
    const p1 = new Vector2(400, 400);
    const p2 = new Vector2(450, 470);
    const searchArea = pathFinder.getSearchArea(p1, p2);
    const collisions = pathFinder.getCollisionsInArea(
      testEnv.nodes,
      searchArea
    );
    expect(collisions.size).toBe(0);
  });
  test('getCollisionsInArea - 1 colisão', () => {
    const p1 = new Vector2(620, 175);
    const p2 = new Vector2(688, 224);
    const searchArea = pathFinder.getSearchArea(p1, p2);
    const collisions = pathFinder.getCollisionsInArea(
      testEnv.nodes,
      searchArea
    );
    expect(collisions.size).toBe(1);
    // Nodes centralizam a posição
    expect(collisions.get(4)!.position).toEqual(new Vector2(602, 160));
  });
  test('getCollisionsInArea - multiplas colisões', () => {
    const p1 = new Vector2(400, 120);
    const p2 = new Vector2(880, 200);
    const searchArea = pathFinder.getSearchArea(p1, p2);
    const collisions = pathFinder.getCollisionsInArea(
      testEnv.nodes,
      searchArea
    );
    expect(collisions.size).toBe(3);
    // Nodes centralizam a posição
    expect(collisions.get(0)!.position).toEqual(new Vector2(25, 20));
    expect(collisions.get(4)!.position).toEqual(new Vector2(602, 160));
    expect(collisions.get(8)!.position).toEqual(new Vector2(790, 130));
  });
});

describe('Testes com o modelo simples do traçador de caminhos', () => {
  test('Caminho em L', () => {
    const p1 = new Vector2(0, 0);
    const p2 = new Vector2(50, 100);
    const path = pathFinder.simplePathFinder(p1, p2);
    expect(path.length).toBe(3);
    expect(path[0]).toEqual(new Vector2(0, 1, false));
    expect(path[1]).toEqual(new Vector2(0.5, 1, false));
    expect(path[2]).toEqual(new Vector2(1, 1, false));
  });
  test('Caminho em Z', () => {
    const p1 = new Vector2(0, 0);
    const p2 = new Vector2(100, 100);
    const path = pathFinder.simplePathFinder(p1, p2);
    expect(path.length).toBe(3);
    expect(path[0]).toEqual(new Vector2(0.5, 0, false));
    expect(path[1]).toEqual(new Vector2(0.5, 1, false));
    expect(path[2]).toEqual(new Vector2(1, 1, false));
  });
  test('Caminho em ¬', () => {
    const p1 = new Vector2(0, 0);
    const p2 = new Vector2(100, 25);
    const path = pathFinder.simplePathFinder(p1, p2);
    expect(path.length).toBe(3);
    expect(path[0]).toEqual(new Vector2(0.5, 0, false));
    expect(path[1]).toEqual(new Vector2(1, 0, false));
    expect(path[2]).toEqual(new Vector2(1, 1, false));
  });
  test('Caminho em L inverso', () => {
    const p2 = new Vector2(0, 0);
    const p1 = new Vector2(50, 100);
    const path = pathFinder.simplePathFinder(p1, p2);
    expect(path.length).toBe(3);
    expect(path[0]).toEqual(new Vector2(0, 1, false));
    expect(path[1]).toEqual(new Vector2(0.5, 1, false));
    expect(path[2]).toEqual(new Vector2(1, 1, false));
  });
  test('Caminho em Z inverso', () => {
    const p2 = new Vector2(0, 0);
    const p1 = new Vector2(100, 100);
    const path = pathFinder.simplePathFinder(p1, p2);
    expect(path.length).toBe(3);
    expect(path[0]).toEqual(new Vector2(0.5, 0, false));
    expect(path[1]).toEqual(new Vector2(0.5, 1, false));
    expect(path[2]).toEqual(new Vector2(1, 1, false));
  });
  test('Caminho em ¬ inverso', () => {
    const p2 = new Vector2(0, 0);
    const p1 = new Vector2(100, 25);
    const path = pathFinder.simplePathFinder(p1, p2);
    expect(path.length).toBe(3);
    expect(path[0]).toEqual(new Vector2(0.5, 0, false));
    expect(path[1]).toEqual(new Vector2(1, 0, false));
    expect(path[2]).toEqual(new Vector2(1, 1, false));
  });
});
