import { expect, test, beforeEach, describe } from 'vitest';
import { SignalGraph } from '../../src/types/common';
import { NodeTypes } from '@connectlab-editor/types/enums';
import * as InputModels from '@connectlab-editor/models/input';
import * as NodeModels from '@connectlab-editor/models/node';
import * as OutputModels from '@connectlab-editor/models/output';
import signalEvents from '../../src/events/signalEvents';
import signalUpdate from '../../src/functions/signal/signalUpdate';

describe('Testes com o grafo de sinal lógico', () => {
  let graph: SignalGraph = {};
  beforeEach(() => {
    graph = {};
  });
  test('Criar um elemento no grafo', () => {
    signalEvents.vertex.add(
      graph,
      0,
      NodeTypes.I_SWITCH,
      InputModels.SwitchInput,
      true,
    );
    expect(graph[0]).toBeDefined();
    expect(graph[0].output).toBe(true);
    expect(graph[0].signalFrom.size).toBe(0);
    expect(graph[0].signalTo.size).toBe(0);
  });
  test('Sinal da porta AND', () => {
    signalEvents.vertex.add(
      graph,
      0,
      NodeTypes.I_SWITCH,
      InputModels.SwitchInput,
      true,
      undefined,
      new Set([2]),
    );
    signalEvents.vertex.add(
      graph,
      1,
      NodeTypes.I_SWITCH,
      InputModels.SwitchInput,
      true,
      undefined,
      new Set([2]),
    );
    signalEvents.vertex.add(
      graph,
      2,
      NodeTypes.G_AND,
      NodeModels.ADDNode,
      false,
      new Map<number, number>([
        [0, 0],
        [1, 1],
      ]),
      new Set([3]),
    );
    signalEvents.vertex.add(
      graph,
      3,
      NodeTypes.O_LED_RED,
      OutputModels.LEDROutput,
      false,
      new Map<number, number>([[0, 2]]),
    );
    signalUpdate.updateGraph(graph, 0);
    console.log(graph);
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
    signalEvents.vertex.add(
      graph,
      0,
      NodeTypes.I_SWITCH,
      InputModels.SwitchInput,
      true,
      undefined,
      new Set([2]),
    );
    signalEvents.vertex.add(
      graph,
      1,
      NodeTypes.I_SWITCH,
      InputModels.SwitchInput,
      true,
      undefined,
      new Set([2]),
    );
    signalEvents.vertex.add(
      graph,
      2,
      NodeTypes.G_NAND,
      NodeModels.NANDNode,
      false,
      new Map([
        [0, 0],
        [1, 1],
      ]),
      new Set([3]),
    );
    signalEvents.vertex.add(
      graph,
      3,
      NodeTypes.O_LED_RED,
      OutputModels.LEDROutput,
      false,
      new Map([[0, 2]]),
    );
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
    signalEvents.vertex.add(
      graph,
      0,
      NodeTypes.I_SWITCH,
      InputModels.SwitchInput,
      true,
      undefined,
      new Set([2]),
    );
    signalEvents.vertex.add(
      graph,
      1,
      NodeTypes.I_SWITCH,
      InputModels.SwitchInput,
      true,
      undefined,
      new Set([2]),
    );
    signalEvents.vertex.add(
      graph,
      2,
      NodeTypes.G_NOR,
      NodeModels.NORNode,
      false,
      new Map([
        [0, 0],
        [1, 1],
      ]),
      new Set([3]),
    );
    signalEvents.vertex.add(
      graph,
      3,
      NodeTypes.O_LED_RED,
      OutputModels.LEDROutput,
      false,
      new Map([[0, 2]]),
    );
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
    signalEvents.vertex.add(
      graph,
      0,
      NodeTypes.I_SWITCH,
      InputModels.SwitchInput,
      false,
      undefined,
      new Set([1]),
    );
    signalEvents.vertex.add(
      graph,
      1,
      NodeTypes.G_NOT,
      NodeModels.NOTNode,
      false,
      new Map([[0, 0]]),
      new Set([2]),
    );
    signalEvents.vertex.add(
      graph,
      2,
      NodeTypes.O_LED_RED,
      OutputModels.LEDROutput,
      false,
      new Map([[1, 1]]),
    );
    signalUpdate.updateGraph(graph, 0);
    expect(signalEvents.vertex.getState(graph, 2)).toBe(true);

    signalEvents.vertex.setState(graph, 0, true);
    signalUpdate.updateGraph(graph, 0);
    expect(signalEvents.vertex.getState(graph, 2)).toBe(false);
  });
  test('Sinal da porta OR', () => {
    signalEvents.vertex.add(
      graph,
      0,
      NodeTypes.I_SWITCH,
      InputModels.SwitchInput,
      true,
      undefined,
      new Set([2]),
    );
    signalEvents.vertex.add(
      graph,
      1,
      NodeTypes.I_SWITCH,
      InputModels.SwitchInput,
      true,
      undefined,
      new Set([2]),
    );
    signalEvents.vertex.add(
      graph,
      2,
      NodeTypes.G_OR,
      NodeModels.ORNode,
      false,
      new Map([
        [0, 0],
        [1, 1],
      ]),
      new Set([3]),
    );
    signalEvents.vertex.add(
      graph,
      3,
      NodeTypes.O_LED_RED,
      OutputModels.LEDROutput,
      false,
      new Map([[0, 2]]),
    );
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
    signalEvents.vertex.add(
      graph,
      0,
      NodeTypes.I_SWITCH,
      InputModels.SwitchInput,
      true,
      undefined,
      new Set([2]),
    );
    signalEvents.vertex.add(
      graph,
      1,
      NodeTypes.I_SWITCH,
      InputModels.SwitchInput,
      true,
      undefined,
      new Set([2]),
    );
    signalEvents.vertex.add(
      graph,
      2,
      NodeTypes.G_XNOR,
      NodeModels.XNORNode,
      false,
      new Map([
        [0, 0],
        [1, 1],
      ]),
      new Set([3]),
    );
    signalEvents.vertex.add(
      graph,
      3,
      NodeTypes.O_LED_RED,
      OutputModels.LEDROutput,
      false,
      new Map([[0, 2]]),
    );
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
    signalEvents.vertex.add(
      graph,
      0,
      NodeTypes.I_SWITCH,
      InputModels.SwitchInput,
      true,
      undefined,
      new Set([2]),
    );
    signalEvents.vertex.add(
      graph,
      1,
      NodeTypes.I_SWITCH,
      InputModels.SwitchInput,
      true,
      undefined,
      new Set([2]),
    );
    signalEvents.vertex.add(
      graph,
      2,
      NodeTypes.G_XOR,
      NodeModels.XORNode,
      false,
      new Map([
        [0, 0],
        [1, 1],
      ]),
      new Set([3]),
    );
    signalEvents.vertex.add(
      graph,
      3,
      NodeTypes.O_LED_RED,
      OutputModels.LEDROutput,
      false,
      new Map([[0, 2]]),
    );
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
