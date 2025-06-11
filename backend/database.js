backend/database.js

"use strict";

const mysql = require("mysql2/promise");

class Database {
  constructor() {
    this.connection = null;
  }

  async connect() {
    
    console.log("Conectando ao MySQL...");
    try {
      this.connection = await mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "2207", 
        database: "dbprojeto", 
      });
      console.log("Conectado ao MySQL. ID: " + this.connection.threadId);

      
      await this.connection.query(`CREATE DATABASE IF NOT EXISTS test`);
      console.log("Banco de dados 'test' criado/verificado.");
      await this.connection.changeUser({ database: "test" });
      console.log("Conectado ao banco 'test'");

      
      await this._createTables(); 
      await this._insertInitialFixedData(); 

      console.log(
        "Estrutura do banco de dados e dados iniciais verificados/inseridos."
      );
    } catch (err) {
      console.error("Erro ao conectar ou inicializar o banco de dados:", err);
      throw err;
    }
  }

  
  async _createTables() {
   
    const createDialogosTable = `
      CREATE TABLE IF NOT EXISTS dialogo (
        id_dialogo INT PRIMARY KEY,
        nome VARCHAR(255) NOT NULL,
        fala TEXT NOT NULL
      );
    `;
    const createPersonagensTable = `
      CREATE TABLE IF NOT EXISTS personagens (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nome VARCHAR(255) NOT NULL,
        ocupacao VARCHAR(255) NOT NULL,
        vida INT,
        armadura INT,
        velocidade INT,
        dinheiro INT,
        reputacao INT
      );
    `;
    await this.connection.query(createDialogosTable);
    await this.connection.query(createPersonagensTable);
    console.log("Tabelas 'dialogos' e 'personagens' verificadas/criadas.");
  }

  async _insertInitialFixedData() {
   
    const dialogosData = [
      { id_dialogo: 1, nome: "Narrador", fala: "Bem-vindo ao Sertão..." },
      {
        id_dialogo: 2,
        nome: "Lampião",
        fala: "Para sobreviver, você precisa aprender a lutar.",
      },
      {
        id_dialogo: 3,
        nome: "Lampião",
        fala: "Prepare-se para o seu primeiro combate!",
      },
      
      { id_dialogo: 4, nome: "Narrador", fala: "Você chegou na Fazenda1." },
      {
        id_dialogo: 5,
        nome: "Coronel",
        fala: "Eu sou o Coronel Teixeira! Você não vai pegar a joia!",
      },
     
    ];

    for (const d of dialogosData) {
      await this.connection.query(
        `INSERT IGNORE INTO dialogos (id_dialogo, nome, fala) VALUES (?, ?, ?)`,
        [d.id_dialogo, d.nome, d.fala]
      );
    }
    console.log("Diálogos iniciais inseridos/verificados.");
  }

  async getDialogosFromDb() {
    try {
      const [rows] = await this.connection.query(
        "SELECT * FROM dialogos ORDER BY id_dialogo"
      );
      return rows;
    } catch (error) {
      console.error("Erro ao buscar diálogos do banco de dados:", error);
      throw error;
    }
  }

  async criarPersonagem(
    nome,
    ocupacao,
    vida,
    armadura,
    velocidade,
    dinheiro,
    reputacao
  ) {
    try {
      const query = `
        INSERT INTO personagens (nome, ocupacao, vida, armadura, velocidade, dinheiro, reputacao)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;
      const [result] = await this.connection.execute(query, [
        nome,
        ocupacao,
        vida,
        armadura,
        velocidade,
        dinheiro,
        reputacao,
      ]);
      return result.insertId; 
    } catch (error) {
      console.error("Erro ao criar personagem:", error);
      throw error;
    }
  }
}

module.exports = Database; 