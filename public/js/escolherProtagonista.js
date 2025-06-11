import { Protagonista } from "./protagonista.js";
import { Habilidades, CaixaItens } from "./arsenal.js";
import { mostrarTexto, mostrarOpcoes } from "./interface.js";

// HABILIDADES
const pistola = new Habilidades("pistola", 20, 2);
const espingarda = new Habilidades("espingarda", 30, 6);
const soco = new Habilidades("soco", 15, 2);
const peixera = new Habilidades("peixeira", 30, 4);
const padinCico = new Habilidades("em nome de padin ciço", 60, 10);
const penitencia = new Habilidades("penitencia", 40, 4);

// CAIXA DE ITENS (Criada uma vez para todos os protagonistas)
const caixaPadrao = new CaixaItens();
caixaPadrao.adicionarItem(0); // Item na posição 0
caixaPadrao.adicionarItem("cantil de água");
caixaPadrao.adicionarItem("pistola velha");
caixaPadrao.adicionarItem("faca enferrujada");

// Função para escolha da ocupação com interface
function escolherProta(nomeJogador) {
  return new Promise((resolve) => {
    mostrarTexto("Escolha sua ocupação:");
    mostrarOpcoes([
      {
        texto: "1: Atirador",
        acao: () => {
         
          const caixaJogador = new CaixaItens();
          caixaPadrao
            .listarItens()
            .forEach((item) => caixaJogador.adicionarItem(item));

          const jogador = new Protagonista(
            nomeJogador,
            "atirador",
            120,
            5,
            10,
            50,
            pistola,
            espingarda,
            10,
            caixaJogador
          );
          mostrarResumo(jogador);
          resolve(jogador); 
        },
      },
      {
        texto: "2: Cabra da Pexte",
        acao: () => {
          const caixaJogador = new CaixaItens();
          caixaPadrao
            .listarItens()
            .forEach((item) => caixaJogador.adicionarItem(item));

          const jogador = new Protagonista(
            nomeJogador,
            "cabra da pexte",
            160,
            10,
            4,
            50,
            soco,
            peixera,
            10,
            caixaJogador
          );
          mostrarResumo(jogador);
          resolve(jogador);
        },
      },
      {
        texto: "3: Espiritualista",
        acao: () => {
          const caixaJogador = new CaixaItens();
          caixaPadrao
            .listarItens()
            .forEach((item) => caixaJogador.adicionarItem(item));

          const jogador = new Protagonista(
            nomeJogador,
            "espiritualista",
            120,
            7,
            2,
            50,
            padinCico,
            penitencia,
            10,
            caixaJogador
          );
          mostrarResumo(jogador);
          resolve(jogador);
        },
      },
    ]);
  });
}


function mostrarResumo(jogador) {
  mostrarTexto("--- Características do seu personagem: ---");
  mostrarTexto(`**Nome:** ${jogador.nome}`);
  mostrarTexto(`**Ocupação:** ${jogador.ocupacao}`);
  mostrarTexto(`**Vida:** ${jogador.vida.toFixed(0)}`);
  mostrarTexto(`**Armadura:** ${jogador.armadura.toFixed(0)}`);
  mostrarTexto(`**Velocidade:** ${jogador.velocidade.toFixed(0)}`);
  mostrarTexto(`**Dinheiro:** ${jogador.dinheiro.toFixed(0)}`);
  mostrarTexto(`**Reputação:** ${jogador.reputacao.toFixed(0)}`);
  mostrarTexto(
    `**Habilidade 1:** ${
      jogador.habilidade1.nome
    } | Dano: ${jogador.habilidade1.dano.toFixed(
      0
    )} | Chance de Falha: ${jogador.habilidade1.falha.toFixed(0)}%`
  );
  mostrarTexto(
    `**Habilidade 2:** ${
      jogador.habilidade2.nome
    } | Dano: ${jogador.habilidade2.dano.toFixed(
      0
    )} | Chance de Falha: ${jogador.habilidade2.falha.toFixed(0)}%`
  );
  mostrarTexto(`**Itens Iniciais:** ${jogador.caixa.listarItens().join(", ")}`);
}

export { escolherProta };