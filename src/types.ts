enum ComponentType {
    LINE = 1,
    NODE = 2,
    TEXT = 3
}

interface CanvasComponent {
    id: number;
    name: String;
    type: ComponentType;
    position: number|Array<number>;
}

interface NodeComponent extends CanvasComponent {
    id: number;
    name: String;
    type: ComponentType;
    className: String;
    position: number;
}

interface LineComponent extends CanvasComponent {
    id: number;
    name: String;
    type: ComponentType;
    connectedTo: Array<number>; // ComponentId - only the first two elements must be considered
    position: Array<number>;
}

interface TextComponent extends CanvasComponent {
    id: number;
    name: String;
    type: ComponentType;
    content: String;
    position: number;
}

interface ComponentsList {
    documentId: String;
    lastComponentId: number;
    components: Array<CanvasComponent>;
}