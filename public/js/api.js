// ===== CONFIGURAÇÕES DA API =====
const API_URL = window.location.origin;

// ===== FUNÇÕES DE API =====

class API {
    // --- PESSOAS DESAPARECIDAS ---
    
    static async listarPessoas() {
        try {
            const response = await fetch(`${API_URL}/pessoas-desaparecidas`);
            if (!response.ok) throw new Error('Erro ao listar pessoas');
            return await response.json();
        } catch (erro) {
            console.error('Erro na API (listarPessoas):', erro);
            throw erro;
        }
    }

    static async obterPessoa(id) {
        try {
            const response = await fetch(`${API_URL}/pessoas-desaparecidas/${id}`);
            if (!response.ok) throw new Error('Pessoa não encontrada');
            return await response.json();
        } catch (erro) {
            console.error('Erro na API (obterPessoa):', erro);
            throw erro;
        }
    }

    static async registrarPessoa(dados) {
        try {
            const response = await fetch(`${API_URL}/pessoas-desaparecidas`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dados)
            });
            if (!response.ok) throw new Error('Erro ao registrar pessoa');
            return await response.json();
        } catch (erro) {
            console.error('Erro na API (registrarPessoa):', erro);
            throw erro;
        }
    }

    static async atualizarStatusPessoa(id, status) {
        try {
            const response = await fetch(`${API_URL}/pessoas-desaparecidas/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status_localizacao: status })
            });
            if (!response.ok) throw new Error('Erro ao atualizar status');
            return await response.json();
        } catch (erro) {
            console.error('Erro na API (atualizarStatusPessoa):', erro);
            throw erro;
        }
    }

    static async atualizarPessoa(id, dados) {
        try {
            const response = await fetch(`${API_URL}/pessoas-desaparecidas/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dados)
            });
            if (!response.ok) throw new Error('Erro ao atualizar pessoa');
            return await response.json();
        } catch (erro) {
            console.error('Erro na API (atualizarPessoa):', erro);
            throw erro;
        }
    }

    static async deletarPessoa(id) {
        try {
            const response = await fetch(`${API_URL}/pessoas-desaparecidas/${id}`, {
                method: 'DELETE'
            });
            if (!response.ok) throw new Error('Erro ao deletar pessoa');
            return await response.json();
        } catch (erro) {
            console.error('Erro na API (deletarPessoa):', erro);
            throw erro;
        }
    }

    static async listarPistas(pessoaId) {
        try {
            const response = await fetch(`${API_URL}/pistas/${pessoaId}`);
            if (!response.ok) throw new Error('Erro ao listar pistas');
            return await response.json();
        } catch (erro) {
            console.error('Erro na API (listarPistas):', erro);
            throw erro;
        }
    }

    static async registrarPista(dados) {
        try {
            const response = await fetch(`${API_URL}/pistas`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dados)
            });
            if (!response.ok) throw new Error('Erro ao registrar pista');
            return await response.json();
        } catch (erro) {
            console.error('Erro na API (registrarPista):', erro);
            throw erro;
        }
    }

    static async atualizarPista(id, dados) {
        try {
            const response = await fetch(`${API_URL}/pistas/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dados)
            });
            if (!response.ok) throw new Error('Erro ao atualizar pista');
            return await response.json();
        } catch (erro) {
            console.error('Erro na API (atualizarPista):', erro);
            throw erro;
        }
    }

    static async deletarPista(id) {
        try {
            const response = await fetch(`${API_URL}/pistas/${id}`, {
                method: 'DELETE'
            });
            if (!response.ok) throw new Error('Erro ao deletar pista');
            return await response.json();
        } catch (erro) {
            console.error('Erro na API (deletarPista):', erro);
            throw erro;
        }
    }
}