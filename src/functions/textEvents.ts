import Editor from '../Editor';
import Vector2 from '../types/Vector2';

export default {
  // Busca na lista de textos quais possuem uma colisão com o ponto do mouse
  checkTextClick(position: Vector2): number[] | undefined {
    let collided = false;
    const collidedWith = new Array<number>();
    Object.keys(Editor.editorEnv.texts).forEach(key => {
      const keyN = parseInt(key);
      const collision =
        Editor.editorEnv.texts[keyN].collisionShape.collisionWithPoint(
          position
        );
      if (collision) collidedWith.push(keyN);
      collided = collided || collision;
    });
    return collided ? collidedWith : undefined;
  },
};
