import Vector2i from '@connectlab-editor/types/vector2i';
import { NodeModel } from '@connectlab-editor/types/common';
import { NodeTypes } from '@connectlab-editor/types/enums';
import GATE_AND from '@connectlab-editor/gates/AND_ANSI.svg';
import GATE_NAND from '@connectlab-editor/gates/NAND_ANSI.svg';
import GATE_NOR from '@connectlab-editor/gates/NOR_ANSI.svg';
import GATE_NOT from '@connectlab-editor/gates/NOT_ANSI.svg';
import GATE_OR from '@connectlab-editor/gates/OR_ANSI.svg';
import GATE_XNOR from '@connectlab-editor/gates/XNOR_ANSI.svg';
import GATE_XOR from '@connectlab-editor/gates/XOR_ANSI.svg';

export const ADDNode: NodeModel = {
  id: NodeTypes.G_AND,
  imgPath: [GATE_AND],
  connectionSlot: [
    {
      id: 0,
      name: 'A',
      in: true,
      localPos: new Vector2i(-4, 15),
    },
    {
      id: 1,
      name: 'B',
      in: true,
      localPos: new Vector2i(-4, 35),
    },
    {
      id: 2,
      name: 'C',
      in: false,
      localPos: new Vector2i(92, 25),
    },
  ],
};

export const NANDNode: NodeModel = {
  id: NodeTypes.G_NAND,
  imgPath: [GATE_NAND],
  connectionSlot: [
    {
      id: 0,
      name: 'A',
      in: true,
      localPos: new Vector2i(-4, 15),
    },
    {
      id: 1,
      name: 'B',
      in: true,
      localPos: new Vector2i(-4, 35),
    },
    {
      id: 2,
      name: 'C',
      in: false,
      localPos: new Vector2i(92, 25),
    },
  ],
};

export const NORNode: NodeModel = {
  id: NodeTypes.G_NOR,
  imgPath: [GATE_NOR],
  connectionSlot: [
    {
      id: 0,
      name: 'A',
      in: true,
      localPos: new Vector2i(-4, 15),
    },
    {
      id: 1,
      name: 'B',
      in: true,
      localPos: new Vector2i(-4, 35),
    },
    {
      id: 2,
      name: 'C',
      in: false,
      localPos: new Vector2i(92, 25),
    },
  ],
};

export const NOTNode: NodeModel = {
  id: NodeTypes.G_NOT,
  imgPath: [GATE_NOT],
  connectionSlot: [
    {
      id: 0,
      name: 'In',
      in: true,
      localPos: new Vector2i(-4, 25),
    },
    {
      id: 1,
      name: 'Out',
      in: false,
      localPos: new Vector2i(92, 25),
    },
  ],
};

export const ORNode: NodeModel = {
  id: NodeTypes.G_OR,
  imgPath: [GATE_OR],
  connectionSlot: [
    {
      id: 0,
      name: 'A',
      in: true,
      localPos: new Vector2i(-4, 15),
    },
    {
      id: 1,
      name: 'B',
      in: true,
      localPos: new Vector2i(-4, 35),
    },
    {
      id: 2,
      name: 'C',
      in: false,
      localPos: new Vector2i(92, 25),
    },
  ],
};

export const XNORNode: NodeModel = {
  id: NodeTypes.G_XNOR,
  imgPath: [GATE_XNOR],
  connectionSlot: [
    {
      id: 0,
      name: 'A',
      in: true,
      localPos: new Vector2i(-4, 15),
    },
    {
      id: 1,
      name: 'B',
      in: true,
      localPos: new Vector2i(-4, 35),
    },
    {
      id: 2,
      name: 'C',
      in: false,
      localPos: new Vector2i(92, 25),
    },
  ],
};

export const XORNode: NodeModel = {
  id: NodeTypes.G_XOR,
  imgPath: [GATE_XOR],
  connectionSlot: [
    {
      id: 0,
      name: 'A',
      in: true,
      localPos: new Vector2i(-4, 15),
    },
    {
      id: 1,
      name: 'B',
      in: true,
      localPos: new Vector2i(-4, 35),
    },
    {
      id: 2,
      name: 'C',
      in: false,
      localPos: new Vector2i(92, 25),
    },
  ],
};
