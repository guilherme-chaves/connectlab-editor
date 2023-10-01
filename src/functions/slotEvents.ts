import Editor from '../Editor';
import EditorEvents from './events';

export default {
  // Busca na lista de slots quais possuem uma colisão com o ponto do mouse
  checkSlotClick(eventsObject: EditorEvents): number[] | undefined {
    let collided = false;
    const collidedWith = new Array<number>();
    Object.keys(Editor.editorEnv.getComponents()['slots']).forEach(key => {
      const keyN = parseInt(key);
      const collision = Editor.editorEnv
        .getComponents()
        ['slots'][keyN].getCollisionShape()
        .collisionWithPoint(eventsObject.getMousePosition());
      if (collision) collidedWith.push(keyN);
      collided = collided || collision;
    });
    return collided ? collidedWith : undefined;
  },
};
