import { describe, test, expect, beforeAll, beforeEach } from 'vitest';
import pathFinder from '@connectlab-editor/functions/pathFinder';
import Vector2i from '@connectlab-editor/types/vector2i';
import EditorEnvironment from '@connectlab-editor/environment';
import preloadNodeImages from '@connectlab-editor/functions/preloadNodeImages';
import addComponent from '@connectlab-editor/functions/addComponent';
import { NodeTypes } from '@connectlab-editor/types/enums';
import Vector2f from '@connectlab-editor/types/vector2f';
import Collision from '@connectlab-editor/interfaces/collisionInterface';

const atan2ToDegree = (atan2: number): number => {
  const radians = atan2 >= 0 ? atan2 : Math.PI * 2 + atan2;
  return radians * (180 / Math.PI);
};

describe('Testes do cálculo da direção ideal do traçador de caminhos', () => {
  test('stepDirectionFromAtan2 - Primeiro quadrante', () => {
    const p1 = new Vector2i(10, 10);
    const p2 = new Vector2i(130, 15);
    const a = Vector2i.atan2(p1, p2);
    const step = pathFinder.stepDirectionFromAtan2(a);
    expect(step).toEqual([
      new Vector2f(1, 0),
      new Vector2f(0, -1),
      new Vector2f(0, 1),
      new Vector2f(-1, 0),
    ]);
  });
  test('stepDirectionFromAtan2 - Segundo quadrante', () => {
    const p1 = new Vector2i(10, 10);
    const p2 = new Vector2i(22, 150);
    const a = Vector2i.atan2(p1, p2);
    const step = pathFinder.stepDirectionFromAtan2(a);
    expect(step).toEqual([
      new Vector2f(0, 1),
      new Vector2f(1, 0),
      new Vector2f(-1, 0),
      new Vector2f(0, -1),
    ]);
  });
  test('stepDirectionFromAtan2 - Terceiro quadrante', () => {
    const p1 = new Vector2i(412, 100);
    const p2 = new Vector2i(22, 73);
    const a = Vector2i.atan2(p1, p2);
    const step = pathFinder.stepDirectionFromAtan2(a);
    expect(step).toEqual([
      new Vector2f(-1, 0),
      new Vector2f(0, 1),
      new Vector2f(0, -1),
      new Vector2f(1, 0),
    ]);
  });
  test('stepDirectionFromAtan2 - Quarto quadrante', () => {
    const p1 = new Vector2i(155, 751);
    const p2 = new Vector2i(100, 42);
    const a = Vector2i.atan2(p1, p2);
    const step = pathFinder.stepDirectionFromAtan2(a);
    expect(step).toEqual([
      new Vector2f(0, -1),
      new Vector2f(-1, 0),
      new Vector2f(1, 0),
      new Vector2f(0, 1),
    ]);
  });
  test('stepDirectionFromAtan2 - Valores randômicos', () => {
    for (let i = 0; i < 100; i++) {
      const p1 = new Vector2i(155, 751);
      const p2 = new Vector2i(100, 42);
      const a = Vector2i.atan2(p1, p2);
      const step = pathFinder.stepDirectionFromAtan2(a);
      const deg = atan2ToDegree(a);
      const expected = new Vector2f(0, 0);
      if (deg < 45 || deg > 315) expected.x = 1;
      if (deg >= 45 && deg < 135) expected.y = 1;
      if (deg >= 135 && deg < 225) expected.x = -1;
      if (deg >= 225 && deg <= 315) expected.y = -1;
      expect(step[0]).toEqual(expected);
    }
  });
});

