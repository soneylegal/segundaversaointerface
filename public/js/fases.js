// fases.js (corrigido para exibir os diálogos no momento certo)

import {
  Vila,
  Cidade,
  Fazenda1,
  Fazenda2,
  Delegacia,
  Igreja,
  Caatinga,
  Venda,
} from "./mapa.js";
import { batalha } from "./batalha.js";
import { Protagonista } from "./protagonista.js";
import { Habilidades, CaixaItens } from "./arsenal.js";
import {
  Personagem,
  gerarNumeroAleatorio0_20,
  lampiao,
  francisctexeira,
  volante,
  bandidoscidade,
  bandidoscidade2,
  zerufino,
} from "./personagem.js";
import { iniciarFuga } from "./fuga.js";
import { mostrarTexto, mostrarOpcoes } from "./interface.js";
import { getDialogos } from "./dadosCompartilhados.js";

let inventario = [0, "cantil de água", "pistola velha", "faca enferrujada"];

let VendaLoja = {
  nomelocal: "----- Mercearia Secos e Molhados -----",
  Itens: ["Água ardente", "Curativos", "Munição", "Parabelo", "Colete", "Carne de sol"],
};

let fasesconcluidas = 0;

const dialogosPorFase = {
  tutorial: [1, 2, 3],
  fase1: [4, 5, 6, 7, 8, 9],
  fase2: [10, 11, 12, 13],
  fase3: [14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24],
  fase4: [25, 26, 27, 28],
};

async function mostrarDialogosPorIds(ids) {
  const dialogos = getDialogos();
  for (const id of ids) {
    const d = dialogos.find((d) => d.id_dialogo === id);
    if (d) {
      mostrarTexto(`**${d.nome}:** ${d.fala}`);
      await new Promise((r) => setTimeout(r, 700));
    } else {
      console.warn(`Diálogo com ID ${id} não encontrado.`);
    }
  }
}

class Fases {
  #nomeFase;
  #status;
  constructor(nomeFase, status) {
    this.#nomeFase = nomeFase;
    this.#status = status;
  }
  get mostrarTutorial() {
    return `\n**[${this.#nomeFase}]**\n`;
  }
  get mostrarfase1() {
    return `\n**[${this.#nomeFase}]**\n`;
  }
  get mostrarfase2() {
    return `**[${this.#nomeFase}]**\n`;
  }
  get mostrarfase3() {
    return `\n**[${this.#nomeFase}]**\n`;
  }
  get mostrarfase4() {
    return `\n**[${this.#nomeFase}]**\n`;
  }
  get mostrarStatusFase() {
    return this.#status;
  }
  missaoConcluida() {
    this.#status = "concluída";
    mostrarTexto(`**Fase \"${this.#nomeFase}\" concluída!**`);
  }
  curaPosBatalha(protagonista) {
    const vidaMaxima = protagonista.vida;
    const curaQuantidade = vidaMaxima * 0.4;
    protagonista.aumentarVida(curaQuantidade);
    mostrarTexto(`Você se recuperou e ganhou **${curaQuantidade.toFixed(0)}** pontos de vida. Vida atual: **${protagonista.vida.toFixed(0)}**.`);
  }
}

class Tutorial extends Fases {
  constructor(nomeFase, status) {
    super(nomeFase, status);
  }
  async iniciarTutorial(protagonistaA, adversario) {
    await mostrarDialogosPorIds(dialogosPorFase.tutorial);
    await new Promise((resolve) => {
      mostrarOpcoes([
        {
          texto: "Iniciar Batalha do Tutorial",
          acao: async () => {
            mostrarTexto("Iniciando batalha do tutorial...");
            const vitoria = await batalha(protagonistaA, adversario);
            if (vitoria) {
              this.missaoConcluida();
              this.curaPosBatalha(protagonistaA);
              mostrarTexto("Parabéns! Você venceu o tutorial e está pronto para o sertão!");
            } else {
              mostrarTexto("Você foi derrotado no tutorial. Tente novamente para dominar as habilidades!");
            }
            resolve();
          },
        },
      ]);
    });
  }
}

