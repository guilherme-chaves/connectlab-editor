import { expect, test, describe } from 'vitest';

import BoxCollision from '@connectlab-editor/collisionShapes/boxCollision';
import CircleCollision from '@connectlab-editor/collisionShapes/circleCollision';
import LineCollision from '@connectlab-editor/collisionShapes/lineCollision';
import Vector2 from '@connectlab-editor/types/vector2i';
import { Rad45Deg } from '@connectlab-editor/types/consts';

const circle = new CircleCollision(new Vector2(500, 500), 25);
const box = new BoxCollision(new Vector2(475, 475), 50, 50);
const line = new LineCollision(new Vector2(475, 475), new Vector2(525, 525));

describe('Testes com a área de colisão circular', () => {
  test('Mover o círculo', () => {
    const circle2 = new CircleCollision(new Vector2(500, 500), 100);
    expect(circle2.position).toEqual({ _x: 500, _y: 500, type: 'int' });
    circle2.moveShape(Vector2.ONE, true);
    expect(circle2.position).toEqual({ _x: 501, _y: 501, type: 'int' });
    circle2.moveShape(Vector2.ZERO, false);
    expect(circle2.position).toEqual({ _x: 0, _y: 0, type: 'int' });
  });
  test('Colisão com outro círculo', () => {
    const circle2 = new CircleCollision(new Vector2(530, 530), 40);
    expect(circle.collisionWithCircle(circle2)).toBe(true);
  });
  test('Colisão com outro círculo (limítrofe)', () => {
    const circle2 = new CircleCollision(new Vector2(535, 455), 40);
    expect(circle.collisionWithCircle(circle2)).toBe(true);
  });
  test('Sem colisão com outro círculo', () => {
    const circle2 = new CircleCollision(new Vector2(100, 450), 40);
    expect(circle.collisionWithCircle(circle2)).toBe(false);
  });
  test('Colisão com uma caixa', () => {
    const box2 = new BoxCollision(new Vector2(450, 500), 100, 30);
    expect(circle.collisionWithBox(box2)).toBe(true);
    expect(box2.collisionWithCircle(circle)).toBe(true);
  });
  test('Colisão com uma caixa (esquerda)', () => {
    const box2 = new BoxCollision(new Vector2(420, 485), 100, 30);
    expect(circle.collisionWithBox(box2)).toBe(true);
  });
  test('Colisão com uma caixa (cima)', () => {
    const box2 = new BoxCollision(new Vector2(485, 480), 30, 30);
    expect(circle.collisionWithBox(box2)).toBe(true);
  });
  test('Colisão com uma caixa (direita)', () => {
    const box2 = new BoxCollision(new Vector2(520, 485), 100, 30);
    expect(circle.collisionWithBox(box2)).toBe(true);
  });
  test('Colisão com uma caixa (baixo)', () => {
    const box2 = new BoxCollision(new Vector2(480, 510), 40, 50);
    expect(circle.collisionWithBox(box2)).toBe(true);
  });
  test('Colisão com uma caixa (limítrofe - esquerda)', () => {
    const box2 = new BoxCollision(new Vector2(400, 485), 100, 30);
    expect(circle.collisionWithBox(box2)).toBe(true);
    const box3 = new BoxCollision(new Vector2(375, 485), 100, 30);
    expect(circle.collisionWithBox(box3)).toBe(false);
  });
  test('Colisão com uma caixa (limítrofe - cima)', () => {
    const box2 = new BoxCollision(new Vector2(450, 446), 100, 30);
    expect(circle.collisionWithBox(box2)).toBe(true);
    const box3 = new BoxCollision(new Vector2(450, 445), 100, 30);
    expect(circle.collisionWithBox(box3)).toBe(false);
  });
  test('Colisão com uma caixa (limítrofe - direita)', () => {
    const box2 = new BoxCollision(new Vector2(524, 475), 100, 30);
    expect(circle.collisionWithBox(box2)).toBe(true);
    const box3 = new BoxCollision(new Vector2(525, 475), 100, 30);
    expect(circle.collisionWithBox(box3)).toBe(false);
  });
  test('Colisão com uma caixa (limítrofe - baixo)', () => {
    const box2 = new BoxCollision(new Vector2(450, 524), 100, 30);
    expect(circle.collisionWithBox(box2)).toBe(true);
    const box3 = new BoxCollision(new Vector2(450, 525), 100, 30);
    expect(circle.collisionWithBox(box3)).toBe(false);
  });
  test('Sem colisão com uma caixa', () => {
    const box2 = new BoxCollision(new Vector2(100, 200), 100, 30);
    expect(circle.collisionWithBox(box2)).toBe(false);
    expect(box2.collisionWithCircle(circle)).toBe(false);
  });
  test('Colisão com uma linha', () => {
    const line2 = new LineCollision(
      new Vector2(450, 500),
      new Vector2(510, 510),
    );
    expect(circle.collisionWithLine(line2)).toBe(true);
    expect(line2.collisionWithCircle(circle)).toBe(true);
  });
  test('Colisão com uma linha (limítrofe - início)', () => {
    const line2 = new LineCollision(
      new Vector2(524, 500),
      new Vector2(560, 500),
    );
    expect(circle.collisionWithLine(line2)).toBe(true);
    const line3 = new LineCollision(
      new Vector2(525, 500),
      new Vector2(560, 500),
    );
    expect(circle.collisionWithLine(line3)).toBe(false);
  });
  test('Colisão com uma linha (limítrofe - tangente)', () => {
    const line2 = new LineCollision(
      new Vector2(476, 450),
      new Vector2(476, 525),
    );
    expect(circle.collisionWithLine(line2)).toBe(true);
    const line3 = new LineCollision(
      new Vector2(475, 450),
      new Vector2(475, 525),
    );
    expect(circle.collisionWithLine(line3)).toBe(false);
  });
  test('Colisão com uma linha (limítrofe - fim)', () => {
    const line2 = new LineCollision(
      new Vector2(400, 500),
      new Vector2(476, 500),
    );
    expect(circle.collisionWithLine(line2)).toBe(true);
    const line3 = new LineCollision(
      new Vector2(400, 500),
      new Vector2(475, 500),
    );
    expect(circle.collisionWithLine(line3)).toBe(false);
  });
  test('Sem colisão com uma linha', () => {
    const line2 = new LineCollision(
      new Vector2(240, 720),
      new Vector2(388, 500),
    );
    expect(circle.collisionWithLine(line2)).toBe(false);
    expect(line2.collisionWithCircle(circle)).toBe(false);
  });
  test('Colisão com um ponto', () => {
    const point = new Vector2(510, 496);
    expect(circle.collisionWithPoint(point)).toBe(true);
  });
  test('Colisão com um ponto (limítrofe)', () => {
    const point = new Vector2(
      Math.cos(Rad45Deg) * circle.radius,
      Math.sin(Rad45Deg) * circle.radius,
    ).add(circle.position);
    expect(circle.collisionWithPoint(point)).toBe(false);
    point.sub(Vector2.ONE);
    expect(circle.collisionWithPoint(point)).toBe(true);
  });
  test('Sem colisão com um ponto', () => {
    const point = new Vector2(100, 100);
    expect(circle.collisionWithPoint(point)).toBe(false);
  });
});

