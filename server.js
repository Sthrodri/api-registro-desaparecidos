const express = require('express');
const { pool, initDb } = require('./database');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Retorna mensagem clara quando o body JSON vier inválido.
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).json({ erro: 'JSON inválido no corpo da requisição.' });
    }
    next(err);
});

// Servir arquivos estáticos da pasta public
app.use(express.static(path.join(__dirname, 'public')));

// Rota inicial - Serve o index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Rota para API (retorna informações dos endpoints)
app.get('/api', (req, res) => {
    res.json({
        api: "Cadastro de Pessoas Desaparecidas - API",
        endpoints: {
            pessoas: {
                GET: "/pessoas-desaparecidas - Lista todas as pessoas",
                GET_ID: "/pessoas-desaparecidas/:id - Busca uma pessoa específica",
                POST: "/pessoas-desaparecidas - Registra uma pessoa desaparecida",
                PUT: "/pessoas-desaparecidas/:id - Atualiza dados de uma pessoa",
                DELETE: "/pessoas-desaparecidas/:id - Remove uma pessoa desaparecida"
            },
            pistas: {
                GET: "/pistas/:pessoa_id - Lista pistas sobre uma pessoa",
                POST: "/pistas - Registra uma pista",
                PUT: "/pistas/:id - Atualiza uma pista",
                DELETE: "/pistas/:id - Remove uma pista"
            },
        }
    });
});

// ===== ROTAS PARA PESSOAS DESAPARECIDAS =====

// GET - Listar todas as pessoas desaparecidas
app.get('/pessoas-desaparecidas', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM pessoas_desaparecidas ORDER BY data_desaparecimento DESC');
        res.json(result.rows);
    } catch (erro) {
        res.status(500).json({ erro: 'Erro ao buscar pessoas desaparecidas' });
    }
});

// GET - Buscar pessoa específica
app.get('/pessoas-desaparecidas/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM pessoas_desaparecidas WHERE id = $1', [id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ erro: 'Pessoa não encontrada' });
        }

        res.json(result.rows[0]);
    } catch (erro) {
        res.status(500).json({ erro: 'Erro ao buscar pessoa' });
    }
});

// POST - Registrar pessoa desaparecida
app.post('/pessoas-desaparecidas', async (req, res) => {
    try {
        const {
            nome,
            idade,
            genero,
            descricao_fisica,
            data_desaparecimento,
            local_desaparecimento,
            contato_solicitante,
            nome_solicitante,
            foto_url
        } = req.body;

        if (!nome || !data_desaparecimento || !local_desaparecimento) {
            return res.status(400).json({ erro: 'Campos obrigatórios: nome, data_desaparecimento, local_desaparecimento' });
        }

        const dataRegistro = new Date().toISOString();

        await pool.query(`
            INSERT INTO pessoas_desaparecidas 
            (nome, idade, genero, descricao_fisica, data_desaparecimento, local_desaparecimento, contato_solicitante, nome_solicitante, foto_url, data_registro, ultima_atualizacao)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        `, [nome, idade, genero, descricao_fisica, data_desaparecimento, local_desaparecimento, contato_solicitante, nome_solicitante, foto_url, dataRegistro, dataRegistro]);

        res.status(201).json({ 
            mensagem: `Pessoa "${nome}" registrada como desaparecida com sucesso!`,
            data_registro: dataRegistro
        });
    } catch (erro) {
        res.status(500).json({ erro: 'Erro ao registrar pessoa' });
    }
});

