"use strict";

const mysql = require("mysql2");
// const { data_para_str, imprime_contato } = require('./util');

function open_connection_and_create_db(callback) {
  console.log("Conectando...");

  const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "2207",
    database: "dbprojeto",
  });

  connection.connect(function (err) {
    if (err) {
      console.error("Erro na conexão: " + err.stack);
      return;
    }
    console.log("Conectado ao MySQL. ID: " + connection.threadId);

    const sql_create_db = `CREATE DATABASE IF NOT EXISTS test`;

    connection.query(sql_create_db, function (err) {
      if (err) {
        console.error("Erro ao criar banco: " + err);
        return;
      }

      console.log("Banco de dados 'test' criado/verificado.");

      connection.changeUser({ database: "test" }, function (err) {
        if (err) {
          console.error("Erro ao mudar para o banco: " + err);
          return;
        }

        console.log("Conectado ao banco 'test'");
        callback(connection);
      });
    });
  });
}

function callback_erro(err, results, fields) {
  if (err) {
    console.error("Erro: " + err);
    return;
  }
}

function create_table_habilidades(con) {
  console.log("Criando tabela 'habilidade'...");
  const sql = `
    CREATE TABLE IF NOT EXISTS habilidade (
      id_habilidade INT NOT NULL PRIMARY KEY,
      dano INT,
      falha INT,
      nome_hab VARCHAR(255)
    );
  `;
  con.query(sql, callback_erro);
}

function create_table_cenas(con) {
  console.log("Criando tabela 'cenas'...");
  const sql = `
    CREATE TABLE IF NOT EXISTS cenas (
      id_cenas INT NOT NULL PRIMARY KEY,
      descricao VARCHAR(255),
      ganho INT,
      nome_cena VARCHAR(255)
    );
  `;
  con.query(sql, callback_erro);
}

function create_table_mapa_fases(con) {
  console.log("criando tabela mapa_fases...");
  const sql = `
  CREATE TABLE IF NOT EXISTS mapa_fases(
  id_local INT NOT NULL PRIMARY KEY, 
  nome_mapa VARCHAR(255),
  status VARCHAR(255),
  fk_id_cenas INT,
  descricao VARCHAR(255),
  FOREIGN KEY (fk_id_cenas) REFERENCES cenas(id_cenas)
  );
  `;
  con.query(sql, callback_erro);

  console.log("fim...");
}

function create_table_dialogo(con) {
  console.log("Criando tabela 'dialogo'...");
  const sql = `
    CREATE TABLE IF NOT EXISTS dialogo (
      id_dialogo INT NOT NULL PRIMARY KEY,
      fk_id_personagem INT,
      fala TEXT,
      FOREIGN KEY (fk_id_personagem) REFERENCES personagem(id_personagem)
    );
  `;
  con.query(sql, callback_erro);
}

function create_table_dialogo_mapa_fases(con) {
  console.log("Criando tabela 'dialogo_mapa_fases'...");
  const sql = `
    CREATE TABLE IF NOT EXISTS dialogo_mapa_fases (
  fk_id_local INT,
  fk_id_dialogo INT,
  FOREIGN KEY (fk_id_local) REFERENCES mapa_fases(id_local),
  FOREIGN KEY (fk_id_dialogo) REFERENCES dialogo(id_dialogo),
  PRIMARY KEY(fk_id_local, fk_id_dialogo)
);
  `;
  con.query(sql, callback_erro);
}

function create_table_itens(con) {
  console.log("Criando tabela 'itens'...");
  const sql = `
    CREATE TABLE IF NOT EXISTS itens (
      id_item INT NOT NULL PRIMARY KEY,
      item VARCHAR(255)
    );
  `;
  con.query(sql, callback_erro);
}

function create_table_personagem(con) {
  console.log("Criando tabela 'personagem'...");
  const sql = `
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
  `;
  con.query(sql, callback_erro);
}

function inserir_itens1(con) {
  console.log("Inserindo itens 1...");
  const sql = `INSERT INTO itens (id_item, item)
             VALUES (1, 'cantil');`;
  con.query(sql, callback_erro);
}

function inserir_hab1(con) {
  console.log("Inserindo hab 1...");
  const sql = `INSERT INTO habilidade (id_habilidade, dano, falha, nome_hab)
             VALUES (1, 7, 2, 'pistola');`;
  con.query(sql, callback_erro);
}

function inserir_hab2(con) {
  console.log("Inserindo hab 2...");
  const sql = `INSERT INTO habilidade (id_habilidade, dano, falha, nome_hab)
             VALUES (2, 12, 5, 'tiro duplo de escopeta');`;
  con.query(sql, callback_erro);
}

