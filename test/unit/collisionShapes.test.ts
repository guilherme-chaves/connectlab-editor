import { expect, test, describe } from 'vitest';

import BoxCollision from '@connectlab-editor/collisionShapes/boxCollision';
import CircleCollision from '@connectlab-editor/collisionShapes/circleCollision';
import LineCollision from '@connectlab-editor/collisionShapes/lineCollision';
import Vector2i from '@connectlab-editor/types/vector2i';
import { Rad45Deg } from '@connectlab-editor/types/consts';

const circle = new CircleCollision(new Vector2i(500, 500), 25);
const box = new BoxCollision(new Vector2i(475, 475), 50, 50);
const line = new LineCollision(new Vector2i(475, 475), new Vector2i(525, 525));

describe('Testes com a área de colisão circular', () => {
  test('Mover o círculo', () => {
    const circle2 = new CircleCollision(new Vector2i(500, 500), 100);
    expect(circle2.position).toEqual({ _x: 500, _y: 500, type: 'int' });
    circle2.moveShape(Vector2i.ONE, true);
    expect(circle2.position).toEqual({ _x: 501, _y: 501, type: 'int' });
    circle2.moveShape(Vector2i.ZERO, false);
    expect(circle2.position).toEqual({ _x: 0, _y: 0, type: 'int' });
  });
  test('Colisão com outro círculo', () => {
    const circle2 = new CircleCollision(new Vector2i(530, 530), 40);
    expect(circle.collisionWithCircle(circle2)).toBe(true);
  });
  test('Colisão com outro círculo (limítrofe)', () => {
    const circle2 = new CircleCollision(new Vector2i(535, 455), 40);
    expect(circle.collisionWithCircle(circle2)).toBe(true);
  });
  test('Sem colisão com outro círculo', () => {
    const circle2 = new CircleCollision(new Vector2i(100, 450), 40);
    expect(circle.collisionWithCircle(circle2)).toBe(false);
  });
  test('Colisão com uma caixa', () => {
    const box2 = new BoxCollision(new Vector2i(450, 500), 100, 30);
    expect(circle.collisionWithBox(box2)).toBe(true);
    expect(box2.collisionWithCircle(circle)).toBe(true);
  });
  test('Colisão com uma caixa (esquerda)', () => {
    const box2 = new BoxCollision(new Vector2i(420, 485), 100, 30);
    expect(circle.collisionWithBox(box2)).toBe(true);
  });
  test('Colisão com uma caixa (cima)', () => {
    const box2 = new BoxCollision(new Vector2i(485, 480), 30, 30);
    expect(circle.collisionWithBox(box2)).toBe(true);
  });
  test('Colisão com uma caixa (direita)', () => {
    const box2 = new BoxCollision(new Vector2i(520, 485), 100, 30);
    expect(circle.collisionWithBox(box2)).toBe(true);
  });
  test('Colisão com uma caixa (baixo)', () => {
    const box2 = new BoxCollision(new Vector2i(480, 510), 40, 50);
    expect(circle.collisionWithBox(box2)).toBe(true);
  });
  test('Colisão com uma caixa (limítrofe - esquerda)', () => {
    const box2 = new BoxCollision(new Vector2i(400, 485), 100, 30);
    expect(circle.collisionWithBox(box2)).toBe(true);
    const box3 = new BoxCollision(new Vector2i(375, 485), 100, 30);
    expect(circle.collisionWithBox(box3)).toBe(false);
  });
  test('Colisão com uma caixa (limítrofe - cima)', () => {
    const box2 = new BoxCollision(new Vector2i(450, 446), 100, 30);
    expect(circle.collisionWithBox(box2)).toBe(true);
    const box3 = new BoxCollision(new Vector2i(450, 445), 100, 30);
    expect(circle.collisionWithBox(box3)).toBe(false);
  });
  test('Colisão com uma caixa (limítrofe - direita)', () => {
    const box2 = new BoxCollision(new Vector2i(524, 475), 100, 30);
    expect(circle.collisionWithBox(box2)).toBe(true);
    const box3 = new BoxCollision(new Vector2i(525, 475), 100, 30);
    expect(circle.collisionWithBox(box3)).toBe(false);
  });
  test('Colisão com uma caixa (limítrofe - baixo)', () => {
    const box2 = new BoxCollision(new Vector2i(450, 524), 100, 30);
    expect(circle.collisionWithBox(box2)).toBe(true);
    const box3 = new BoxCollision(new Vector2i(450, 525), 100, 30);
    expect(circle.collisionWithBox(box3)).toBe(false);
  });
  test('Sem colisão com uma caixa', () => {
    const box2 = new BoxCollision(new Vector2i(100, 200), 100, 30);
    expect(circle.collisionWithBox(box2)).toBe(false);
    expect(box2.collisionWithCircle(circle)).toBe(false);
  });
  test('Colisão com uma linha', () => {
    const line2 = new LineCollision(
      new Vector2i(450, 500),
      new Vector2i(510, 510),
    );
    expect(circle.collisionWithLine(line2)).toBe(true);
    expect(line2.collisionWithCircle(circle)).toBe(true);
  });
  test('Colisão com uma linha (limítrofe - início)', () => {
    const line2 = new LineCollision(
      new Vector2i(524, 500),
      new Vector2i(560, 500),
    );
    expect(circle.collisionWithLine(line2)).toBe(true);
    const line3 = new LineCollision(
      new Vector2i(525, 500),
      new Vector2i(560, 500),
    );
    expect(circle.collisionWithLine(line3)).toBe(false);
  });
  test('Colisão com uma linha (limítrofe - tangente)', () => {
    const line2 = new LineCollision(
      new Vector2i(476, 450),
      new Vector2i(476, 525),
    );
    expect(circle.collisionWithLine(line2)).toBe(true);
    const line3 = new LineCollision(
      new Vector2i(475, 450),
      new Vector2i(475, 525),
    );
    expect(circle.collisionWithLine(line3)).toBe(false);
  });
  test('Colisão com uma linha (limítrofe - fim)', () => {
    const line2 = new LineCollision(
      new Vector2i(400, 500),
      new Vector2i(476, 500),
    );
    expect(circle.collisionWithLine(line2)).toBe(true);
    const line3 = new LineCollision(
      new Vector2i(400, 500),
      new Vector2i(475, 500),
    );
    expect(circle.collisionWithLine(line3)).toBe(false);
  });
  test('Sem colisão com uma linha', () => {
    const line2 = new LineCollision(
      new Vector2i(240, 720),
      new Vector2i(388, 500),
    );
    expect(circle.collisionWithLine(line2)).toBe(false);
    expect(line2.collisionWithCircle(circle)).toBe(false);
  });
  test('Colisão com um ponto', () => {
    const point = new Vector2i(510, 496);
    expect(circle.collisionWithPoint(point)).toBe(true);
  });
  test('Colisão com um ponto (limítrofe)', () => {
    const point = Vector2i.add(
      new Vector2i(
        Math.cos(Rad45Deg) * circle.radius,
        Math.sin(Rad45Deg) * circle.radius,
      ),
      circle.position,
    );
    expect(circle.collisionWithPoint(point)).toBe(false);
    Vector2i.sub(point, Vector2i.ONE, point);
    expect(circle.collisionWithPoint(point)).toBe(true);
  });
  test('Sem colisão com um ponto', () => {
    const point = new Vector2i(100, 100);
    expect(circle.collisionWithPoint(point)).toBe(false);
  });
});

