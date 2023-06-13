import Editor from '../Editor';
import Position from '../types/Position';
import ComponentsList from '../components/ComponentsList';
import connectionEvents from './connectionEvents';

interface collisionListInterface {
  [index: string]: Array<number> | undefined;
  nodes: Array<number> | undefined;
  slots: Array<number> | undefined;
  connections: Array<number> | undefined;
  texts: Array<number> | undefined;
}

export default class EditorEvents {
  // private currentComponentType: ComponentType
  // private currentNodeType: nodeTypes

  private collisionList: collisionListInterface;

  private mousePosition: Position; // Posição dentro do canvas, não global
  private oldMousePosition: Position;
  private mouseClicked: boolean;
  private mouseChangedState: boolean;
  private mouseChangedPosition: boolean;

  constructor() {
    // this.currentComponentType = ComponentType.NODE
    // this.currentNodeType = nodeTypes.NOT

    this.collisionList = {
      nodes: undefined,
      slots: undefined,
      connections: undefined,
      texts: undefined,
    };

    this.mousePosition = new Position(0, 0);
    this.oldMousePosition = this.mousePosition;
    this.mouseClicked = false;
    this.mouseChangedState = true;
    this.mouseChangedPosition = false;
  }

  mouseClick(componentsList: ComponentsList) {
    if (this.mouseClicked && this.mouseChangedState) {
      // Obtêm uma lista com todas as colisões encontradas
      const nodeId = this.checkNodeClick(componentsList);
      const slotId = this.checkSlotClick(componentsList);
      const connectionId = connectionEvents.checkConnectionClick(componentsList);
      const textId = undefined;
      
      // Escrever aqui ou chamar outras funções que tratem o que cada tipo de colisão encontrada deve responder
      if (slotId != undefined)
        componentsList.getComponents().slots[slotId[0]].setState(true);
      this.clearUnselectedComponents(componentsList, undefined, slotId);
      
      this.collisionList = {
        nodes: nodeId,
        slots: slotId,
        connections: connectionId,
        texts: textId
      }
      this.mouseChangedState = false;
    }
  }

  // Busca na lista de nodes quais possuem uma colisão com o ponto do mouse
  checkNodeClick(componentsList: ComponentsList): number[] | undefined {
    let collided = false;
    const collidedWith = new Array<number>();
    Object.keys(componentsList.getComponents()['nodes']).forEach(key => {
      const keyN = parseInt(key);
      const collision = componentsList
        .getComponents()
        ['nodes'][keyN].getCollisionShape()
        .collisionWithPoint(this.mousePosition);
      if (collision) collidedWith.push(keyN);
      collided = collided || collision;
    });
    return collided ? collidedWith : undefined;
  }

  // Busca na lista de slots quais possuem uma colisão com o ponto do mouse
  checkSlotClick(componentsList: ComponentsList): number[] | undefined {
    let collided = false;
    const collidedWith = new Array<number>();
    Object.keys(componentsList.getComponents()['slots']).forEach(key => {
      const keyN = parseInt(key);
      const collision = componentsList
        .getComponents()
        ['slots'][keyN].getCollisionShape()
        .collisionWithPoint(this.mousePosition);
      if (collision) collidedWith.push(keyN);
      collided = collided || collision;
    });
    return collided ? collidedWith : undefined;
  }

  // Busca na lista de textos quais possuem uma colisão com o ponto do mouse
  checkTextClick(editor: Editor) {}

  mouseRelease(componentsList: ComponentsList) {
    if (!this.mouseClicked && this.mouseChangedState) {
      if (!connectionEvents.fixLine(componentsList, this)) {
        this.clearDragCollisions()
      }
      this.mouseChangedState = false;
    }
  }

  mouseDrag(editor: Editor, componentsList: ComponentsList) {
    if (this.mouseClicked) {
      if (
        connectionEvents.lineDrag(
          componentsList,
          this,
          this.mousePosition.minus(this.oldMousePosition)
        )
      ) {
        this.mouseChangedPosition = false;
        return true;
      }
        
        
      if (connectionEvents.addLine(editor, this)) {
        this.mouseChangedPosition = false;
        return true;
      }
      if (this.moveNode(
            componentsList,
            this.mousePosition.minus(this.oldMousePosition)
          )
        ) {
        this.mouseChangedPosition = false;
        return true;
        }
    }
    return false;
  }

  moveNode(componentsList: ComponentsList, delta: Position): boolean {
    if (this.collisionList.nodes !== undefined && this.mouseChangedPosition) {
      const key = Object.values(this.collisionList.nodes)[0];
      componentsList.getComponents().nodes[key].changePosition(delta);
      componentsList
        .getComponents()
        .nodes[key].getCollisionShape()
        .moveShape(delta);
      componentsList
        .getComponents()
        .nodes[key].getSlotComponents()
        .forEach(slotKey => {
          componentsList
            .getComponents()
            .slots[slotKey].setParentPosition(
              componentsList.getComponents().nodes[key].position
            );
          componentsList
            .getComponents()
            .slots[slotKey].getCollisionShape()
            .moveShape(delta);
          if (
            componentsList.getComponents().slots[slotKey].getConnectionId() !==
            -1
          ) {
            const connectionKey = componentsList
              .getComponents()
              .slots[slotKey].getConnectionId();
            if (
              componentsList.getComponents().connections[connectionKey]
                .connectedTo.start?.id === slotKey
            )
              componentsList
                .getComponents()
                .connections[connectionKey].changePosition(delta, 0, true);
            else if (
              componentsList.getComponents().connections[connectionKey]
                .connectedTo.end?.id === slotKey
            )
              componentsList
                .getComponents()
                .connections[connectionKey].changePosition(delta, 1, true);
          }
        });
      return true;
    }
    return false;
  }

  // Procura na lista anterior de colisões as que não estão presentes na atual, removendo seu estado de selecionado/ativo
  clearUnselectedComponents = (
    componentsList: ComponentsList,
    newNodeIds?: number[],
    newSlotIds?: number[],
    newConnectionIds?: number[],
    newTextIds?: number[]
  ): void => {
    if (this.collisionList.slots != undefined) {
      this.collisionList.slots.forEach(slot => {
        if (!newSlotIds?.includes(slot)) {
          componentsList.getComponents().slots[slot].setState(false);
        }
      });
    }
  };

  getCollisionList() {
    return this.collisionList;
  }

  clearDragCollisions = () => {
    this.collisionList.nodes = undefined;
  };

  clearAllCollisions(componentsList: ComponentsList) {
    this.clearUnselectedComponents(componentsList);
    this.collisionList.nodes = undefined;
    this.collisionList.slots = undefined;
    this.collisionList.connections = undefined;
    this.collisionList.texts = undefined;
  };

  getMousePosition(): Position {
    return this.mousePosition;
  }

  setMousePosition(position: Position) {
    this.oldMousePosition = this.mousePosition;
    this.mousePosition = position;
    this.mouseChangedPosition = true;
  }

  getMouseChangedState = () => {
    return this.mouseChangedState
  }

  getMouseChangedPosition = () => {
    return this.mouseChangedPosition
  }

  getMouseClicked = () => {
    return this.mouseClicked
  }

  setMouseClicked(state = false) {
    this.mouseClicked = state;
    this.mouseChangedState = true;
  }
}
