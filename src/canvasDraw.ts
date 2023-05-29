function updateAll(_canvas : HTMLCanvasElement, ctx : CanvasRenderingContext2D, elements : Array<CanvasComponent|NodeComponent|LineComponent|TextComponent>) : any {
    // TODO
    /*
        - Escolher, determinado o tipo do elemento, o que deve ser adicionado a tela
        - Caso seja um componente lógico (NODE), buscar qual objeto (na pasta node/) deve ser adicionado
        - Caso seja uma ligação (LINE), deve achar qual a posição dos dois elementos que se conectam com a linha e
            percorrer o array de posições para desenhar o caminho (beginPath, moveTo, lineTo, lineStroke)
    */
    elements.forEach(element => {
        switch (element.type) {
            case ComponentType.LINE:
                drawLine(ctx, <LineComponent> element);
        }
    });
}

function drawLine(ctx : CanvasRenderingContext2D, element : LineComponent) {
    ctx.beginPath();
    // .moveTo() deve conter a posição local?
    // Isso necessitaria obter a posição do elemento antes de realizar a movimentação
    ctx.moveTo(element.position.x, element.position.y)
    element.connectedTo.forEach(pos => {
        ctx.lineTo(pos.x, pos.y);
    });
    ctx.stroke();
}

export default updateAll