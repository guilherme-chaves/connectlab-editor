import ComponentType from '../types/types';
import Vector2 from '../types/Vector2';
import Component from './Component';
import BBCollision from '../collision/BBCollision';

class TextComponent extends Component {
  public text: string;
  public parentNode: Component | null;
  public style: string;
  private textSize: Vector2;
  protected declare collisionShape: BBCollision;
  constructor(
    id: number,
    position: Vector2,
    text = '',
    style = '12px sans-serif',
    parent: Component | null = null
  ) {
    super(id, position, ComponentType.TEXT);
    this.text = text;
    this.style = style;
    this.parentNode = parent;
    this.textSize = new Vector2(0, 0);
    this.collisionShape = new BBCollision(
      this.parentNode?.position ?? new Vector2(0, 0),
      this.position,
      this.textSize.x,
      this.textSize.y
    );
  }

  draw(ctx: CanvasRenderingContext2D, style?: string) {
    // Ordem de prioridade (argumento -> objeto -> global)
    ctx.font = style ?? this.style ?? ctx.font;
    ctx.textBaseline = 'top';
    ctx.textAlign = 'left';
    this.textSize.x = ctx.measureText(this.text).width;
    this.textSize.y =
      ctx.measureText(this.text).actualBoundingBoxDescent -
      ctx.measureText(this.text).actualBoundingBoxAscent;
    this.collisionShape.b = this.textSize;
    this.collisionShape.drawPath = this.collisionShape.generatePath();
    //console.log(ctx.measureText(this.text))
    // Caso possua um nó-pai, deve usar a posição relativa a ele
    if (this.parentNode !== null) {
      const pos = this.parentNode.position.add(this.position);
      ctx.fillText(this.text, pos.x, pos.y);
    } else {
      ctx.fillText(this.text, this.position.x, this.position.y);
    }
    this.collisionShape.draw(ctx, true);
  }

  getCollisionShape(): BBCollision {
    return this.collisionShape;
  }
}

export default TextComponent;
