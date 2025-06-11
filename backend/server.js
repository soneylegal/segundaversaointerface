// backend/index.js

const express = require("express");
const path = require("path"); // Importe o módulo path
const Database = require("./database.js"); // Importe a classe Database

const app = express();
const PORT = process.env.PORT || 3000; // Use uma porta padrão, por exemplo, 3000

const db = new Database(); // **INSTANCIAR A CLASSE DATABASE AQUI**

// Middleware para parsear JSON no corpo das requisições
app.use(express.json());

app.use(express.static(path.join(__dirname, "../public")));

// Rotas da API
app.get("/api/dialogos", async (req, res) => {
  try {
    const dialogos = await db.getDialogosFromDb();
    res.json(dialogos);
  } catch (error) {
    console.error("Erro na rota /api/dialogos:", error);
    res.status(500).json({ error: "Erro ao buscar diálogos." });
  }
});

app.post("/api/personagem/criar", async (req, res) => {
  try {
    const { nome, ocupacao, vida, armadura, velocidade, dinheiro, reputacao } =
      req.body;
    const personagemId = await db.criarPersonagem(
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

// Iniciar o servidor e conectar ao banco de dados
async function startServer() {
  try {
    await db.connect(); // **CHAMAR O MÉTODO CONNECT AQUI**
    console.log("Banco de dados pronto para uso.");

    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  } catch (error) {
    console.error(
      "Falha ao iniciar o servidor devido a erro no banco de dados:",
      error
    );
    process.exit(1); // Encerra o processo se o DB não puder ser inicializado
  }
}

startServer(); // Chama a função para iniciar tudo