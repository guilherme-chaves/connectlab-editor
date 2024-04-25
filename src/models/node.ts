import Vector2 from '@connectlab-editor/types/Vector2';
import {NodeModel, NodeTypes} from '@connectlab-editor/types';
import ADDPath from '@connectlab-editor/gates/AND_ANSI.svg';
import NANDPath from '@connectlab-editor/gates/NAND_ANSI.svg';
import NORPath from '@connectlab-editor/gates/NOR_ANSI.svg';
import NOTPath from '@connectlab-editor/gates/NOT_ANSI.svg';
import ORPath from '@connectlab-editor/gates/OR_ANSI.svg';
import XNORPath from '@connectlab-editor/gates/XNOR_ANSI.svg';
import XORPath from '@connectlab-editor/gates/XOR_ANSI.svg';

export const ADDNode: NodeModel = {
  id: NodeTypes.G_AND,
  imgPath: [ADDPath],
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

export const NANDNode: NodeModel = {
  id: NodeTypes.G_NAND,
  imgPath: [NANDPath],
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

export const NORNode: NodeModel = {
  id: NodeTypes.G_NOR,
  imgPath: [NORPath],
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

export const NOTNode: NodeModel = {
  id: NodeTypes.G_NOT,
  imgPath: [NOTPath],
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

export const ORNode: NodeModel = {
  id: NodeTypes.G_OR,
  imgPath: [ORPath],
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

export const XNORNode: NodeModel = {
  id: NodeTypes.G_XNOR,
  imgPath: [XNORPath],
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

export const XORNode: NodeModel = {
  id: NodeTypes.G_XOR,
  imgPath: [XORPath],
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