describe('Testes com a área de colisão retangular', () => {
  test('Alterar valor dos vértices ao mover caixa', () => {
    const box2 = new BoxCollision(new Vector2i(500, 500), 100, 100);
    expect(box2.vertices.a).toEqual({ _x: 500, _y: 500, type: 'int' });
    expect(box2.vertices.b).toEqual({ _x: 600, _y: 500, type: 'int' });
    expect(box2.vertices.c).toEqual({ _x: 600, _y: 600, type: 'int' });
    expect(box2.vertices.d).toEqual({ _x: 500, _y: 600, type: 'int' });
    box2.moveShape(Vector2i.ONE, true);
    expect(box2.vertices.a).toEqual({ _x: 501, _y: 501, type: 'int' });
    expect(box2.vertices.b).toEqual({ _x: 601, _y: 501, type: 'int' });
    expect(box2.vertices.c).toEqual({ _x: 601, _y: 601, type: 'int' });
    expect(box2.vertices.d).toEqual({ _x: 501, _y: 601, type: 'int' });
    box2.moveShape(Vector2i.ZERO, false);
    expect(box2.vertices.a).toEqual({ _x: 0, _y: 0, type: 'int' });
    expect(box2.vertices.b).toEqual({ _x: 100, _y: 0, type: 'int' });
    expect(box2.vertices.c).toEqual({ _x: 100, _y: 100, type: 'int' });
    expect(box2.vertices.d).toEqual({ _x: 0, _y: 100, type: 'int' });
  });
  test('Colisão com outra caixa', () => {
    const box2 = new BoxCollision(new Vector2i(450, 500), 100, 30);
    expect(box.collisionWithBox(box2)).toBe(true);
  });
  test('Colisão com outra caixa (esquerda)', () => {
    const box2 = new BoxCollision(new Vector2i(450, 500), 100, 30);
    expect(box.collisionWithBox(box2)).toBe(true);
  });
  test('Colisão com outra caixa (cima)', () => {
    const box2 = new BoxCollision(new Vector2i(450, 500), 100, 30);
    expect(box.collisionWithBox(box2)).toBe(true);
  });
  test('Colisão com outra caixa (direita)', () => {
    const box2 = new BoxCollision(new Vector2i(450, 500), 100, 30);
    expect(box.collisionWithBox(box2)).toBe(true);
  });
  test('Colisão com outra caixa (baixo)', () => {
    const box2 = new BoxCollision(new Vector2i(450, 500), 100, 30);
    expect(box.collisionWithBox(box2)).toBe(true);
  });
  test('Colisão com outra caixa (limítrofe - esquerda)', () => {
    const box2 = new BoxCollision(new Vector2i(450, 500), 100, 30);
    expect(box.collisionWithBox(box2)).toBe(true);
  });
  test('Colisão com outra caixa (limítrofe - cima)', () => {
    const box2 = new BoxCollision(new Vector2i(450, 500), 100, 30);
    expect(box.collisionWithBox(box2)).toBe(true);
  });
  test('Colisão com outra caixa (limítrofe - direita)', () => {
    const box2 = new BoxCollision(new Vector2i(450, 500), 100, 30);
    expect(box.collisionWithBox(box2)).toBe(true);
  });
  test('Colisão com outra caixa (limítrofe - baixo)', () => {
    const box2 = new BoxCollision(new Vector2i(450, 500), 100, 30);
    expect(box.collisionWithBox(box2)).toBe(true);
  });
  test('Sem colisão com outra caixa', () => {
    const box2 = new BoxCollision(new Vector2i(450, 500), 100, 30);
    expect(box.collisionWithBox(box2)).toBe(true);
  });
  test('Colisão com uma linha (dentro)', () => {
    const line2 = new LineCollision(
      new Vector2i(480, 500),
      new Vector2i(510, 520),
    );
    expect(box.collisionWithLine(line2)).toBe(true);
    expect(line2.collisionWithBox(box)).toBe(true);
  });
  test('Colisão com uma linha (esquerda)', () => {
    const line2 = new LineCollision(
      new Vector2i(400, 500),
      new Vector2i(475, 500),
    );
    expect(box.collisionWithLine(line2)).toBe(true);
    const line3 = new LineCollision(
      new Vector2i(400, 500),
      new Vector2i(474, 500),
    );
    expect(box.collisionWithLine(line3)).toBe(false);
  });
  test('Colisão com uma linha (cima)', () => {
    const line2 = new LineCollision(
      new Vector2i(490, 440),
      new Vector2i(490, 475),
    );
    expect(box.collisionWithLine(line2)).toBe(true);
    const line3 = new LineCollision(
      new Vector2i(490, 440),
      new Vector2i(490, 474),
    );
    expect(box.collisionWithLine(line3)).toBe(false);
  });
  test('Colisão com uma linha (direita)', () => {
    const line2 = new LineCollision(
      new Vector2i(525, 500),
      new Vector2i(570, 500),
    );
    expect(box.collisionWithLine(line2)).toBe(true);
    const line3 = new LineCollision(
      new Vector2i(526, 500),
      new Vector2i(570, 500),
    );
    expect(box.collisionWithLine(line3)).toBe(false);
  });
  test('Colisão com uma linha (baixo)', () => {
    const line2 = new LineCollision(
      new Vector2i(515, 525),
      new Vector2i(515, 600),
    );
    expect(box.collisionWithLine(line2)).toBe(true);
    const line3 = new LineCollision(
      new Vector2i(515, 526),
      new Vector2i(515, 600),
    );
    expect(box.collisionWithLine(line3)).toBe(false);
  });
  test('Sem colisão com uma linha', () => {
    const line2 = new LineCollision(
      new Vector2i(720, 651),
      new Vector2i(850, 510),
    );
    expect(box.collisionWithLine(line2)).toBe(false);
    expect(line2.collisionWithBox(box)).toBe(false);
  });
  test('Colisão com um ponto', () => {
    const point = new Vector2i(480, 505);
    expect(box.collisionWithPoint(point)).toBe(true);
  });
  test('Colisão com um ponto (limítrofe)', () => {
    const point = new Vector2i(476, 505);
    expect(box.collisionWithPoint(point)).toBe(true);
    const point2 = new Vector2i(475, 505);
    expect(box.collisionWithPoint(point2)).toBe(false);
  });
  test('Sem colisão com um ponto', () => {
    const point = new Vector2i(80, 300);
    expect(box.collisionWithPoint(point)).toBe(false);
  });
});