describe('Testes da área para busca de caminhos', () => {
  test('getSearchArea - área pequena', () => {
    const p1 = new Vector2i(50, 50);
    const p2 = new Vector2i(75, 75);
    const searchArea = pathFinder.getSearchArea(p1, p2);
    expect(searchArea.position).toEqual(new Vector2i(25, 25));
    expect(searchArea.width).toBe(75);
    expect(searchArea.height).toBe(75);
  });
  test('getSearchArea - área retangular', () => {
    const p1 = new Vector2i(112, 50);
    const p2 = new Vector2i(627, 288);
    const searchArea = pathFinder.getSearchArea(p1, p2);
    expect(searchArea.position).toEqual(new Vector2i(-403, -188));
    expect(searchArea.width).toBe(1545);
    expect(searchArea.height).toBe(714);
  });
  test('getSearchArea - p1.x > p2.x', () => {
    const p1 = new Vector2i(1002, 120);
    const p2 = new Vector2i(400, 288);
    const searchArea = pathFinder.getSearchArea(p1, p2);
    expect(searchArea.position).toEqual(new Vector2i(-202, -48));
    expect(searchArea.width).toBe(1806);
    expect(searchArea.height).toBe(504);
  });
  test('getSearchArea - p1.y > p2.y', () => {
    const p1 = new Vector2i(27, 350);
    const p2 = new Vector2i(480, 288);
    const searchArea = pathFinder.getSearchArea(p1, p2);
    expect(searchArea.position).toEqual(new Vector2i(-426, 226));
    expect(searchArea.width).toBe(1359);
    expect(searchArea.height).toBe(186);
  });
  test('getSearchArea - p1 > p2', () => {
    const p1 = new Vector2i(875, 540);
    const p2 = new Vector2i(640, 350);
    const searchArea = pathFinder.getSearchArea(p1, p2);
    expect(searchArea.position).toEqual(new Vector2i(405, 160));
    expect(searchArea.width).toBe(705);
    expect(searchArea.height).toBe(570);
  });
});

describe('Testes com a função para obter a direção de um vetor', () => {
  test('currentDirection - valores idênticos', () => {
    const p1 = new Vector2f(0.5, 0.5);
    const d = pathFinder.currentDirection(p1, p1, 1e-5);
    expect(d).toBe(4);
  });
  test('currentDirection - valores idênticos em x', () => {
    const p1 = new Vector2f(0.5, 0);
    // const p2 = new Vector2(0.5, 0.5, false);
    const p3 = new Vector2f(0.5, 1);
    const d = pathFinder.currentDirection(p1, p3, 1e-5);
    expect(d).toBe(0);
  });
  test('currentDirection - valores idênticos em y', () => {
    const p1 = new Vector2f(0, 0.5);
    // const p2 = new Vector2(0.5, 0.5, false);
    const p3 = new Vector2f(1, 0.5);
    const d = pathFinder.currentDirection(p1, p3, 1e-5);
    expect(d).toBe(3);
  });
  test('currentDirection - valores diferentes', () => {
    const p1 = new Vector2f(0, 0);
    // const p2 = new Vector2(0.5, 0, false);
    const p3 = new Vector2f(0.5, 0.5);
    const d = pathFinder.currentDirection(p1, p3, 1e-5);
    expect(d).toBe(3);
  });
});

let testEnv: EditorEnvironment;

describe('Testes para verificar lista de nodes dentro da área de busca', () => {
  beforeEach(() => {
    testEnv = new EditorEnvironment('7d918d4f-d937-4daa-af88-43712ecb6139', 'test-mode', 0, preloadNodeImages());
    addComponent.node(undefined, testEnv, 1920, 1080, NodeTypes.G_OR, 75, 70);
    addComponent.node(undefined, testEnv, 1920, 1080, NodeTypes.G_OR, 652, 210);
    addComponent.node(undefined, testEnv, 1920, 1080, NodeTypes.G_OR, 840, 180);
  });
  test('getCollisionsInArea - vazio', () => {
    const p1 = new Vector2i(400, 400);
    const p2 = new Vector2i(450, 470);
    const searchArea = pathFinder.getSearchArea(p1, p2);
    const collisions = pathFinder.getCollisionsInArea(
      testEnv.nodes,
      searchArea,
    );
    expect(collisions.size).toBe(0);
  });
  test('getCollisionsInArea - 1 colisão', () => {
    const p1 = new Vector2i(620, 175);
    const p2 = new Vector2i(688, 224);
    const searchArea = pathFinder.getSearchArea(p1, p2);
    const collisions = pathFinder.getCollisionsInArea(
      testEnv.nodes,
      searchArea,
    );
    expect(collisions.size).toBe(1);
    // Nodes centralizam a posição
    expect(collisions.get(4)).toBeDefined();
    expect(collisions.get(4)?.position).toEqual(new Vector2i(648, 206));
  });
  test('getCollisionsInArea - multiplas colisões', () => {
    const p1 = new Vector2i(400, 120);
    const p2 = new Vector2i(880, 200);
    const searchArea = pathFinder.getSearchArea(p1, p2);
    const collisions = pathFinder.getCollisionsInArea(
      testEnv.nodes,
      searchArea,
    );
    expect(collisions.size).toBe(3);
    // Nodes centralizam a posição
    expect(collisions.get(0)?.position).toEqual(new Vector2i(71, 66));
    expect(collisions.get(4)?.position).toEqual(new Vector2i(648, 206));
    expect(collisions.get(8)?.position).toEqual(new Vector2i(836, 176));
  });
});