describe('Testes com a área de colisão retangular', () => {
  test('Alterar valor dos vértices ao mover caixa', () => {
    const box2 = new BoxCollision(new Vector2(500, 500), 100, 100);
    expect(box2.vertices.a).toEqual({ _x: 500, _y: 500, type: 'int' });
    expect(box2.vertices.b).toEqual({ _x: 600, _y: 500, type: 'int' });
    expect(box2.vertices.c).toEqual({ _x: 600, _y: 600, type: 'int' });
    expect(box2.vertices.d).toEqual({ _x: 500, _y: 600, type: 'int' });
    box2.moveShape(Vector2.ONE, true);
    expect(box2.vertices.a).toEqual({ _x: 501, _y: 501, type: 'int' });
    expect(box2.vertices.b).toEqual({ _x: 601, _y: 501, type: 'int' });
    expect(box2.vertices.c).toEqual({ _x: 601, _y: 601, type: 'int' });
    expect(box2.vertices.d).toEqual({ _x: 501, _y: 601, type: 'int' });
    box2.moveShape(Vector2.ZERO, false);
    expect(box2.vertices.a).toEqual({ _x: 0, _y: 0, type: 'int' });
    expect(box2.vertices.b).toEqual({ _x: 100, _y: 0, type: 'int' });
    expect(box2.vertices.c).toEqual({ _x: 100, _y: 100, type: 'int' });
    expect(box2.vertices.d).toEqual({ _x: 0, _y: 100, type: 'int' });
  });
  test('Colisão com outra caixa', () => {
    const box2 = new BoxCollision(new Vector2(450, 500), 100, 30);
    expect(box.collisionWithBox(box2)).toBe(true);
  });
  test('Colisão com outra caixa (esquerda)', () => {
    const box2 = new BoxCollision(new Vector2(450, 500), 100, 30);
    expect(box.collisionWithBox(box2)).toBe(true);
  });
  test('Colisão com outra caixa (cima)', () => {
    const box2 = new BoxCollision(new Vector2(450, 500), 100, 30);
    expect(box.collisionWithBox(box2)).toBe(true);
  });
  test('Colisão com outra caixa (direita)', () => {
    const box2 = new BoxCollision(new Vector2(450, 500), 100, 30);
    expect(box.collisionWithBox(box2)).toBe(true);
  });
  test('Colisão com outra caixa (baixo)', () => {
    const box2 = new BoxCollision(new Vector2(450, 500), 100, 30);
    expect(box.collisionWithBox(box2)).toBe(true);
  });
  test('Colisão com outra caixa (limítrofe - esquerda)', () => {
    const box2 = new BoxCollision(new Vector2(450, 500), 100, 30);
    expect(box.collisionWithBox(box2)).toBe(true);
  });
  test('Colisão com outra caixa (limítrofe - cima)', () => {
    const box2 = new BoxCollision(new Vector2(450, 500), 100, 30);
    expect(box.collisionWithBox(box2)).toBe(true);
  });
  test('Colisão com outra caixa (limítrofe - direita)', () => {
    const box2 = new BoxCollision(new Vector2(450, 500), 100, 30);
    expect(box.collisionWithBox(box2)).toBe(true);
  });
  test('Colisão com outra caixa (limítrofe - baixo)', () => {
    const box2 = new BoxCollision(new Vector2(450, 500), 100, 30);
    expect(box.collisionWithBox(box2)).toBe(true);
  });
  test('Sem colisão com outra caixa', () => {
    const box2 = new BoxCollision(new Vector2(450, 500), 100, 30);
    expect(box.collisionWithBox(box2)).toBe(true);
  });
  test('Colisão com uma linha (dentro)', () => {
    const line2 = new LineCollision(
      new Vector2(480, 500),
      new Vector2(510, 520),
    );
    expect(box.collisionWithLine(line2)).toBe(true);
    expect(line2.collisionWithBox(box)).toBe(true);
  });
  test('Colisão com uma linha (esquerda)', () => {
    const line2 = new LineCollision(
      new Vector2(400, 500),
      new Vector2(475, 500),
    );
    expect(box.collisionWithLine(line2)).toBe(true);
    const line3 = new LineCollision(
      new Vector2(400, 500),
      new Vector2(474, 500),
    );
    expect(box.collisionWithLine(line3)).toBe(false);
  });
  test('Colisão com uma linha (cima)', () => {
    const line2 = new LineCollision(
      new Vector2(490, 440),
      new Vector2(490, 475),
    );
    expect(box.collisionWithLine(line2)).toBe(true);
    const line3 = new LineCollision(
      new Vector2(490, 440),
      new Vector2(490, 474),
    );
    expect(box.collisionWithLine(line3)).toBe(false);
  });
  test('Colisão com uma linha (direita)', () => {
    const line2 = new LineCollision(
      new Vector2(525, 500),
      new Vector2(570, 500),
    );
    expect(box.collisionWithLine(line2)).toBe(true);
    const line3 = new LineCollision(
      new Vector2(526, 500),
      new Vector2(570, 500),
    );
    expect(box.collisionWithLine(line3)).toBe(false);
  });
  test('Colisão com uma linha (baixo)', () => {
    const line2 = new LineCollision(
      new Vector2(515, 525),
      new Vector2(515, 600),
    );
    expect(box.collisionWithLine(line2)).toBe(true);
    const line3 = new LineCollision(
      new Vector2(515, 526),
      new Vector2(515, 600),
    );
    expect(box.collisionWithLine(line3)).toBe(false);
  });
  test('Sem colisão com uma linha', () => {
    const line2 = new LineCollision(
      new Vector2(720, 651),
      new Vector2(850, 510),
    );
    expect(box.collisionWithLine(line2)).toBe(false);
    expect(line2.collisionWithBox(box)).toBe(false);
  });
  test('Colisão com um ponto', () => {
    const point = new Vector2(480, 505);
    expect(box.collisionWithPoint(point)).toBe(true);
  });
  test('Colisão com um ponto (limítrofe)', () => {
    const point = new Vector2(476, 505);
    expect(box.collisionWithPoint(point)).toBe(true);
    const point2 = new Vector2(475, 505);
    expect(box.collisionWithPoint(point2)).toBe(false);
  });
  test('Sem colisão com um ponto', () => {
    const point = new Vector2(80, 300);
    expect(box.collisionWithPoint(point)).toBe(false);
  });
});

