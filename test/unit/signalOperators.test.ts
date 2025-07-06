/* eslint-disable node/no-unpublished-import */
import {signalOperations} from '@connectlab-editor/signal/signalOperations';
import {expect, test, describe} from 'vitest';

describe('Testes de prova das funções de matemática booleana', () => {
  test('AND - 2 operadores', () => {
    expect(signalOperations.and(0b11, 2)).toBe(true);
    expect(signalOperations.and(0b10, 2)).toBe(false);
    expect(signalOperations.and(0b01, 2)).toBe(false);
    expect(signalOperations.and(0b00, 2)).toBe(false);
  });
  test('AND - 3 operadores', () => {
    expect(signalOperations.and(0b111, 3)).toBe(true);
    expect(signalOperations.and(0b110, 3)).toBe(false);
    expect(signalOperations.and(0b101, 3)).toBe(false);
    expect(signalOperations.and(0b100, 3)).toBe(false);
    expect(signalOperations.and(0b011, 3)).toBe(false);
    expect(signalOperations.and(0b010, 3)).toBe(false);
    expect(signalOperations.and(0b001, 3)).toBe(false);
    expect(signalOperations.and(0b000, 3)).toBe(false);
  });
  test('NAND - 2 operadores', () => {
    expect(signalOperations.nand(0b11, 2)).toBe(false);
    expect(signalOperations.nand(0b10, 2)).toBe(true);
    expect(signalOperations.nand(0b01, 2)).toBe(true);
    expect(signalOperations.nand(0b00, 2)).toBe(true);
  });
  test('NAND - 3 operadores', () => {
    expect(signalOperations.nand(0b111, 3)).toBe(false);
    expect(signalOperations.nand(0b110, 3)).toBe(true);
    expect(signalOperations.nand(0b101, 3)).toBe(true);
    expect(signalOperations.nand(0b100, 3)).toBe(true);
    expect(signalOperations.nand(0b011, 3)).toBe(true);
    expect(signalOperations.nand(0b010, 3)).toBe(true);
    expect(signalOperations.nand(0b001, 3)).toBe(true);
    expect(signalOperations.nand(0b000, 3)).toBe(true);
  });
  test('NOR - 2 operadores', () => {
    expect(signalOperations.nor(0b11, 2)).toBe(false);
    expect(signalOperations.nor(0b10, 2)).toBe(false);
    expect(signalOperations.nor(0b01, 2)).toBe(false);
    expect(signalOperations.nor(0b00, 2)).toBe(true);
  });
  test('NOR - 3 operadores', () => {
    expect(signalOperations.nor(0b111, 3)).toBe(false);
    expect(signalOperations.nor(0b110, 3)).toBe(false);
    expect(signalOperations.nor(0b101, 3)).toBe(false);
    expect(signalOperations.nor(0b100, 3)).toBe(false);
    expect(signalOperations.nor(0b011, 3)).toBe(false);
    expect(signalOperations.nor(0b010, 3)).toBe(false);
    expect(signalOperations.nor(0b001, 3)).toBe(false);
    expect(signalOperations.nor(0b000, 3)).toBe(true);
  });
  test('NOT - 1 operador', () => {
    expect(signalOperations.not(0b1, 1)).toBe(false);
    expect(signalOperations.not(0b0, 1)).toBe(true);
  });
  test('NOT - 2 operadores', () => {
    expect(signalOperations.not(0b11, 2)).toBe(false);
    expect(signalOperations.not(0b10, 2)).toBe(false);
    expect(signalOperations.not(0b01, 2)).toBe(false);
    expect(signalOperations.not(0b00, 2)).toBe(true);
  });
  test('OR - 2 operadores', () => {
    expect(signalOperations.or(0b11, 2)).toBe(true);
    expect(signalOperations.or(0b10, 2)).toBe(true);
    expect(signalOperations.or(0b01, 2)).toBe(true);
    expect(signalOperations.or(0b00, 2)).toBe(false);
  });
  test('OR - 3 operadores', () => {
    expect(signalOperations.or(0b111, 3)).toBe(true);
    expect(signalOperations.or(0b110, 3)).toBe(true);
    expect(signalOperations.or(0b101, 3)).toBe(true);
    expect(signalOperations.or(0b100, 3)).toBe(true);
    expect(signalOperations.or(0b011, 3)).toBe(true);
    expect(signalOperations.or(0b010, 3)).toBe(true);
    expect(signalOperations.or(0b001, 3)).toBe(true);
    expect(signalOperations.or(0b000, 3)).toBe(false);
  });
  test('XNOR - 2 operadores', () => {
    expect(signalOperations.xnor(0b11, 2)).toBe(true);
    expect(signalOperations.xnor(0b10, 2)).toBe(false);
    expect(signalOperations.xnor(0b01, 2)).toBe(false);
    expect(signalOperations.xnor(0b00, 2)).toBe(true);
  });
  test('XNOR - 3 operadores', () => {
    expect(signalOperations.xnor(0b111, 3)).toBe(false);
    expect(signalOperations.xnor(0b110, 3)).toBe(true);
    expect(signalOperations.xnor(0b101, 3)).toBe(true);
    expect(signalOperations.xnor(0b100, 3)).toBe(false);
    expect(signalOperations.xnor(0b011, 3)).toBe(true);
    expect(signalOperations.xnor(0b010, 3)).toBe(false);
    expect(signalOperations.xnor(0b001, 3)).toBe(false);
    expect(signalOperations.xnor(0b000, 3)).toBe(true);
  });
  test('XOR - 2 operadores', () => {
    expect(signalOperations.xor(0b11, 2)).toBe(false);
    expect(signalOperations.xor(0b10, 2)).toBe(true);
    expect(signalOperations.xor(0b01, 2)).toBe(true);
    expect(signalOperations.xor(0b00, 2)).toBe(false);
  });
  test('XOR - 3 operadores', () => {
    expect(signalOperations.xor(0b111, 3)).toBe(true);
    expect(signalOperations.xor(0b101, 3)).toBe(false);
    expect(signalOperations.xor(0b110, 3)).toBe(false);
    expect(signalOperations.xor(0b100, 3)).toBe(true);
    expect(signalOperations.xor(0b011, 3)).toBe(false);
    expect(signalOperations.xor(0b010, 3)).toBe(true);
    expect(signalOperations.xor(0b001, 3)).toBe(true);
    expect(signalOperations.xor(0b000, 3)).toBe(false);
  });
});
