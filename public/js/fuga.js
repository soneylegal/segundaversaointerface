import { mostrarTexto, mostrarOpcoes } from "./interface.js";
import { batalha } from "./batalha.js";
import { gerarNumeroAleatorio0_20 } from "./personagem.js";

let personagemA;
let personagemB;
let falhas = 0;
let vitorias = 0;
let turno = 1;
let resolveFugaPromise; // Variável para controlar a Promise da fuga

function iniciarFuga(protagonista, inimigo) {
  return new Promise((resolve) => {
    // Retorna uma Promise
    personagemA = protagonista;
    personagemB = inimigo;
    falhas = 0;
    vitorias = 0;
    turno = 1;
    resolveFugaPromise = resolve; // Armazena a função resolve da Promise

    mostrarTexto("------ A fuga começou ------");
    mostrarTexto(
      "Você precisa de 3 vitórias para fugir. Se acumular 3 falhas, será pego!"
    );
    proximoTurno();
  });
}

function proximoTurno() {
  if (falhas >= 3) {
    mostrarTexto(`Infelizmente, **${personagemA.nome}** foi capturado!`);
    mostrarOpcoes([]); // Limpa as opções
    resolveFugaPromise(false); // Resolve a Promise como falha
    return;
  }

  if (vitorias >= 3) {
    mostrarTexto(
      `Parabéns! **${personagemA.nome}** conseguiu fugir com sucesso!`
    );
    mostrarOpcoes([]); // Limpa as opções
    resolveFugaPromise(true); // Resolve a Promise como sucesso
    return;
  }

  mostrarTexto(`---- Turno ${turno} ----`);
  mostrarOpcoes([
    {
      texto: "Tentar continuar fugindo",
      acao: () => tentarFugir(),
    },
    {
      texto: "Desistir e lutar",
      acao: () => desistir(),
    },
  ]);
}

function tentarFugir() {
  const velocidadePersonagemA =
    personagemA.velocidade / 2 + gerarNumeroAleatorio0_20();
  const velocidadePersonagemB =
    personagemB.velocidade / 2 + gerarNumeroAleatorio0_20(); // Inimigo também tem rolagem

  mostrarTexto(
    `Você correu a ${velocidadePersonagemA.toFixed(1)} de velocidade.`
  );
  mostrarTexto(
    `${personagemB.nome} perseguiu a ${velocidadePersonagemB.toFixed(
      1
    )} de velocidade.`
  );

  if (velocidadePersonagemA > velocidadePersonagemB) {
    vitorias++;
    mostrarTexto(`**${personagemA.nome}** venceu o turno!`);
  } else {
    falhas++;
    mostrarTexto(`**${personagemB.nome}** se aproximou!`);
  }
  mostrarTexto(`**Vitórias:** ${vitorias} | **Falhas:** ${falhas}`);
  turno++;
  // Pequeno delay para a leitura antes do próximo turno
  setTimeout(proximoTurno, 1500);
}

async function desistir() {
  // Tornar assíncrona para aguardar a batalha
  const danoPenalidade = falhas * 10;
  if (danoPenalidade > 0) {
    mostrarTexto(
      `Você desistiu! Sofreu **${danoPenalidade}** de dano como penalidade.`
    );
    personagemA.levarDano(danoPenalidade);
  } else {
    mostrarTexto("Você desistiu e vai lutar!");
  }

  mostrarTexto(
    `Vida atual de ${personagemA.nome}: ${personagemA.vida.toFixed(0)}`
  );

  // Inicia a batalha e aguarda o resultado
  const vitoriaBatalha = await batalha(personagemA, personagemB);
  resolveFugaPromise(vitoriaBatalha); // Resolve a Promise da fuga com o resultado da batalha
}

export { iniciarFuga };