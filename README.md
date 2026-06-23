<<<<<<< HEAD
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
=======
# A/R — Loja (Frontend + Backend Flask + SQLite)

## O que estava quebrado

1. **`Backend/app.py` estava vazio.** O backend real ficava em
   `Backend/servidor.py`, que só registrava as rotas `GET/POST /compras`.
   Nenhuma rota servia HTML/CSS/JS — por isso, ao rodar, a única coisa que
   aparecia era a mensagem genérica do Flask em modo debug ("Backend Flask
   está rodando"), sem nenhuma interface acessível.

2. **`admin.html` nunca existiu.** Só havia `Backend/adm.js`, um script de
   painel administrativo completo, mas sem o HTML que o carregasse e sem o
   CSS correspondente. O `adm.js` apontava para `http://localhost:5000/api`,
   uma API que também não existia (`/api/produtos`, `/api/candidatos`,
   `/api/dashboard`, `/api/compras/<id>/status` etc.).

3. **O site da loja (`loja (1).html` + `script.js`) era 100% mock.** O botão
   "Comprar Agora" só mudava de cor por 3 segundos — não chamava nenhuma API,
   não gravava nada no banco.

4. **Sem arquivos de deploy.** Não havia `requirements.txt`, `Procfile` nem
   configuração para Railway.

5. **Nomes de arquivo com espaços/parênteses** (`loja (1).html`, imagens com
   espaço) — problemáticos em URLs e em alguns ambientes de build.

## O que foi feito

- **Um único `app.py`** na raiz, usando `flask` + `flask-cors`, que:
  - serve as páginas (`/`, `/sobre`, `/loja`, `/admin`) via `render_template`
    a partir de `templates/`;
  - serve CSS/JS/imagens via Flask `static/` automático;
  - expõe a API REST completa em `/api/*` (produtos, compras, candidatos,
    dashboard), criando as tabelas no SQLite automaticamente na primeira
    execução.
- **Criado `templates/admin.html`**, um painel novo (visual preto/dourado
  consistente com a identidade do site) que carrega `static/js/adm.js`
  (ajustado para chamar `/api` em vez de `http://localhost:5000/api`, já que
  agora front e back estão no mesmo serviço/domínio).
- **`static/js/script.js`** (loja) atualizado: o botão "Comprar Agora" agora
  faz `POST /api/compras` de fato, gravando o pedido no SQLite — essas
  compras aparecem no painel admin em "Compras".
- **Arquivos renomeados** sem espaços/parênteses (`loja.html`,
  `captura-2026-04-24.png`, etc.) e referenciados via `url_for(...)` nos
  templates Jinja2.
- **Adicionados**: `requirements.txt`, `Procfile`, `railway.json`,
  `.gitignore`.

## Rotas da API

| Método | Rota                          | Descrição                                  |
|--------|-------------------------------|---------------------------------------------|
| GET    | `/api/produtos`                | Lista produtos                              |
| POST   | `/api/produtos`                | Cria produto (`nome`, `categoria`, `preco`, `estoque`, `estilo`, `descricao`) |
| PUT    | `/api/produtos/<id>`           | Atualiza produto                            |
| DELETE | `/api/produtos/<id>`           | Remove produto                              |
| GET    | `/api/compras`                 | Lista compras                               |
| POST   | `/api/compras`                 | Cria compra (`cliente_nome`, `cliente_email`, `produto_nome`, `quantidade`, `total`) |
| PUT    | `/api/compras/<id>/status`     | Atualiza status (`pendente`/`pago`/`cancelado`) |
| GET    | `/api/candidatos`              | Lista candidatos                            |
| POST   | `/api/candidatos`              | Cria candidato (`nome`, `email`, `data_nasc`) |
| GET    | `/api/dashboard`               | Métricas agregadas                          |
| GET    | `/status`                      | Health-check simples                        |

## Rodando localmente

>>>>>>> 56f37798f742afa3fe8568c0af69938722492a6e
```bash
pip install -r requirements.txt
python app.py
```
<<<<<<< HEAD
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

=======

Acesse `http://127.0.0.1:5000` (loja), `http://127.0.0.1:5000/admin` (painel,
usuário `admin` / senha `1234`).

## Deploy no Railway

1. Suba este projeto para um repositório Git (GitHub) e crie um novo serviço
   no Railway a partir dele — o Nixpacks detecta o `requirements.txt` e o
   `Procfile`/`railway.json` automaticamente.
2. **Persistência do SQLite (importante):** o filesystem de um container no
   Railway é efêmero — a cada novo deploy, o `banco.db` criado em runtime é
   perdido. Para persistir os dados:
   - No serviço, vá em **Settings → Volumes** e crie um Volume (ex: montado
     em `/data`).
   - Defina a variável de ambiente `DB_DIR=/data` no serviço.
   - O `app.py` já lê `DB_DIR` e cria/usa `banco.db` dentro dela.
3. Não é necessário configurar a variável `PORT` manualmente — o Railway a
   injeta e o `Procfile`/`app.py` já leem `$PORT`.
4. Não use `flask run` ou `debug=True` em produção; o `Procfile` já usa
   `gunicorn`.

## Estrutura final

```
app.py                 # backend Flask único (páginas + API)
requirements.txt
Procfile
railway.json
banco.db                # banco SQLite (tabelas criadas automaticamente)
>>>>>>> 56f37798f742afa3fe8568c0af69938722492a6e
templates/
  index.html
  sobre.html
  loja.html
<<<<<<< HEAD
  admin.html
  cadastro.html
  (outros templates)

static/
  css/
  js/
  img/
```

=======
  admin.html            # painel administrativo (antes inexistente)
static/
  css/
  js/
    script.js           # loja: botão "Comprar" agora chama a API
    adm.js              # painel admin: usa /api (mesmo domínio)
  img/
```
>>>>>>> 56f37798f742afa3fe8568c0af69938722492a6e
