import Position from "./Position";

// Modelo para criação de objetos do tipo NODE
interface NodeType {
    readonly name: string,
    readonly imgPath: string,
    readonly connectionSlots: Array<{
        name: string,
        localPos: Position,
        in: boolean, // Recebe informação de outro elemento (true), ou apenas envia (false)
    }>,
    readonly op: (inA: boolean, inB?: boolean, inC?: boolean) => boolean
}

export default NodeType