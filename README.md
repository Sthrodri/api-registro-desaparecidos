# 🚨 Sistema de Busca por Pessoas Desaparecidas - Reencontro em Tempos de Crise

## 1. Apresentação da Ideia

Este projeto foi desenvolvido a partir do desafio sobre enchentes e desastres naturais no Brasil. Ao analisar o cenário, identifiquei a dificuldade relacionada ao **registro e localização de pessoas desaparecidas durante eventos críticos**, o que motivou a criação desta solução.

Durante enchentes e evacuações em massa, famílias se veem separadas em meio ao caos. A falta de um sistema centralizado de informações sobre desaparecidos torna o reencontro ainda mais difícil. Este projeto busca resolver esse problema oferecendo uma plataforma clara e acessível para:
- Registrar pessoas desaparecidas
- Compartilhar pistas e informações
- Coordenar voluntários na busca
- Conectar famílias e equipes de apoio

## 2. Problema Escolhido

### Registro de Pessoas Desaparecidas

**A dificuldade enfrentada:**
- Durante a evacuação de uma área alagada, famílias se separam no meio da confusão
- Pessoas afetadas não conseguem contato pelo celular e não sabem onde seus entes queridos foram levados
- As informações buscadas com voluntários e redes sociais são desencontradas, incompletas ou desatualizadas
- Equipes de apoio recebem diversos pedidos semelhantes mas enfrentam dificuldade para organizar as informações

**Quem são as pessoas impactadas:**
- Famílias que se separaram durante a evacuação
- Pessoas desaparecidas em áreas afetadas
- Voluntários que querem ajudar
- Equipes de apoio e resgate

**Por que esse problema é relevante:**
- Em situações de crise, cada minuto conta
- A centralização de informações aumenta as chances de reencontro
- A comunicação clara entre diferentes atores (famílias, voluntários, equipes) é essencial
- Uma solução organizada pode salvar vidas

## 3. Solução Proposta

### Como o sistema funciona de forma geral:

O sistema oferece uma **plataforma centralizada** onde:

1. **Pessoas desaparecidas** podem ser registradas com informações importantes (nome, idade, descrição física, local do desaparecimento)
2. **Pistas** podem ser compartilhadas por qualquer pessoa que tenha informações sobre o desaparecido
3. **Voluntários** se registram para ajudar nas buscas
4. **Status** é atualizado conforme novas informações surgem

### Como ele ajuda a resolver o problema:

- ✅ **Centralização**: Todas as informações em um único lugar, acessível via internet
- ✅ **Clareza**: Interface intuitiva que funciona em celular, tablet ou computador
- ✅ **Agilidade**: Pistas são registradas e compartilhadas em tempo real
- ✅ **Organização**: Voluntários sabem onde estão as maiores necessidades

### Principais diferenciais:

- Sistema modular com tabelas separadas para pessoas, pistas e voluntários
- Possibilidade de atualizar status em tempo real
- Interface pensada para acesso móvel (internet limitada)
- API estruturada e documentada para facilitar integrações

## 4. Estrutura do Sistema

### **Front-end**
- Interface web responsiva (HTML/CSS/JavaScript)
- Funcionalidades principais:
  - Formulário para registrar pessoa desaparecida
  - Busca de pessoas por nome ou localização
  - Submissão de pistas
  - Cadastro de voluntários
  - Visualização de status em tempo real

### **Back-end**
- Servidor Express.js com API RESTful
- Endpoints para CRUD (Create, Read, Update) de:
  - Pessoas desaparecidas
  - Pistas
  - Voluntários
- Validação de dados de entrada
- Tratamento de erros

### **Banco de Dados** (SQLite)
Três tabelas principais:

#### **pessoas_desaparecidas**
Armazena informações sobre pessoas desaparecidas:
- `id`: Identificador único
- `nome`: Nome completo
- `idade`: Idade
- `genero`: Gênero
- `descricao_fisica`: Características físicas (altura, cabelo, olhos, etc.)
- `data_desaparecimento`: Data do desaparecimento
- `local_desaparecimento`: Último local visto
- `contato_solicitante`: Telefone de contato
- `nome_solicitante`: Quem fez o registro
- `status_localizacao`: Desaparecido / Localizado / Sob investigação
- `foto_url`: Link para foto
- `data_registro`: Quando foi registrado no sistema

#### **pistas**
Registra informações sobre possíveis localizações:
- `id`: Identificador único
- `pessoa_id`: Referência à pessoa desaparecida
- `descricao_pista`: Descrição da informação
- `local_avistamento`: Onde foi visto
- `data_pista`: Data do avistamento
- `hora_pista`: Hora aproximada
- `contato_informante`: Quem reportou
- `nome_informante`: Nome de quem reportou
- `confiabilidade`: Nível de confiança da pista

#### **voluntarios**
Gerencia voluntários que ajudam nas buscas:
- `id`: Identificador único
- `nome`: Nome do voluntário
- `contato`: Telefone/email
- `area_atuacao`: Área onde pode atuar
- `data_cadastro`: Data do registro
- `status`: Ativo / Inativo

## 5. Como Usar

### Instalação
```bash
npm install
```

### Executar o servidor
```bash
npm run dev
# ou
node server.js
```

O servidor rodará em `http://localhost:3000`

### Endpoints Disponíveis

#### Pessoas Desaparecidas
- `GET /pessoas-desaparecidas` - Lista todas as pessoas
- `GET /pessoas-desaparecidas/:id` - Busca pessoa específica
- `POST /pessoas-desaparecidas` - Registra nova pessoa
- `PUT /pessoas-desaparecidas/:id` - Atualiza status

#### Pistas
- `GET /pistas/:pessoa_id` - Lista pistas de uma pessoa
- `POST /pistas` - Registra nova pista

#### Voluntários
- `GET /voluntarios` - Lista voluntários ativos
- `POST /voluntarios` - Registra novo voluntário

## 6. Tecnologias Utilizadas

- **Node.js** - Ambiente de execução JavaScript
- **Express.js** - Framework web
- **SQLite3** - Banco de dados
- **CORS** - Suporte para requisições cross-origin
- **Nodemon** - Desenvolvimento com auto-reload

## 7. Possíveis Melhorias Futuras

- [ ] Autenticação de usuários
- [ ] Envio de notificações via email/SMS
- [ ] Integração com redes sociais
- [ ] Mapa interativo com localidades
- [ ] Histórico de atualizações
- [ ] Sistema de fotos com upload
- [ ] Chat em tempo real entre voluntários
- [ ] Exportação de relatórios

---

**Desenvolvido com o objetivo de salvar vidas e reunir famílias em tempos de crise.**
