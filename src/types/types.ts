import ConnectionComponent from '@connectlab-editor/components/connectionComponent';
import NodeComponent from '@connectlab-editor/components/nodeComponent';
import SlotComponent from '@connectlab-editor/components/slotComponent';
import TextComponent from '@connectlab-editor/components/textComponent';
import Component from '@connectlab-editor/interfaces/componentInterface';
import Vector2 from '@connectlab-editor/types/vector2';

export const enum ComponentType {
  LINE = 1,
  NODE = 2,
  TEXT = 3,
  SLOT = 4,
  INPUT = 5,
  OUTPUT = 6,
}

// G(ate)_*, I(nput)_*, O(utput)_*
export const enum NodeTypes {
  G_AND = 0,
  G_NAND = 1,
  G_NOR = 2,
  G_NOT = 3,
  G_OR = 4,
  G_XNOR = 5,
  G_XOR = 6,
  I_SWITCH = 100,
  O_LED_RED = 200,
}

export const enum EditorMode {
  ADD = 0,
  MOVE = 1,
  SELECT = 2,
  PROP = 3,
}

export type ImageListObject = Record<string, ImageBitmap>;

export type NodeList = Map<number, NodeComponent>;

export type SlotList = Map<number, SlotComponent>;

export type ConnectionList = Map<number, ConnectionComponent>;

export type TextList = Map<number, TextComponent>;

export interface FullComponentList {
  [index: string]: Map<number, Component>;
  nodes: NodeList;
  slots: SlotList;
  connections: ConnectionList;
  texts: TextList;
}

export interface ConnectionVertex {
  slotId: number;
  nodeId: number;
}

export interface ConnectionVertices {
  start: ConnectionVertex | undefined;
  end: ConnectionVertex | undefined;
}

export type slotStates = boolean;

// Modelo para criação de objetos do tipo NODE
export type NodeModel = Readonly<{
  id: NodeTypes;
  imgPath: string[];
  connectionSlot: Readonly<
    Array<
      Readonly<{
        id: number; // Identificador do slot (0 => inA, 1 => inB, ...)
        name: string; // Nome do slot (adiciona textNode?)
        localPos: Vector2; // Posição do slot, relativo ao elemento-pai
        in: boolean; // Recebe informação de outro elemento (true)
      }>
    >
  >;
}>;

export interface SignalGraphData {
  state: boolean | undefined;
  signalFrom: Array<number>;
  signalTo: Array<number>;
  nodeType: NodeTypes;
}

export type SignalGraph = Record<number, SignalGraphData>;

export type VectorObject = {x: number; y: number; useInt: boolean};
