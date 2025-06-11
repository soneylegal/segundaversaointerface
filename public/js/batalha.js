import { Personagem, gerarNumeroAleatorio0_20 } from "./personagem.js";
// import {Habilidades, CaixaItens } from './arsenal.js' // Não são usadas diretamente aqui
// import { Protagonista } from './protagonista.js' // Não é usada diretamente aqui
// import { escolherProta } from './escolherProtagonista.js' // Não é usada diretamente aqui
import { mostrarTexto, mostrarOpcoes } from "./interface.js";

let personagemAAtual; // O protagonista em batalha
let personagemBAtual; // O inimigo em batalha
let resolveBatalhaPromise; // Função para resolver a Promise da batalha

/**
 * Inicia uma batalha interativa entre dois personagens.
 * A batalha é assíncrona e retorna uma Promise que se resolve com true (vitória) ou false (derrota).
 * @param {Personagem} personagemA - O protagonista.
 * @param {Personagem} personagemB - O inimigo.
 * @returns {Promise<boolean>} Uma Promise que resolve com true se o protagonista vencer, false caso contrário.
 */
function batalha(personagemA, personagemB) {
  return new Promise((resolve) => {
    personagemAAtual = personagemA;
    personagemBAtual = personagemB;
    resolveBatalhaPromise = resolve; // Armazena a função resolve

    mostrarTexto(
      `------ Batalha iniciada entre **${personagemAAtual.nome}** e **${personagemBAtual.nome}**! ------`
    );
    iniciarTurnoBatalha(1); // Inicia o primeiro turno
  });
}

/**
 * Gerencia o fluxo de um turno de batalha, verificando condições de vitória/derrota
 * e apresentando opções de ação ao jogador.
 * @param {number} turno - O número do turno atual.
 */
function iniciarTurnoBatalha(turno) {
  // Verifica se a batalha já terminou
  if (personagemAAtual.vida <= 0) {
    mostrarTexto(
      `**${personagemAAtual.nome}** foi derrotado! **${personagemBAtual.nome}** venceu!`
    );
    mostrarOpcoes([]); // Limpa as opções
    resolveBatalhaPromise(false); // Resolve a Promise como derrota
    return;
  }
  if (personagemBAtual.vida <= 0) {
    mostrarTexto(
      `**${personagemBAtual.nome}** foi derrotado! **${personagemAAtual.nome}** venceu!`
    );
    personagemAAtual.receberDinheiro(personagemBAtual.dinheiro); // Protagonista ganha dinheiro
    mostrarTexto(
      `Você ganhou **${personagemBAtual.dinheiro.toFixed(0)}** de dinheiro.`
    );
    mostrarOpcoes([]); // Limpa as opções
    resolveBatalhaPromise(true); // Resolve a Promise como vitória
    return;
  }

  mostrarTexto(`--- **Turno ${turno}** ---`);
  mostrarTexto(
    `**${personagemAAtual.nome}** (Vida: ${personagemAAtual.vida.toFixed(
      0
    )}) vs **${personagemBAtual.nome}** (Vida: ${personagemBAtual.vida.toFixed(
      0
    )})`
  );

  mostrarOpcoes([
    {
      texto: `Usar Habilidade 1: ${
        personagemAAtual.habilidade1.nome
      } (Dano: ${personagemAAtual.habilidade1.dano.toFixed(0)})`,
      acao: () =>
        realizarAtaque(
          personagemAAtual,
          personagemBAtual,
          personagemAAtual.habilidade1,
          turno
        ),
    },
    {
      texto: `Usar Habilidade 2: ${
        personagemAAtual.habilidade2.nome
      } (Dano: ${personagemAAtual.habilidade2.dano.toFixed(0)})`,
      acao: () =>
        realizarAtaque(
          personagemAAtual,
          personagemBAtual,
          personagemAAtual.habilidade2,
          turno
        ),
    },
    {
      texto: "Ver Status",
      acao: () => {
        mostrarStatus(personagemAAtual);
        iniciarTurnoBatalha(turno); // Permite ao jogador ver o status e escolher novamente
      },
    },
  ]);
}

