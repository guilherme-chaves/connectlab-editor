import NodeTypeInterface from './NodeType';
import {nodeTypes} from './types';
import Position from './Position';
import NOTPath from '../assets/gates/NOT.svg';

const ADDNode: NodeTypeInterface = {
  id: nodeTypes.ADD,
  imgPath: '',
  connectionSlots: [
    {
      id: 0,
      name: 'A',
      in: true,
      localPos: new Position(-8, -8),
      slotId: -1,
      status: false,
    },
    {
      id: 1,
      name: 'B',
      in: true,
      localPos: new Position(-8, 8),
      slotId: -1,
      status: false,
    },
    {
      id: 2,
      name: 'C',
      in: false,
      localPos: new Position(8, 0),
      slotId: -1,
      status: false,
    },
  ],
  op(slotsState) {
    return slotsState[0] && slotsState[1];
  },
};

const ORNode: NodeTypeInterface = {
  id: nodeTypes.OR,
  imgPath: '',
  connectionSlots: [
    {
      id: 0,
      name: 'A',
      in: true,
      localPos: new Position(-8, -8),
      slotId: -1,
      status: false,
    },
    {
      id: 1,
      name: 'B',
      in: true,
      localPos: new Position(-8, 8),
      slotId: -1,
      status: false,
    },
    {
      id: 2,
      name: 'C',
      in: false,
      localPos: new Position(8, 0),
      slotId: -1,
      status: false,
    },
  ],
  op(slotsState) {
    return slotsState[0] || slotsState[1];
  },
};

const NOTNode: NodeTypeInterface = {
  id: nodeTypes.NOT,
  imgPath: NOTPath,
  connectionSlots: [
    {
      id: 0,
      name: 'In',
      in: true,
      localPos: new Position(0, 25),
      slotId: -1,
      status: false,
    },
    {
      id: 1,
      name: 'Out',
      in: false,
      localPos: new Position(88, 25),
      slotId: -1,
      status: false,
    },
  ],
  op(slotsState) {
    return !slotsState[0];
  },
};

export {ADDNode, ORNode, NOTNode};
