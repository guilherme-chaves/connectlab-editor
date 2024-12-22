import Vector2 from '@connectlab-editor/types/vector2';
import {NodeModel, NodeTypes} from '@connectlab-editor/types';

const ADDNode: NodeModel = {
  id: NodeTypes.G_AND,
  imgPath: ['/src/assets/gates/AND_ANSI.svg'],
  connectionSlot: [
    {
      id: 0,
      name: 'A',
      in: true,
      localPos: new Vector2(0, 15),
    },
    {
      id: 1,
      name: 'B',
      in: true,
      localPos: new Vector2(0, 35),
    },
    {
      id: 2,
      name: 'C',
      in: false,
      localPos: new Vector2(88, 25),
    },
  ],
};

const NANDNode: NodeModel = {
  id: NodeTypes.G_NAND,
  imgPath: ['/src/assets/gates/NAND_ANSI.svg'],
  connectionSlot: [
    {
      id: 0,
      name: 'A',
      in: true,
      localPos: new Vector2(0, 15),
    },
    {
      id: 1,
      name: 'B',
      in: true,
      localPos: new Vector2(0, 35),
    },
    {
      id: 2,
      name: 'C',
      in: false,
      localPos: new Vector2(88, 25),
    },
  ],
};

const NORNode: NodeModel = {
  id: NodeTypes.G_NOR,
  imgPath: ['/src/assets/gates/NOR_ANSI.svg'],
  connectionSlot: [
    {
      id: 0,
      name: 'A',
      in: true,
      localPos: new Vector2(0, 15),
    },
    {
      id: 1,
      name: 'B',
      in: true,
      localPos: new Vector2(0, 35),
    },
    {
      id: 2,
      name: 'C',
      in: false,
      localPos: new Vector2(88, 25),
    },
  ],
};

const NOTNode: NodeModel = {
  id: NodeTypes.G_NOT,
  imgPath: ['/src/assets/gates/NOT_ANSI.svg'],
  connectionSlot: [
    {
      id: 0,
      name: 'In',
      in: true,
      localPos: new Vector2(0, 25),
    },
    {
      id: 1,
      name: 'Out',
      in: false,
      localPos: new Vector2(88, 25),
    },
  ],
};

const ORNode: NodeModel = {
  id: NodeTypes.G_OR,
  imgPath: ['/src/assets/gates/OR_ANSI.svg'],
  connectionSlot: [
    {
      id: 0,
      name: 'A',
      in: true,
      localPos: new Vector2(0, 15),
    },
    {
      id: 1,
      name: 'B',
      in: true,
      localPos: new Vector2(0, 35),
    },
    {
      id: 2,
      name: 'C',
      in: false,
      localPos: new Vector2(88, 25),
    },
  ],
};

const XNORNode: NodeModel = {
  id: NodeTypes.G_XNOR,
  imgPath: ['/src/assets/gates/XNOR_ANSI.svg'],
  connectionSlot: [
    {
      id: 0,
      name: 'A',
      in: true,
      localPos: new Vector2(0, 15),
    },
    {
      id: 1,
      name: 'B',
      in: true,
      localPos: new Vector2(0, 35),
    },
    {
      id: 2,
      name: 'C',
      in: false,
      localPos: new Vector2(88, 25),
    },
  ],
};

const XORNode: NodeModel = {
  id: NodeTypes.G_XOR,
  imgPath: ['/src/assets/gates/XOR_ANSI.svg'],
  connectionSlot: [
    {
      id: 0,
      name: 'A',
      in: true,
      localPos: new Vector2(0, 15),
    },
    {
      id: 1,
      name: 'B',
      in: true,
      localPos: new Vector2(0, 35),
    },
    {
      id: 2,
      name: 'C',
      in: false,
      localPos: new Vector2(88, 25),
    },
  ],
};

export const nodeModels = {
  ADDNode,
  NANDNode,
  NORNode,
  NOTNode,
  ORNode,
  XNORNode,
  XORNode,
};