describe('Testes com uma linha', () => {
  test('Mover uma linha', () => {
    const line2 = new LineCollision(
      new Vector2i(475, 500),
      new Vector2i(525, 500),
    );
    line2.moveShape(Vector2i.ONE, true);
    expect(line2.position).toEqual({ _x: 476, _y: 501, type: 'int' });
    expect(line2.endPosition).toEqual({ _x: 526, _y: 501, type: 'int' });
    line2.moveShape(Vector2i.ZERO, false);
    expect(line2.position).toEqual({ _x: 0, _y: 0, type: 'int' });
    expect(line2.endPosition).toEqual({ _x: 50, _y: 0, type: 'int' });
  });
  test('Colisão com outra linha', () => {
    const line2 = new LineCollision(
      new Vector2i(475, 500),
      new Vector2i(525, 500),
    );
    expect(line.collisionWithLine(line2)).toBe(true);
  });
  test('Colisão com outra linha (inversa)', () => {
    const line2 = new LineCollision(
      new Vector2i(525, 500),
      new Vector2i(475, 500),
    );
    expect(line.collisionWithLine(line2)).toBe(true);
  });
  test('Colisão com outra linha (perpendicular)', () => {
    const line2 = new LineCollision(
      new Vector2i(475, 500),
      new Vector2i(525, 475),
    );
    expect(line.collisionWithLine(line2)).toBe(true);
  });
  test('Colisão com outra linha (perpendicular inversa)', () => {
    const line2 = new LineCollision(
      new Vector2i(525, 475),
      new Vector2i(475, 500),
    );
    expect(line.collisionWithLine(line2)).toBe(true);
  });
  test('Colisão com outra linha (colineares)', () => {
    const line2 = new LineCollision(
      new Vector2i(450, 450),
      new Vector2i(550, 550),
    );
    expect(line.collisionWithLine(line2)).toBe(true);
    const line3 = new LineCollision(
      new Vector2i(500, 100),
      new Vector2i(550, 100),
    );
    const line4 = new LineCollision(
      new Vector2i(530, 100),
      new Vector2i(580, 100),
    );
    expect(line3.collisionWithLine(line4)).toBe(true);
    const line5 = new LineCollision(
      new Vector2i(120, 1000),
      new Vector2i(120, 1100),
    );
    const line6 = new LineCollision(
      new Vector2i(120, 950),
      new Vector2i(120, 1010),
    );
    expect(line5.collisionWithLine(line6)).toBe(true);
  });
  test('Colisão com outra linha (colineares inversas)', () => {
    const line2 = new LineCollision(
      new Vector2i(560, 560),
      new Vector2i(525, 525),
    );
    expect(line.collisionWithLine(line2)).toBe(true);
    const line3 = new LineCollision(
      new Vector2i(550, 100),
      new Vector2i(500, 100),
    );
    const line4 = new LineCollision(
      new Vector2i(530, 100),
      new Vector2i(580, 100),
    );
    expect(line3.collisionWithLine(line4)).toBe(true);
    const line5 = new LineCollision(
      new Vector2i(120, 1100),
      new Vector2i(120, 1000),
    );
    const line6 = new LineCollision(
      new Vector2i(120, 950),
      new Vector2i(120, 1010),
    );
    expect(line5.collisionWithLine(line6)).toBe(true);
    const line7 = new LineCollision(
      new Vector2i(500, 100),
      new Vector2i(550, 100),
    );
    const line8 = new LineCollision(
      new Vector2i(600, 100),
      new Vector2i(540, 100),
    );
    expect(line7.collisionWithLine(line8)).toBe(true);
    const line9 = new LineCollision(
      new Vector2i(120, 1000),
      new Vector2i(120, 1100),
    );
    const line10 = new LineCollision(
      new Vector2i(120, 1010),
      new Vector2i(120, 900),
    );
    expect(line9.collisionWithLine(line10)).toBe(true);
    const line11 = new LineCollision(
      new Vector2i(550, 100),
      new Vector2i(500, 100),
    );
    const line12 = new LineCollision(
      new Vector2i(600, 100),
      new Vector2i(540, 100),
    );
    expect(line11.collisionWithLine(line12)).toBe(true);
    const line13 = new LineCollision(
      new Vector2i(120, 1100),
      new Vector2i(120, 1000),
    );
    const line14 = new LineCollision(
      new Vector2i(120, 1010),
      new Vector2i(120, 900),
    );
    expect(line13.collisionWithLine(line14)).toBe(true);
  });
  test('Sem colisão com outra linha (colineares)', () => {
    const line2 = new LineCollision(
      new Vector2i(400, 400),
      new Vector2i(449, 449),
    );
    expect(line.collisionWithLine(line2)).toBe(false);
    const line3 = new LineCollision(
      new Vector2i(500, 100),
      new Vector2i(550, 100),
    );
    const line4 = new LineCollision(
      new Vector2i(560, 100),
      new Vector2i(600, 100),
    );
    expect(line3.collisionWithLine(line4)).toBe(false);
    const line5 = new LineCollision(
      new Vector2i(120, 1000),
      new Vector2i(120, 1100),
    );
    const line6 = new LineCollision(
      new Vector2i(120, 900),
      new Vector2i(120, 950),
    );
    expect(line5.collisionWithLine(line6)).toBe(false);
  });
  test('Sem colisão com outra linha (colineares inversas)', () => {
    const line2 = new LineCollision(
      new Vector2i(449, 449),
      new Vector2i(400, 400),
    );
    expect(line.collisionWithLine(line2)).toBe(false);
    const line3 = new LineCollision(
      new Vector2i(550, 100),
      new Vector2i(500, 100),
    );
    const line4 = new LineCollision(
      new Vector2i(560, 100),
      new Vector2i(600, 100),
    );
    expect(line3.collisionWithLine(line4)).toBe(false);
    const line5 = new LineCollision(
      new Vector2i(120, 1100),
      new Vector2i(120, 1000),
    );
    const line6 = new LineCollision(
      new Vector2i(120, 900),
      new Vector2i(120, 950),
    );
    expect(line5.collisionWithLine(line6)).toBe(false);
    const line7 = new LineCollision(
      new Vector2i(500, 100),
      new Vector2i(550, 100),
    );
    const line8 = new LineCollision(
      new Vector2i(600, 100),
      new Vector2i(560, 100),
    );
    expect(line7.collisionWithLine(line8)).toBe(false);
    const line9 = new LineCollision(
      new Vector2i(120, 1000),
      new Vector2i(120, 1100),
    );
    const line10 = new LineCollision(
      new Vector2i(120, 950),
      new Vector2i(120, 900),
    );
    expect(line9.collisionWithLine(line10)).toBe(false);
    const line11 = new LineCollision(
      new Vector2i(550, 100),
      new Vector2i(500, 100),
    );
    const line12 = new LineCollision(
      new Vector2i(600, 100),
      new Vector2i(560, 100),
    );
    expect(line11.collisionWithLine(line12)).toBe(false);
    const line13 = new LineCollision(
      new Vector2i(120, 1100),
      new Vector2i(120, 1000),
    );
    const line14 = new LineCollision(
      new Vector2i(120, 960),
      new Vector2i(120, 900),
    );
    expect(line13.collisionWithLine(line14)).toBe(false);
  });
  test('Colisão com outra linha (limítrofe - início)', () => {
    const line2 = new LineCollision(
      new Vector2i(450, 450),
      new Vector2i(475, 475),
    );
    expect(line.collisionWithLine(line2)).toBe(true);
    Vector2i.sub(line2.endPosition, Vector2i.ONE, line2.endPosition);
    expect(line.collisionWithLine(line2)).toBe(false);
  });
  test('Colisão com outra linha (limítrofe - fim)', () => {
    const line2 = new LineCollision(
      new Vector2i(525, 525),
      new Vector2i(550, 550),
    );
    expect(line.collisionWithLine(line2)).toBe(true);
    Vector2i.add(line2.position, Vector2i.ONE, line2.position);
    expect(line.collisionWithLine(line2)).toBe(false);
  });
  test('Sem colisão com uma linha', () => {
    const line2 = new LineCollision(
      new Vector2i(475, 500),
      new Vector2i(499, 500),
    );
    expect(line.collisionWithLine(line2)).toBe(false);
  });
  test('Colisão com um ponto', () => {
    const point = new Vector2i(490, 490);
    expect(box.collisionWithPoint(point)).toBe(true);
  });
  test('Colisão com um ponto (limítrofe - início)', () => {
    const point = new Vector2i(475, 475);
    expect(line.collisionWithPoint(point)).toBe(true);
    Vector2i.sub(point, Vector2i.ONE, point);
    expect(line.collisionWithPoint(point)).toBe(false);
  });
  test('Colisão com um ponto (limítrofe - fim)', () => {
    const point = new Vector2i(525, 525);
    expect(line.collisionWithPoint(point)).toBe(true);
    Vector2i.add(point, Vector2i.ONE, point);
    expect(line.collisionWithPoint(point)).toBe(false);
  });
  test('Sem colisão com um ponto', () => {
    const point = new Vector2i(450, 450);
    expect(line.collisionWithPoint(point)).toBe(false);
  });
});
