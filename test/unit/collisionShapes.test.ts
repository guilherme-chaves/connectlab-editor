// eslint-disable-next-line node/no-unpublished-import
import {expect, test, describe, beforeAll} from 'vitest';

import BoxCollision from '@connectlab-editor/collisionShapes/boxCollision';
import CircleCollision from '@connectlab-editor/collisionShapes/circleCollision';
import Vector2 from '@connectlab-editor/types/vector2';

let box: BoxCollision;
let box2: BoxCollision;
let circle: CircleCollision;
let circle2: CircleCollision;

describe('Testes de funcionamento das formas de colisão', () => {
  beforeAll(() => {
    box = new BoxCollision(new Vector2(100, 100), 500, 200);
    box2 = new BoxCollision(new Vector2(), 120, 120, '#8080FF');
    circle = new CircleCollision(new Vector2(400, 200), 100);
    circle2 = new CircleCollision(new Vector2(550, 300), 150, '#8080FF');
  });

  test('Colisão entre caixas de colisão', () => {
    expect(box.collisionWithBox(box2)).toBe(true);
  });

  test('Colisão entre círculos de colisão', () => {
    expect(circle.collisionWithCircle(circle2)).toBe(true);
  });

  test('Movimentar caixa de colisão', () => {
    box2.moveShape(new Vector2(550, 250), false);
    expect(box2.position).toEqual({_x: 550, _y: 250, useInt: true});
  });

  test('Colisão entre uma caixa e um círculo', () => {
    expect(box.collisionWithCircle(circle)).toBe(false);
    expect(box2.collisionWithCircle(circle2)).toBe(true);
  });

  test('Movimentar um círculo de colisão', () => {
    circle2.moveShape(new Vector2(-100, 50));
    expect(circle2.position).toEqual({_x: 450, _y: 350, useInt: true});
    circle.moveShape(new Vector2(100, 100), false);
    expect(circle.position).toEqual({_x: 100, _y: 100, useInt: true});
  });
});
