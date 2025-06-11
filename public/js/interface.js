// Importações
import { setDialogos } from "./dadosCompartilhados.js";
import { escolherProta } from "./escolherProtagonista.js";
import { Tutorial, Fase1, Fase2, Fase3, Fase4 } from "./fases.js";
import {
  lampiao,
  francisctexeira,
  volante,
  bandidoscidade,
  bandidoscidade2,
  zerufino,
} from "./personagem.js";


function mostrarTexto(texto) {
  const caixa = document.getElementById("caixa-de-dialogo");
  caixa.innerHTML += `<p>${texto}</p>`;
  caixa.scrollTop = caixa.scrollHeight;
}

function mostrarOpcoes(opcoes) {
  const comandos = document.getElementById("comandos");
  comandos.innerHTML = "";

  opcoes.forEach((opcao) => {
    const botao = document.createElement("button");
    botao.textContent = opcao.texto;
    botao.onclick = () => {
      comandos.innerHTML = "";
      opcao.acao();
    };
    comandos.appendChild(botao);
  });
}


function atualizarImagemPersonagem(estado) {
  const img = document.querySelector("#jogador img");
  switch (estado) {
    case "ataque":
      img.src = "imgspjcangaco/protagonista_ataque.png";
      break;
    case "rip":
      img.src = "imgspjcangaco/protagonista_rip.png";
      break;
    default:
      img.src = "imgspjcangaco/protagonista_relaxado.png";
  }
}

function atualizarCenario(nomeCenario) {
  const imagens = document.querySelectorAll("#cenario img");
  imagens.forEach((img) => img.classList.remove("ativo"));
  const imagemAtual = document.getElementById(nomeCenario);
  if (imagemAtual) {
    imagemAtual.classList.add("ativo");
  } else {
    console.warn(`Cenário "${nomeCenario}" não encontrado.`);
  }
}

function atualizarInterface({ cenario, estadoJogador }) {
  if (cenario) atualizarCenario(cenario);
  if (estadoJogador) atualizarImagemPersonagem(estadoJogador);
}


let jogador;

let dialogosCarregados = false;

window.onload = async () => {
  try {
    const res = await fetch("/api/dialogos");
    const data = await res.json();
    setDialogos(data);
    dialogosCarregados = true;
    console.log("Diálogos carregados com sucesso!");
  } catch (err) {
    console.error("Erro ao carregar diálogos:", err);
    const caixa = document.getElementById("caixa-de-dialogo");
    if (caixa) {
      caixa.innerHTML += `<p>Erro ao carregar diálogos. O jogo pode não funcionar corretamente.</p>`;
    }
  }
};


async function comecarJogo() {
  if (!dialogosCarregados) {
    alert("Aguarde o carregamento dos diálogos antes de começar o jogo.");
    return;
  }

  const nome = document.getElementById("nomeJogador").value;
  if (!nome) {
    alert("Por favor, digite um nome para o seu personagem.");
    return;
  }

  document.getElementById("comecar").style.display = "none";
  document.getElementById("caixa-de-dialogo").style.display = "block";
  document.getElementById("comandos").style.display = "flex";

  jogador = await escolherProta(nome);
  mostrarTexto(`Seja bem-vindo(a), **${jogador.nome}**! O sertão te espera.`);

  // TUTORIAL
  const tutorial = new Tutorial("Tutorial", "pendente");
  atualizarInterface({ cenario: "caatinga", estadoJogador: "" });
  mostrarTexto(tutorial.mostrarTutorial);
  await tutorial.iniciarTutorial(jogador, lampiao);

  // FASE 1
  const fase1 = new Fase1("A Joia do Coronel", "pendente");
  atualizarInterface({ cenario: "fase1", estadoJogador: "" });
  mostrarTexto(fase1.mostrarfase1);
  await fase1.missaoDaJoia(jogador, francisctexeira);

  // FASE 2
  const fase2 = new Fase2("Resgate na Vila", "pendente");
  atualizarInterface({ cenario: "fase2", estadoJogador: "" });
  mostrarTexto(fase2.mostrarfase2);
  await fase2.missaoResgate(jogador, volante);
  fase2.missaoResgateConcluida(jogador);

  // FASE 3
  const fase3 = new Fase3("Confronto na Cidade", "pendente");
  atualizarInterface({ cenario: "fase3", estadoJogador: "" });
  mostrarTexto(fase3.mostrarfase3);
  await fase3.irParaCidade(jogador, bandidoscidade, bandidoscidade2);

  // FASE 4
  const fase4 = new Fase4("Fazenda do Coronel", "pendente");
  atualizarInterface({ cenario: "fase4", estadoJogador: "" });
  mostrarTexto(fase4.mostrarfase4);
  await fase4.irParaFazendaCoronel(jogador, zerufino);

}


window.comecarJogo = comecarJogo;


export {
  mostrarTexto,
  mostrarOpcoes,
  atualizarImagemPersonagem,
  atualizarCenario,
  atualizarInterface,
};
