enum ComponentType {
    LINE = 1,
    NODE = 2,
    TEXT = 3
}

interface Position {
    x: number;
    y: number;
}

interface CanvasComponent {
    id: number; // Identificador numérico
    name: String; // ?
    type: ComponentType; // Tipo de elemento a ser adicionado
    position: Position; // Posição do elemento
}

interface NodeComponent extends CanvasComponent {
    id: number;
    name: String;
    type: ComponentType;
    className: String;
    position: Position;
}

interface LineComponent extends CanvasComponent {
    id: number;
    name: String;
    type: ComponentType;
    connectedTo: Array<Position>; // ComponentId - only the first two elements must be considered
    position: Position;
}

interface TextComponent extends CanvasComponent {
    id: number;
    name: String;
    type: ComponentType;
    content: String;
    position: Position;
}

interface ComponentsList {
    documentId: String;
    lastComponentId: number;
    components: Array<CanvasComponent>;
}