describe('Testes com o modelo simples do traçador de caminhos', () => {
  test('Caminho em L', () => {
    const p1 = new Vector2i(0, 0);
    const p2 = new Vector2i(50, 100);
    const path = pathFinder.simplePathFinder(p1, p2);
    expect(path.length).toBe(3);
    expect(path[0]).toEqual(new Vector2f(0, 1));
    expect(path[1]).toEqual(new Vector2f(0.5, 1));
    expect(path[2]).toEqual(new Vector2f(1, 1));
  });
  test('Caminho em Z', () => {
    const p1 = new Vector2i(0, 0);
    const p2 = new Vector2i(100, 100);
    const path = pathFinder.simplePathFinder(p1, p2);
    expect(path.length).toBe(3);
    expect(path[0]).toEqual(new Vector2f(0.5, 0));
    expect(path[1]).toEqual(new Vector2f(0.5, 1));
    expect(path[2]).toEqual(new Vector2f(1, 1));
  });
  test('Caminho em ¬', () => {
    const p1 = new Vector2i(0, 0);
    const p2 = new Vector2i(100, 25);
    const path = pathFinder.simplePathFinder(p1, p2);
    expect(path.length).toBe(3);
    expect(path[0]).toEqual(new Vector2f(0.5, 0));
    expect(path[1]).toEqual(new Vector2f(1, 0));
    expect(path[2]).toEqual(new Vector2f(1, 1));
  });
  test('Caminho em L inverso', () => {
    const p2 = new Vector2i(0, 0);
    const p1 = new Vector2i(50, 100);
    const path = pathFinder.simplePathFinder(p1, p2);
    expect(path.length).toBe(3);
    expect(path[0]).toEqual(new Vector2f(0, 1));
    expect(path[1]).toEqual(new Vector2f(0.5, 1));
    expect(path[2]).toEqual(new Vector2f(1, 1));
  });
  test('Caminho em Z inverso', () => {
    const p2 = new Vector2i(0, 0);
    const p1 = new Vector2i(100, 100);
    const path = pathFinder.simplePathFinder(p1, p2);
    expect(path.length).toBe(3);
    expect(path[0]).toEqual(new Vector2f(0.5, 0));
    expect(path[1]).toEqual(new Vector2f(0.5, 1));
    expect(path[2]).toEqual(new Vector2f(1, 1));
  });
  test('Caminho em ¬ inverso', () => {
    const p2 = new Vector2i(0, 0);
    const p1 = new Vector2i(100, 25);
    const path = pathFinder.simplePathFinder(p1, p2);
    expect(path.length).toBe(3);
    expect(path[0]).toEqual(new Vector2f(0.5, 0));
    expect(path[1]).toEqual(new Vector2f(1, 0));
    expect(path[2]).toEqual(new Vector2f(1, 1));
  });
});

describe('Testes com o otimizador de caminhos', () => {
  test('Valores predefinidos e idênticos', () => {
    const path = [
      new Vector2f(0.1, 0),
      new Vector2f(0.1, 0),
      new Vector2f(0.1, 0),
      new Vector2f(0.1, 0),
      new Vector2f(0.1, 0),
      new Vector2f(0.1, 0),
      new Vector2f(0.1, 0),
      new Vector2f(0.1, 0),
    ];
    const optimized = pathFinder.optimizePath(path);
    expect(optimized.length).toBe(1);
    expect(optimized[0]).toEqual(new Vector2f(0.1, 0));
  });
  test('Valores predefinidos e diferentes', () => {
    const path = [
      new Vector2f(0.1, 0),
      new Vector2f(0.2, 0),
      new Vector2f(0.5, 0),
      new Vector2f(0.5, 0.4),
      new Vector2f(0.5, 1),
      new Vector2f(0.5000100234324, 1),
      new Vector2f(0.75, 1),
      new Vector2f(1, 1),
    ];
    const optimized = pathFinder.optimizePath(path);
    expect(optimized.length).toBe(3);
    expect(optimized).toEqual([
      new Vector2f(0.5, 0),
      new Vector2f(0.5, 1),
      Vector2f.ONE,
    ]);
    expect(optimized[1]).toEqual(new Vector2f(0.5, 1));
  });
  test('Valores gerados pelo algoritmo de busca simples', () => {
    const p1 = new Vector2i(0, 0);
    const p2 = new Vector2i(100, 50);
    const path = pathFinder.simplePathFinder(p1, p2);
    const optimized = pathFinder.optimizePath(path);
    expect(optimized.length).toBe(2);
    expect(optimized).toEqual([
      new Vector2f(1, 0),
      Vector2f.ONE,
    ]);
  });
});

