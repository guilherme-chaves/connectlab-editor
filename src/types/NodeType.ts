import Position from "./Position";

// Modelo para criação de objetos do tipo NODE
interface NodeType {
    readonly name: string,
    readonly imgPath: string,
    readonly connectionSlots: Array<{
        name: string, // Identificador do slot (adiciona textNode?)
        localPos: Position, // Posição do slot, relativo ao elemento-pai
        in: boolean, // Recebe informação de outro elemento (true), ou apenas envia (false)
    }>,
    readonly op: (inA: boolean, inB?: boolean, inC?: boolean) => boolean // Operação booleana envolvendo o valor atual dos slots
}

export default NodeType