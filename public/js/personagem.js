import { Habilidades } from "./arsenal.js";
// import { getDialogos } from './dadosCompartilhados.js' // Não usado diretamente aqui

function gerarNumeroAleatorio0_20() {
  return Math.floor(Math.random() * 21);
}

class Personagem {
  #nome;
  #ocupacao;
  #habilidade1;
  #habilidade2;
  #vida;
  #armadura;
  #velocidade;
  #dinheiro;

  constructor(
    nome,
    ocupacao,
    vida,
    armadura,
    velocidade,
    dinheiro,
    habilidade1,
    habilidade2
  ) {
    this.#nome = nome;
    this.#ocupacao = ocupacao;
    this.#vida = vida;
    this.#armadura = armadura;
    this.#velocidade = velocidade;
    this.#dinheiro = dinheiro;
    this.#habilidade1 = habilidade1;
    this.#habilidade2 = habilidade2;
  }

  get nome() {
    return this.#nome;
  }
  get ocupacao() {
    return this.#ocupacao;
  }
  get vida() {
    return this.#vida;
  }
  get armadura() {
    return this.#armadura;
  }
  get velocidade() {
    return this.#velocidade;
  }
  get dinheiro() {
    return this.#dinheiro;
  }
  get habilidade1() {
    return this.#habilidade1;
  }
  get habilidade2() {
    return this.#habilidade2;
  }

  set vida(novaVida) {
    this.#vida = Math.max(0, novaVida); // Garante que a vida não seja menor que zero
    if (this.#vida <= 0) {
      console.log(`${this.#nome} foi derrotado!`);
     
    }
  }

  set armadura(novaArmadura) {
    this.#armadura = Math.max(0, novaArmadura); // Garante que a armadura não seja menor que zero
  }

  set velocidade(novaVelocidade) {
    this.#velocidade = Math.max(0, novaVelocidade); // Garante que a velocidade não seja menor que zero
  }

  set dinheiro(novoDinheiro) {
    this.#dinheiro = Math.max(0, novoDinheiro); // Garante que o dinheiro não seja menor que zero
  }

  set habilidade1(h) {
    this.#habilidade1 = h;
  }
  set habilidade2(h) {
    this.#habilidade2 = h;
  }

  levarDano(dano) {
    this.vida = this.vida - dano; 
  }
}

const pistola = new Habilidades("pistola", 7, 2);
const tiroduplo = new Habilidades("tiro duplo de escopeta", 30, 7);
const faca = new Habilidades("faca", 12, 7);
const chute = new Habilidades("chute", 10, 7);
const disparo = new Habilidades("disparo", 10, 2);
const escopeta = new Habilidades("escopeta", 15, 5);
const facao = new Habilidades("facão", 14, 4);

function criarPersonagens() {
  const lampiao = new Personagem(
    "Lampião",
    "Cangaceiro",
    100,
    20,
    15,
    50,
    pistola,
    tiroduplo
  );
  const francisctexeira = new Personagem(
    "Francisc Teixeira",
    "Jagunço",
    90,
    10,
    20,
    40,
    faca,
    chute
  );
  const volante = new Personagem(
    "Volante",
    "Policial",
    110,
    15,
    12,
    60,
    faca,
    pistola
  );
  const bandidoscidade = new Personagem(
    "Bandido da Cidade",
    "Bandido",
    80,
    5,
    18,
    30,
    disparo,
    faca
  );
  const bandidoscidade2 = new Personagem(
    "Bandido da Cidade",
    "Bandido",
    80,
    5,
    18,
    30,
    disparo,
    faca
  );
  const zerufino = new Personagem(
    "Zé Rufino",
    "Coronel",
    120,
    25,
    10,
    100,
    escopeta,
    facao
  );

  return {
    lampiao,
    francisctexeira,
    volante,
    bandidoscidade,
    bandidoscidade2,
    zerufino,
  };
}

const {
  lampiao,
  francisctexeira,
  volante,
  bandidoscidade,
  bandidoscidade2,
  zerufino,
} = criarPersonagens();

export {
  Personagem,
  gerarNumeroAleatorio0_20,
  lampiao,
  francisctexeira,
  volante,
  bandidoscidade,
  bandidoscidade2,
  zerufino,
};