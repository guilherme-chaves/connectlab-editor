import ConnectionComponent from "../components/ConnectionComponent"
import NodeComponent from "../components/NodeComponent"
import SlotComponent from "../components/SlotComponent"
import TextComponent from "../components/TextComponent"

enum ComponentType {
    LINE = 1,
    NODE = 2,
    TEXT = 3,
    SLOT = 4
}

export enum nodeTypes {
    ADD = 0,
    OR = 1,
    NOT = 2
}

export enum EditorMode {
    ADD = 0,
    MOVE = 1,
    SELECT = 2,
    PROP = 3
}

export interface nodeListInterface {
    [index: number]: NodeComponent
}

export interface slotListInterface {
    [index: number]: SlotComponent
}

export interface connectionListInterface {
    [index: number]: ConnectionComponent
}

export interface textListInterface {
    [index: number]: TextComponent
}


export interface componentListInterface {
    [index: string]: nodeListInterface|slotListInterface|connectionListInterface|textListInterface,
    "nodes": nodeListInterface,
    "slots": slotListInterface,
    "connections": connectionListInterface,
    "texts": textListInterface
}

export default ComponentType