function inserir_personagem2(con) {
  console.log("Inserindo personagem 2...");
  const sql = `INSERT INTO personagem (id_personagem, nome, vida, dinheiro, ocupacao, armadura, velocidade, reputacao, personagem_tipo, fk_id_item, fk_id_habilidade1, fk_id_habilidade2 )
                VALUES (2, 'Lampião', 80, 500, 'Líder do cangaço', 2, 4, 100, 'NPC', NULL , 1, 2);`;
  con.query(sql, callback_erro);
}

function inserir_personagem3(con) {
  console.log("Inserindo personagem 3...");
  const sql = `INSERT INTO personagem (id_personagem, nome, vida, dinheiro, ocupacao, armadura, velocidade, reputacao, personagem_tipo, fk_id_item, fk_id_habilidade1, fk_id_habilidade2 )
                VALUES (3, 'Maria Rendeira', NULL, NULL, 'dona de casa', NULL, NULL, NULL, 'NPC', NULL,NULL,NULL);`;
  con.query(sql, callback_erro);
}

function inserir_dialogo1(con) {
  console.log("Inserindo dialogo 1...");
  const sql = `INSERT INTO dialogo (id_dialogo, fk_id_personagem, fala)
               VALUES (1, 2, 'Acorda, cabra! Precisa saber lutar à risca faca se quiser se juntar ao bando.');`;
  con.query(sql, callback_erro);
}

function inserir_dialogo2(con) {
  console.log("Inserindo dialogo 2...");
  const sql = `INSERT INTO dialogo (id_dialogo, fk_id_personagem, fala)
               VALUES (2, 1, 'Quem é você?!');`;
  con.query(sql, callback_erro);
}

function inserir_dialogo3(con) {
  console.log("Inserindo dialogo 3...");
  const sql = `INSERT INTO dialogo (id_dialogo, fk_id_personagem, fala)
               VALUES (3, 2, 'Capitão do cangaço. Estou aqui para te ensinar a meter bala nos macacos! Agora, aperte a tecla ''Enter'' para começar.');`;
  con.query(sql, callback_erro);
}

function inserir_dialogo4(con) {
  console.log("Inserindo dialogo 4...");
  const sql = `INSERT INTO dialogo (id_dialogo, fk_id_personagem, fala)
               VALUES (4, 3, 'Oh, pelo amor de meu Padinho. Me ajude a resgatar a minha jóia de família! Um jagunço a levou...');`;
  con.query(sql, callback_erro);
}

function inserir_dialogo5(con) {
  console.log("Inserindo dialogo 5...");
  const sql = `INSERT INTO dialogo (id_dialogo, fk_id_personagem, fala)
               VALUES (5, 1, 'Se acalme, posso ajudar a sinhora. Para onde levaram?');`;
  con.query(sql, callback_erro);
}

function inserir_dialogo6(con) {
  console.log("Inserindo dialogo 6...");
  const sql = `INSERT INTO dialogo (id_dialogo, fk_id_personagem, fala)
               VALUES (6, 3, 'Para a fazenda do Coronel Francisco de Texeira. Se adiante cabra!');`;
  con.query(sql, callback_erro);
}

function inserir_dialogo7(con) {
  console.log("Inserindo dialogo 7...");
  const sql = `INSERT INTO dialogo (id_dialogo, fk_id_personagem, fala)
               VALUES (7, 2, 'Afinal, o sinhor sabe se virar. Boa sorte cumpadi! Lembre de mantê o zoio aberto pra volante malandro pelas bandas.');`;
  con.query(sql, callback_erro);
}

function inserir_personagem0(con) {
  console.log("Inserindo personagem 0...");
  const sql = `INSERT INTO personagem (id_personagem, nome, vida, dinheiro, ocupacao, armadura, velocidade, reputacao, personagem_tipo, fk_id_item, fk_id_habilidade1, fk_id_habilidade2 )
                VALUES (0, 'NARRADOR', NULL, NULL, 'NARRADOR', NULL, NULL, NULL, 'NPC', NULL,NULL,NULL);`;
  con.query(sql, callback_erro);
}

function inserir_dialogo8(con) {
  console.log("Inserindo dialogo 8...");
  const sql = `INSERT INTO dialogo (id_dialogo, fk_id_personagem, fala)
               VALUES 8, 0, 'Você chega na região da fazenda do finado coronel Francisco de Texeira, onde a tal da jóia se encontra. Está de noite, e só se ouve as cigarras e seus próprios passos. De repente, um sombra sinistra aparece em sua frente! E ela não parece amigável…');`;
  con.query(sql, callback_erro);
}

function inserir_dialogo8(con) {
  console.log("Inserindo dialogo 8...");
  const sql = `INSERT INTO dialogo (id_dialogo, fk_id_personagem, fala)
               VALUES (8, 0, 'Você chega na região da fazenda do finado coronel Francisco de Texeira, onde a tal da jóia se encontra. Está de noite, e só se ouve as cigarras e seus próprios passos. De repente, um sombra sinistra aparece em sua frente! E ela não parece amigável…');`;
  con.query(sql, callback_erro);
}

