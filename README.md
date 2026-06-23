# A/R — Loja (Flask + API + SQLite)

Projeto de loja com **frontend servido pelo Flask**, **API REST** e **painel administrativo**.
O site permite cadastrar/visualizar **produtos**, fazer **compras (pedidos)** e enviar **candidatos**. O painel ADM lê e altera os dados via `/api/*`.

---

## Funcionalidades
- **Páginas públicas (frontend):**
  - `Home` (`/`)
  - `Sobre` (`/sobre`)
  - `Loja` (`/loja`)
  - `Painel ADM` (`/admin`)
  - `Cadastro / Login` (`/cadastro`) — uma única página com abas
  - `/login` redireciona para `/cadastro` (mesma tela cobre login e cadastro)
- **Painel administrativo (ADM)** para gerenciar:
  - **Produtos**
  - **Compras (pedidos)**
  - **Candidatos**
  - **Dashboard** (métricas, incluindo total de camisas vendidas e total de pessoas que compraram)
  - **Configurações** (nome da loja e senha do admin)
- **Autenticação real** (ver seção abaixo) — login do site e do admin validados no backend, com senha protegida por hash e sessão de servidor.
- **API REST** em `/api/*` usada pelo frontend e pelo painel.
- **Banco SQLite** com tabelas criadas automaticamente na primeira execução.

---

## Autenticação e segurança

### Login do site (clientes)
- Cadastro e login ficam na mesma página (`/cadastro`, abas "Entrar" / "Criar conta").
- A senha nunca é guardada em texto puro: é transformada em hash (`werkzeug.security.generate_password_hash`) antes de ir para o banco.
- Ao logar (ou cadastrar), o servidor abre uma sessão (cookie assinado pelo Flask). Por isso, se o cliente recarregar a página, ele continua logado — o front confere isso chamando `GET /api/me` ao carregar.
- Quando um cliente logado faz uma compra na loja, o pedido é gravado com o nome/e-mail **reais da sessão**, não com o que vier do front — isso evita que alguém finja ser outra pessoa editando o JavaScript do navegador.

### Login do painel admin
- Usuário/senha não ficam mais fixos no JavaScript (`admin`/`1234` escrito no código). Agora existe uma tabela `admins` no banco, com senha em hash, e o login é validado pelo servidor.
- **Na primeira execução**, é criado automaticamente um admin com usuário `admin` e senha `1234` (só para você conseguir entrar a primeira vez). Troque essa senha na tela **Configurações** do painel assim que possível.
- Todas as rotas de escrita do admin (criar/editar/excluir produto, ver compras, mudar status de compra, ver candidatos, ver dashboard) agora **exigem sessão de admin válida** no servidor — não é mais só a tela que "tranca", a própria API recusa (`401`) quem não estiver logado. Antes, qualquer pessoa que descobrisse a URL da API podia alterar os dados sem nunca passar pela tela de login.

### Variáveis de ambiente recomendadas em produção
| Variável | Para quê serve | Padrão se não definida |
|---|---|---|
| `SECRET_KEY` | Assina o cookie de sessão. Sem isso, todo mundo é deslogado a cada reinício/deploy. | valor fixo de desenvolvimento (troque em produção) |
| `ADMIN_USUARIO` | Usuário do admin criado na primeira execução. | `admin` |
| `ADMIN_SENHA_INICIAL` | Senha do admin criado na primeira execução. | `1234` |
| `DB_DIR` | Pasta onde o `banco.db` é criado/lido. | pasta do projeto |

---

## Endpoints

### Páginas (frontend)
- `GET /` → `templates/index.html`
- `GET /sobre` → `templates/sobre.html`
- `GET /loja` → `templates/loja.html`
- `GET /admin` → `templates/admin.html`
- `GET /login` → redireciona (302) para `/cadastro`
- `GET /cadastro` → `templates/cadastro.html`
- `GET /status` → health-check simples

### API REST (`/api/*`)

**Autenticação do site**
- `POST /api/cadastro` *(nome, email, senha)* — cria usuário e já abre sessão
- `POST /api/login` *(email, senha)*
- `POST /api/logout`
- `GET /api/me` — usuário logado na sessão atual (ou `logado: false`)

**Autenticação do admin**
- `POST /api/admin/login` *(usuario, senha)*
- `POST /api/admin/logout`
- `GET /api/admin/me`
- `PUT /api/admin/config` *(nome_loja, nova_senha)* — requer admin logado

**Produtos**
- `GET /api/produtos`
- `POST /api/produtos` *(nome, categoria, preco, estoque, estilo, descricao)* — requer admin
- `PUT /api/produtos/<id>` — requer admin
- `DELETE /api/produtos/<id>` — requer admin

**Compras (pedidos)**
- `GET /api/compras` — requer admin
- `POST /api/compras` *(produto_nome, quantidade, total[, cliente_nome, cliente_email])* — se houver sessão de cliente ativa, nome/e-mail vêm da sessão
- `PUT /api/compras/<id>/status` *(pendente, pago, cancelado)* — requer admin

**Candidatos**
- `GET /api/candidatos` — requer admin
- `POST /api/candidatos` *(nome, email, data_nasc)*

**Dashboard**
- `GET /api/dashboard` — requer admin. Retorna métricas, incluindo `total_itens_comprados` (camisas vendidas) e `total_clientes` (pessoas que já compraram).

---

## Banco de dados (SQLite)
- Arquivo do banco: `banco.db`
- Diretório do banco:
  - padrão: a pasta raiz do projeto
  - configurável via variável de ambiente `DB_DIR`

> Em deploy (ex.: Railway), use **Volume** para persistir `banco.db` entre deploys.

---

## Rodando localmente
```bash
pip install -r requirements.txt
python app.py
```
- Abra:
  - `http://127.0.0.1:5000/`
  - `http://127.0.0.1:5000/admin`

---

## Deploy (Railway)
1. Envie o projeto para um repositório Git.
2. Crie um serviço no Railway com **Nixpacks** (detecta `requirements.txt`/`Procfile`).
3. Persistência do SQLite (recomendado):
   - Crie um **Volume** e monte em `/data`.
   - Defina `DB_DIR=/data` no serviço.
4. O servidor sobe via `gunicorn` (configurado no `Procfile`).

---

## Estrutura do projeto
```text
app.py
requirements.txt
Procfile
railway.json

templates/
  index.html
  sobre.html
  loja.html
  admin.html
  cadastro.html
  (outros templates)

static/
  css/
  js/
  img/
```

