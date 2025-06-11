class Habilidades {
    #nome;
    #dano;
    #falha; // Chance de falha do ataque (0-20, comparado com gerarNumeroAleatorio0_20)
  
    constructor(nome, dano, falha) {
      this.#nome = nome;
      this.#dano = dano;
      this.#falha = falha;
    }
  
    get nome() {
      return this.#nome;
    }
    get dano() {
      return this.#dano;
    }
    get falha() {
      return this.#falha;
    }
    set dano(novoDano) {
      this.#dano = Math.max(0, novoDano); 
    }
    set falha(novaFalha) {
      this.#falha = Math.max(0, Math.min(20, novaFalha)); 
    }
  }
  
  class CaixaItens {
    #itens; // Array para armazenar os itens
  
    constructor() {
      this.#itens = [];
    }
  
    // Retorna o item em uma posição específica
    receberItem(n) {
      if (n >= 0 && n < this.#itens.length) {
        return this.#itens[n];
      }
      return null; // Retorna null se a posição for inválida
    }
  
    // Altera o item em uma posição específica
    mudarItem(n, valor) {
      if (n >= 0 && n < this.#itens.length) {
        this.#itens[n] = valor;
        return true;
      }
      return false; // Retorna false se a posição for inválida
    }
  
    // Adiciona um novo item ao final do array
    adicionarItem(valor) {
      this.#itens.push(valor);
    }
  
    // Retorna uma cópia do array de itens
    listarItens() {
      return [...this.#itens]; // Retorna uma cópia para evitar modificações diretas
    }
  }
  
  export { Habilidades, CaixaItens };