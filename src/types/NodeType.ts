import Position from "./Position"
import { nodeTypes } from "./types"

// Modelo para criação de objetos do tipo NODE
interface NodeType {
    readonly id: nodeTypes,
    readonly imgPath: string,
    readonly connectionSlots: Array<{
        id: number, // Identificador do slot (0 => inA, 1 => inB, ...)
        name: string, // Nome do slot (adiciona textNode?)
        localPos: Position, // Posição do slot, relativo ao elemento-pai
        in: boolean, // Recebe informação de outro elemento (true)
    }>,
    readonly op: (slotsState: Array<boolean>) => boolean // Operação booleana envolvendo o valor atual dos slots
}

export default NodeType