import Editor from '../../Editor';
import Vector2 from '../../types/Vector2';
import ComponentType from '../../types/types';
import EditorEvents from '../events';
import slotEvents from '../slotEvents';

export default {
  editingLineId: -1,
  editingLine: false,
  lineStartSlot: -1,
  oldSlotCollision: -1,
  slotCollision: -1,

  // Busca na lista de conexões quais possuem uma colisão com o ponto do mouse
  checkConnectionClick(eventsObject: EditorEvents): number[] | undefined {
    let collided = false;
    const collidedWith = new Array<number>();
    Object.keys(Editor.editorEnv.getComponents()['connections']).forEach(
      key => {
        const keyN = parseInt(key);
        const collision = Editor.editorEnv
          .getComponents()
          ['connections'][keyN].getCollisionShape()
          .collisionWithPoint(eventsObject.getMousePosition());
        if (collision) collidedWith.push(keyN);
        collided = collided || collision;
      }
    );
    return collided ? collidedWith : undefined;
  },

  addLine(editor: Editor, eventsObject: EditorEvents) {
    if (this.editingLine && this.editingLineId !== -1) return true;
    const slotCollisions = slotEvents.checkSlotClick(eventsObject);
    if (slotCollisions !== undefined) {
      const key = Object.values(slotCollisions)[0];
      const slot = Editor.editorEnv.getComponents().slots[key];
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

  lineMove(eventsObject: EditorEvents, mouseDelta: Vector2) {
    if (
      this.editingLine &&
      this.editingLineId !== -1 &&
      eventsObject.getMouseChangedPosition()
    ) {
      Editor.editorEnv
        .getComponents()
        .connections[this.editingLineId].changePosition(mouseDelta, 1, true);
      this.bindConnection(eventsObject);
      return true;
    }
    return false;
  },

  fixLine(eventsObject: EditorEvents) {
    if (this.editingLine && this.editingLineId !== -1) {
      // Busca se existe um slot na posição atual do mouse
      const currentSlotCollision = slotEvents.checkSlotClick(eventsObject);
      if (
        this.slotCollision !== -1 &&
        currentSlotCollision !== undefined &&
        currentSlotCollision[0] !== this.lineStartSlot
      ) {
        // Comparação para evitar conexões entre o mesmo slot
        if (
          Editor.editorEnv
            .getComponents()
            .slots[this.lineStartSlot].getInSlot() ===
          Editor.editorEnv
            .getComponents()
            .slots[currentSlotCollision[0]].getInSlot()
        ) {
          delete Editor.editorEnv.getComponents().connections[
            this.editingLineId
          ];
          this.resetConnEventParams();
          return false;
        }

        // Caso a conexão esteja sendo feita de forma inversa (in -> out), trocar o valor dos parâmetros
        else if (
          !Editor.editorEnv
            .getComponents()
            .slots[currentSlotCollision[0]].getInSlot()
        ) {
          const temp = this.lineStartSlot;
          this.lineStartSlot = currentSlotCollision[0];
          currentSlotCollision[0] = temp;
        }

        // Remove uma antiga conexão nos slots inicial e final, se existir
        this.removeOldConnection(this.lineStartSlot);
        this.removeOldConnection(currentSlotCollision[0]);

        // Atribui a nova conexão aos slots
        Editor.editorEnv
          .getComponents()
          .slots[this.lineStartSlot].setConnectionId(this.editingLineId);
        Editor.editorEnv
          .getComponents()
          .slots[currentSlotCollision[0]].setConnectionId(this.editingLineId);

        // Define as posições inicial e final da conexão para os dois slots
        this.setConnectionParams(
          Editor.editorEnv
            .getComponents()
            .slots[this.lineStartSlot].getPosition(true),
          Editor.editorEnv
            .getComponents()
            .slots[currentSlotCollision[0]].getPosition(true),
          this.lineStartSlot,
          currentSlotCollision[0]
        );

        // Cria conjunto de caixas de colisão para a conexão
        Editor.editorEnv
          .getComponents()
          .connections[this.editingLineId].generateCollisionShapes();

        // Retorna a lista de parâmetros do objeto para seus valores padrão
        this.resetConnEventParams();
        return true;
      }
      // Caso não haja colisão com algum slot, exclue a conexão que está sendo gerada
      else {
        delete Editor.editorEnv.getComponents().connections[this.editingLineId];
        this.resetConnEventParams();
        return false;
      }
    }
    this.resetConnEventParams();
    return false;
  },

  bindConnection(eventsObject: EditorEvents) {
    if (this.editingLine && this.editingLineId !== -1) {
      const slotCollided = slotEvents.checkSlotClick(eventsObject);
      if (slotCollided !== undefined) {
        // Evitar colisões com o slot de onde a linha se origina
        if (
          Editor.editorEnv.getComponents().connections[this.editingLineId]
            .connectedTo.start?.id !== slotCollided[0]
        ) {
          const collisionWith =
            Editor.editorEnv.getComponents().slots[slotCollided[0]];
          this.oldSlotCollision = this.slotCollision;
          this.slotCollision = slotCollided[0];
          // A posição do slot é relativa ao seu componente-pai
          const collisionPos = collisionWith.position.add(
            collisionWith.getParentPosition()
          );
          // Fixa a posição da linha para o slot
          Editor.editorEnv.getComponents().connections[
            this.editingLineId
          ].endPosition = collisionPos;
        }
      } else {
        if (this.slotCollision !== -1) {
          this.oldSlotCollision = this.slotCollision;
          this.slotCollision = -1;
        }
        Editor.editorEnv.getComponents().connections[
          this.editingLineId
        ].endPosition = eventsObject.getMousePosition();
      }
    }
  },
  setConnectionParams(
    startPos?: Vector2,
    endPos?: Vector2,
    startSlotId?: number,
    endSlotId?: number
  ) {
    if (startPos !== undefined)
      Editor.editorEnv
        .getComponents()
        .connections[this.editingLineId].changePosition(startPos, 0, false);
    if (endPos !== undefined)
      Editor.editorEnv
        .getComponents()
        .connections[this.editingLineId].changePosition(endPos, 1, false);
    if (startSlotId !== undefined)
      Editor.editorEnv
        .getComponents()
        .connections[this.editingLineId].changeConnection(
          startSlotId,
          ComponentType.SLOT,
          false
        );
    if (endSlotId !== undefined)
      Editor.editorEnv
        .getComponents()
        .connections[this.editingLineId].changeConnection(
          endSlotId,
          ComponentType.SLOT,
          true
        );
  },
  removeOldConnection(slotId: number) {
    const oldConnectionId = Editor.editorEnv
      .getComponents()
      .slots[slotId].getConnectionId();
    if (oldConnectionId !== -1) {
      const oldConnection =
        Editor.editorEnv.getComponents().connections[oldConnectionId];
      Editor.editorEnv.getComponents().slots[slotId].setConnectionId(-1);
      if (oldConnection.connectedTo.start)
        Editor.editorEnv
          .getComponents()
          .slots[oldConnection.connectedTo.start.id].setConnectionId(-1);
      if (oldConnection.connectedTo.end)
        Editor.editorEnv
          .getComponents()
          .slots[oldConnection.connectedTo.end.id].setConnectionId(-1);
      delete Editor.editorEnv.getComponents().connections[oldConnectionId];
    }
  },
  resetConnEventParams() {
    // Reinicia os parâmetros para evitar ligações acidentais
    this.editingLine = false;
    this.editingLineId = -1;
    this.slotCollision = -1;
    this.oldSlotCollision = -1;
    this.lineStartSlot = -1;
  },
};
