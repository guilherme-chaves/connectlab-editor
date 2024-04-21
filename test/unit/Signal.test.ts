// eslint-disable-next-line node/no-unpublished-import
import {expect, test, beforeEach} from '@jest/globals';
import {NodeTypes, SignalGraph} from '../../src/types/types';
import signalEvents from '../../src/functions/signal/signalEvents';
import signalUpdate from '../../src/functions/signal/signalUpdate';

describe('Testes com o grafo de sinal lógico', () => {
  let graph: SignalGraph = {};
  beforeEach(() => {
    graph = {};
  });
  test('Criar um elemento no grafo', () => {
    signalEvents.addVertex(graph, 0, NodeTypes.I_SWITCH, true);
    expect(graph[0]).toBeDefined();
    expect(graph[0].state).toBe(true);
  });
  test('Sinal da porta AND', () => {
    signalEvents.addVertex(graph, 0, NodeTypes.I_SWITCH, true, [], [2]);
    signalEvents.addVertex(graph, 1, NodeTypes.I_SWITCH, true, [], [2]);
    signalEvents.addVertex(graph, 2, NodeTypes.G_AND, false, [0, 1], [3]);
    signalEvents.addVertex(graph, 3, NodeTypes.O_LED_RED, false, [2]);
    signalUpdate.updateGraphPartial(graph, 0);
    expect(signalEvents.getVertexState(graph, 3)).toBe(true);

    signalEvents.setVertexState(graph, 0, false);
    signalUpdate.updateGraphPartial(graph, 0);
    expect(signalEvents.getVertexState(graph, 3)).toBe(false);

    signalEvents.setVertexState(graph, 0, true);
    signalEvents.setVertexState(graph, 1, false);
    signalUpdate.updateGraphPartial(graph, 0);
    expect(signalEvents.getVertexState(graph, 3)).toBe(false);

    signalEvents.setVertexState(graph, 0, false);
    signalUpdate.updateGraphPartial(graph, 0);
    expect(signalEvents.getVertexState(graph, 3)).toBe(false);
  });
  test('Sinal da porta NAND', () => {
    signalEvents.addVertex(graph, 0, NodeTypes.I_SWITCH, true, [], [2]);
    signalEvents.addVertex(graph, 1, NodeTypes.I_SWITCH, true, [], [2]);
    signalEvents.addVertex(graph, 2, NodeTypes.G_NAND, false, [0, 1], [3]);
    signalEvents.addVertex(graph, 3, NodeTypes.O_LED_RED, false, [2]);
    signalUpdate.updateGraphPartial(graph, 0);
    expect(signalEvents.getVertexState(graph, 3)).toBe(false);

    signalEvents.setVertexState(graph, 0, false);
    signalUpdate.updateGraphPartial(graph, 0);
    expect(signalEvents.getVertexState(graph, 3)).toBe(true);

    signalEvents.setVertexState(graph, 0, true);
    signalEvents.setVertexState(graph, 1, false);
    signalUpdate.updateGraphPartial(graph, 0);
    expect(signalEvents.getVertexState(graph, 3)).toBe(true);

    signalEvents.setVertexState(graph, 0, false);
    signalUpdate.updateGraphPartial(graph, 0);
    expect(signalEvents.getVertexState(graph, 3)).toBe(true);
  });
  test('Sinal da porta NOR', () => {
    signalEvents.addVertex(graph, 0, NodeTypes.I_SWITCH, true, [], [2]);
    signalEvents.addVertex(graph, 1, NodeTypes.I_SWITCH, true, [], [2]);
    signalEvents.addVertex(graph, 2, NodeTypes.G_NOR, false, [0, 1], [3]);
    signalEvents.addVertex(graph, 3, NodeTypes.O_LED_RED, false, [2]);
    signalUpdate.updateGraphPartial(graph, 0);
    expect(signalEvents.getVertexState(graph, 3)).toBe(false);

    signalEvents.setVertexState(graph, 0, false);
    signalUpdate.updateGraphPartial(graph, 0);
    expect(signalEvents.getVertexState(graph, 3)).toBe(false);

    signalEvents.setVertexState(graph, 0, true);
    signalEvents.setVertexState(graph, 1, false);
    signalUpdate.updateGraphPartial(graph, 0);
    expect(signalEvents.getVertexState(graph, 3)).toBe(false);

    signalEvents.setVertexState(graph, 0, false);
    signalUpdate.updateGraphPartial(graph, 0);
    expect(signalEvents.getVertexState(graph, 3)).toBe(true);
  });
  test('Sinal da porta NOT', () => {
    signalEvents.addVertex(graph, 0, NodeTypes.I_SWITCH, false, [], [1]);
    signalEvents.addVertex(graph, 1, NodeTypes.G_NOT, false, [0], [2]);
    signalEvents.addVertex(graph, 2, NodeTypes.O_LED_RED, false, [1]);
    signalUpdate.updateGraphPartial(graph, 0);
    expect(signalEvents.getVertexState(graph, 2)).toBe(true);

    signalEvents.setVertexState(graph, 0, true);
    signalUpdate.updateGraphPartial(graph, 0);
    expect(signalEvents.getVertexState(graph, 2)).toBe(false);
  });
  test('Sinal da porta OR', () => {
    signalEvents.addVertex(graph, 0, NodeTypes.I_SWITCH, true, [], [2]);
    signalEvents.addVertex(graph, 1, NodeTypes.I_SWITCH, true, [], [2]);
    signalEvents.addVertex(graph, 2, NodeTypes.G_OR, false, [0, 1], [3]);
    signalEvents.addVertex(graph, 3, NodeTypes.O_LED_RED, false, [2]);
    signalUpdate.updateGraphPartial(graph, 0);
    expect(signalEvents.getVertexState(graph, 3)).toBe(true);

    signalEvents.setVertexState(graph, 0, false);
    signalUpdate.updateGraphPartial(graph, 0);
    expect(signalEvents.getVertexState(graph, 3)).toBe(true);

    signalEvents.setVertexState(graph, 0, true);
    signalEvents.setVertexState(graph, 1, false);
    signalUpdate.updateGraphPartial(graph, 0);
    expect(signalEvents.getVertexState(graph, 3)).toBe(true);

    signalEvents.setVertexState(graph, 0, false);
    signalUpdate.updateGraphPartial(graph, 0);
    expect(signalEvents.getVertexState(graph, 3)).toBe(false);
  });
  test('Sinal da porta XNOR', () => {
    signalEvents.addVertex(graph, 0, NodeTypes.I_SWITCH, true, [], [2]);
    signalEvents.addVertex(graph, 1, NodeTypes.I_SWITCH, true, [], [2]);
    signalEvents.addVertex(graph, 2, NodeTypes.G_XNOR, false, [0, 1], [3]);
    signalEvents.addVertex(graph, 3, NodeTypes.O_LED_RED, false, [2]);
    signalUpdate.updateGraphPartial(graph, 0);
    expect(signalEvents.getVertexState(graph, 3)).toBe(true);

    signalEvents.setVertexState(graph, 0, false);
    signalUpdate.updateGraphPartial(graph, 0);
    expect(signalEvents.getVertexState(graph, 3)).toBe(false);

    signalEvents.setVertexState(graph, 0, true);
    signalEvents.setVertexState(graph, 1, false);
    signalUpdate.updateGraphPartial(graph, 0);
    expect(signalEvents.getVertexState(graph, 3)).toBe(false);

    signalEvents.setVertexState(graph, 0, false);
    signalUpdate.updateGraphPartial(graph, 0);
    expect(signalEvents.getVertexState(graph, 3)).toBe(true);
  });
  test('Sinal da porta XOR', () => {
    signalEvents.addVertex(graph, 0, NodeTypes.I_SWITCH, true, [], [2]);
    signalEvents.addVertex(graph, 1, NodeTypes.I_SWITCH, true, [], [2]);
    signalEvents.addVertex(graph, 2, NodeTypes.G_XOR, false, [0, 1], [3]);
    signalEvents.addVertex(graph, 3, NodeTypes.O_LED_RED, false, [2]);
    signalUpdate.updateGraphPartial(graph, 0);
    expect(signalEvents.getVertexState(graph, 3)).toBe(false);

    signalEvents.setVertexState(graph, 0, false);
    signalUpdate.updateGraphPartial(graph, 0);
    expect(signalEvents.getVertexState(graph, 3)).toBe(true);

    signalEvents.setVertexState(graph, 0, true);
    signalEvents.setVertexState(graph, 1, false);
    signalUpdate.updateGraphPartial(graph, 0);
    expect(signalEvents.getVertexState(graph, 3)).toBe(true);

    signalEvents.setVertexState(graph, 0, false);
    signalUpdate.updateGraphPartial(graph, 0);
    expect(signalEvents.getVertexState(graph, 3)).toBe(false);
  });
});
