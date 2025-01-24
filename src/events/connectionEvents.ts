import Vector2 from '@connectlab-editor/types/vector2';
import {ConnectionList} from '@connectlab-editor/types/common';
import {ComponentType} from '@connectlab-editor/types/enums';
import slotEvents from '@connectlab-editor/events/slotEvents';
import SlotComponent from '@connectlab-editor/components/slotComponent';
import signalEvents from '@connectlab-editor/events/signalEvents';
import EditorEnvironment from '@connectlab-editor/environment';
import MouseEvents from '@connectlab-editor/events/mouseEvents';
import ConnectionComponent from '@connectlab-editor/components/connectionComponent';
import addComponent from '@connectlab-editor/functions/addComponent';

export const connectionEvents = {
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
    for (const [key, connection] of connections.entries()) {
      const collision = connection.collisionShape.find(collisionShape => {
        return collisionShape.collisionWithPoint(position);
      });
      if (collision !== undefined) collidedWith.push(key);
    }
    return collidedWith;
  },

  addLine(editorEnv: EditorEnvironment, mouseEvents: MouseEvents): boolean {
    if (this.editingLine && this.editingLineId !== -1) return true;
    const slotCollisions = mouseEvents.getCollisionList().slots;
    if (slotCollisions.length > 0) {
      const slot = editorEnv.slots.get(slotCollisions[0]);
      if (!slot) return false;
      // debugger;
      this.editingLineId = addComponent.connection(
        undefined,
        editorEnv,
        slot.globalPosition.x,
        slot.globalPosition.y,
        slot.globalPosition.x,
        slot.globalPosition.y,
        {
          slotId: slot.id,
          nodeId: slot.parent.id,
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
  ): boolean {
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

  fixLine(editorEnv: EditorEnvironment, position: Vector2): boolean {
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
          startSlot.parent.id,
          currentSlotCollisions[0],
          currentSlot.parent.id
        );
        // Cria conjunto de caixas de colisão para a conexão
        signalEvents.edge.add(editorEnv.signalGraph, currentLine);
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

  bindConnection(editorEnv: EditorEnvironment, position: Vector2): void {
    if (this.editingLine && this.editingLineId !== -1) {
      const slotCollisions = slotEvents.checkSlotClick(
        editorEnv.slots,
        position
      );
      const currentLine = editorEnv.connections.get(this.editingLineId)!;
      if (slotCollisions.length > 0) {
        // Evitar colisões com o slot de onde a linha se origina
        if (currentLine.connectedTo.start?.slotId !== slotCollisions[0]) {
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
    startNodeId?: number,
    endSlotId?: number,
    endNodeId?: number
  ): void {
    if (startPos !== undefined) connection.move(startPos, false, 0, false);
    if (endPos !== undefined) connection.move(endPos, false, 1, false);
    if (startSlotId !== undefined && startNodeId !== undefined)
      connection.changeConnection(startSlotId, startNodeId, false);
    if (endSlotId !== undefined && endNodeId !== undefined)
      connection.changeConnection(endSlotId, endNodeId, true);
  },
  removeOldInSlotConnection(
    editorEnv: EditorEnvironment,
    slot: SlotComponent
  ): void {
    if (!slot.inSlot) return;
    const oldConnection = slot.slotConnections[0];
    if (oldConnection !== undefined) {
      slot.slotConnections.splice(0, slot.slotConnections.length);
      if (oldConnection.connectedTo.start)
        editorEnv.slots
          .get(oldConnection.connectedTo.start.slotId)!
          .slotConnections.find((connection, index, arr) => {
            if (connection.id === oldConnection.connectedTo.start?.slotId) {
              arr.splice(index, 1);
              return true;
            } else return false;
          });
      if (oldConnection.connectedTo.end)
        editorEnv.slots
          .get(oldConnection.connectedTo.end.slotId)!
          .slotConnections.find((connection, index, arr) => {
            if (connection.id === oldConnection.connectedTo.end?.slotId) {
              arr.splice(index, 1);
              return true;
            } else return false;
          });
      editorEnv.removeComponent(oldConnection.id, ComponentType.LINE);
    }
  },
  resetConnEventParams(): void {
    // Reinicia os parâmetros para evitar ligações acidentais
    this.editingLine = false;
    this.editingLineId = -1;
    this.slotCollision = -1;
    this.oldSlotCollision = -1;
    this.lineStartSlot = -1;
  },
};