function inserir_dialogo9(con) {
  console.log("Inserindo dialogo 9...");
  const sql = `INSERT INTO dialogo (id_dialogo, fk_id_personagem, fala)
               VALUES (9, 0, 'Após derrotar o Coronel Francisco de Teixeira, parece que a lua brilha mais. O cangaceiro retorna à casa de Maria Rendeira, mas antes de bater na porta, se questiona: será que ficar com a jóia não é melhor? Ela deve valer muitíssimo. Ou seria melhor devolver pra senhora?');`;
  con.query(sql, callback_erro);
}

function inserir_hab3(con) {
  console.log("Inserindo hab 3...");
  const sql = `INSERT INTO habilidade (id_habilidade, dano, falha, nome_hab)
             VALUES (3, 10, 7, 'FACA');`;
  con.query(sql, callback_erro);
}

function inserir_hab4(con) {
  console.log("Inserindo hab 4...");
  const sql = `INSERT INTO habilidade (id_habilidade, dano, falha, nome_hab)
             VALUES (4, 10, 8, 'CHUTE');`;
  con.query(sql, callback_erro);
}

function inserir_hab5(con) {
  console.log("Inserindo hab 5...");
  const sql = `INSERT INTO habilidade (id_habilidade, dano, falha, nome_hab)
             VALUES (5, 10, 5, 'DISPARO');`;
  con.query(sql, callback_erro);
}

function inserir_hab6(con) {
  console.log("Inserindo hab 6...");
  const sql = `INSERT INTO habilidade (id_habilidade, dano, falha, nome_hab)
             VALUES (6, 15, 7, 'ESCOPETA');`;
  con.query(sql, callback_erro);
}

function inserir_hab7(con) {
  console.log("Inserindo hab 7...");
  const sql = `INSERT INTO habilidade (id_habilidade, dano, falha, nome_hab)
             VALUES (7, 14, 8, 'FACAO');`;
  con.query(sql, callback_erro);
}

function inserir_hab8(con) {
  console.log("Inserindo hab 8...");
  const sql = `INSERT INTO habilidade (id_habilidade, dano, falha, nome_hab)
             VALUES (8, 20, 2, 'PISTOLA 20M');`;
  con.query(sql, callback_erro);
}

function inserir_hab9(con) {
  console.log("Inserindo hab 9...");
  const sql = `INSERT INTO habilidade (id_habilidade, dano, falha, nome_hab)
             VALUES (9, 30, 2, 'ESPINGARDA');`;
  con.query(sql, callback_erro);
}

function inserir_hab10(con) {
  console.log("Inserindo hab 10...");
  const sql = `INSERT INTO habilidade (id_habilidade, dano, falha, nome_hab)
             VALUES (10, 25, 2, 'SOCO');`;
  con.query(sql, callback_erro);
}

function inserir_hab11(con) {
  console.log("Inserindo hab 11...");
  const sql = `INSERT INTO habilidade (id_habilidade, dano, falha, nome_hab)
             VALUES (11, 30, 4, 'PEIXERA');`;
  con.query(sql, callback_erro);
}

function inserir_hab12(con) {
  console.log("Inserindo hab 12...");
  const sql = `INSERT INTO habilidade (id_habilidade, dano, falha, nome_hab)
             VALUES (12, 60, 7, 'me de padin ciço');`;
  con.query(sql, callback_erro);
}

function inserir_hab13(con) {
  console.log("Inserindo hab 13...");
  const sql = `INSERT INTO habilidade (id_habilidade, dano, falha, nome_hab)
             VALUES (13, 40, 4, 'PENITENCIA');`;
  con.query(sql, callback_erro);
}

function inserir_personagem4(con) {
  console.log("Inserindo personagem 4...");
  const sql = `INSERT INTO personagem (id_personagem, nome, vida, dinheiro, ocupacao, armadura, velocidade, reputacao, personagem_tipo, fk_id_item, fk_id_habilidade1, fk_id_habilidade2 )
                VALUES (4, 'Coronel Francisco de Texeira', 60,  50, 'Coronel da fazenda de gados', 4,  10, 10, 'NPC', NULL, 3, 4);`;
  con.query(sql, callback_erro);
}

function inserir_personagem5(con) {
  console.log("Inserindo personagem 5...");
  const sql = `INSERT INTO personagem (id_personagem, nome, vida, dinheiro, ocupacao, armadura, velocidade, reputacao, personagem_tipo, fk_id_item, fk_id_habilidade1, fk_id_habilidade2 )
                VALUES (5, 'Volante', 50, 50, 'Policiais do sertão', 4,  7, 1, 'NPC', NULL, 3, 1);`;
  con.query(sql, callback_erro);
}