describe('Testes com uma linha', () => {
  test('Mover uma linha', () => {
    const line2 = new LineCollision(
      new Vector2(475, 500),
      new Vector2(525, 500),
    );
    line2.moveShape(Vector2.ONE, true);
    expect(line2.position).toEqual({ _x: 476, _y: 501, type: 'int' });
    expect(line2.endPosition).toEqual({ _x: 526, _y: 501, type: 'int' });
    line2.moveShape(Vector2.ZERO, false);
    expect(line2.position).toEqual({ _x: 0, _y: 0, type: 'int' });
    expect(line2.endPosition).toEqual({ _x: 50, _y: 0, type: 'int' });
  });
  test('Colisão com outra linha', () => {
    const line2 = new LineCollision(
      new Vector2(475, 500),
      new Vector2(525, 500),
    );
    expect(line.collisionWithLine(line2)).toBe(true);
  });
  test('Colisão com outra linha (perpendicular)', () => {
    const line2 = new LineCollision(
      new Vector2(475, 500),
      new Vector2(525, 475),
    );
    expect(line.collisionWithLine(line2)).toBe(true);
  });
  test('Colisão com outra linha (colineares)', () => {
    const line2 = new LineCollision(
      new Vector2(450, 450),
      new Vector2(550, 550),
    );
    expect(line.collisionWithLine(line2)).toBe(true);
  });
  test('Colisão com outra linha (limítrofe - início)', () => {
    const line2 = new LineCollision(
      new Vector2(450, 450),
      new Vector2(475, 475),
    );
    expect(line.collisionWithLine(line2)).toBe(true);
    line2.endPosition.sub(Vector2.ONE);
    expect(line.collisionWithLine(line2)).toBe(false);
  });
  test('Colisão com outra linha (limítrofe - fim)', () => {
    const line2 = new LineCollision(
      new Vector2(525, 525),
      new Vector2(550, 550),
    );
    expect(line.collisionWithLine(line2)).toBe(true);
    line2.position.add(Vector2.ONE);
    expect(line.collisionWithLine(line2)).toBe(false);
  });
  test('Sem colisão com uma linha', () => {
    const line2 = new LineCollision(
      new Vector2(475, 500),
      new Vector2(490, 500),
    );
    expect(line.collisionWithLine(line2)).toBe(false);
  });
  test('Colisão com um ponto', () => {
    const point = new Vector2(490, 490);
    expect(box.collisionWithPoint(point)).toBe(true);
  });
  test('Colisão com um ponto (limítrofe - início)', () => {
    const point = new Vector2(475, 475);
    expect(line.collisionWithPoint(point)).toBe(true);
    point.sub(Vector2.ONE);
    expect(line.collisionWithPoint(point)).toBe(false);
  });
  test('Colisão com um ponto (limítrofe - fim)', () => {
    const point = new Vector2(524, 524);
    expect(line.collisionWithPoint(point)).toBe(true);
    point.add(Vector2.LEFT);
    expect(line.collisionWithPoint(point)).toBe(false);
  });
  test('Sem colisão com um ponto', () => {
    const point = new Vector2(450, 450);
    expect(line.collisionWithPoint(point)).toBe(false);
  });
});