class Fase1 extends Fases {
  constructor(nomeFase, status) {
    super(nomeFase, status);
  }
  async missaoDaJoia(protagonistaA, adversario) {
    await mostrarDialogosPorIds([4, 5, 6]);
    mostrarTexto(`**Local:** ${Fazenda1.nomelocal}`);
    mostrarTexto(`>>> **Informações:** ${Fazenda1.informacoes}`);

    const vitoria = await batalha(protagonistaA, adversario);
    if (vitoria) {
      await mostrarDialogosPorIds([7, 8, 9]);
      this.curaPosBatalha(protagonistaA);
      mostrarTexto("Você derrotou o Coronel Texeira e recuperou a joia!");
      await new Promise((resolve) => {
        mostrarOpcoes([
          {
            texto: "Ficar com a joia (Reputação baixa, item valioso)",
            acao: () => {
              protagonistaA.caixa.mudarItem(0, "joia");
              protagonistaA.perderReputacao(5);
              mostrarTexto(`Narração: **${protagonistaA.nome}** decidiu ficar com a joia. Sua reputação diminuiu um pouco.`);
              mostrarTexto("Você guardou a joia consigo.");
              resolve();
            },
          },
          {
            texto: "Devolver a joia (Reputação alta, terço de proteção)",
            acao: () => {
              protagonistaA.caixa.mudarItem(0, "terço");
              protagonistaA.ganharReputacao(10);
              mostrarTexto("Você devolveu a joia e ganhou um terço como proteção. Sua reputação aumentou!");
              resolve();
            },
          },
        ]);
      });
      this.missaoConcluida();
    } else {
      mostrarTexto("Você foi derrotado e não conseguiu recuperar a joia. O sertão se torna mais perigoso...");
    }
  }
}

class Fase2 extends Fases {
  constructor(nomeFase, status) {
    super(nomeFase, status);
  }
  async missaoResgate(protagonistaA, adversario) {
    await mostrarDialogosPorIds([10, 11]);
    mostrarTexto(`**Local:** ${Delegacia.nomelocal}`);
    mostrarTexto(`>>> **Informações:** ${Delegacia.informacoes}`);
    mostrarTexto("Você precisa resgatar Batoré da delegacia!");

    const vitoria = await batalha(protagonistaA, adversario);
    if (vitoria) {
      mostrarTexto("Você derrotou o Volante! Agora, você precisa escapar com Batoré...");
      const fuga = await iniciarFuga(protagonistaA, adversario);
      if (fuga) {
        await mostrarDialogosPorIds([12, 13]);
        mostrarTexto("Você e Batoré escaparam com sucesso! A missão foi cumprida.");
        this.missaoConcluida();
      } else {
        mostrarTexto("Você não conseguiu escapar com Batoré. Ele foi recapturado...");
      }
    } else {
      mostrarTexto("Você foi derrotado na delegacia e não conseguiu salvar Batoré. A missão falhou.");
    }
  }
  missaoResgateConcluida(protagonistaA) {
    super.missaoConcluida();
    fasesconcluidas = 2;
    protagonistaA.receberDinheiro(125);
    mostrarTexto("Recompensa recebida: **+125 dinheiro** por salvar Batoré!");
    this.curaPosBatalha(protagonistaA);
  }
}

class Fase3 extends Fases {
  constructor(nomeFase, status) {
    super(nomeFase, status);
  }
  async irParaCidade(protagonistaA, adversario, adversario2) {
    mostrarTexto(`**Local:** ${Cidade.nomelocal}`);
    mostrarTexto(`>>> **Informações:** ${Cidade.informacoes}`);
    await mostrarDialogosPorIds([14]);

    await new Promise((resolve) => {
      mostrarOpcoes([
        {
          texto: "Visitar a Vila Piranhas",
          acao: async () => {
            await this.irParaVila(protagonistaA);
            resolve();
          },
        },
        {
          texto: "Ir para a Mercearia Secos e Molhados",
          acao: async () => {
            await this.irParaVenda(protagonistaA);
            resolve();
          },
        },
        {
          texto: "Ir para a Igreja do Padinho Cicero",
          acao: async () => {
            await this.irParaIgreja(protagonistaA);
            resolve();
          },
        },
      ]);
    });

    mostrarTexto("Após suas andanças pela cidade, é hora de encarar a Caatinga...");
    await this.irParaCaatinga(protagonistaA, adversario, adversario2);
  }

  async irParaVila(protagonistaA) {
    mostrarTexto(`**Local:** ${Vila.nomelocal}`);
    mostrarTexto(`>>> **Informações:** ${Vila.informacoes}`);
    await mostrarDialogosPorIds([15, 16, 17, 18]);
    mostrarTexto("Você explorou a Vila Piranhas.");
  }

