// backend/db.js (O NOVO ARQUIVO CONSOLIDADO)

"use strict";

const mysql = require("mysql2/promise"); // Usar a versão com Promise

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
        password: "12345678",
        database: "dbprojeto", // O banco de dados a ser usado
      });
      console.log("Conectado ao MySQL. ID: " + this.connection.threadId);

      // Garante que o banco de dados 'dbprojeto' exista
      await this.connection.query(`CREATE DATABASE IF NOT EXISTS dbprojeto`);
      console.log("Banco de dados 'dbprojeto' criado/verificado.");
      // Muda para o banco de dados 'dbprojeto'
      await this.connection.changeUser({ database: "dbprojeto" });
      console.log("Conectado ao banco 'dbprojeto'");

      // Chama os métodos para criar tabelas e inserir dados iniciais
      await this._createTables();
      await this._insertInitialFixedData();

      console.log(
        "Estrutura do banco de dados e dados iniciais verificados/inseridos."
      );
    } catch (err) {
      console.error("Erro ao conectar ou inicializar o banco de dados:", err);
      // É importante propagar o erro para quem chamou connect()
      throw err;
    }
  }

  // Método para criar todas as tabelas na ordem correta (FKs)
  async _createTables() {
    console.log("Criando/verificando tabelas...");

    // Ordem de criação das tabelas (tabelas pai primeiro, depois as que dependem)
    const createTableQueries = [
      `
      CREATE TABLE IF NOT EXISTS itens (
        id_item INT NOT NULL PRIMARY KEY,
        item VARCHAR(255)
      );
      `,
      `
      CREATE TABLE IF NOT EXISTS habilidade (
        id_habilidade INT NOT NULL PRIMARY KEY,
        dano INT,
        falha INT,
        nome_hab VARCHAR(255)
      );
      `,
      // A tabela 'personagem' tem FKs para 'itens' e 'habilidade'
      `
      CREATE TABLE IF NOT EXISTS personagem (
        id_personagem INT NOT NULL PRIMARY KEY,
        nome VARCHAR(255),
        vida INT,
        dinheiro INT,
        ocupacao VARCHAR(255),
        armadura INT,
        velocidade INT,
        reputacao INT,
        personagem_tipo VARCHAR(255),
        fk_id_item INT,
        fk_id_habilidade1 INT,
        fk_id_habilidade2 INT,
        FOREIGN KEY (fk_id_item) REFERENCES itens(id_item),
        FOREIGN KEY (fk_id_habilidade1) REFERENCES habilidade(id_habilidade),
        FOREIGN KEY (fk_id_habilidade2) REFERENCES habilidade(id_habilidade)
      );
      `,
      `
      CREATE TABLE IF NOT EXISTS cenas (
        id_cenas INT NOT NULL PRIMARY KEY,
        descricao VARCHAR(255),
        ganho INT,
        nome_cena VARCHAR(255)
      );
      `,
      // A tabela 'mapa_fases' tem FK para 'cenas'
      `
      CREATE TABLE IF NOT EXISTS mapa_fases(
        id_local INT NOT NULL PRIMARY KEY,
        nome_mapa VARCHAR(255),
        status VARCHAR(255),
        fk_id_cenas INT,
        descricao VARCHAR(255),
        FOREIGN KEY (fk_id_cenas) REFERENCES cenas(id_cenas)
      );
      `,
      // A tabela 'dialogo' tem FK para 'personagem'
      `
      CREATE TABLE IF NOT EXISTS dialogo (
        id_dialogo INT NOT NULL PRIMARY KEY,
        fk_id_personagem INT,
        nome VARCHAR(255), -- Adicionado 'nome' aqui para consistência com o outro db.js que vi, mas o fk_id_personagem já indica o nome do personagem
        fala TEXT,
        FOREIGN KEY (fk_id_personagem) REFERENCES personagem(id_personagem)
      );
      `,
      // A tabela 'dialogo_mapa_fases' tem FKs para 'mapa_fases' e 'dialogo'
      `
      CREATE TABLE IF NOT EXISTS dialogo_mapa_fases (
        fk_id_local INT,
        fk_id_dialogo INT,
        FOREIGN KEY (fk_id_local) REFERENCES mapa_fases(id_local),
        FOREIGN KEY (fk_id_dialogo) REFERENCES dialogo(id_dialogo),
        PRIMARY KEY(fk_id_local, fk_id_dialogo)
      );
      `,
    ];

    for (const sql of createTableQueries) {
      await this.connection.query(sql);
    }
    console.log("Todas as tabelas verificadas/criadas.");
  }

  // Método para inserir todos os dados fixos
  async _insertInitialFixedData() {
    console.log("Inserindo/verificando dados fixos...");

    // Ordem de inserção (tabelas pai primeiro)
    const insertQueries = [
      // Itens
      `INSERT IGNORE INTO itens (id_item, item) VALUES (1, 'cantil');`,
      // Habilidades
      `INSERT IGNORE INTO habilidade (id_habilidade, dano, falha, nome_hab) VALUES (1, 7, 2, 'pistola');`,
      `INSERT IGNORE INTO habilidade (id_habilidade, dano, falha, nome_hab) VALUES (2, 12, 5, 'tiro duplo de escopeta');`,
      `INSERT IGNORE INTO habilidade (id_habilidade, dano, falha, nome_hab) VALUES (3, 10, 7, 'FACA');`,
      `INSERT IGNORE INTO habilidade (id_habilidade, dano, falha, nome_hab) VALUES (4, 10, 8, 'CHUTE');`,
      `INSERT IGNORE INTO habilidade (id_habilidade, dano, falha, nome_hab) VALUES (5, 10, 5, 'DISPARO');`,
      `INSERT IGNORE INTO habilidade (id_habilidade, dano, falha, nome_hab) VALUES (6, 15, 7, 'ESCOPETA');`,
      `INSERT IGNORE INTO habilidade (id_habilidade, dano, falha, nome_hab) VALUES (7, 14, 8, 'FACAO');`,
      `INSERT IGNORE INTO habilidade (id_habilidade, dano, falha, nome_hab) VALUES (8, 20, 2, 'PISTOLA 20M');`,
      `INSERT IGNORE INTO habilidade (id_habilidade, dano, falha, nome_hab) VALUES (9, 30, 2, 'ESPINGARDA');`,
      `INSERT IGNORE INTO habilidade (id_habilidade, dano, falha, nome_hab) VALUES (10, 25, 2, 'SOCO');`,
      `INSERT IGNORE INTO habilidade (id_habilidade, dano, falha, nome_hab) VALUES (11, 30, 4, 'PEIXERA');`,
      `INSERT IGNORE INTO habilidade (id_habilidade, dano, falha, nome_hab) VALUES (12, 60, 7, 'me de padin ciço');`,
      `INSERT IGNORE INTO habilidade (id_habilidade, dano, falha, nome_hab) VALUES (13, 40, 4, 'PENITENCIA');`,

      // Cenas
      `INSERT IGNORE INTO cenas (id_cenas, descricao, ganho, nome_cena) VALUES (1, NULL, NULL, 'Começo do jogo');`,
      `INSERT IGNORE INTO cenas (id_cenas, descricao, ganho, nome_cena) VALUES (2, NULL, NULL, 'TUTORIAL');`,
      `INSERT IGNORE INTO cenas (id_cenas, descricao, ganho, nome_cena) VALUES (3, 'Tutorial concluído. Ganho de: 50 cruzados novos', 50, 'FASE 1 - A JÓIA ROUBADA');`,
      `INSERT IGNORE INTO cenas (id_cenas, descricao, ganho, nome_cena) VALUES (4, 'Missão da joia concluída. Ganho de 75 cruzados novos', 75, 'FASE 2 - A VOLANTE');`,
      `INSERT IGNORE INTO cenas (id_cenas, descricao, ganho, nome_cena) VALUES (5, 'Missão da . Ganho de: Mil cruzados novos', 1000, 'FASE 3 - CIDADE DO SERTÃO');`,
      `INSERT IGNORE INTO cenas (id_cenas, descricao, ganho, nome_cena) VALUES (6, 'Missão da . Ganho de: Mil cruzados novo', 9999, 'FASE 4 - FAZENDA DO CORONEL ZÉ RUFINO');`,
      `INSERT IGNORE INTO cenas (id_cenas, descricao, ganho, nome_cena) VALUES (7, 'Jogo zerado. Você recebeu o título de Rei do Cangaço', 99999999, 'FIM DE JOGO');`,
      `INSERT IGNORE INTO cenas (id_cenas, descricao, ganho, nome_cena) VALUES (8, 'Game over. Você não conseguiu vencer o coronel Zé Rufino, perdeu tudo e virou lembrança no sertão.', 0, 'FIM DE JOGO');`,

      // Personagens (NPCs e o slot do jogador inicial)
      // Nota: O personagem 1 será inicializado/atualizado pelo /login ou rotas específicas do jogador.
      `INSERT IGNORE INTO personagem (id_personagem, nome, vida, dinheiro, ocupacao, armadura, velocidade, reputacao, personagem_tipo, fk_id_item, fk_id_habilidade1, fk_id_habilidade2 ) VALUES (0, 'NARRADOR', NULL, NULL, 'NARRADOR', NULL, NULL, NULL, 'NPC', NULL,NULL,NULL);`,
      `INSERT IGNORE INTO personagem (id_personagem, nome, vida, dinheiro, ocupacao, armadura, velocidade, reputacao, personagem_tipo, fk_id_item, fk_id_habilidade1, fk_id_habilidade2 ) VALUES (1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'jogador', NULL, NULL, NULL);`, // Slot inicial do jogador
      `INSERT IGNORE INTO personagem (id_personagem, nome, vida, dinheiro, ocupacao, armadura, velocidade, reputacao, personagem_tipo, fk_id_item, fk_id_habilidade1, fk_id_habilidade2 ) VALUES (2, 'Lampião', 80, 500, 'Líder do cangaço', 2, 4, 100, 'NPC', NULL , 1, 2);`,
      `INSERT IGNORE INTO personagem (id_personagem, nome, vida, dinheiro, ocupacao, armadura, velocidade, reputacao, personagem_tipo, fk_id_item, fk_id_habilidade1, fk_id_habilidade2 ) VALUES (3, 'Maria Rendeira', NULL, NULL, 'dona de casa', NULL, NULL, NULL, 'NPC', NULL,NULL,NULL);`,
      `INSERT IGNORE INTO personagem (id_personagem, nome, vida, dinheiro, ocupacao, armadura, velocidade, reputacao, personagem_tipo, fk_id_item, fk_id_habilidade1, fk_id_habilidade2 ) VALUES (4, 'Coronel Francisco de Texeira', 60, 50, 'Coronel da fazenda de gados', 4, 10, 10, 'NPC', NULL, 3, 4);`,
      `INSERT IGNORE INTO personagem (id_personagem, nome, vida, dinheiro, ocupacao, armadura, velocidade, reputacao, personagem_tipo, fk_id_item, fk_id_habilidade1, fk_id_habilidade2 ) VALUES (5, 'Volante', 50, 50, 'Policiais do sertão', 4, 7, 1, 'NPC', NULL, 3, 1);`,
      `INSERT IGNORE INTO personagem (id_personagem, nome, vida, dinheiro, ocupacao, armadura, velocidade, reputacao, personagem_tipo, fk_id_item, fk_id_habilidade1, fk_id_habilidade2 ) VALUES (6, 'Bandidos da Cidade', 30, 50, 'Invasores', 2, 10, 1, 'NPC', NULL, 5, 4);`,
      `INSERT IGNORE INTO personagem (id_personagem, nome, vida, dinheiro, ocupacao, armadura, velocidade, reputacao, personagem_tipo, fk_id_item, fk_id_habilidade1, fk_id_habilidade2 ) VALUES (7, 'Bandidos da Cidade', 30, 50, 'Invasores', 2, 10, 1, 'NPC', NULL, 5, 4);`,
      `INSERT IGNORE INTO personagem (id_personagem, nome, vida, dinheiro, ocupacao, armadura, velocidade, reputacao, personagem_tipo, fk_id_item, fk_id_habilidade1, fk_id_habilidade2 ) VALUES (8, 'Coronel Zé Rufine', 100, 5000, 'Coronel militarizado', 2, 10, 1, 'NPC', NULL, 6, 7);`,
      `INSERT IGNORE INTO personagem (id_personagem, nome, vida, dinheiro, ocupacao, armadura, velocidade, reputacao, personagem_tipo, fk_id_item, fk_id_habilidade1, fk_id_habilidade2 ) VALUES (9, 'chefeBando', NULL, NULL, 'chefeBando', NULL, NULL, NULL, 'NPC', NULL,NULL,NULL);`,
      `INSERT IGNORE INTO personagem (id_personagem, nome, vida, dinheiro, ocupacao, armadura, velocidade, reputacao, personagem_tipo, fk_id_item, fk_id_habilidade1, fk_id_habilidade2 ) VALUES (10, 'donaVenda', NULL, NULL, 'donaVenda', NULL, NULL, NULL, 'NPC', NULL,NULL,NULL);`,
      `INSERT IGNORE INTO personagem (id_personagem, nome, vida, dinheiro, ocupacao, armadura, velocidade, reputacao, personagem_tipo, fk_id_item, fk_id_habilidade1, fk_id_habilidade2 ) VALUES (11, 'padre', NULL, NULL, 'padre', NULL, NULL, NULL, 'NPC', NULL,NULL,NULL);`,
      `INSERT IGNORE INTO personagem (id_personagem, nome, vida, dinheiro, ocupacao, armadura, velocidade, reputacao, personagem_tipo, fk_id_item, fk_id_habilidade1, fk_id_habilidade2 ) VALUES (12, 'criança', NULL, NULL, 'criança', NULL, NULL, NULL, 'NPC', NULL,NULL,NULL);`,
      `INSERT IGNORE INTO dialogo (id_dialogo, fk_id_personagem, nome, fala) VALUES (1, 2, 'Lampião', 'Acorda, cabra! Precisa saber lutar à risca faca se quiser se juntar ao bando.');`,
      `INSERT IGNORE INTO dialogo (id_dialogo, fk_id_personagem, nome, fala) VALUES (2, 1, 'Protagonista', 'Quem é você?!');`, // Assumindo Protagonista como ID 1
      `INSERT IGNORE INTO dialogo (id_dialogo, fk_id_personagem, nome, fala) VALUES (3, 2, 'Lampião', 'Capitão do cangaço. Estou aqui para te ensinar a meter bala nos macacos! Agora, aperte a tecla ''Enter'' para começar.');`,
      `INSERT IGNORE INTO dialogo (id_dialogo, fk_id_personagem, nome, fala) VALUES (4, 3, 'Maria Rendeira', 'Oh, pelo amor de meu Padinho. Me ajude a resgatar a minha jóia de família! Um jagunço a levou...');`,
      `INSERT IGNORE INTO dialogo (id_dialogo, fk_id_personagem, nome, fala) VALUES (5, 1, 'Protagonista', 'Se acalme, posso ajudar a sinhora. Para onde levaram?');`,
      `INSERT IGNORE INTO dialogo (id_dialogo, fk_id_personagem, nome, fala) VALUES (6, 3, 'Maria Rendeira', 'Para a fazenda do Coronel Francisco de Texeira. Se adiante cabra!');`,
      `INSERT IGNORE INTO dialogo (id_dialogo, fk_id_personagem, nome, fala) VALUES (7, 2, 'Lampião', 'Afinal, o sinhor sabe se virar. Boa sorte cumpadi! Lembre de mantê o zoio aberto pra volante malandro pelas bandas.');`,
      `INSERT IGNORE INTO dialogo (id_dialogo, fk_id_personagem, nome, fala) VALUES (8, 0, 'Narrador', 'Você chega na região da fazenda do finado coronel Francisco de Texeira, onde a tal da jóia se encontra. Está de noite, e só se ouve as cigarras e seus próprios passos. De repente, um sombra sinistra aparece em sua frente! E ela não parece amigável…');`,
      `INSERT IGNORE INTO dialogo (id_dialogo, fk_id_personagem, nome, fala) VALUES (9, 0, 'Narrador', 'Após derrotar o Coronel Francisco de Teixeira, parece que a lua brilha mais. O cangaceiro retorna à casa de Maria Rendeira, mas antes de bater na porta, se questiona: será que ficar com a jóia não é melhor? Ela deve valer muitíssimo. Ou seria melhor devolver pra senhora?');`,
      `INSERT IGNORE INTO dialogo (id_dialogo, fk_id_personagem, nome, fala) VALUES (10, 9, 'chefeBando', 'Ave, o caceteiro daquele volante maldito levou Batoré com ele! tu vai atrais dele. Tás em Caju Bunito, na delegacia. Seje rápido antes que o sol esfrie.');`,
      `INSERT IGNORE INTO dialogo (id_dialogo, fk_id_personagem, nome, fala) VALUES (11, 0, 'Narrador', 'Com pressa, você vai até Caju Bonito, e chega na delegacia. É afastada, abafada e pequena, com apenas um policial cochilando, e seu colega de bando. Ao tentar tirar Batoré das grades, um barulho de tiro acorda o guarda, que te percebe e ataca.');`,
      `INSERT IGNORE INTO dialogo (id_dialogo, fk_id_personagem, nome, fala) VALUES (12, 0, 'Narrador', 'Depois de uma árdua luta, você e Batoré batem em retirada até o acampamento recém-erguido nas fronteiras da cidade.');`,
      `INSERT IGNORE INTO dialogo (id_dialogo, fk_id_personagem, nome, fala) VALUES (13, 9, 'chefeBando', 'Ora, e num é que voltaram mermo? Jurei a Mainha que tinhas desembestado de vez. Vamo passar 3 dias na cidade, pra vê se num roubam mais remédio de nois. Vai na venda de Dona Betânia, e compre um cadin de pinga, visse?');`,
      `INSERT IGNORE INTO dialogo (id_dialogo, fk_id_personagem, nome, fala) VALUES (14, 0, 'Narrador', 'Você vai em direção à cidade, e se depara em três caminhos diferentes pra ir. Qual você vai?');`,
      `INSERT IGNORE INTO dialogo (id_dialogo, fk_id_personagem, nome, fala) VALUES (15, 10, 'donaVenda', 'Boa tarde, querido! Deus bençoe! Quer o quê?');`,
      `INSERT IGNORE INTO dialogo (id_dialogo, fk_id_personagem, nome, fala) VALUES (16, 11, 'padre', 'Boa tarde, senhor. Em reza, Nossa Senhora me disse que uma alma abençoada pelo Pai estaria passando por aqui. Vejo pelo menos um pouco de bondade em seu coração. Permita-me que eu ore por você, e peça proteção pela sua vida.');`,
      `INSERT IGNORE INTO dialogo (id_dialogo, fk_id_personagem, nome, fala) VALUES (17, 0, 'Narrador', 'Você se sente um pouco mais seguro. Talvez a jornada se torne mais fácil.');`,
      `INSERT IGNORE INTO dialogo (id_dialogo, fk_id_personagem, nome, fala) VALUES (18, 0, 'Narrador', 'Não há ninguém aqui. Talvez Deus não queira se manifestar hoje.');`,
      `INSERT IGNORE INTO dialogo (id_dialogo, fk_id_personagem, nome, fala) VALUES (19, 0, 'Narrador', 'Você chega na parte residencial da cidade, quando escuta novamente um tiro, tal qual o dia do resgate na delegacia. Alguns civis correm, e uma criança chega aos prantos perto de onde você está.');`,
      `INSERT IGNORE INTO dialogo (id_dialogo, fk_id_personagem, nome, fala) VALUES (20, 12, 'criança', 'Moço! Tem uns homem ruim atirando pra todo lado! Levaram meu pai e o dono da vendinha…');`,
      `INSERT IGNORE INTO dialogo (id_dialogo, fk_id_personagem, nome, fala) VALUES (21, 1, 'Protagonista', 'Se acalme, minino. Eu dou conta deles. Fique escondido e reze pro Padinho me dar sorte');`,
      `INSERT IGNORE INTO dialogo (id_dialogo, fk_id_personagem, nome, fala) VALUES (22, 0, 'Narrador', 'Você avança pelas ruas da cidade. As casas estão arrombadas, e os bandidos gritam, tocando o terror. Um deles te avista e começa o confronto!');`,
      `INSERT IGNORE INTO dialogo (id_dialogo, fk_id_personagem, nome, fala) VALUES (23, 0, 'Narrador', 'Com os últimos bandidos no chão, a cidade enfim respira. Mas antes de sair, uma senhora te entrega um papel escondido: Zé Rufino vai atrás de vocês. Ele tá furioso. Vai pra fazenda dele, antes que ele vá até o sertão');`,
      `INSERT IGNORE INTO dialogo (id_dialogo, fk_id_personagem, nome, fala) VALUES (24, 9, 'chefeBando', 'Zé Rufino... esse cabra é perigoso dimais. Já matou mais cangaceiro que a seca matou boi! Mas se ele quer guerra, que seja, arrocha!');`,
      `INSERT IGNORE INTO dialogo (id_dialogo, fk_id_personagem, nome, fala) VALUES (25, 0, 'Narrador', 'Você se aproxima da fazenda de Zé Rufino. O mato é alto, o céu cinza. Há bandidos patrulhando com cachorros. Silêncio, até o galo cantar longe');`,
      `INSERT IGNORE INTO dialogo (id_dialogo, fk_id_personagem, nome, fala) VALUES (26, 1, 'Protagonista', 'É agora. Ou ele morre de morte matada... ou eu viro lembrança no sertão');`,
      `INSERT IGNORE INTO dialogo (id_dialogo, fk_id_personagem, nome, fala) VALUES (27, 8, 'Coronel Zé Rufine', 'Oxente oxente... o cabra que andaram dizendo que peitou a volante e enfrentou meus homens. Veio se entregar ou ser enterrado?');`,
      `INSERT IGNORE INTO dialogo (id_dialogo, fk_id_personagem, nome, fala) VALUES (28, 1, 'Protagonista', 'Vim acabar com a injustiça que tu espalha por essas terras, seu lazarento. O povo merece paz, e tua hora chegou, coronel cheio de chifre!');`,

      // Mapas
      `INSERT IGNORE INTO mapa_fases (id_local, nome_mapa, status, fk_id_cenas, descricao ) VALUES (1, '----- Piranhas -----', 'incompleta', 5, 'Cidade mais frequentada pelo cangaço. Possuí centro para abastecimento de mantimentos e ajuda dos moradores locais. Algumas volantes espreitam a cidade.');`,
      `INSERT IGNORE INTO mapa_fases (id_local, nome_mapa, status, fk_id_cenas, descricao ) VALUES (2, '----- Vila -----', 'incompleta', 5,'Centro de moradores. Alguns amigaveis, outros cabuetas.' );`,
      `INSERT IGNORE INTO mapa_fases (id_local, nome_mapa, status, fk_id_cenas, descricao ) VALUES (3, '----- Delegacia ----', 'incompleta', 5,'Delegacia regional, famosa no sertão por ser bastante equipada' );`,
      `INSERT IGNORE INTO mapa_fases (id_local, nome_mapa, status, fk_id_cenas, descricao ) VALUES (4, '----- Mercearia Secos e Molhados -----', 'incompleta', 5,'vende-se ["Água ardente", "Curativos", "Munição", "Parabelo", "Colete", "Anéis do sertão", "Carne de sol"]' );`,
      `INSERT IGNORE INTO mapa_fases (id_local, nome_mapa, status, fk_id_cenas, descricao ) VALUES (5, '----- Igreja Piranhas -----', 'incompleta', 5,'Igreja onde ocorre encontros sociais, acordos e missas. Há boatos que Padre Cicero frequenta o local, curando os cangaçeiros das enfermidades.' );`,
      `INSERT IGNORE INTO mapa_fases (id_local, nome_mapa, status, fk_id_cenas, descricao ) VALUES (6, '----- Caatinga Profunda -----', 'incompleta', 5,'Caatinga perigosa, onde possui bandidos, volantes e outros grupos de cangaceiros.' );`,
      `INSERT IGNORE INTO mapa_fases (id_local, nome_mapa, status, fk_id_cenas, descricao ) VALUES (7, '----- Fazenda do Coronel F. de Texeira ------', 'incompleta', 6,'Fazenda pequena e comandada pelo coronel da região. Alguns jagunços e volantes protegendo.' );`,
      `INSERT IGNORE INTO mapa_fases (id_local, nome_mapa, status, fk_id_cenas, descricao ) VALUES (8, '----- Fazenda do Coronel Zé Rufino -----', 'incompleta', 6,'Fazenda rica e farta da região. Extremamente perigosa, comandada pelo inimigo dos cangaceiros, Zé Rufino. Muitos jagunços, volantes e apoio do governo Vargas.' );`,
    ];

    for (const sql of insertQueries) {
      await this.connection.query(sql);
    }
    console.log("Todos os dados iniciais inseridos/verificados.");
  }

  // Métodos de consulta e manipulação de dados

  async getDialogosFromDb() {
    try {
      const [rows] = await this.connection.query(
        "SELECT * FROM dialogo ORDER BY id_dialogo"
      );
      return rows;
    } catch (error) {
      console.error("Erro ao buscar diálogos do banco de dados:", error);
      throw error;
    }
  }

  // Já existe no database.js original (mas vamos renomear para evitar confusão com 'personagem' vs 'personagens')
  async criarNovoPersonagem(
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
        INSERT INTO personagem (nome, ocupacao, vida, armadura, velocidade, dinheiro, reputacao, personagem_tipo, fk_id_item, fk_id_habilidade1, fk_id_habilidade2)
        VALUES (?, ?, ?, ?, ?, ?, ?, 'jogador', NULL, NULL, NULL)
      `; // Assumindo tipo 'jogador' para novos personagens
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
      console.error("Erro ao criar novo personagem:", error);
      throw error;
    }
  }

  // Equivalente a inserir_personagem1_cabraPexte, mas como UPDATE para id_personagem = 1
  async inicializarPersonagemCabraPexte(nome) {
    try {
      const sql = `
        UPDATE personagem
        SET nome = ?, vida = 160, dinheiro = 50, ocupacao = 'cabra da pexte',
            armadura = 10, velocidade = 4, reputacao = 10, personagem_tipo = 'jogador',
            fk_id_item = 1, fk_id_habilidade1 = 10, fk_id_habilidade2 = 11
        WHERE id_personagem = 1;
      `;
      // Use execute para melhor segurança contra SQL Injection
      await this.connection.execute(sql, [nome]);
      console.log(
        "Personagem Protagonista (Cabra da Pexte) inicializado/atualizado."
      );
    } catch (error) {
      console.error("Erro ao inicializar personagem Cabra da Pexte:", error);
      throw error;
    }
  }

  // Equivalente a inserir_personagem1_espiritualista, mas como UPDATE para id_personagem = 1
  async inicializarPersonagemEspiritualista(nome) {
    try {
      const sql = `
        UPDATE personagem
        SET nome = ?, vida = 160, dinheiro = 50, ocupacao = 'espiritualista',
            armadura = 7, velocidade = 7, reputacao = 10, personagem_tipo = 'jogador',
            fk_id_item = 1, fk_id_habilidade1 = 12, fk_id_habilidade2 = 13
        WHERE id_personagem = 1;
      `;
      await this.connection.execute(sql, [nome]);
      console.log(
        "Personagem Protagonista (Espiritualista) inicializado/atualizado."
      );
    } catch (error) {
      console.error("Erro ao inicializar personagem Espiritualista:", error);
      throw error;
    }
  }

  // Função para buscar um personagem pelo ID
  async getPersonagemById(id) {
    try {
      const [rows] = await this.connection.query(
        `SELECT * FROM personagem WHERE id_personagem = ?`,
        [id]
      );
      return rows[0]; // Retorna o primeiro personagem encontrado ou undefined
    } catch (error) {
      console.error("Erro ao buscar personagem por ID:", error);
      throw error;
    }
  }

  // Função para atualizar a vida de um personagem (já existia no app.js)
  async atualizarVidaPersonagem(id_personagem, novaVida) {
    try {
      const sql = `UPDATE personagem SET vida = ? WHERE id_personagem = ?`;
      const [result] = await this.connection.execute(sql, [
        novaVida,
        id_personagem,
      ]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error("Erro ao atualizar vida do personagem:", error);
      throw error;
    }
  }

  // Função para atualizar nome e ocupação (usada na rota /login do app.js)
  async atualizarNomeOcupacaoPersonagem(id_personagem, nome, ocupacao) {
    try {
      const sql = `UPDATE personagem SET nome = ?, ocupacao = ? WHERE id_personagem = ?`;
      const [result] = await this.connection.execute(sql, [
        nome,
        ocupacao,
        id_personagem,
      ]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error("Erro ao atualizar nome/ocupação do personagem:", error);
      throw error;
    }
  }

  // Novo método para buscar dados completos do protagonista para o login (do app.js)
  async getProtagonistaFullData(protagonistaId) {
    try {
      const selectSql = `
        SELECT p.id_personagem, p.nome, p.ocupacao, p.vida, p.armadura, p.dinheiro,
               h1.id_habilidade AS habilidade1_id, h1.nome_hab AS habilidade1_nome, h1.dano AS habilidade1_dano, h1.falha AS habilidade1_falha,
               h2.id_habilidade AS habilidade2_id, h2.nome_hab AS habilidade2_nome, h2.dano AS habilidade2_dano, h2.falha AS habilidade2_falha
        FROM personagem p
        LEFT JOIN habilidade h1 ON p.fk_id_habilidade1 = h1.id_habilidade
        LEFT JOIN habilidade h2 ON p.fk_id_habilidade2 = h2.id_habilidade
        WHERE p.id_personagem = ?;
      `;
      const [rows] = await this.connection.query(selectSql, [protagonistaId]);
      return rows[0]; // Retorna o primeiro resultado ou undefined
    } catch (error) {
      console.error("Erro ao buscar dados completos do protagonista:", error);
      throw error;
    }
  }

  // Método para fechar a conexão
  async close() {
    if (this.connection) {
      await this.connection.end();
      console.log("Conexão com o banco de dados encerrada.");
      this.connection = null; // Limpa a conexão após fechar
    }
  }
}

// Exporta a classe para ser usada em outros arquivos (ex: app.js / server.js)
module.exports = Database;

// Remova a chamada inserirDb() e as exportações globais antigas
// pois a inicialização será feita via `db.connect()` no `app.js`
// delete module.exports.inserirDb;
// delete module.exports.inserir_personagem1;
// delete module.exports.inserir_personagem1_cabraPexte;
// delete module.exports.inserir_personagem1_espiritualista;
// delete module.exports.callback_erro;
// delete module.exports.close;