function inserir_personagem6(con) {
  console.log("Inserindo personagem 6...");
  const sql = `INSERT INTO personagem (id_personagem, nome, vida, dinheiro, ocupacao, armadura, velocidade, reputacao, personagem_tipo, fk_id_item, fk_id_habilidade1, fk_id_habilidade2 )
                VALUES (6, 'Bandidos da Cidade', 30, 50, 'Invasores', 2,  10, 1, 'NPC', NULL, 5, 4);`;
  con.query(sql, callback_erro);
}

function inserir_personagem7(con) {
  console.log("Inserindo personagem 7...");
  const sql = `INSERT INTO personagem (id_personagem, nome, vida, dinheiro, ocupacao, armadura, velocidade, reputacao, personagem_tipo, fk_id_item, fk_id_habilidade1, fk_id_habilidade2 )
                VALUES (7, 'Bandidos da Cidade', 30, 50, 'Invasores', 2,  10, 1, 'NPC', NULL, 5, 4);`;
  con.query(sql, callback_erro);
}

function inserir_personagem8(con) {
  console.log("Inserindo personagem 8...");
  const sql = `INSERT INTO personagem (id_personagem, nome, vida, dinheiro, ocupacao, armadura, velocidade, reputacao, personagem_tipo, fk_id_item, fk_id_habilidade1, fk_id_habilidade2 )
                VALUES (8, 'Coronel Zé Rufine', 100, 5000, 'Coronel militarizado', 2,  10, 1, 'NPC', NULL, 6, 7);`;
  con.query(sql, callback_erro);
}

function inserir_personagem9(con) {
  console.log("Inserindo personagem 9...");
  const sql = `INSERT INTO personagem (id_personagem, nome, vida, dinheiro, ocupacao, armadura, velocidade, reputacao, personagem_tipo, fk_id_item, fk_id_habilidade1, fk_id_habilidade2 )
                VALUES (9, 'chefeBando', NULL, NULL, 'chefeBando', NULL, NULL, NULL, 'NPC', NULL,NULL,NULL);`;
  con.query(sql, callback_erro);
}

function inserir_personagem10(con) {
  console.log("Inserindo personagem 10...");
  const sql = `INSERT INTO personagem (id_personagem, nome, vida, dinheiro, ocupacao, armadura, velocidade, reputacao, personagem_tipo, fk_id_item, fk_id_habilidade1, fk_id_habilidade2 )
                VALUES (10, 'donaVenda', NULL, NULL, 'donaVenda', NULL, NULL, NULL, 'NPC', NULL,NULL,NULL);`;
  con.query(sql, callback_erro);
}

function inserir_personagem11(con) {
  console.log("Inserindo personagem 11...");
  const sql = `INSERT INTO personagem (id_personagem, nome, vida, dinheiro, ocupacao, armadura, velocidade, reputacao, personagem_tipo, fk_id_item, fk_id_habilidade1, fk_id_habilidade2 )
                VALUES (11, 'padre', NULL, NULL, 'padre', NULL, NULL, NULL, 'NPC', NULL,NULL,NULL);`;
  con.query(sql, callback_erro);
}

function inserir_personagem12(con) {
  console.log("Inserindo personagem 12...");
  const sql = `INSERT INTO personagem (id_personagem, nome, vida, dinheiro, ocupacao, armadura, velocidade, reputacao, personagem_tipo, fk_id_item, fk_id_habilidade1, fk_id_habilidade2 )
                VALUES (12, 'criança', NULL, NULL, 'criança', NULL, NULL, NULL, 'NPC', NULL,NULL,NULL);`;
  con.query(sql, callback_erro);
}

function inserir_dialogo10(con) {
  console.log("Inserindo dialogo 10...");
  const sql = `INSERT INTO dialogo (id_dialogo, fk_id_personagem, fala)
               VALUES (10, 9, 'Ave, o caceteiro daquele volante maldito levou Batoré com ele! tu vai atrais dele. Tás em Caju Bunito, na delegacia. Seje rápido antes que o sol esfrie.');`;
  con.query(sql, callback_erro);
}

function inserir_dialogo11(con) {
  console.log("Inserindo dialogo 11...");
  const sql = `INSERT INTO dialogo (id_dialogo, fk_id_personagem, fala)
               VALUES (11, 0, 'Com pressa, você vai até Caju Bonito, e chega na delegacia. É afastada, abafada e pequena, com apenas um policial cochilando, e seu colega de bando. Ao tentar tirar Batoré das grades, um barulho de tiro acorda o guarda, que te percebe e ataca.');`;
  con.query(sql, callback_erro);
}

