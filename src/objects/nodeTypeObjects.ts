import {NodeTypeObject, NodeTypes} from '../types/types';
import Vector2 from '../types/Vector2';

const ADDNode: NodeTypeObject = {
  id: NodeTypes.ADD,
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
  op(slotState) {
    return slotState.length >= 2 ? slotState[0] && slotState[1] : false;
  },
};

const NANDNode: NodeTypeObject = {
  id: NodeTypes.NAND,
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
  op(slotState) {
    return slotState.length >= 2 ? !(slotState[0] && slotState[1]) : false;
  },
};

const NORNode: NodeTypeObject = {
  id: NodeTypes.NOR,
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
  op(slotState) {
    return slotState.length >= 2 ? !(slotState[0] || slotState[1]) : false;
  },
};

const NOTNode: NodeTypeObject = {
  id: NodeTypes.NOT,
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
  op(slotState) {
    return slotState.length >= 1 ? !slotState[0] : false;
  },
};

const ORNode: NodeTypeObject = {
  id: NodeTypes.OR,
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
  op(slotState) {
    return slotState.length >= 2 ? slotState[0] || slotState[1] : false;
  },
};

const XNORNode: NodeTypeObject = {
  id: NodeTypes.XNOR,
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
  op(slotState) {
    return slotState.length >= 2 ? slotState[0] === slotState[1] : false;
  },
};

const XORNode: NodeTypeObject = {
  id: NodeTypes.XOR,
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
  op(slotState) {
    return slotState.length >= 2 ? slotState[0] !== slotState[1] : false;
  },
};

export {ADDNode, NANDNode, NORNode, NOTNode, ORNode, XNORNode, XORNode};
