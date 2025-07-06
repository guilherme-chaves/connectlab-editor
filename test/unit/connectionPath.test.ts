// eslint-disable-next-line node/no-unpublished-import
import {expect, test, describe} from 'vitest';
import BoxCollision from '@connectlab-editor/collisionShapes/boxCollision';
import connectionPath from '@connectlab-editor/functions/connectionPath';
import Vector2i from '@connectlab-editor/types/vector2i';
import pathFinder from '@connectlab-editor/functions/pathFinder';
import Vector2f from '@connectlab-editor/types/vector2f';

describe('Testes com a geração da conexão entre componentes', () => {
  test('Definir o tamanho de uma caixa de colisão a partir de dois vetores (inteiros)', () => {
    const pPos = new Vector2i(100, 245);
    const nPos = new Vector2i(390, 245);
    const size = connectionPath.setCollisionShapeSize(
      pPos,
      nPos,
      6,
      nPos.x - pPos.x,
      6,
      nPos.y - pPos.y
    );
    expect(size).toEqual(new Vector2f(290, 6));
  });
  test('Definir o tamanho de uma caixa de colisão a partir de dois vetores (floats)', () => {
    const pPos = new Vector2f(100, 245);
    const nPos = new Vector2f(390, 245.00005);
    const size = connectionPath.setCollisionShapeSize(
      pPos,
      nPos,
      6,
      nPos.x - pPos.x,
      6,
      nPos.y - pPos.y
    );
    expect(size).toEqual(new Vector2f(290, 6));
  });
  test('Definir o tamanho de uma caixa de colisão a partir de dois vetores (floats - falhar)', () => {
    const pPos = new Vector2f(100, 245);
    const nPos = new Vector2f(390, 245.005);
    const size = connectionPath.setCollisionShapeSize(
      pPos,
      nPos,
      6,
      nPos.x - pPos.x,
      6,
      nPos.y - pPos.y
    );
    expect(size).not.toEqual(new Vector2f(290, 6));
  });
  test('Criar lista objetos de caixas de colisão', () => {
    const pos = new Vector2i(100, 100);
    const endPos = new Vector2i(1000, 1000);
    const anchors = pathFinder.simplePathFinder(pos, endPos);
    const bb = connectionPath.generateCollisionShapes(pos, endPos, anchors);
    expect(bb.length).toBe(4);
    expect(bb[0]).toBeInstanceOf(BoxCollision);
  });
});