  async irParaVenda(protagonistaA) {
    mostrarTexto(`**Local:** ${Venda.nomelocal}`);
    mostrarTexto(`**Informações:** ${VendaLoja.nomelocal}`);
    const novosItens = [];
    if (protagonistaA.caixa.receberItem(0) === "joia") {
      VendaLoja.Itens.forEach((item) => {
        if (!inventario.includes(item)) {
          inventario.push(item);
          novosItens.push(item);
        }
      });
    } else {
      ["Parabelo", "Água ardente", "Munição", "Curativos"].forEach((item) => {
        if (!inventario.includes(item)) {
          inventario.push(item);
          novosItens.push(item);
        }
      });
    }
    if (novosItens.length > 0) {
      mostrarTexto(`Você adquiriu os seguintes itens: **${novosItens.join(", ")}**.`);
    } else {
      mostrarTexto("Não há novos itens para você aqui no momento.");
    }
    mostrarTexto("Compra efetuada com sucesso! Seu inventário foi atualizado.");
  }

  async irParaIgreja(protagonistaA) {
    mostrarTexto(`**Local:** ${Igreja.nomelocal}`);
    mostrarTexto(`>>> **Informações:** ${Igreja.informacoes}`);
    if (protagonistaA.caixa.receberItem(0) !== "joia") {
      protagonistaA.aumentarVida(20);
      mostrarTexto("Você recebeu uma benção do Padinho Cicero! Sua vida aumentou em **20 pontos**.");
    } else {
      mostrarTexto("Você não sentiu a benção do Padinho Cicero. Talvez por estar com a joia roubada...");
    }
  }

  async irParaCaatinga(protagonistaA, adversario, adversario2) {
    mostrarTexto(`**Local:** ${Caatinga.nomelocal}`);
    mostrarTexto(`>>> **Informações:** ${Caatinga.informacoes}`);
    mostrarTexto("Você encontra os bandidos... prepare-se para a luta!");

    let vitoria1 = await batalha(protagonistaA, adversario);
    if (!vitoria1) {
      mostrarTexto("Você foi derrotado pelo primeiro bandido. O jogo termina aqui...");
      return;
    }
    this.curaPosBatalha(protagonistaA);
    mostrarTexto("Você derrotou o primeiro bandido. Prepare-se para o próximo!");

    let vitoria2 = await batalha(protagonistaA, adversario2);
    if (!vitoria2) {
      mostrarTexto("Você foi derrotado pelo segundo bandido. O jogo termina aqui...");
      return;
    }
    this.curaPosBatalha(protagonistaA);
    await mostrarDialogosPorIds([23, 24]);
    this.missaoConcluida();
  }

  missaoConcluida() {
    super.missaoConcluida();
    fasesconcluidas = 3;
    mostrarTexto("Você concluiu a **Fase 3** e limpou a Caatinga da região!");
  }
}

class Fase4 extends Fases {
  constructor(nomeFase, status) {
    super(nomeFase, status);
  }
  async irParaFazendaCoronel(protagonistaA, adversario) {
    mostrarTexto(`**Local:** ${Fazenda2.nomelocal}`);
    mostrarTexto(`>>> **Informações:** ${Fazenda2.informacoes}`);
    await mostrarDialogosPorIds(dialogosPorFase.fase4);

    const vitoriaFinal = await batalha(protagonistaA, adversario);
    if (vitoriaFinal) {
      this.missaoConcluida();
      this.fimDeJogo(true);
    } else {
      this.fimDeJogo(false);
    }
  }
  missaoConcluida() {
    super.missaoConcluida();
    fasesconcluidas = 4;
    inventario[0] = "Coroa de Campeão do Sertão";
    mostrarTexto("Parabéns! Você completou a jornada e se tornou o verdadeiro herói do sertão!");
  }
  fimDeJogo(n) {
    if (n) {
      mostrarTexto("--- **VITÓRIA!** ---");
      mostrarTexto("O sertão está em paz novamente. Sua lenda será contada por gerações!");
    } else {
      mostrarTexto("--- **DERROTA!** ---");
      mostrarTexto("Você foi derrotado e esquecido nas terras secas do sertão. O mal prevaleceu...");
    }
    mostrarTexto("Obrigado por jogar Cangaceiros!")
    // Oferece a opção de jogar novamente
    mostrarOpcoes([
      { texto: "Jogar Novamente", acao: () => location.reload() },
    ]);
  }
}

export {
  Fases,
  Tutorial,
  Fase1,
  Fase2,
  Fase3,
  Fase4,
  dialogosPorFase,
  mostrarDialogosPorIds,
};