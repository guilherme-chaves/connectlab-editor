import Editor from '../../Editor';
import Vector2 from '../../types/Vector2';
import {ComponentType, ConnectionList} from '../../types/types';
import slotEvents from '../slotEvents';
import SlotComponent from '../../components/SlotComponent';
import signalEvents from '../Signal/signalEvents';
import EditorEnvironment from '../../EditorEnvironment';
import MouseEvents from '../mouseEvents';
import ConnectionComponent from '../../components/ConnectionComponent';

export default {
  editingLineId: -1,
  editingLine: false,
  lineStartSlot: -1,
  oldSlotCollision: -1,
  slotCollision: -1,

  // Busca na lista de conexões quais possuem uma colisão com o ponto do mouse
  checkConnectionClick(
    connections: ConnectionList,
    position: Vector2
  ): number[] {
    const collidedWith: Array<number> = [];
    connections.forEach((connection, key) => {
      const collision = connection.collisionShape.find(collisionShape => {
        return collisionShape.collisionWithPoint(position);
      });
      if (collision !== undefined) collidedWith.push(key);
    });
    return collidedWith;
  },

  addLine(editor: Editor, mouseEvents: MouseEvents) {
    if (this.editingLine && this.editingLineId !== -1) return true;
    const slotCollisions = mouseEvents.getCollisionList().slots;
    if (slotCollisions.length > 0) {
      const slot = editor.editorEnv.slots.get(slotCollisions[0]);
      if (!slot) return false;
      // debugger;
      this.editingLineId = editor.line(
        slot.globalPosition.x,
        slot.globalPosition.y,
        slot.globalPosition.x,
        slot.globalPosition.y,
        {
          type: ComponentType.SLOT,
          id: slot.id,
        }
      );
      this.editingLine = true;
      this.oldSlotCollision = this.slotCollision;
      this.slotCollision = slot.id;
      this.lineStartSlot = slot.id;
      return true;
    } else {
      this.oldSlotCollision = this.slotCollision;
      this.slotCollision = -1;
    }
    return false;
  },

  move(
    editorEnv: EditorEnvironment,
    mouseEvents: MouseEvents,
    position: Vector2
  ) {
    if (
      !this.editingLine ||
      this.editingLineId === -1 ||
      !(
        mouseEvents.movingObject === 'none' ||
        mouseEvents.movingObject === 'connection'
      ) ||
      !editorEnv.connections.has(this.editingLineId)
    )
      return false;

    mouseEvents.movingObject = 'connection';

    const connection = editorEnv.connections.get(this.editingLineId);
    if (connection) {
      connection.move(position, false, 1, false);
      this.bindConnection(editorEnv, position);
      return true;
    }
    return false;
  },

  fixLine(editorEnv: EditorEnvironment, position: Vector2) {
    if (this.editingLine && this.editingLineId !== -1) {
      // Busca se existe um slot na posição atual do mouse
      const currentSlotCollisions = slotEvents.checkSlotClick(
        editorEnv.slots,
        position
      );
      if (
        this.slotCollision !== -1 &&
        currentSlotCollisions.length > 0 &&
        currentSlotCollisions[0] !== this.lineStartSlot
      ) {
        // Comparação para evitar conexões entre o mesmo slot
        let startSlot = editorEnv.slots.get(this.lineStartSlot)!;
        let currentSlot = editorEnv.slots.get(currentSlotCollisions[0])!;
        const currentLine = editorEnv.connections.get(this.editingLineId)!;
        if (startSlot.inSlot === currentSlot.inSlot) {
          editorEnv.removeComponent(this.editingLineId, ComponentType.LINE);
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
        this.removeOldInSlotConnection(editorEnv, startSlot);
        this.removeOldInSlotConnection(editorEnv, currentSlot);

        // Atribui a nova conexão aos slots
        startSlot.slotConnections = [...startSlot.slotConnections, currentLine];
        currentSlot.slotConnections = [
          ...currentSlot.slotConnections,
          currentLine,
        ];

        // Define as posições inicial e final da conexão para os dois slots
        this.changeConnectionParams(
          editorEnv.connections.get(this.editingLineId)!,
          startSlot.globalPosition,
          currentSlot.globalPosition,
          this.lineStartSlot,
          currentSlotCollisions[0]
        );
        // Cria conjunto de caixas de colisão para a conexão
        signalEvents.addEdge(editorEnv, currentLine);
        currentLine.collisionShape = currentLine.generateCollisionShapes();

        // Retorna a lista de parâmetros do objeto para seus valores padrão
        this.resetConnEventParams();
        return true;
      }
      // Caso não haja colisão com algum slot, exclui a conexão que está sendo gerada
      else {
        editorEnv.removeComponent(this.editingLineId, ComponentType.LINE);
        this.resetConnEventParams();
        return false;
      }
    }
    this.resetConnEventParams();
    return false;
  },

  bindConnection(editorEnv: EditorEnvironment, position: Vector2) {
    if (this.editingLine && this.editingLineId !== -1) {
      const slotCollisions = slotEvents.checkSlotClick(
        editorEnv.slots,
        position
      );
      const currentLine = editorEnv.connections.get(this.editingLineId)!;
      if (slotCollisions.length > 0) {
        // Evitar colisões com o slot de onde a linha se origina
        if (currentLine.connectedTo.start?.id !== slotCollisions[0]) {
          const slotCollided = editorEnv.slots.get(slotCollisions[0])!;
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
        currentLine.endPosition = position;
      }
    }
  },
  changeConnectionParams(
    connection: ConnectionComponent,
    startPos?: Vector2,
    endPos?: Vector2,
    startSlotId?: number,
    endSlotId?: number
  ) {
    if (startPos !== undefined) connection.move(startPos, false, 0, false);
    if (endPos !== undefined) connection.move(endPos, false, 1, false);
    if (startSlotId !== undefined)
      connection.changeConnection(startSlotId, ComponentType.SLOT, false);
    if (endSlotId !== undefined)
      connection.changeConnection(endSlotId, ComponentType.SLOT, true);
  },
  removeOldInSlotConnection(editorEnv: EditorEnvironment, slot: SlotComponent) {
    if (!slot.inSlot) return;
    const oldConnection = slot.slotConnections[0];
    if (oldConnection !== undefined) {
      slot.slotConnections.splice(0, slot.slotConnections.length);
      if (oldConnection.connectedTo.start)
        editorEnv.slots
          .get(oldConnection.connectedTo.start.id)!
          .slotConnections.find((connection, index, arr) => {
            if (connection.id === oldConnection.connectedTo.start?.id) {
              arr.splice(index, 1);
              return true;
            } else return false;
          });
      if (oldConnection.connectedTo.end)
        editorEnv.slots
          .get(oldConnection.connectedTo.end.id)!
          .slotConnections.find((connection, index, arr) => {
            if (connection.id === oldConnection.connectedTo.end?.id) {
              arr.splice(index, 1);
              return true;
            } else return false;
          });
      editorEnv.removeComponent(oldConnection.id, ComponentType.LINE);
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
