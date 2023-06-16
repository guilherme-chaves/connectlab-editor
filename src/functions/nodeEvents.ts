import ComponentsList from "../components/ComponentsList";
import Position from "../types/Position";
import EditorEvents from "./events";
import connectionEvents from "./connectionEvents";

export default {
	// Busca na lista de nodes quais possuem uma colisão com o ponto do mouse
	checkNodeClick(componentsList: ComponentsList, eventsObject: EditorEvents): number[] | undefined {
		let collided = false;
		const collidedWith = new Array<number>();
		Object.keys(componentsList.getComponents()['nodes']).forEach(key => {
			const keyN = parseInt(key);
			const collision = componentsList
				.getComponents()
				['nodes'][keyN].getCollisionShape()
				.collisionWithPoint(eventsObject.getMousePosition());
			if (collision) collidedWith.push(keyN);
			collided = collided || collision;
		});
		return collided ? collidedWith : undefined;
	},
	nodeMove(componentsList: ComponentsList, eventsObject: EditorEvents, delta: Position): boolean {
    if (eventsObject.getCollisionList().nodes !== undefined && eventsObject.getMouseChangedPosition() && !connectionEvents.editingLine) {
      const key = Object.values(eventsObject.getCollisionList().nodes as number[])[0];
      componentsList.getComponents().nodes[key].changePosition(delta);
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
};