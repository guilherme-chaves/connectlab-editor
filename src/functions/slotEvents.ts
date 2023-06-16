import ComponentsList from "../components/ComponentsList";
import EditorEvents from "./events";

export default {
  // Busca na lista de slots quais possuem uma colisão com o ponto do mouse
  checkSlotClick(componentsList: ComponentsList, eventsObject: EditorEvents): number[] | undefined {
    let collided = false;
    const collidedWith = new Array<number>();
    Object.keys(componentsList.getComponents()['slots']).forEach(key => {
      const keyN = parseInt(key);
      const collision = componentsList
        .getComponents()
        ['slots'][keyN].getCollisionShape()
        .collisionWithPoint(eventsObject.getMousePosition());
      if (collision) collidedWith.push(keyN);
      collided = collided || collision;
    });
    return collided ? collidedWith : undefined;
  }
}