import Editor from '../Editor';
import Mouse from '../types/Mouse';

export default {
  // Busca na lista de textos quais possuem uma colisão com o ponto do mouse
  checkTextClick(): number[] | undefined {
    let collided = false;
    const collidedWith = new Array<number>();
    Object.keys(Editor.editorEnv.texts).forEach(key => {
      const keyN = parseInt(key);
      const collision = Editor.editorEnv.texts[
        keyN
      ].collisionShape.collisionWithPoint(Mouse.position);
      if (collision) collidedWith.push(keyN);
      collided = collided || collision;
    });
    return collided ? collidedWith : undefined;
  },
};