function inserir_dialogo12(con) {
  console.log("Inserindo dialogo 12...");
  const sql = `INSERT INTO dialogo (id_dialogo, fk_id_personagem, fala)
               VALUES (12, 0, '"Depois de uma árdua luta, você e Batoré batem em retirada até o acampamento recém-erguido nas fronteiras da cidade.');`;
  con.query(sql, callback_erro);
}

function inserir_dialogo13(con) {
  console.log("Inserindo dialogo 13...");
  const sql = `INSERT INTO dialogo (id_dialogo, fk_id_personagem, fala)
               VALUES (13, 9, 'Ora, e num é que voltaram mermo? Jurei a Mainha que tinhas desembestado de vez. Vamo passar 3 dias na cidade, pra vê se num roubam mais remédio de nois. Vai na venda de Dona Betânia, e compre um cadin de pinga, visse?');`;
  con.query(sql, callback_erro);
}

function inserir_dialogo14(con) {
  console.log("Inserindo dialogo 14...");
  const sql = `INSERT INTO dialogo (id_dialogo, fk_id_personagem, fala)
               VALUES (14, 0, 'Você vai em direção à cidade, e se depara em três caminhos diferentes pra ir. Qual você vai?');`;
  con.query(sql, callback_erro);
}

function inserir_dialogo15(con) {
  console.log("Inserindo dialogo 15 ...");
  const sql = `INSERT INTO dialogo (id_dialogo, fk_id_personagem, fala)
               VALUES (15, 10, 'Boa tarde, querido! Deus bençoe! Quer o quê?');`;
  con.query(sql, callback_erro);
}

function inserir_dialogo16(con) {
  console.log("Inserindo dialogo 16 ...");
  const sql = `INSERT INTO dialogo (id_dialogo, fk_id_personagem, fala)
               VALUES (16, 11, 'Boa tarde, senhor. Em reza, Nossa Senhora me disse que uma alma abençoada pelo Pai estaria passando por aqui. Vejo pelo menos um pouco de bondade em seu coração. Permita-me que eu ore por você, e peça proteção pela sua vida.');`;
  con.query(sql, callback_erro);
}

function inserir_dialogo17(con) {
  console.log("Inserindo dialogo 17...");
  const sql = `INSERT INTO dialogo (id_dialogo, fk_id_personagem, fala)
               VALUES (17, 0, 'Você se sente um pouco mais seguro. Talvez a jornada se torne mais fácil.');`;
  con.query(sql, callback_erro);
}

function inserir_dialogo18(con) {
  console.log("Inserindo dialogo 18...");
  const sql = `INSERT INTO dialogo (id_dialogo, fk_id_personagem, fala)
               VALUES (18, 0, 'Não há ninguém aqui. Talvez Deus não queira se manifestar hoje.');`;
  con.query(sql, callback_erro);
}

function inserir_dialogo19(con) {
  console.log("Inserindo dialogo 19...");
  const sql = `INSERT INTO dialogo (id_dialogo, fk_id_personagem, fala)
               VALUES (19, 0, 'Você chega na parte residencial da cidade, quando escuta novamente um tiro, tal qual o dia do resgate na delegacia. Alguns civis correm, e uma criança chega aos prantos perto de onde você está.');`;
  con.query(sql, callback_erro);
}

function inserir_dialogo20(con) {
  console.log("Inserindo dialogo 20...");
  const sql = `INSERT INTO dialogo (id_dialogo, fk_id_personagem, fala)
               VALUES (20, 12, 'Moço! Tem uns homem ruim atirando pra todo lado! Levaram meu pai e o dono da vendinha…');`;
  con.query(sql, callback_erro);
}

function inserir_dialogo21(con) {
  console.log("Inserindo dialogo 21...");
  const sql = `INSERT INTO dialogo (id_dialogo, fk_id_personagem, fala)
               VALUES (21, 1, 'Se acalme, minino. Eu dou conta deles. Fique escondido e reze pro Padinho me dar sorte');`;
  con.query(sql, callback_erro);
}

function inserir_dialogo22(con) {
  console.log("Inserindo dialogo 22...");
  const sql = `INSERT INTO dialogo (id_dialogo, fk_id_personagem, fala)
               VALUES (22, 0, 'Você avança pelas ruas da cidade. As casas estão arrombadas, e os bandidos gritam, tocando o terror. Um deles te avista e começa o confronto!');`;
  con.query(sql, callback_erro);
}

function inserir_dialogo23(con) {
  console.log("Inserindo dialogo 23...");
  const sql = `INSERT INTO dialogo (id_dialogo, fk_id_personagem, fala)
               VALUES (23, 0, 'Com os últimos bandidos no chão, a cidade enfim respira. Mas antes de sair, uma senhora te entrega um papel escondido: Zé Rufino vai atrás de vocês. Ele tá furioso. Vai pra fazenda dele, antes que ele vá até o sertão');`;
  con.query(sql, callback_erro);
}

