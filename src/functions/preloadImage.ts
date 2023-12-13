import {ImageListObject} from '../types/types';

/**
 * Função que carrega um ou mais arrays contendo um par de chave da imagem e caminho para o arquivo,
 * retornando um objeto contendo uma lista de objetos, com a chave de nome especificado.
 * @argument Array(s) com chave da imagem e caminho (path) da imagem, no formato [chave, chaminho]
 * @returns Objeto com a lista de imagens
 */
export default function preloadImage(list: Map<number, string>) {
  const images: ImageListObject = new Map();
  list.forEach((value, key) => {
    images.set(key, new Image());
    images.get(key)!.src = value;
  });
  return images;
}
