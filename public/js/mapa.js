import { mostrarTexto, mostrarOpcoes } from "./interface.js";
// import { getDialogos } from './dadosCompartilhados.js' // Não usado diretamente aqui

class Mapa {
  #nome;
  #informacoes;
  #desbloqueado;

  constructor(nome, informacoes = "Sem informações", desbloqueado = false) {
    this.#nome = nome;
    this.#informacoes = informacoes;
    this.#desbloqueado = desbloqueado;
  }

  get nomelocal() {
    return this.#nome;
  }

  get informacoes() {
    return this.#informacoes;
  }

  get acesso() {
    return this.#desbloqueado;
  }

  set desbloq_bloq(valor) {
    if (valor === true) {
      this.#desbloqueado = true;
      mostrarTexto(`${this.#nome} agora está desbloqueado!`);
    } else {
      this.#desbloqueado = false; // Garante que o status seja atualizado
      mostrarTexto(
        `${this.#nome} está bloqueado. Realize uma missão para desbloquear.`
      );
    }
  }

  mostrarLocal() {
    mostrarTexto(`**Local:** ${this.#nome}`);
    mostrarTexto(`**Informações:** ${this.#informacoes}`);
    mostrarTexto(
      `**Status:** ${
        this.#desbloqueado ? "Local acessível" : "Local bloqueado"
      }`
    );
  }
}

// Criando dinamicamente os locais
function criarMapaDinamico() {
  const Cidade = new Mapa(
    "Piranhas",
    "Cidade principal do jogo, com muitos mistérios.",
    true
  );
  const Vila = new Mapa("Vila Piranhas", "Uma vila pequena e humilde.", true);
  const Delegacia = new Mapa("Delegacia", "Lugar perigoso e vigiado.", false);
  const Venda = new Mapa("Secos e Molhados", "Um pequeno comércio local", true);
  const Igreja = new Mapa(
    "Igreja do Padinho Cicero",
    "Igreja histórica do cangaço.",
    false
  );
  const Caatinga = new Mapa("Caatinga", "Vegetação densa e perigosa.", false);
  const Fazenda1 = new Mapa(
    "Fazenda do Coronel Texeira",
    "Fazenda protegida por bandidos.",
    false
  );
  const Fazenda2 = new Mapa(
    "Fazenda Zé Rufino",
    "Fazenda escondida, cheia de segredos.",
    false
  );

  return {
    Cidade,
    Vila,
    Delegacia,
    Venda,
    Igreja,
    Caatinga,
    Fazenda1,
    Fazenda2,
  };
}

const { Cidade, Vila, Delegacia, Venda, Igreja, Caatinga, Fazenda1, Fazenda2 } =
  criarMapaDinamico();

const Locais = [
  Cidade,
  Vila,
  Delegacia,
  Venda,
  Igreja,
  Caatinga,
  Fazenda1,
  Fazenda2,
];

function exibirMapa() {
  mostrarTexto("--- MAPA DO JOGO ---");
  mostrarOpcoes(
    Locais.map((local) => ({
      texto: local.nomelocal + (local.acesso ? " (Acessível)" : " (Bloqueado)"), // Mostra status de acesso
      acao: () => local.mostrarLocal(),
    }))
  );
}

export {
  exibirMapa,
  Cidade,
  Vila,
  Delegacia,
  Venda,
  Igreja,
  Caatinga,
  Fazenda1,
  Fazenda2,
};