function inserir_dialogo24(con) {
  console.log("Inserindo dialogo 24...");
  const sql = `INSERT INTO dialogo (id_dialogo, fk_id_personagem, fala)
               VALUES (24, 9, 'Zé Rufino... esse cabra é perigoso dimais. Já matou mais cangaceiro que a seca matou boi! Mas se ele quer guerra, que seja, arrocha!');`;
  con.query(sql, callback_erro);
}

function inserir_dialogo25(con) {
  console.log("Inserindo dialogo 25...");
  const sql = `INSERT INTO dialogo (id_dialogo, fk_id_personagem, fala)
               VALUES (25, 0, 'Você se aproxima da fazenda de Zé Rufino. O mato é alto, o céu cinza. Há bandidos patrulhando com cachorros. Silêncio, até o galo cantar longe');`;
  con.query(sql, callback_erro);
}

function inserir_dialogo26(con) {
  console.log("Inserindo dialogo 26...");
  const sql = `INSERT INTO dialogo (id_dialogo, fk_id_personagem, fala)
               VALUES (26, 1, 'É agora. Ou ele morre de morte matada... ou eu viro lembrança no sertão');`;
  con.query(sql, callback_erro);
}

function inserir_dialogo27(con) {
  console.log("Inserindo dialogo 27...");
  const sql = `INSERT INTO dialogo (id_dialogo, fk_id_personagem, fala)
               VALUES (27, 8, 'Oxente oxente... o cabra que andaram dizendo que peitou a volante e enfrentou meus homens. Veio se entregar ou ser enterrado?');`;
  con.query(sql, callback_erro);
}

function inserir_dialogo28(con) {
  console.log("Inserindo dialogo 28...");
  const sql = `INSERT INTO dialogo (id_dialogo, fk_id_personagem, fala)
               VALUES (28, 1, 'Vim acabar com a injustiça que tu espalha por essas terras, seu lazarento. O povo merece paz, e tua hora chegou, coronel cheio de chifre!');`;
  con.query(sql, callback_erro);
}

function inserir_cena1(con) {
  console.log("Inserindo cena 1...");
  const sql = `INSERT INTO cenas (id_cenas, descricao, ganho, nome_cena)
               VALUES (1, NULL, NULL, 'Começo do jogo');`;
  con.query(sql, callback_erro);
}

function inserir_cena2(con) {
  console.log("Inserindo cena 2...");
  const sql = `INSERT INTO cenas (id_cenas, descricao, ganho, nome_cena)
               VALUES (2, NULL, NULL, 'TUTORIAL');`;
  con.query(sql, callback_erro);
}

function inserir_cena3(con) {
  console.log("Inserindo cena 3...");
  const sql = `INSERT INTO cenas (id_cenas, descricao, ganho, nome_cena)
               VALUES (3, 'Tutorial concluído. Ganho de: 50 cruzados novos', 50, 'FASE 1 - A JÓIA ROUBADA');`;
  con.query(sql, callback_erro);
}

function inserir_cena4(con) {
  console.log("Inserindo cena 4...");
  const sql = `INSERT INTO cenas (id_cenas, descricao, ganho, nome_cena)
               VALUES (4, 'Missão da joia concluída. Ganho de 75 cruzados novos', 75, 'FASE 2 - A VOLANTE');`;
  con.query(sql, callback_erro);
}

function inserir_cena5(con) {
  console.log("Inserindo cena 5...");
  const sql = `INSERT INTO cenas (id_cenas, descricao, ganho, nome_cena)
               VALUES (5, 'Missão da . Ganho de:  Mil cruzados novos', 1000, 'FASE 3 - CIDADE DO SERTÃO');`;
  con.query(sql, callback_erro);
}

function inserir_cena6(con) {
  console.log("Inserindo cena 6...");
  const sql = `INSERT INTO cenas (id_cenas, descricao, ganho, nome_cena)
               VALUES (6, 'Missão da . Ganho de:  Mil cruzados novo', 9999, 'FASE 4 - FAZENDA DO CORONEL ZÉ RUFINO');`;
  con.query(sql, callback_erro);
}

function inserir_cena7(con) {
  console.log("Inserindo cena 7...");
  const sql = `INSERT INTO cenas (id_cenas, descricao, ganho, nome_cena)
               VALUES (7, 'Jogo zerado. Você recebeu o título de Rei do Cangaço', 99999999, 'FIM DE JOGO');`;
  con.query(sql, callback_erro);
}

function inserir_cena8(con) {
  console.log("Inserindo cena 8...");
  const sql = `INSERT INTO cenas (id_cenas, descricao, ganho, nome_cena)
               VALUES (8, 'Game over. Você não conseguiu vencer o coronel Zé Rufino, perdeu tudo e virou lembrança no sertão.', 0, 'FIM DE JOGO');`;
  con.query(sql, callback_erro);
}

