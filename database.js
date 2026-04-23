const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

const criarBanco = async () => {
    const db = await open({
        filename: './database.db',
        driver: sqlite3.Database
    });

    await db.exec(`
        CREATE TABLE IF NOT EXISTS pessoas_desaparecidas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            idade INTEGER,
            genero TEXT,
            descricao_fisica TEXT,
            data_desaparecimento TEXT,
            local_desaparecimento TEXT,
            contato_solicitante TEXT,
            nome_solicitante TEXT,
            status_localizacao TEXT DEFAULT 'Desaparecido',
            ultima_atualizacao TEXT,
            foto_url TEXT,
            data_registro TEXT
        )
    `);

    await db.exec(`
        CREATE TABLE IF NOT EXISTS pistas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            pessoa_id INTEGER NOT NULL,
            descricao_pista TEXT,
            local_avistamento TEXT,
            data_pista TEXT,
            hora_pista TEXT,
            contato_informante TEXT,
            nome_informante TEXT,
            confiabilidade TEXT DEFAULT 'A verificar',
            FOREIGN KEY (pessoa_id) REFERENCES pessoas_desaparecidas(id)
        )
    `);



    console.log('Banco de dados configurado: Sistema de pessoas desaparecidas pronto.');

    const checagem = await db.get('SELECT COUNT(*) AS total FROM pessoas_desaparecidas');

    if (checagem.total === 0) {
        await db.exec(`
            INSERT INTO pessoas_desaparecidas (nome, idade, genero, descricao_fisica, data_desaparecimento, local_desaparecimento, contato_solicitante, nome_solicitante, status_localizacao, ultima_atualizacao, foto_url, data_registro) VALUES
            ('João Pedro Silva', 12, 'Masculino', 'Cabelos pretos, olhos castanhos, 1,40m de altura', '2024-04-15', 'Bairro Centro', '11987654321', 'Maria Silva', 'Desaparecido', '2024-04-17', 'https://example.com/foto1.jpg', '2024-04-15'),
            ('Ana Costa Oliveira', 8, 'Feminino', 'Cabelos loiros, olhos azuis, 1,20m de altura, usa óculos', '2024-04-14', 'Comunidade Vila Nova', '11912345678', 'Carlos Costa', 'Desaparecido', '2024-04-17', 'https://example.com/foto2.jpg', '2024-04-14'),
            ('Lucas Pereira Santos', 15, 'Masculino', 'Cabelos castanhos, 1,65m de altura', '2024-04-16', 'Próximo à escola estadual', '11987654322', 'Patricia Pereira', 'Localizado', '2024-04-17', 'https://example.com/foto3.jpg', '2024-04-16')
        `);
        console.log('Dados iniciais inseridos na tabela de pessoas desaparecidas.');
    } else {
        console.log(`Banco pronto com ${checagem.total} registros de pessoas desaparecidas`);
    }

    const total = await db.all(`SELECT * FROM pessoas_desaparecidas`);
    console.log('----- REGISTROS DE PESSOAS DESAPARECIDAS -----');
    console.log(total);

    return db;
};

module.exports = { criarBanco };
