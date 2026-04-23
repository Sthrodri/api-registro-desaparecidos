// ===== LÓGICA PRINCIPAL DA APLICAÇÃO =====

const app = {
    // Estado da aplicação
    estado: {
        pessoas: [],
        pessoasFiltradas: [],
        statusFiltro: 'todos',
        termoBusca: ''
    },

    // ===== INICIALIZAÇÃO =====
    init() {
        console.log('🚀 Aplicação iniciada');
        
        // Carregar pessoas ao iniciar
        this.carregarPessoas();
        
        // Registrar event listeners
        this.registrarEventos();
    },

    registrarEventos() {
        // Busca de pessoas
        const inputBusca = document.getElementById('buscar-pessoa');
        if (inputBusca) {
            inputBusca.addEventListener('input', (e) => this.buscarPessoas(e.target.value));
        }

        // Formulários
        document.getElementById('form-registrar')?.addEventListener('submit', (e) => this.registrarDesaparecido(e));
        document.getElementById('form-pista')?.addEventListener('submit', (e) => this.enviarPista(e));

        // Select de pessoa para pista
        document.getElementById('pessoa-pista')?.addEventListener('change', () => {
            this.carregarPistasModal();
        });
    },

    // ===== NAVEGAÇÃO DE ABAS =====
    abrirTab(tabName) {
        // Fechar todas as abas
        const tabs = document.querySelectorAll('.tab-content');
        tabs.forEach(tab => tab.classList.remove('active'));

        // Remover active dos botões
        const buttons = document.querySelectorAll('.tab-btn');
        buttons.forEach(btn => btn.classList.remove('active'));

        // Abrir aba selecionada
        const tabElement = document.getElementById(tabName);
        if (tabElement) {
            tabElement.classList.add('active');
        }

        // Ativar botão
        event.target.classList.add('active');

        // Carregar dados quando necessário
        if (tabName === 'pessoas') {
            this.carregarPessoas();
        } else if (tabName === 'pistas') {
            this.carregarPessoasParaPistas();
        }
    },

    // ===== UTILITÁRIOS =====
    mostrarMensagem(elementId, mensagem, tipo = 'success') {
        const elemento = document.getElementById(elementId);
        if (!elemento) return;
        
        elemento.innerHTML = `<div class="message ${tipo}">${mensagem}</div>`;
        
        // Auto-remover após 5 segundos
        setTimeout(() => {
            if (elemento.firstChild) {
                elemento.firstChild.remove();
            }
        }, 5000);
    },

    formatarData(data) {
        return new Date(data).toLocaleDateString('pt-BR');
    },

    normalizarFotoUrl(url) {
        if (!url) return '';

        const limpa = url.trim();

        // Converte link de compartilhamento do Google Drive para link direto de imagem.
        const matchDrive = limpa.match(/drive\.google\.com\/file\/d\/([^/]+)/);
        if (matchDrive?.[1]) {
            return `https://drive.google.com/uc?export=view&id=${matchDrive[1]}`;
        }

        return limpa;
    },

    // ===== PESSOAS DESAPARECIDAS =====
    async carregarPessoas() {
        try {
            const listaPessoas = document.getElementById('lista-pessoas');
            listaPessoas.innerHTML = '<div class="loading"><div class="spinner"></div><p>Carregando...</p></div>';

            const pessoas = await API.listarPessoas();
            this.estado.pessoas = pessoas;
            this.estado.pessoasFiltradas = pessoas;

            // Atualizar contador
            document.getElementById('pessoas-count').innerHTML = 
                `Pessoas Desaparecidas: <strong>${pessoas.length}</strong>`;

            this.renderizarPessoas(pessoas);
        } catch (erro) {
            document.getElementById('lista-pessoas').innerHTML = 
                '<div class="message error">❌ Erro ao carregar pessoas. Verifique se o servidor está rodando em http://localhost:3000</div>';
        }
    },

    renderizarPessoas(pessoas) {
        const listaPessoas = document.getElementById('lista-pessoas');
        
        if (pessoas.length === 0) {
            listaPessoas.innerHTML = '<div class="empty-state"><p>📭 Nenhuma pessoa registrada ainda.</p></div>';
            return;
        }

        let html = '';
        pessoas.forEach(pessoa => {
            const statusClass = pessoa.status_localizacao.toLowerCase().replace(/\s+/g, '');
            const fotoUrl = this.normalizarFotoUrl(pessoa.foto_url);
            const fotoHtml = fotoUrl
                ? `<img src="${fotoUrl}" alt="${pessoa.nome}" class="person-foto" referrerpolicy="no-referrer" onerror="this.onerror=null; this.src='https://via.placeholder.com/200x200?text=Sem+foto';">`
                : '';
            
            html += `
                <div class="person-item">
                    <div class="person-header">
                        <div>
                            <h3>${pessoa.nome}</h3>
                            <span class="status ${statusClass}">${pessoa.status_localizacao}</span>
                        </div>
                    </div>
                    ${fotoHtml}
                    <div class="person-info">
                        <p><strong>👤 Idade:</strong> ${pessoa.idade} anos</p>
                        <p><strong>⚥ Gênero:</strong> ${pessoa.genero || 'Não especificado'}</p>
                        <p><strong>📅 Desaparecimento:</strong> ${this.formatarData(pessoa.data_desaparecimento)}</p>
                        <p><strong>📍 Local:</strong> ${pessoa.local_desaparecimento}</p>
                    </div>
                    <p><strong>🔍 Descrição Física:</strong> ${pessoa.descricao_fisica || 'Não informada'}</p>
                    <p><strong>📞 Contato:</strong> ${pessoa.contato_solicitante}</p>
                    <p><strong>📝 Registrado por:</strong> ${pessoa.nome_solicitante} em ${this.formatarData(pessoa.data_registro)}</p>
                    <div class="person-actions">
                        <button class="btn-secondary" onclick="app.verPistas(${pessoa.id}, '${pessoa.nome}')">🔍 Ver Pistas</button>
                        ${pessoa.status_localizacao === 'Desaparecido' ? 
                            `<button class="btn-secondary" onclick="app.marcarLocalizado(${pessoa.id})">✅ Marcar como Localizado</button>` 
                            : ''}
                    </div>
                </div>
            `;
        });

        listaPessoas.innerHTML = html;
    },

    async registrarDesaparecido(event) {
        event.preventDefault();

        const dados = {
            nome: document.getElementById('nome').value,
            idade: parseInt(document.getElementById('idade').value),
            genero: document.getElementById('genero').value,
            descricao_fisica: document.getElementById('descricao-fisica').value,
            data_desaparecimento: document.getElementById('data-desap').value,
            local_desaparecimento: document.getElementById('local-desap').value,
            nome_solicitante: document.getElementById('nome-solicitante').value,
            contato_solicitante: document.getElementById('contato-solicitante').value,
            foto_url: document.getElementById('foto-url').value
        };

        try {
            // Validação
            if (!dados.nome || !dados.data_desaparecimento || !dados.local_desaparecimento) {
                this.mostrarMensagem('mensagem-registrar', '⚠️ Preencha todos os campos obrigatórios', 'error');
                return;
            }

            const response = await API.registrarPessoa(dados);
            this.mostrarMensagem('mensagem-registrar', '✅ Pessoa registrada com sucesso! Espalhamos a notícia', 'success');
            
            // Limpar formulário
            document.getElementById('form-registrar').reset();
            
            // Recarregar lista
            setTimeout(() => this.carregarPessoas(), 1000);
        } catch (erro) {
            this.mostrarMensagem('mensagem-registrar', '❌ Erro ao registrar pessoa', 'error');
        }
    },

    filtrarPorStatus(status) {
        this.estado.statusFiltro = status;
        this.aplicarFiltros();

        // Atualizar botões de filtro
        document.querySelectorAll('.filtro-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        event.target.classList.add('active');
    },

    buscarPessoas(termo) {
        this.estado.termoBusca = termo.toLowerCase();
        this.aplicarFiltros();
    },

    aplicarFiltros() {
        let resultado = this.estado.pessoas;

        // Filtro por status
        if (this.estado.statusFiltro !== 'todos') {
            resultado = resultado.filter(p => 
                p.status_localizacao === this.estado.statusFiltro
            );
        }

        // Filtro por busca
        if (this.estado.termoBusca) {
            resultado = resultado.filter(p => 
                p.nome.toLowerCase().includes(this.estado.termoBusca) ||
                p.local_desaparecimento.toLowerCase().includes(this.estado.termoBusca)
            );
        }

        this.renderizarPessoas(resultado);
    },

    async marcarLocalizado(pessoaId) {
        try {
            await API.atualizarStatusPessoa(pessoaId, 'Localizado');
            this.mostrarMensagem('mensagem-pessoas', '🎉 Pessoa marcada como localizada!', 'success');
            this.carregarPessoas();
        } catch (erro) {
            this.mostrarMensagem('mensagem-pessoas', '❌ Erro ao atualizar status', 'error');
        }
    },

    // ===== PISTAS =====
    async carregarPessoasParaPistas() {
        try {
            const pessoas = await API.listarPessoas();
            let options = '<option value="">Selecione uma pessoa desaparecida...</option>';
            
            pessoas.forEach(pessoa => {
                if (pessoa.status_localizacao === 'Desaparecido') {
                    options += `<option value="${pessoa.id}">${pessoa.nome} (${this.formatarData(pessoa.data_desaparecimento)})</option>`;
                }
            });

            document.getElementById('pessoa-pista').innerHTML = options;
        } catch (erro) {
            console.error('Erro ao carregar pessoas para pistas:', erro);
        }
    },

    async carregarPistasModal() {
        const pessoaId = document.getElementById('pessoa-pista').value;
        if (!pessoaId) return;

        try {
            const pistas = await API.listarPistas(pessoaId);
            console.log('Pistas carregadas:', pistas);
        } catch (erro) {
            console.error('Erro ao carregar pistas:', erro);
        }
    },

    async verPistas(pessoaId, nomePessoa) {
        try {
            const pistas = await API.listarPistas(pessoaId);
            
            let conteudo = '';
            if (pistas.length === 0) {
                conteudo = '<p style="text-align: center; color: #999;">Nenhuma pista registrada ainda.</p>';
            } else {
                conteudo = '<div>';
                pistas.forEach(pista => {
                    conteudo += `
                        <div class="person-item" style="margin-bottom: 15px;">
                            <p><strong>📝 Descrição:</strong> ${pista.descricao_pista}</p>
                            <p><strong>📍 Local:</strong> ${pista.local_avistamento || 'Não informado'}</p>
                            <p><strong>📅 Data:</strong> ${pista.data_pista ? this.formatarData(pista.data_pista) : 'Não informada'}</p>
                            <p><strong>⏰ Hora:</strong> ${pista.hora_pista || 'Não informada'}</p>
                            <p><strong>👤 Informante:</strong> ${pista.nome_informante || 'Anônimo'}</p>
                            <p><strong>📞 Contato:</strong> ${pista.contato_informante}</p>
                            <p><strong>✔️ Confiabilidade:</strong> ${pista.confiabilidade}</p>
                        </div>
                    `;
                });
                conteudo += '</div>';
            }

            document.getElementById('nome-pessoa-pista').textContent = nomePessoa;
            document.getElementById('lista-pistas-modal').innerHTML = conteudo;
            this.abrirModal('modal-pistas');
        } catch (erro) {
            this.mostrarMensagem('mensagem-pessoas', '❌ Erro ao carregar pistas', 'error');
        }
    },

    async enviarPista(event) {
        event.preventDefault();

        const pessoaId = document.getElementById('pessoa-pista').value;
        if (!pessoaId) {
            this.mostrarMensagem('mensagem-pista', '⚠️ Selecione uma pessoa desaparecida', 'error');
            return;
        }

        const dados = {
            pessoa_id: parseInt(pessoaId),
            descricao_pista: document.getElementById('descricao-pista').value,
            local_avistamento: document.getElementById('local-avistamento').value,
            data_pista: document.getElementById('data-pista').value,
            hora_pista: document.getElementById('hora-pista').value,
            contato_informante: document.getElementById('contato-informante').value,
            nome_informante: document.getElementById('nome-informante').value
        };

        try {
            if (!dados.descricao_pista || !dados.contato_informante) {
                this.mostrarMensagem('mensagem-pista', '⚠️ Preencha os campos obrigatórios', 'error');
                return;
            }

            const response = await API.registrarPista(dados);
            this.mostrarMensagem('mensagem-pista', '✅ Pista enviada com sucesso! Obrigado pela ajuda', 'success');
            document.getElementById('form-pista').reset();
        } catch (erro) {
            this.mostrarMensagem('mensagem-pista', '❌ Erro ao enviar pista', 'error');
        }
    },

        // ===== MODAL =====
    abrirModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('show');
        }
    },

    fecharModal() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.remove('show');
        });
    }
};

// Inicializar app quando página carregar
window.addEventListener('load', () => {
    app.init();
});

// Fechar modal ao clicar fora dele
window.addEventListener('click', (event) => {
    const modal = document.getElementById('modal-pistas');
    if (event.target === modal) {
        app.fecharModal();
    }
});