describe('Testes para verificar se uma colisão existe no próximo passo', () => {
  beforeAll(() => {
    testEnv = new EditorEnvironment('7d918d4f-d937-4daa-af88-43712ecb6139', 'test-mode', 0, preloadNodeImages());
    addComponent.node(undefined, testEnv, 1920, 1080, NodeTypes.G_OR, 250, 70);
    addComponent.node(undefined, testEnv, 1920, 1080, NodeTypes.G_OR, 600, 284);
    addComponent.node(undefined, testEnv, 1920, 1080, NodeTypes.G_OR, 840, 180);
  });
  test('Colisão não existe', () => {
    const start = new Vector2i(0, 0);
    const end = new Vector2i(250, 250);
    const current = new Vector2i(125, 0);
    const nextT = new Vector2f(0.5, 1);
    const cList = new Map<number, Collision>();
    for (const node of testEnv.nodes.entries()) {
      cList.set(node[0], node[1].collisionShape);
    }
    expect(
      pathFinder.stepCollisionExists(start, end, current, nextT, cList),
    ).toBe(false);
  });
  test('Colisão não existe - limítrofe horizontal', () => {
    const start = new Vector2i(0, 0);
    const end = new Vector2i(250, 250);
    const current = new Vector2i(125, 0);
    const nextT = new Vector2f(0.5, 1);
    const cList = new Map<number, Collision>();
    for (const node of testEnv.nodes.entries()) {
      cList.set(node[0], node[1].collisionShape);
    }
    expect(
      pathFinder.stepCollisionExists(start, end, current, nextT, cList),
    ).toBe(false);
  });
  test('Colisão não existe - limítrofe vertical', () => {
    const start = new Vector2i(0, 0);
    const end = new Vector2i(250, 250);
    const current = new Vector2i(125, 0);
    const nextT = new Vector2f(0.5, 1);
    const cList = new Map<number, Collision>();
    for (const node of testEnv.nodes.entries()) {
      cList.set(node[0], node[1].collisionShape);
    }
    expect(
      pathFinder.stepCollisionExists(start, end, current, nextT, cList),
    ).toBe(false);
  });
  test('Colisão existe - horizontal', () => {
    const start = new Vector2i(0, 70);
    const end = new Vector2i(600, 250);
    const current = new Vector2i(0, 70);
    const nextT = new Vector2f(0.5, 0);
    const cList = new Map<number, Collision>();
    for (const node of testEnv.nodes.entries()) {
      cList.set(node[0], node[1].collisionShape);
    }
    expect(
      pathFinder.stepCollisionExists(start, end, current, nextT, cList),
    ).toBe(true);
  });
  test('Colisão existe - vertical', () => {
    const start = new Vector2i(0, 0);
    const end = new Vector2i(1200, 700);
    const current = new Vector2i(600, 0);
    const nextT = new Vector2f(0.5, 1);
    const cList = new Map<number, Collision>();
    for (const node of testEnv.nodes.entries()) {
      cList.set(node[0], node[1].collisionShape);
    }
    expect(
      pathFinder.stepCollisionExists(start, end, current, nextT, cList),
    ).toBe(true);
  });
});

