import Editor from '../Editor';
import ComponentsList from '../components/ComponentsList';
import Position from '../types/Position';
import ComponentType from '../types/types';
import EditorEvents from './events';

export default {
  editingLineId: -1,
  editingLine: false,
  lineStartSlot: -1,
  oldSlotCollision: -1,
  slotCollision: -1,
  // Busca na lista de conexões quais possuem uma colisão com o ponto do mouse
  checkConnectionClick(componentsList: ComponentsList) {
    // Cada linha da conexão possui um BB ou OBB, então precisa passar por um loop no array de malhas de colisão
    return undefined;
  },
  addLine(editor: Editor, eventsObject: EditorEvents) {
    if (this.editingLine) return true;
    const slotCollisions = eventsObject.getCollisionList().slots;
    if (slotCollisions !== undefined) {
      const key = Object.values(slotCollisions)[0];
      const slot = editor.getEnviroment().getComponents().slots[key];
      const slotPosition = slot.position.add(slot.getParentPosition());
      this.editingLineId = editor.line(slotPosition.x, slotPosition.y, {
        type: ComponentType.SLOT,
        id: key,
      });
      this.editingLine = true;
      this.oldSlotCollision = this.slotCollision;
      this.slotCollision = key;
      this.lineStartSlot = key;
      return true;
    } else {
      this.oldSlotCollision = this.slotCollision;
      this.slotCollision = -1;
    }
    return false;
  },
  lineDrag(
    componentsList: ComponentsList,
    eventsObject: EditorEvents,
    mouseDelta: Position
  ) {
    if (this.editingLine && this.editingLineId !== -1) {
      componentsList
        .getComponents()
        .connections[this.editingLineId].changePosition(mouseDelta, 1, true);
      this.bindConnection(componentsList, eventsObject);
      return true;
    }
    return false;
  },
  fixLine(componentsList: ComponentsList, eventsObject: EditorEvents) {
    if (this.editingLine && this.editingLineId !== -1) {
      // Busca se existe um slot na posição atual do mouse
      const currentSlotCollision = eventsObject.checkSlotClick(componentsList);
      if (
        this.slotCollision !== -1 &&
        currentSlotCollision !== undefined &&
        currentSlotCollision[0] !== this.lineStartSlot
      ) {
        // Remove uma antiga conexão no slot inicial, se existir, e atribui a nova conexão
        const oldStartConnection = componentsList
          .getComponents()
          .slots[this.lineStartSlot].getConnectionId();
        if (oldStartConnection !== -1)
          delete componentsList.getComponents().connections[oldStartConnection];
        componentsList
          .getComponents()
          .slots[this.lineStartSlot].setConnectionId(this.editingLineId);
        // Remove uma antiga conexão no slot final, se existir, e atribui a nova conexão
        const currentSlotConnection = componentsList
          .getComponents()
          .slots[currentSlotCollision[0]].getConnectionId();
        if (currentSlotConnection !== this.editingLineId)
          delete componentsList.getComponents().connections[
            currentSlotConnection
          ];

        componentsList
          .getComponents()
          .connections[this.editingLineId].changeConnection(
            this.slotCollision,
            ComponentType.SLOT,
            true
          );
        componentsList
          .getComponents()
          .slots[this.slotCollision].setConnectionId(this.editingLineId);
      } else {
        delete componentsList.getComponents().connections[this.editingLineId];
      }
      // Reinicia os parâmetros para evitar ligações acidentais
      this.editingLine = false;
      this.editingLineId = -1;
      this.slotCollision = -1;
      this.oldSlotCollision = -1;
      this.lineStartSlot = -1;
    }
  },
  bindConnection(componentsList: ComponentsList, eventsObject: EditorEvents) {
    if (this.editingLine && this.editingLineId !== -1) {
      const slotCollided = eventsObject.checkSlotClick(componentsList);
      if (slotCollided !== undefined) {
        // Evitar colisões com o slot de onde a linha se origina
        if (
          componentsList.getComponents().connections[this.editingLineId]
            .connectedTo.start?.id !== slotCollided[0]
        ) {
          const collisionWith =
            componentsList.getComponents().slots[slotCollided[0]];
          this.oldSlotCollision = this.slotCollision;
          this.slotCollision = slotCollided[0];
          // A posição do slot é relativa ao seu componente-pai
          const collisionPos = collisionWith.position.add(
            collisionWith.getParentPosition()
          );
          // Fixa a posição da linha para o slot
          componentsList.getComponents().connections[
            this.editingLineId
          ].endPosition = collisionPos;
        }
      } else {
        if (this.slotCollision !== -1) {
          this.oldSlotCollision = this.slotCollision;
          this.slotCollision = -1;
        }
        componentsList.getComponents().connections[
          this.editingLineId
        ].endPosition = eventsObject.getMousePosition();
      }
    }
  },
};
