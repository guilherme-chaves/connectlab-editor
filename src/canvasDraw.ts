function updateAll(canvas : HTMLCanvasElement, ctx : CanvasRenderingContext2D, elements : Array<CanvasComponent|NodeComponent>) : any {
    // TODO
    /*
        - Escolher, determinado o tipo do elemento, o que deve ser adicionado a tela
        - Caso seja um componente lógico (NODE), buscar qual objeto (na pasta node/) deve ser adicionado
        - Caso seja uma ligação (LINE), deve achar qual a posição dos dois elementos que se conectam com a linha e
            percorrer o array de posições para desenhar o caminho (beginPath, moveTo, lineTo, lineStroke)
    */
}

export default updateAll