// PUT - Atualizar dados de pessoa desaparecida
app.put('/pessoas-desaparecidas/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const {
            nome,
            idade,
            genero,
            descricao_fisica,
            data_desaparecimento,
            local_desaparecimento,
            contato_solicitante,
            nome_solicitante,
            foto_url,
            status_localizacao
        } = req.body;

        const dataAtualizacao = new Date().toISOString();

        const pessoaExiste = await pool.query('SELECT id FROM pessoas_desaparecidas WHERE id = $1', [id]);
        if (pessoaExiste.rowCount === 0) {
            return res.status(404).json({ erro: 'Pessoa não encontrada' });
        }

        const pessoaAtualRes = await pool.query('SELECT * FROM pessoas_desaparecidas WHERE id = $1', [id]);
        const pessoaAtual = pessoaAtualRes.rows[0];
        const pessoaAtualizada = {
            nome: nome ?? pessoaAtual.nome,
            idade: idade ?? pessoaAtual.idade,
            genero: genero ?? pessoaAtual.genero,
            descricao_fisica: descricao_fisica ?? pessoaAtual.descricao_fisica,
            data_desaparecimento: data_desaparecimento ?? pessoaAtual.data_desaparecimento,
            local_desaparecimento: local_desaparecimento ?? pessoaAtual.local_desaparecimento,
            contato_solicitante: contato_solicitante ?? pessoaAtual.contato_solicitante,
            nome_solicitante: nome_solicitante ?? pessoaAtual.nome_solicitante,
            foto_url: foto_url ?? pessoaAtual.foto_url,
            status_localizacao: status_localizacao ?? pessoaAtual.status_localizacao
        };

        await pool.query(
            `UPDATE pessoas_desaparecidas
             SET nome = $1, idade = $2, genero = $3, descricao_fisica = $4, data_desaparecimento = $5,
                 local_desaparecimento = $6, contato_solicitante = $7, nome_solicitante = $8, foto_url = $9,
                 status_localizacao = $10, ultima_atualizacao = $11
             WHERE id = $12`,
            [
                pessoaAtualizada.nome,
                pessoaAtualizada.idade,
                pessoaAtualizada.genero,
                pessoaAtualizada.descricao_fisica,
                pessoaAtualizada.data_desaparecimento,
                pessoaAtualizada.local_desaparecimento,
                pessoaAtualizada.contato_solicitante,
                pessoaAtualizada.nome_solicitante,
                pessoaAtualizada.foto_url,
                pessoaAtualizada.status_localizacao,
                dataAtualizacao,
                id
            ]
        );

        res.json({ 
            mensagem: 'Pessoa atualizada com sucesso!',
            data_atualizacao: dataAtualizacao
        });
    } catch (erro) {
        res.status(500).json({ erro: 'Erro ao atualizar pessoa' });
    }
});

// DELETE - Remover pessoa desaparecida
app.delete('/pessoas-desaparecidas/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const pessoaExiste = await pool.query('SELECT id FROM pessoas_desaparecidas WHERE id = $1', [id]);
        if (pessoaExiste.rowCount === 0) {
            return res.status(404).json({ erro: 'Pessoa não encontrada' });
        }

        await pool.query('DELETE FROM pistas WHERE pessoa_id = $1', [id]);
        await pool.query('DELETE FROM pessoas_desaparecidas WHERE id = $1', [id]);

        res.json({ mensagem: 'Pessoa removida com sucesso!' });
    } catch (erro) {
        res.status(500).json({ erro: 'Erro ao remover pessoa' });
    }
});

// ===== ROTAS PARA PISTAS =====

// GET - Listar pistas de uma pessoa
app.get('/pistas/:pessoa_id', async (req, res) => {
    try {
        const { pessoa_id } = req.params;
        const result = await pool.query('SELECT * FROM pistas WHERE pessoa_id = $1 ORDER BY data_pista DESC', [pessoa_id]);
        res.json(result.rows);
    } catch (erro) {
        res.status(500).json({ erro: 'Erro ao buscar pistas' });
    }
});

// GET - Listar pistas de uma pessoa
app.get('/pistas', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM pistas');
        res.json(result.rows);
    } catch (erro) {
        res.status(500).json({ erro: 'Erro ao buscar pistas' });
    }
});

