const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

const initDb = async () => {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS pessoas_desaparecidas (
            id SERIAL PRIMARY KEY,
            nome TEXT NOT NULL,
            idade INTEGER,
            genero TEXT,
            descricao_fisica TEXT,
            data_desaparecimento DATE,
            local_desaparecimento TEXT,
            contato_solicitante TEXT,
            nome_solicitante TEXT,
            status_localizacao TEXT DEFAULT 'Desaparecido',
            ultima_atualizacao TIMESTAMP,
            foto_url TEXT,
            data_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `);

    await pool.query(`
        CREATE TABLE IF NOT EXISTS pistas (
            id SERIAL PRIMARY KEY,
            pessoa_id INTEGER NOT NULL REFERENCES pessoas_desaparecidas(id) ON DELETE CASCADE,
            descricao_pista TEXT,
            local_avistamento TEXT,
            data_pista DATE,
            hora_pista TIME,
            contato_informante TEXT,
            nome_informante TEXT,
            confiabilidade TEXT DEFAULT 'A verificar'
        );
    `);

    console.log('Banco PostgreSQL configurado: tabelas garantidas.');

    const check = await pool.query('SELECT COUNT(*)::int AS total FROM pessoas_desaparecidas');
    const total = check.rows[0]?.total ?? 0;

    if (total === 0) {
        await pool.query(`
            INSERT INTO pessoas_desaparecidas (nome, idade, genero, descricao_fisica, data_desaparecimento, local_desaparecimento, contato_solicitante, nome_solicitante, status_localizacao, ultima_atualizacao, foto_url, data_registro)
            VALUES
            ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12),
            ($13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24),
            ($25, $26, $27, $28, $29, $30, $31, $32, $33, $34, $35, $36)
        `, [
            'João Pedro Silva', 12, 'Masculino', 'Cabelos pretos, olhos castanhos, 1,40m de altura', '2024-04-15', 'Bairro Centro', '11987654321', 'Maria Silva', 'Desaparecido', '2024-04-17', 'https://example.com/foto1.jpg', '2024-04-15',
            'Ana Costa Oliveira', 8, 'Feminino', 'Cabelos loiros, olhos azuis, 1,20m de altura, usa óculos', '2024-04-14', 'Comunidade Vila Nova', '11912345678', 'Carlos Costa', 'Desaparecido', '2024-04-17', 'https://example.com/foto2.jpg', '2024-04-14',
            'Lucas Pereira Santos', 15, 'Masculino', 'Cabelos castanhos, 1,65m de altura', '2024-04-16', 'Próximo à escola estadual', '11987654322', 'Patricia Pereira', 'Localizado', '2024-04-17', 'https://example.com/foto3.jpg', '2024-04-16'
        ]);

        console.log('Dados iniciais inseridos na tabela de pessoas desaparecidas.');
    } else {
        console.log(`Banco pronto com ${total} registros de pessoas desaparecidas`);
    }
};

module.exports = { pool, initDb };
