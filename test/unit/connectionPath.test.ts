import BBCollision from '../../src/collision/BBCollision';
import connectionPath from '../../src/functions/connection/connectionPath';
import Vector2 from '../../src/types/Vector2';

describe('Testes com a geração da conexão entre componentes', () => {
  test('Definir o tamanho de uma caixa de colisão a partir de dois vetores (inteiros)', () => {
    const pPos = new Vector2(100, 245);
    const nPos = new Vector2(390, 245);
    const size = connectionPath.setCollisionShapeSize(
      pPos,
      nPos,
      6,
      nPos.x - pPos.x,
      6,
      nPos.y - pPos.y
    );
    expect(size).toEqual(new Vector2(290, 6));
  });
  test('Definir o tamanho de uma caixa de colisão a partir de dois vetores (floats)', () => {
    const pPos = new Vector2(100, 245, false);
    const nPos = new Vector2(390, 245.00005, false);
    const size = connectionPath.setCollisionShapeSize(
      pPos,
      nPos,
      6,
      nPos.x - pPos.x,
      6,
      nPos.y - pPos.y
    );
    expect(size).toEqual(new Vector2(290, 6, false));
  });
  test('Definir o tamanho de uma caixa de colisão a partir de dois vetores (floats - falhar)', () => {
    const pPos = new Vector2(100, 245, false);
    const nPos = new Vector2(390, 245.005, false);
    const size = connectionPath.setCollisionShapeSize(
      pPos,
      nPos,
      6,
      nPos.x - pPos.x,
      6,
      nPos.y - pPos.y
    );
    expect(size).not.toEqual(new Vector2(290, 6, false));
  });
  test('Criar âncoras entre duas posições (ZigZag)', () => {
    const pos = new Vector2(100, 100);
    const endPos = new Vector2(1000, 1000);
    const anchors = connectionPath.generateAnchors(pos, endPos);
    expect(anchors).toEqual([
      new Vector2(0.5, 0, false),
      new Vector2(0.5, 1, false),
      new Vector2(1, 1, false),
    ]);
  });
  test('Criar âncoras entre duas posições (¬)', () => {
    const pos = new Vector2(100, 100);
    const endPos = new Vector2(684, 0);
    const anchors = connectionPath.generateAnchors(pos, endPos);
    expect(anchors).toEqual([
      new Vector2(0.5, 0, false),
      new Vector2(1, 0, false),
      new Vector2(1, 1, false),
    ]);
  });
  test('Criar âncoras entre duas posições (L)', () => {
    const pos = new Vector2(100, 100);
    const endPos = new Vector2(0, 750);
    const anchors = connectionPath.generateAnchors(pos, endPos);
    expect(anchors).toEqual([
      new Vector2(0, 1, false),
      new Vector2(0.5, 1, false),
      new Vector2(1, 1, false),
    ]);
  });
  test('Criar lista objetos de caixas de colisão', () => {
    const pos = new Vector2(100, 100);
    const endPos = new Vector2(1000, 1000);
    const anchors = connectionPath.generateAnchors(pos, endPos);
    const bb = connectionPath.generateCollisionShapes(pos, endPos, anchors);
    expect(bb.length).toBe(4);
    expect(bb[0]).toBeInstanceOf(BBCollision);
  });
});