function inserir_mapa1(con) {
  console.log("Inserindo mapa 1...");
  const sql = `INSERT INTO mapa_fases (id_local, nome_mapa, status, fk_id_cenas, descricao )
               VALUES (1, '----- Piranhas -----', 'incompleta', 5, 'Cidade mais frequentada pelo cangaço. Possuí centro para abastecimento de mantimentos e ajuda dos moradores locais. Algumas volantes espreitam a cidade.');`;
  con.query(sql, callback_erro);
}

function inserir_mapa2(con) {
  console.log("Inserindo mapa 2...");
  const sql = `INSERT INTO mapa_fases (id_local, nome_mapa, status, fk_id_cenas, descricao )
               VALUES (2, '----- Vila -----', 'incompleta', 5,'Centro de moradores. Alguns amigaveis, outros cabuetas.' );`;
  con.query(sql, callback_erro);
}

function inserir_mapa3(con) {
  console.log("Inserindo mapa 3...");
  const sql = `INSERT INTO mapa_fases (id_local, nome_mapa, status, fk_id_cenas, descricao )
               VALUES (3, '----- Delegacia ----', 'incompleta', 5,'Delegacia regional, famosa no sertão por ser bastante equipada' );`;
  con.query(sql, callback_erro);
}

function inserir_mapa4(con) {
  console.log("Inserindo mapa 4...");
  const sql = `INSERT INTO mapa_fases (id_local, nome_mapa, status, fk_id_cenas, descricao )
               VALUES (4, '----- Mercearia Secos e Molhados -----', 'incompleta', 5,'vende-se ["Água ardente", "Curativos", "Munição", "Parabelo", "Colete", "Anéis do sertão", "Carne de sol"]' );`;
  con.query(sql, callback_erro);
}

function inserir_mapa5(con) {
  console.log("Inserindo mapa 5...");
  const sql = `INSERT INTO mapa_fases (id_local, nome_mapa, status, fk_id_cenas, descricao )
               VALUES (5, '----- Igreja Piranhas -----', 'incompleta', 5,'Igreja onde ocorre encontros sociais, acordos e missas. Há boatos que Padre Cicero frequenta o local, curando os cangaçeiros das enfermidades.' );`;
  con.query(sql, callback_erro);
}

function inserir_mapa6(con) {
  console.log("Inserindo mapa 6...");
  const sql = `INSERT INTO mapa_fases (id_local, nome_mapa, status, fk_id_cenas, descricao )
               VALUES (6, '----- Caatinga Profunda -----', 'incompleta', 5,'Caatinga perigosa, onde possui bandidos, volantes e outros grupos de cangaceiros.' );`;
  con.query(sql, callback_erro);
}

function inserir_mapa7(con) {
  console.log("Inserindo mapa 7...");
  const sql = `INSERT INTO mapa_fases (id_local, nome_mapa, status, fk_id_cenas, descricao )
               VALUES (7, '----- Fazenda do Coronel F. de Texeira ------', 'incompleta', 6,'Fazenda pequena e comandada pelo coronel da região. Alguns jagunços e volantes protegendo.' );`;
  con.query(sql, callback_erro);
}

function inserir_mapa8(con) {
  console.log("Inserindo mapa 8...");
  const sql = `INSERT INTO mapa_fases (id_local, nome_mapa, status, fk_id_cenas, descricao )
               VALUES (8, '----- Fazenda do Coronel Zé Rufino -----', 'incompleta', 6,'Fazenda rica e farta da região. Extremamente perigosa, comandada pelo inimigo dos cangaceiros, Zé Rufino. Muitos jagunços, volantes e apoio do governo Vargas.' );`;
  con.query(sql, callback_erro);
}

function consulta_habilidade(con) {
  console.log("Consultando habilidades...");
  const sql = `SELECT * FROM habilidade WHERE id_habilidade = 1;`;

  con.query(sql, function (err, results, fields) {
    if (err) {
      console.error("Erro: " + err.stack);
      return;
    }

    console.log("Consulta realizada com sucesso:");
    if (results && results.length > 0) {
      results.forEach((hab) => {
        console.log(`ID: ${hab.id_habilidade}`);
        console.log(`Nome: ${hab.nome_hab}`);
        console.log(`Dano: ${hab.dano}`);
        console.log(`Falha: ${hab.falha}`);
        console.log("------------------------------");
      });
    } else {
      console.log("Nenhuma habilidade encontrada.");
    }
  });
}

function close(con) {
  console.log("Fechando conexão...");
  con.end(function (err) {
    if (err) {
      console.error("Erro ao fechar conexão:", err.message);
    } else {
      console.log("Conexão encerrada com sucesso.");
    }
  });
}

