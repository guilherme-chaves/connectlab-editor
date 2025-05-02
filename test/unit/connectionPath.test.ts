// eslint-disable-next-line node/no-unpublished-import
import {expect, test, describe} from 'vitest';
import BoxCollision from '@connectlab-editor/collisionShapes/boxCollision';
import connectionPath from '@connectlab-editor/functions/connectionPath';
import Vector2 from '@connectlab-editor/types/vector2';
import pathFinder from '@connectlab-editor/functions/pathFinder';

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
  test('Criar lista objetos de caixas de colisão', () => {
    const pos = new Vector2(100, 100);
    const endPos = new Vector2(1000, 1000);
    const anchors = pathFinder.simplePathFinder(pos, endPos);
    const bb = connectionPath.generateCollisionShapes(pos, endPos, anchors);
    expect(bb.length).toBe(4);
    expect(bb[0]).toBeInstanceOf(BoxCollision);
  });
});
