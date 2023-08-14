import ComponentType from '../types/types';
import Vector2 from '../types/Vector2';
import CollisionShape from '../collision/CollisionShape';

class Component {
  public readonly id: number;
  public position: Vector2;
  public readonly type: ComponentType;
  protected componentPath: Path2D;
  protected collisionShape: CollisionShape | undefined;

  constructor(
    id: number,
    position: Vector2,
    type: ComponentType = ComponentType.NODE,
    collisionShape?: CollisionShape
  ) {
    this.id = id;
    this.position = position;
    this.type = type;
    this.componentPath = new Path2D();
    this.collisionShape = collisionShape;
  }

  changePosition(delta: Vector2) {
    this.position = this.position.add(delta);
    this.generatePath();
  }

  draw(_ctx: CanvasRenderingContext2D) {
    throw new Error(
      'Função não implementada na classe-pai, utilize uma das subclasses!'
    );
  }

  getCollisionShape() {
    return this.collisionShape;
  }

  protected generatePath() {
    console.error(
      'Função não implementada na classe-pai, utilize uma das subclasses!'
    );
    return new Path2D();
  }
}

export default Component;
