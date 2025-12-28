import { NodeTypes } from './enums';

export type signalOperation = (
  inputStates: number,
  numSlots: number
) => boolean;

export interface SignalGraphData {
  id: number
  output: boolean
  signalFrom: Map<number, number> // Map<slotId, nodeConnectedId]
  signalTo: Set<number> // nodeConnectedId
  nodeType: NodeTypes
  signalGraph: SignalGraph
}

export type SignalGraph = Record<number, SignalGraphData>;

export type SignalGraphObject = {
  id: number
  data: {
    output: boolean
    signalFrom: number[][]
    signalTo: Array<number>
    nodeType: NodeTypes
  }
};