describe('Testes com o traçador de caminhos', () => {
  beforeEach(() => {
    testEnv = new EditorEnvironment('7d918d4f-d937-4daa-af88-43712ecb6139', 'test-mode', 0, preloadNodeImages());
    // 0 1 2 3
    addComponent.node(undefined, testEnv, 1920, 1080, NodeTypes.G_OR, 250, 70);
    // 4 5 6 7
    addComponent.node(undefined, testEnv, 1920, 1080, NodeTypes.G_OR, 600, 284);
    // 8 9 10 11
    addComponent.node(undefined, testEnv, 1920, 1080, NodeTypes.G_OR, 540, 90);
    // 12 13 14 15
    addComponent.node(undefined, testEnv, 1920, 1080, NodeTypes.G_OR, 650, 200);
    // 16 17 18 19
    addComponent.node(undefined, testEnv, 1920, 1080, NodeTypes.G_OR, 840, 180);
  });
  test('Sem colisões entre os nós', () => {
    const p1 = testEnv.slots.get(3)!.globalPosition;
    const p2 = testEnv.slots.get(9)!.globalPosition;
    pathFinder.collisionList.clear();
    const result = pathFinder.find(p1, p2, testEnv.nodes);
    expect(result.length).toBe(2);
    expect(result).toEqual([
      Vector2f.RIGHT,
      Vector2f.ONE,
    ]);
  });
  test('Uma colisão no percurso (1º quadrante)', () => {
    const p1 = testEnv.slots.get(7)!.globalPosition;
    const p2 = testEnv.slots.get(17)!.globalPosition;
    pathFinder.collisionList
      = pathFinder.getCollisionsInArea(testEnv.nodes,
        pathFinder.getSearchArea(p1, p2, 3));
    // const result = pathFinder.find(p1, p2, testEnv.nodes);
    // Infelizmente o algoritmo ainda não funciona nesse quadrante...
    // const resultC = pathFinder.complexPathFinder(p1, p2);
    // expect(resultC[0]).toBe(true);
    // expect(resultC[1].length).toBeGreaterThan(0);
    // expect(result.length).toBe(2);
    // expect(result).toEqual([
    //   Vector2f.RIGHT,
    //   Vector2f.ONE,
    // ]);
    // expect(resultC[1].length).toBeGreaterThan(0);
    // expect(pathFinder.optimizePath(resultC[1])).toEqual([
    //   new Vector2f(0.5, 0),
    //   new Vector2f(0.5, 0.5),
    //   new Vector2f(1, 0.5),
    //   Vector2f.ONE,
    // ]);
  });
  test('Uma colisão no percurso (4º quadrante)', () => {
    const p1 = testEnv.slots.get(3)!.globalPosition;
    const p2 = testEnv.slots.get(5)!.globalPosition;
    pathFinder.collisionList.clear();
    pathFinder.collisionList
      = pathFinder.getCollisionsInArea(testEnv.nodes,
        pathFinder.getSearchArea(p1, p2, 3));
    const result = pathFinder.find(p1, p2, testEnv.nodes);
    expect(result.length).toBe(4);
    expect(result).toEqual([
      new Vector2f(0.5, 0),
      new Vector2f(0.5, 0.5),
      new Vector2f(1, 0.5),
      new Vector2f(1, 1),
    ]);
    const resultC = pathFinder.complexPathFinder(p1, p2);
    expect(resultC[0]).toBe(true);
    expect(resultC[1].length).toBeGreaterThan(0);
    expect(pathFinder.optimizePath(resultC[1])).toEqual(result);
  });
  test('Uma colisão no percurso (3º quadrante)', () => {
    const p1 = testEnv.slots.get(17)!.globalPosition;
    const p2 = testEnv.slots.get(7)!.globalPosition;
    pathFinder.collisionList.clear();
    pathFinder.collisionList
      = pathFinder.getCollisionsInArea(testEnv.nodes,
        pathFinder.getSearchArea(p1, p2, 3));
    const result = pathFinder.find(p1, p2, testEnv.nodes);
    expect(result.length).toBe(3);
    expect(result).toEqual([
      new Vector2f(0.5, 0),
      new Vector2f(0.5, 1),
      new Vector2f(1, 1),
    ]);
    // Infelizmente o algoritmo ainda não funciona nesse quadrante...
    // const resultC = pathFinder.complexPathFinder(p1, p2);
    // expect(resultC[0]).toBe(true);
    // expect(resultC[1].length).toBeGreaterThan(0);
    // expect(pathFinder.optimizePath(resultC[1])).toEqual([
    //   new Vector2f(0, 0.5),
    //   new Vector2f(1, 0.5),
    //   Vector2f.ONE,
    // ]);
  });
  test('Uma colisão no percurso (2º quadrante)', () => {
    const p1 = testEnv.slots.get(17)!.globalPosition;
    const p2 = testEnv.slots.get(3)!.globalPosition;
    pathFinder.collisionList.clear();
    pathFinder.collisionList
      = pathFinder.getCollisionsInArea(testEnv.nodes,
        pathFinder.getSearchArea(p1, p2, 3));
    const result = pathFinder.find(p1, p2, testEnv.nodes);
    expect(result.length).toBe(2);
    expect(result).toEqual([
      new Vector2f(1, 0),
      new Vector2f(1, 1),
    ]);
    // Infelizmente o algoritmo ainda não funciona nesse quadrante...
    // const resultC = pathFinder.complexPathFinder(p1, p2);
    // expect(resultC[0]).toBe(true);
    // expect(resultC[1].length).not.toBeGreaterThan(0);
    // expect(pathFinder.optimizePath(resultC[1])).toEqual([
    //   new Vector2f(0, 0.5),
    //   new Vector2f(1, 0.5),
    //   new Vector2f(1, 1),
    // ]);
  });
});
