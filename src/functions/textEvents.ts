import ComponentsList from '../components/ComponentsList';
import EditorEvents from './events';

export default {
  // Busca na lista de textos quais possuem uma colisão com o ponto do mouse
  checkTextClick(
    componentsList: ComponentsList,
    eventsObject: EditorEvents
  ): number[] | undefined {
    let collided = false;
    const collidedWith = new Array<number>();
    Object.keys(componentsList.getComponents()['texts']).forEach(key => {
      const keyN = parseInt(key);
      const collision = componentsList
        .getComponents()
        ['texts'][keyN].getCollisionShape()
        .collisionWithPoint(eventsObject.getMousePosition());
      if (collision) collidedWith.push(keyN);
      collided = collided || collision;
    });
    return collided ? collidedWith : undefined;
  },
};
