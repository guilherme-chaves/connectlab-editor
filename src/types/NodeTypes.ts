const ADDNode: NodeType = {
    name: "add",
    imgPath: "",
    connectionSlots: [
        {name: "A", in: true, localPos: new Position(-8, -8)},
        {name: "B", in: true, localPos: new Position(-8, 8)},
        {name: "C", in: false, localPos: new Position(8, 0)}
    ],
    op(inA: boolean, inB?: boolean) { // Operação envolvendo o valor atual do
        if (inB != undefined)
            return inA && inB
        else return false
    }
}

const ORNode: NodeType = {
    name: "or",
    imgPath: "",
    connectionSlots: [
        {name: "A", in: true, localPos: new Position(-8, -8)},
        {name: "B", in: true, localPos: new Position(-8, 8)},
        {name: "C", in: false, localPos: new Position(8, 0)}
    ],
    op(inA: boolean, inB?: boolean) { // Operação envolvendo o valor atual do
        if (inB != undefined)
            return inA || inB
        else return false
    }
}

export default {ADDNode, ORNode}