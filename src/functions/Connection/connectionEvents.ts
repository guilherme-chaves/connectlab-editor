import Editor from '../../Editor';
import Vector2 from '../../types/Vector2';
import ComponentType from '../../types/types';
import Mouse from '../../types/Mouse';
import slotEvents from '../slotEvents';
import SlotComponent from '../../components/SlotComponent';

export default {
  editingLineId: -1,
  editingLine: false,
  lineStartSlot: -1,
  oldSlotCollision: -1,
  slotCollision: -1,

  // Busca na lista de conexões quais possuem uma colisão com o ponto do mouse
  checkConnectionClick(): number[] | undefined {
    let collided = false;
    const collidedWith = new Array<number>();
    Object.keys(Editor.editorEnv.getComponents()['connections']).forEach(
      key => {
        const keyN = parseInt(key);
        const collision = Editor.editorEnv
          .getComponents()
          ['connections'][keyN].collisionShape.find(collisionShape => {
            return collisionShape.collisionWithPoint(Mouse.position);
          });
        if (collision !== undefined) collidedWith.push(keyN);
        collided = collided || collision !== undefined;
      }
    );
    return collided ? collidedWith : undefined;
  },

  addLine(editor: Editor) {
    if (this.editingLine && this.editingLineId !== -1) return true;
    const slotCollisions = slotEvents.checkSlotClick();
    if (slotCollisions !== undefined) {
      const key = Object.values(slotCollisions)[0];
      const slot = Editor.editorEnv.getComponents().slots[key];
      this.editingLineId = editor.line(
        slot.globalPosition.x,
        slot.globalPosition.y,
        {
          type: ComponentType.SLOT,
          id: key,
        }
      );
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

  lineMove(position: Vector2) {
    if (this.editingLine && this.editingLineId !== -1) {
      Editor.editorEnv
        .getComponents()
        .connections[this.editingLineId].move(position, 1, false, false);
      this.bindConnection();
      return true;
    }
    return false;
  },

  fixLine() {
    if (this.editingLine && this.editingLineId !== -1) {
      // Busca se existe um slot na posição atual do mouse
      const currentSlotCollisions = slotEvents.checkSlotClick();
      if (
        this.slotCollision !== -1 &&
        currentSlotCollisions !== undefined &&
        currentSlotCollisions[0] !== this.lineStartSlot
      ) {
        // Comparação para evitar conexões entre o mesmo slot
        let startSlot =
          Editor.editorEnv.getComponents().slots[this.lineStartSlot];
        let currentSlot =
          Editor.editorEnv.getComponents().slots[currentSlotCollisions[0]];
        const currentLine =
          Editor.editorEnv.getComponents().connections[this.editingLineId];
        if (startSlot.inSlot === currentSlot.inSlot) {
          delete Editor.editorEnv.getComponents().connections[
            this.editingLineId
          ];
          this.resetConnEventParams();
          return false;
        }

        // Caso a conexão esteja sendo feita de forma inversa (in -> out), trocar o valor dos parâmetros
        else if (!currentSlot.inSlot) {
          const temp = this.lineStartSlot;
          const tempObj = startSlot;
          this.lineStartSlot = currentSlotCollisions[0];
          startSlot = currentSlot;
          currentSlotCollisions[0] = temp;
          currentSlot = tempObj;
        }

        // Remove uma conexão anterior no slot de entrada, se existir
        this.removeOldInSlotConnection(startSlot);
        this.removeOldInSlotConnection(currentSlot);

        // Atribui a nova conexão aos slots
        startSlot.slotConnections = [...startSlot.slotConnections, currentLine];
        currentSlot.slotConnections = [
          ...currentSlot.slotConnections,
          currentLine,
        ];

        // Define as posições inicial e final da conexão para os dois slots
        this.changeConnectionParams(
          startSlot.globalPosition,
          currentSlot.globalPosition,
          this.lineStartSlot,
          currentSlotCollisions[0]
        );

        // Cria conjunto de caixas de colisão para a conexão
        currentLine.collisionShape = currentLine.generateCollisionShapes();

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

  bindConnection() {
    if (this.editingLine && this.editingLineId !== -1) {
      const slotCollisions = slotEvents.checkSlotClick();
      const currentLine =
        Editor.editorEnv.getComponents().connections[this.editingLineId];
      if (slotCollisions !== undefined) {
        // Evitar colisões com o slot de onde a linha se origina
        if (currentLine.connectedTo.start?.id !== slotCollisions[0]) {
          const slotCollided =
            Editor.editorEnv.getComponents().slots[slotCollisions[0]];
          this.oldSlotCollision = this.slotCollision;
          this.slotCollision = slotCollisions[0];
          // Fixa a posição da linha para o slot
          currentLine.endPosition = new Vector2(slotCollided.globalPosition);
        }
      } else {
        if (this.slotCollision !== -1) {
          this.oldSlotCollision = this.slotCollision;
          this.slotCollision = -1;
        }
        currentLine.endPosition = Mouse.position;
      }
    }
  },
  changeConnectionParams(
    startPos?: Vector2,
    endPos?: Vector2,
    startSlotId?: number,
    endSlotId?: number
  ) {
    if (startPos !== undefined)
      Editor.editorEnv
        .getComponents()
        .connections[this.editingLineId].move(startPos, 0, false, false);
    if (endPos !== undefined)
      Editor.editorEnv
        .getComponents()
        .connections[this.editingLineId].move(endPos, 1, false, false);
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
  removeOldInSlotConnection(slot: SlotComponent) {
    if (!slot.inSlot) return;
    const oldConnection = slot.slotConnections[0];
    if (oldConnection !== undefined) {
      slot.slotConnections.shift();
      if (oldConnection.connectedTo.start)
        Editor.editorEnv
          .getComponents()
          .slots[oldConnection.connectedTo.start.id].slotConnections.find(
            (connection, index, arr) => {
              if (connection.id === oldConnection.connectedTo.start?.id) {
                arr.splice(index, 1);
                return true;
              } else return false;
            }
          );
      if (oldConnection.connectedTo.end)
        Editor.editorEnv
          .getComponents()
          .slots[oldConnection.connectedTo.end.id].slotConnections.find(
            (connection, index, arr) => {
              if (connection.id === oldConnection.connectedTo.end?.id) {
                arr.splice(index, 1);
                return true;
              } else return false;
            }
          );
      delete Editor.editorEnv.getComponents().connections[oldConnection.id];
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
