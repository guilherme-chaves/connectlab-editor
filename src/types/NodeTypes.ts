import NodeType from "./NodeType"
import { nodeTypes } from "./types"
import Position from "./Position"
import NOTPath from "../assets/gates/NOT_S.svg"

const ADDNode: NodeType = {
    id: nodeTypes.ADD,
    imgPath: "",
    connectionSlots: [
        {id: 0, name: "A", in: true, localPos: new Position(-8, -8)},
        {id: 1, name: "B", in: true, localPos: new Position(-8, 8)},
        {id: 2, name: "C", in: false, localPos: new Position(8, 0)}
    ],
    op(slotsState) {
        return slotsState[0] && slotsState[1]
    }
}

const ORNode: NodeType = {
    id: nodeTypes.OR,
    imgPath: "",
    connectionSlots: [
        {id: 0, name: "A", in: true, localPos: new Position(-8, -8)},
        {id: 1, name: "B", in: true, localPos: new Position(-8, 8)},
        {id: 2, name: "C", in: false, localPos: new Position(8, 0)}
    ],
    op(slotsState) {
        return slotsState[0] || slotsState[1]
    }
}

const NOTNode: NodeType = {
    id: nodeTypes.NOT,
    imgPath: NOTPath,
    connectionSlots: [
        {id: 0, name: "In", in: true, localPos: new Position(15, 25)},
        {id: 1, name: "Out", in: false, localPos: new Position(103,25)}
    ],
    op(slotsState) {
        return !slotsState[0]
    },
}

export {ADDNode, ORNode, NOTNode}