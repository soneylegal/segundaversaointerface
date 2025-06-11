// backend/server.js (ou app.js)

const express = require("express");
const path = require("path");
const Database = require("./db.js"); // ADICIONE ESTA LINHA (ajuste o caminho se db.js não estiver na mesma pasta)

const app = express();
const PORT = process.env.PORT || 3000;

// Configurar o EJS como o template engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views")); // Define a pasta 'views' para os templates EJS

const db = new Database(); // Instanciar a classe Database

// Middleware para parsear JSON no corpo das requisições
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Útil para parsear dados de formulários HTML

// Servir arquivos estáticos (CSS, JS do frontend, imagens, etc.)
app.use(express.static(path.join(__dirname, "../public")));

// ======================================
// ROTAS HTTP
// ======================================

// Rota para a página inicial (tela de login/escolha de personagem)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "principal.html")); // Certifique-se que principal.html está na pasta 'views'
});

// Rota para processar o login/criação/atualização do personagem principal (ID 1)
app.post("/login", async (req, res) => {
  const { user, campo } = req.body;
  const protagonistaId = 1;

  try {
    let protaDataRaw = await db.getProtagonistaFullData(protagonistaId);
    let needsFullInitialization = false;
    let protaData;

    if (protaDataRaw && protaDataRaw.id_personagem === protagonistaId) {
      // Checa se os dados estão "vazios" (NULL ou 0) para determinar se precisa de inicialização completa
      if (
        protaDataRaw.vida === null ||
        protaDataRaw.armadura === null ||
        protaDataRaw.dinheiro === null ||
        protaDataRaw.habilidade1_id === null ||
        protaDataRaw.habilidade2_id === null ||
        protaDataRaw.vida === 0 || // Adicionei checagem para 0
        protaDataRaw.dinheiro === 0 // Adicionei checagem para 0
      ) {
        needsFullInitialization = true;
        console.log("Dados incompletos do personagem. Inicializando...");
      } else {
        // Se já existem dados básicos, apenas mapeia para o formato que 'infoprota' espera
        protaData = {
          nome: user || protaDataRaw.nome, // Permite atualizar o nome/ocupação mesmo se não for full init
          ocupacao: campo || protaDataRaw.ocupacao,
          vida: protaDataRaw.vida,
          armadura: protaDataRaw.armadura,
          dinheiro: protaDataRaw.dinheiro,
          habilidade1: {
            nome: protaDataRaw.habilidade1_nome,
            dano: protaDataRaw.habilidade1_dano,
            falha: protaDataRaw.habilidade1_falha,
          },
          habilidade2: {
            nome: protaDataRaw.habilidade2_nome,
            dano: protaDataRaw.habilidade2_dano,
            falha: protaDataRaw.habilidade2_falha,
          },
        };
      }
    } else {
      needsFullInitialization = true;
      console.warn(
        "Personagem não encontrado ou ID incorreto. Inicializando do zero."
      );
    }

    if (needsFullInitialization) {
      // Determine qual tipo de personagem inicializar com base no 'campo'
      if (campo === "cabra da pexte") {
        await db.inicializarPersonagemCabraPexte(user);
      } else if (campo === "espiritualista") {
        await db.inicializarPersonagemEspiritualista(user);
      } else {
        // Se 'campo' não for 'cabra da pexte' ou 'espiritualista',
        // você pode querer definir valores padrão para vida/armadura/dinheiro,
        // ou direcionar para uma tela de erro/seleção de classe.
        // Por enquanto, apenas atualiza nome e ocupação, mantendo outros NULLs.
        await db.atualizarNomeOcupacaoPersonagem(protagonistaId, user, campo);
        console.warn(
          "Ocupação não reconhecida para inicialização completa. Apenas nome e ocupação foram atualizados."
        );
      }

      // Após a inicialização/atualização, busque os dados novamente para ter certeza que estão corretos e completos
      protaDataRaw = await db.getProtagonistaFullData(protagonistaId); // Re-fetch
      if (!protaDataRaw) {
        return res.status(500).send("Erro ao buscar dados após inicialização.");
      }
      protaData = {
        nome: protaDataRaw.nome,
        ocupacao: protaDataRaw.ocupacao,
        vida: protaDataRaw.vida,
        armadura: protaDataRaw.armadura,
        dinheiro: protaDataRaw.dinheiro,
        habilidade1: {
          nome: protaDataRaw.habilidade1_nome,
          dano: protaDataRaw.habilidade1_dano,
          falha: protaDataRaw.habilidade1_falha,
        },
        habilidade2: {
          nome: protaDataRaw.habilidade2_nome,
          dano: protaDataRaw.habilidade2_dano,
          falha: protaDataRaw.habilidade2_falha,
        },
      };
      console.log("Personagem inicializado e carregado:", protaData.nome);
      res.render("infoprota", { prota: protaData });
    } else {
      // Se não precisa de inicialização completa (já tinha dados), apenas atualiza nome/ocupação
      await db.atualizarNomeOcupacaoPersonagem(protagonistaId, user, campo);
      res.render("infoprota", { prota: protaData });
    }
  } catch (error) {
    console.error("Erro na rota /login: ", error);
    res.status(500).send("Erro no servidor ao processar login.");
  }
});

