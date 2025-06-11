import { Personagem, gerarNumeroAleatorio0_20 } from "./personagem.js";
import { CaixaItens, Habilidades } from "./arsenal.js";

class Protagonista extends Personagem {
  #reputacao;
  #caixaItens;

  constructor(
    nome,
    ocupacao,
    vida,
    armadura,
    velocidade,
    dinheiro,
    habilidade1,
    habilidade2,
    reputacao,
    caixaItens
  ) {
    super(
      nome,
      ocupacao,
      vida,
      armadura,
      velocidade,
      dinheiro,
      habilidade1,
      habilidade2
    );
    this.#reputacao = reputacao;
    this.#caixaItens = caixaItens;
  }

  get caixa() {
    return this.#caixaItens;
  }

  get reputacao() {
    return this.#reputacao;
  }

  set reputacao(novaReputacao) {
    if (novaReputacao >= 0) {
      this.#reputacao = novaReputacao;
    } else {
      this.#reputacao = 0; // Garante que não fique negativo
      console.log(
        "A reputação do protagonista caiu a zero. O jogo deve ser encerrado."
      );
      // O controle de "game over" deve estar nas fases/interface
    }
  }

  // Métodos para interagir com o dinheiro herdado de Personagem
  receberDinheiro(valor) {
    this.dinheiro = this.dinheiro + valor; // Usa o setter de Personagem
  }

  perderReputacao(perca) {
    this.reputacao = this.reputacao - perca; // Usa o setter de reputação
  }

  ganharReputacao(ganho) {
    this.reputacao = this.reputacao + ganho; // Usa o setter de reputação
  }

  // Métodos para interagir com os atributos herdados de Personagem
  aumentarVida(valor) {
    this.vida = this.vida + valor;
  }

  diminuirVida(valor) {
    this.vida = this.vida - valor;
  }

  aumentarArmadura(valor) {
    this.armadura = this.armadura + valor;
  }

  diminuirArmadura(valor) {
    this.armadura = this.armadura - valor;
  }

  aumentarVelocidade(valor) {
    this.velocidade = this.velocidade + valor;
  }

  diminuirVelocidade(valor) {
    this.velocidade = this.velocidade - valor;
  }

  aumentarHabilidade1(valor) {
    this.habilidade1.dano = this.habilidade1.dano + valor; // Aumenta o dano da habilidade
  }

  diminuirHabilidade1(valor) {
    this.habilidade1.dano = this.habilidade1.dano - valor;
  }

  aumentarHabilidade2(valor) {
    this.habilidade2.dano = this.habilidade2.dano + valor;
  }

  diminuirHabilidade2(valor) {
    this.habilidade2.dano = this.habilidade2.dano - valor;
  }
}

export { Protagonista };