// DELETE - Remover pista específica
app.delete('/pistas/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const pistaExiste = await pool.query('SELECT id FROM pistas WHERE id = $1', [id]);
        if (pistaExiste.rowCount === 0) {
            return res.status(404).json({ erro: 'Pista não encontrada' });
        }

        await pool.query('DELETE FROM pistas WHERE id = $1', [id]);

        res.json({ mensagem: 'Pista removida com sucesso!' });
    } catch (erro) {
        res.status(500).json({ erro: 'Erro ao remover pista' });
    }
});

// PUT - Atualizar pista
app.put('/pistas/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const {
            pessoa_id,
            descricao_pista,
            local_avistamento,
            data_pista,
            hora_pista,
            contato_informante,
            nome_informante,
            confiabilidade
        } = req.body;

        const pistaRes = await pool.query('SELECT * FROM pistas WHERE id = $1', [id]);
        const pistaExiste = pistaRes.rows[0];

        if (!pistaExiste) {
            return res.status(404).json({ erro: 'Pista não encontrada' });
        }

        const pessoaIdAtual = pessoa_id ?? pistaExiste.pessoa_id;
        const pessoaExiste = await pool.query('SELECT id FROM pessoas_desaparecidas WHERE id = $1', [pessoaIdAtual]);
        if (pessoaExiste.rowCount === 0) {
            return res.status(404).json({ erro: 'Pessoa não encontrada para o pessoa_id informado.' });
        }

        await pool.query(
            `UPDATE pistas
             SET pessoa_id = $1, descricao_pista = $2, local_avistamento = $3, data_pista = $4, hora_pista = $5,
                 contato_informante = $6, nome_informante = $7, confiabilidade = $8
             WHERE id = $9`,
            [
                pessoaIdAtual,
                descricao_pista ?? pistaExiste.descricao_pista,
                local_avistamento ?? pistaExiste.local_avistamento,
                data_pista ?? pistaExiste.data_pista,
                hora_pista ?? pistaExiste.hora_pista,
                contato_informante ?? pistaExiste.contato_informante,
                nome_informante ?? pistaExiste.nome_informante,
                confiabilidade ?? pistaExiste.confiabilidade,
                id
            ]
        );

        res.json({ mensagem: 'Pista atualizada com sucesso!' });
    } catch (erro) {
        res.status(500).json({ erro: 'Erro ao atualizar pista' });
    }
});

// POST - Registrar uma pista
app.post('/pistas', async (req, res) => {
    try {
        const {
            pessoa_id,
            descricao_pista,
            local_avistamento,
            data_pista,
            hora_pista,
            contato_informante,
            nome_informante
        } = req.body;

        if (!pessoa_id || !descricao_pista) {
            return res.status(400).json({ erro: 'Campos obrigatórios: pessoa_id, descricao_pista' });
        }

        const pessoaIdNumero = Number(pessoa_id);

        if (!Number.isInteger(pessoaIdNumero) || pessoaIdNumero <= 0) {
            return res.status(400).json({ erro: 'pessoa_id inválido. Envie um número inteiro positivo.' });
        }

        const pessoaExiste = await pool.query('SELECT id FROM pessoas_desaparecidas WHERE id = $1', [pessoaIdNumero]);
        if (pessoaExiste.rowCount === 0) {
            return res.status(404).json({ erro: 'Pessoa não encontrada para o pessoa_id informado.' });
        }

        await pool.query(`
            INSERT INTO pistas 
            (pessoa_id, descricao_pista, local_avistamento, data_pista, hora_pista, contato_informante, nome_informante)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
        `, [pessoaIdNumero, descricao_pista, local_avistamento, data_pista, hora_pista, contato_informante, nome_informante]);

        res.status(201).json({ 
            mensagem: 'Pista registrada com sucesso!'
        });
    } catch (erro) {
        res.status(500).json({ erro: 'Erro ao registrar pista' });
    }
});

// Iniciar servidor após garantir o schema
const PORT = process.env.PORT || 3000;

initDb()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Servidor rodando em http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error('Erro ao inicializar o banco de dados:', err);
        process.exit(1);
    });