function inserirDb() {
  console.log("==== INÍCIO ====");

  open_connection_and_create_db(function (conexao) {
    create_table_habilidades(conexao);
    create_table_cenas(conexao);
    create_table_mapa_fases(conexao);
    create_table_itens(conexao);
    create_table_personagem(conexao);
    create_table_dialogo(conexao);
    create_table_dialogo_mapa_fases(conexao);
    inserir_itens1(conexao);
    inserir_hab1(conexao);
    inserir_hab2(conexao);
    inserir_hab3(conexao);
    inserir_hab4(conexao);
    inserir_hab5(conexao);
    inserir_hab6(conexao);
    inserir_hab7(conexao);
    inserir_hab8(conexao);
    inserir_hab9(conexao);
    inserir_hab10(conexao);
    inserir_hab11(conexao);
    inserir_hab12(conexao);
    inserir_hab13(conexao);
    inserir_personagem0(conexao);
    inserir_personagem2(conexao);
    inserir_personagem3(conexao);
    inserir_personagem4(conexao);
    inserir_personagem5(conexao);
    inserir_personagem6(conexao);
    inserir_personagem7(conexao);
    inserir_personagem8(conexao);
    inserir_personagem9(conexao);
    inserir_personagem10(conexao);
    inserir_personagem11(conexao);
    inserir_personagem12(conexao);
    inserir_dialogo1(conexao);
    inserir_dialogo2(conexao);
    inserir_dialogo3(conexao);
    inserir_dialogo4(conexao);
    inserir_dialogo5(conexao);
    inserir_dialogo6(conexao);
    inserir_dialogo7(conexao);
    inserir_dialogo8(conexao);
    inserir_dialogo9(conexao);
    inserir_dialogo10(conexao);
    inserir_dialogo11(conexao);
    inserir_dialogo12(conexao);
    inserir_dialogo13(conexao);
    inserir_dialogo14(conexao);
    inserir_dialogo15(conexao);
    inserir_dialogo16(conexao);
    inserir_dialogo17(conexao);
    inserir_dialogo18(conexao);
    inserir_dialogo19(conexao);
    inserir_dialogo20(conexao);
    inserir_dialogo21(conexao);
    inserir_dialogo22(conexao);
    inserir_dialogo23(conexao);
    inserir_dialogo24(conexao);
    inserir_dialogo25(conexao);
    inserir_dialogo26(conexao);
    inserir_dialogo27(conexao);
    inserir_dialogo28(conexao);
    //consulta_habilidade(conexao)
    inserir_cena1(conexao);
    inserir_cena2(conexao);
    inserir_cena3(conexao);
    inserir_cena4(conexao);
    inserir_cena5(conexao);
    inserir_cena6(conexao);
    inserir_cena7(conexao);
    inserir_cena8(conexao);
    inserir_mapa1(conexao);
    inserir_mapa2(conexao);
    inserir_mapa3(conexao);
    inserir_mapa4(conexao);
    inserir_mapa5(conexao);
    inserir_mapa6(conexao);
    close(conexao);
  });

  console.log("==== FIM ====");
}

function inserir_personagem1_atirador(con, nome) {
  console.log("Inserindo personagem 1...");
  const sql = `INSERT INTO personagem (id_personagem, nome, vida, dinheiro, ocupacao, armadura, velocidade, reputacao, personagem_tipo, fk_id_item, fk_id_habilidade1, fk_id_habilidade2 )
                VALUES (1, '${nome}', 120, 50, 'atirador', 5, 10, 10, 'jogador', 1, 8, 9);`;
  con.query(sql, callback_erro);
}

function inserir_personagem1_cabraPexte(con, nome) {
  console.log("Inserindo personagem 1...");
  const sql = `INSERT INTO personagem (id_personagem, nome, vida, dinheiro, ocupacao, armadura, velocidade, reputacao, personagem_tipo, fk_id_item, fk_id_habilidade1, fk_id_habilidade2 )
                VALUES (1, ${nome}, 160, 50, 'cabra da pexte"', 10, 4, 10, 'jogador', 1, 10, 11);`;
  con.query(sql, callback_erro);
}

function inserir_personagem1_espiritualista(con, nome) {
  console.log("Inserindo personagem 1...");
  const sql = `INSERT INTO personagem (id_personagem, nome, vida, dinheiro, ocupacao, armadura, velocidade, reputacao, personagem_tipo, fk_id_item, fk_id_habilidade1, fk_id_habilidade2 )
                VALUES (1, ${nome}, 160, 50, 'espiritualista', 7, 7, 10, 'jogador', 1, 12, 13);`;
  con.query(sql, callback_erro);
}

module.exports = {
  inserirDb,
  inserir_personagem1_atirador,
  inserir_personagem1_cabraPexte,
  inserir_personagem1_espiritualista,
  callback_erro,
  close,
};

inserirDb();