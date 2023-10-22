import {ImageListObject} from '../types/types';

/**
 * Função que carrega um ou mais arrays contendo um par de chave da imagem e caminho para o arquivo,
 * retornando um objeto contendo uma lista de objetos, com a chave de nome especificado.
 * @argument Array(s) com chave da imagem e caminho (path) da imagem, no formato [chave, chaminho]
 * @returns Objeto com a lista de imagens
 */
export default function preloadImage(list: string[][]) {
  const images: ImageListObject = {};
  for (let i = 0; i < list.length; i++) {
    images[list[i][0]] = new Image();
    images[list[i][0]].src = list[i][1] as string;
  }
  return images;
}
