import ConnectionComponent
  from '@connectlab-editor/components/connectionComponent';
import NodeComponent from '@connectlab-editor/interfaces/nodeInterface';
import SlotComponent from '@connectlab-editor/components/slotComponent';
import TextComponent from '@connectlab-editor/components/textComponent';
import Component from '@connectlab-editor/interfaces/componentInterface';
import Vector2i from '@connectlab-editor/types/vector2i';
import { NodeTypes } from '@connectlab-editor/types/enums';

export type ImageListObject = Record<string, ImageBitmap>;

export type NodeList = Map<number, NodeComponent>;

export type SlotList = Map<number, SlotComponent>;

export type ConnectionList = Map<number, ConnectionComponent>;

export type TextList = Map<number, TextComponent>;

export interface FullComponentList {
  [index: string]: Map<number, Component>
  nodes: NodeList
  slots: SlotList
  connections: ConnectionList
  texts: TextList
}

export interface ConnectionVertex {
  slotId: number
  nodeId: number
}

export interface ConnectionVertices {
  start: ConnectionVertex | undefined
  end: ConnectionVertex | undefined
}

// Modelo para criação de objetos do tipo NODE
export type NodeModel = Readonly<{
  id: NodeTypes
  imgPath: string[]
  connectionSlot: Readonly<
    Array<
      Readonly<{
        id: number // Identificador do slot (0 => inA, 1 => inB, ...)
        name: string // Nome do slot (adiciona textNode?)
        localPos: Vector2i // Posição do slot, relativo ao elemento-pai
        in: boolean // Recebe informação de outro elemento (true)
      }>
    >
  >
}>;

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

export type VectorObject = { x: number, y: number };

export type SignalGraphObject = {
  id: number
  data: {
    output: boolean
    signalFrom: number[][]
    signalTo: Array<number>
    nodeType: NodeTypes
  }
};
