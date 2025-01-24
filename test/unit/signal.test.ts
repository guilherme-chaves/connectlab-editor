// eslint-disable-next-line node/no-unpublished-import
import {expect, test, beforeEach, describe} from 'vitest';
import {SignalGraph} from '../../src/types/common';
import {NodeTypes} from '@connectlab-editor/types/enums';
import signalEvents from '../../src/events/signalEvents';
import signalUpdate from '../../src/functions/signal/signalUpdate';

describe('Testes com o grafo de sinal lógico', () => {
  let graph: SignalGraph = {};
  beforeEach(() => {
    graph = {};
  });
  test('Criar um elemento no grafo', () => {
    signalEvents.vertex.add(graph, 0, NodeTypes.I_SWITCH, true);
    expect(graph[0]).toBeDefined();
    expect(graph[0].state).toBe(true);
  });
  test('Sinal da porta AND', () => {
    signalEvents.vertex.add(graph, 0, NodeTypes.I_SWITCH, true, [], [2]);
    signalEvents.vertex.add(graph, 1, NodeTypes.I_SWITCH, true, [], [2]);
    signalEvents.vertex.add(graph, 2, NodeTypes.G_AND, false, [0, 1], [3]);
    signalEvents.vertex.add(graph, 3, NodeTypes.O_LED_RED, false, [2]);
    signalUpdate.updateGraph(graph, 0);
    expect(signalEvents.vertex.getState(graph, 3)).toBe(true);

    signalEvents.vertex.setState(graph, 0, false);
    signalUpdate.updateGraph(graph, 0);
    expect(signalEvents.vertex.getState(graph, 3)).toBe(false);

    signalEvents.vertex.setState(graph, 0, true);
    signalEvents.vertex.setState(graph, 1, false);
    signalUpdate.updateGraph(graph, 0);
    expect(signalEvents.vertex.getState(graph, 3)).toBe(false);

    signalEvents.vertex.setState(graph, 0, false);
    signalUpdate.updateGraph(graph, 0);
    expect(signalEvents.vertex.getState(graph, 3)).toBe(false);
  });
  test('Sinal da porta NAND', () => {
    signalEvents.vertex.add(graph, 0, NodeTypes.I_SWITCH, true, [], [2]);
    signalEvents.vertex.add(graph, 1, NodeTypes.I_SWITCH, true, [], [2]);
    signalEvents.vertex.add(graph, 2, NodeTypes.G_NAND, false, [0, 1], [3]);
    signalEvents.vertex.add(graph, 3, NodeTypes.O_LED_RED, false, [2]);
    signalUpdate.updateGraph(graph, 0);
    expect(signalEvents.vertex.getState(graph, 3)).toBe(false);

    signalEvents.vertex.setState(graph, 0, false);
    signalUpdate.updateGraph(graph, 0);
    expect(signalEvents.vertex.getState(graph, 3)).toBe(true);

    signalEvents.vertex.setState(graph, 0, true);
    signalEvents.vertex.setState(graph, 1, false);
    signalUpdate.updateGraph(graph, 0);
    expect(signalEvents.vertex.getState(graph, 3)).toBe(true);

    signalEvents.vertex.setState(graph, 0, false);
    signalUpdate.updateGraph(graph, 0);
    expect(signalEvents.vertex.getState(graph, 3)).toBe(true);
  });
  test('Sinal da porta NOR', () => {
    signalEvents.vertex.add(graph, 0, NodeTypes.I_SWITCH, true, [], [2]);
    signalEvents.vertex.add(graph, 1, NodeTypes.I_SWITCH, true, [], [2]);
    signalEvents.vertex.add(graph, 2, NodeTypes.G_NOR, false, [0, 1], [3]);
    signalEvents.vertex.add(graph, 3, NodeTypes.O_LED_RED, false, [2]);
    signalUpdate.updateGraph(graph, 0);
    expect(signalEvents.vertex.getState(graph, 3)).toBe(false);

    signalEvents.vertex.setState(graph, 0, false);
    signalUpdate.updateGraph(graph, 0);
    expect(signalEvents.vertex.getState(graph, 3)).toBe(false);

    signalEvents.vertex.setState(graph, 0, true);
    signalEvents.vertex.setState(graph, 1, false);
    signalUpdate.updateGraph(graph, 0);
    expect(signalEvents.vertex.getState(graph, 3)).toBe(false);

    signalEvents.vertex.setState(graph, 0, false);
    signalUpdate.updateGraph(graph, 0);
    expect(signalEvents.vertex.getState(graph, 3)).toBe(true);
  });
  test('Sinal da porta NOT', () => {
    signalEvents.vertex.add(graph, 0, NodeTypes.I_SWITCH, false, [], [1]);
    signalEvents.vertex.add(graph, 1, NodeTypes.G_NOT, false, [0], [2]);
    signalEvents.vertex.add(graph, 2, NodeTypes.O_LED_RED, false, [1]);
    signalUpdate.updateGraph(graph, 0);
    expect(signalEvents.vertex.getState(graph, 2)).toBe(true);

    signalEvents.vertex.setState(graph, 0, true);
    signalUpdate.updateGraph(graph, 0);
    expect(signalEvents.vertex.getState(graph, 2)).toBe(false);
  });
  test('Sinal da porta OR', () => {
    signalEvents.vertex.add(graph, 0, NodeTypes.I_SWITCH, true, [], [2]);
    signalEvents.vertex.add(graph, 1, NodeTypes.I_SWITCH, true, [], [2]);
    signalEvents.vertex.add(graph, 2, NodeTypes.G_OR, false, [0, 1], [3]);
    signalEvents.vertex.add(graph, 3, NodeTypes.O_LED_RED, false, [2]);
    signalUpdate.updateGraph(graph, 0);
    expect(signalEvents.vertex.getState(graph, 3)).toBe(true);

    signalEvents.vertex.setState(graph, 0, false);
    signalUpdate.updateGraph(graph, 0);
    expect(signalEvents.vertex.getState(graph, 3)).toBe(true);

    signalEvents.vertex.setState(graph, 0, true);
    signalEvents.vertex.setState(graph, 1, false);
    signalUpdate.updateGraph(graph, 0);
    expect(signalEvents.vertex.getState(graph, 3)).toBe(true);

    signalEvents.vertex.setState(graph, 0, false);
    signalUpdate.updateGraph(graph, 0);
    expect(signalEvents.vertex.getState(graph, 3)).toBe(false);
  });
  test('Sinal da porta XNOR', () => {
    signalEvents.vertex.add(graph, 0, NodeTypes.I_SWITCH, true, [], [2]);
    signalEvents.vertex.add(graph, 1, NodeTypes.I_SWITCH, true, [], [2]);
    signalEvents.vertex.add(graph, 2, NodeTypes.G_XNOR, false, [0, 1], [3]);
    signalEvents.vertex.add(graph, 3, NodeTypes.O_LED_RED, false, [2]);
    signalUpdate.updateGraph(graph, 0);
    expect(signalEvents.vertex.getState(graph, 3)).toBe(true);

    signalEvents.vertex.setState(graph, 0, false);
    signalUpdate.updateGraph(graph, 0);
    expect(signalEvents.vertex.getState(graph, 3)).toBe(false);

    signalEvents.vertex.setState(graph, 0, true);
    signalEvents.vertex.setState(graph, 1, false);
    signalUpdate.updateGraph(graph, 0);
    expect(signalEvents.vertex.getState(graph, 3)).toBe(false);

    signalEvents.vertex.setState(graph, 0, false);
    signalUpdate.updateGraph(graph, 0);
    expect(signalEvents.vertex.getState(graph, 3)).toBe(true);
  });
  test('Sinal da porta XOR', () => {
    signalEvents.vertex.add(graph, 0, NodeTypes.I_SWITCH, true, [], [2]);
    signalEvents.vertex.add(graph, 1, NodeTypes.I_SWITCH, true, [], [2]);
    signalEvents.vertex.add(graph, 2, NodeTypes.G_XOR, false, [0, 1], [3]);
    signalEvents.vertex.add(graph, 3, NodeTypes.O_LED_RED, false, [2]);
    signalUpdate.updateGraph(graph, 0);
    expect(signalEvents.vertex.getState(graph, 3)).toBe(false);

    signalEvents.vertex.setState(graph, 0, false);
    signalUpdate.updateGraph(graph, 0);
    expect(signalEvents.vertex.getState(graph, 3)).toBe(true);

    signalEvents.vertex.setState(graph, 0, true);
    signalEvents.vertex.setState(graph, 1, false);
    signalUpdate.updateGraph(graph, 0);
    expect(signalEvents.vertex.getState(graph, 3)).toBe(true);

    signalEvents.vertex.setState(graph, 0, false);
    signalUpdate.updateGraph(graph, 0);
    expect(signalEvents.vertex.getState(graph, 3)).toBe(false);
  });
});