// Rota para renderizar a página de combate (com os dados do protagonista)
app.get("/combate", async (req, res) => {
  try {
    const protagonistaId = 1; // Supondo que o ID do protagonista seja sempre 1
    const protagonista = await db.getProtagonistaFullData(protagonistaId);

    if (!protagonista) {
      // Se o protagonista não for encontrado, redirecione para o login ou mostre um erro
      return res.redirect("/"); // Ou res.status(404).send('Protagonista não encontrado.');
    }

    res.render("combate", { prota: protagonista });
  } catch (error) {
    console.error("Erro na rota /combate:", error);
    res.status(500).send("Erro ao carregar a página de combate.");
  }
});

// Rota para atualizar a vida do protagonista via API (geralmente usada por JavaScript no frontend)
app.post("/api/atualizar-vida-protagonista", async (req, res) => {
  const { vidaAtual } = req.body;
  const protagonistaId = 1; // Supondo que o protagonista seja sempre o ID 1

  if (typeof vidaAtual === "undefined" || vidaAtual < 0) {
    return res.status(400).json({ message: "Vida inválida fornecida." });
  }

  try {
    const updated = await db.atualizarVidaPersonagem(protagonistaId, vidaAtual); // Usar o novo método
    if (updated) {
      res.json({ message: "Vida atualizada com sucesso." });
    } else {
      res.status(404).json({ message: "Protagonista não encontrado." });
    }
  } catch (error) {
    console.error("Erro na rota /api/atualizar-vida-protagonista:", error);
    res.status(500).json({ message: "Erro ao atualizar vida." });
  }
});

// Rota de API para obter todos os diálogos (geralmente usada por JavaScript no frontend)
app.get("/api/dialogos", async (req, res) => {
  try {
    const dialogos = await db.getDialogosFromDb();
    res.json(dialogos);
  } catch (error) {
    console.error("Erro na rota /api/dialogos:", error);
    res.status(500).json({ error: "Erro ao buscar diálogos." });
  }
});

// Rota de API para criar NOVOS slots de personagem (não o protagonista fixo de ID 1)
// Útil se você tiver múltiplos slots de save ou personagens não-jogadores criados dinamicamente
app.post("/api/personagem/criar", async (req, res) => {
  try {
    const { nome, ocupacao, vida, armadura, velocidade, dinheiro, reputacao } =
      req.body;
    const personagemId = await db.criarNovoPersonagem(
      nome,
      ocupacao,
      vida,
      armadura,
      velocidade,
      dinheiro,
      reputacao
    );
    res
      .status(201)
      .json({ message: "Personagem criado com sucesso!", id: personagemId });
  } catch (error) {
    console.error("Erro na rota /api/personagem/criar:", error);
    res.status(500).json({ error: "Erro ao criar personagem." });
  }
});

// ======================================
// INICIALIZAÇÃO DO SERVIDOR E BANCO DE DADOS
// ======================================

async function startServer() {
  try {
    await db.connect(); // **AGORA CHAMA O MÉTODO CONNECT DO SEU NOVO DB.JS**
    console.log("Banco de dados pronto para uso.");

    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  } catch (error) {
    console.error(
      "Falha ao iniciar o servidor devido a erro no banco de dados:",
      error
    );
    process.exit(1); // Encerra o processo se não conseguir conectar ao DB
  }
}

startServer();