/**
 * Realiza um ataque de um personagem em outro.
 * @param {Personagem} atacante - O personagem que está atacando.
 * @param {Personagem} defensor - O personagem que está defendendo.
 * @param {Habilidades} habilidadeUsada - A habilidade utilizada no ataque.
 * @param {number} turno - O número do turno atual.
 */
function realizarAtaque(atacante, defensor, habilidadeUsada, turno) {
  let danoCausado = 0;
  // Lógica da falha: se o número aleatório for menor que a falha, o ataque falha.
  // Ou seja, um valor de falha mais alto significa mais chance de falha.
  if (gerarNumeroAleatorio0_20() > habilidadeUsada.falha) {
    // Lógica ajustada: se o número aleatório for MAIOR que a falha, o ataque acerta
    danoCausado = habilidadeUsada.dano;
  } else {
    mostrarTexto(
      `**${atacante.nome}** tentou usar **${habilidadeUsada.nome}**, mas o ataque falhou!`
    );
  }

  let danoRecebidoPeloDefensor = Math.max(0, danoCausado - defensor.armadura);
  defensor.levarDano(danoRecebidoPeloDefensor);

  if (danoCausado > 0) {
    mostrarTexto(
      `**${atacante.nome}** atacou com **${
        habilidadeUsada.nome
      }**, causando **${danoRecebidoPeloDefensor.toFixed(0)}** de dano em **${
        defensor.nome
      }**!`
    );
  }

  // Pequeno delay para a mensagem do jogador aparecer antes do contra-ataque do inimigo
  setTimeout(() => {
    // Verifica se o defensor foi derrotado antes do contra-ataque
    if (defensor.vida <= 0) {
      iniciarTurnoBatalha(turno); // Vai para o próximo turno para verificar a vitória
      return;
    }

    // Ataque do inimigo
    let habilidadeInimiga =
      Math.random() < 0.5 ? defensor.habilidade1 : defensor.habilidade2;
    let danoInimigo = 0;

    if (gerarNumeroAleatorio0_20() > habilidadeInimiga.falha) {
      // Lógica de falha para o inimigo
      danoInimigo = habilidadeInimiga.dano;
    } else {
      mostrarTexto(
        `O ataque de **${defensor.nome}** com **${habilidadeInimiga.nome}** falhou!`
      );
    }

    let danoRecebidoPeloAtacante = Math.max(0, danoInimigo - atacante.armadura);
    atacante.levarDano(danoRecebidoPeloAtacante);

    if (danoInimigo > 0) {
      mostrarTexto(
        `**${defensor.nome}** contra-atacou com **${
          habilidadeInimiga.nome
        }**, causando **${danoRecebidoPeloAtacante.toFixed(0)}** de dano em **${
          atacante.nome
        }**!`
      );
    }

    iniciarTurnoBatalha(turno + 1); // Próximo turno
  }, 1500); // Espera 1.5 segundos para o ataque do inimigo
}

/**
 * Exibe o status atual do personagem na interface.
 * @param {Personagem} personagem - O personagem cujo status será exibido.
 */
function mostrarStatus(personagem) {
  mostrarTexto(`
        --- **Seu Status:** ---
        **Vida:** ${personagem.vida.toFixed(0)}
        **Armadura:** ${personagem.armadura.toFixed(0)}
        **Dinheiro:** ${personagem.dinheiro.toFixed(0)}
        **Habilidade 1 (${
          personagem.habilidade1.nome
        }):** Dano ${personagem.habilidade1.dano.toFixed(
    0
  )} | Falha ${personagem.habilidade1.falha.toFixed(0)}%
        **Habilidade 2 (${
          personagem.habilidade2.nome
        }):** Dano ${personagem.habilidade2.dano.toFixed(
    0
  )} | Falha ${personagem.habilidade2.falha.toFixed(0)}%
    `);
}

export { batalha };