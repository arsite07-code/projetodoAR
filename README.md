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

```bash
pip install -r requirements.txt
python app.py
```

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
templates/
  index.html
  sobre.html
  loja.html
  admin.html            # painel administrativo (antes inexistente)
static/
  css/
  js/
    script.js           # loja: botão "Comprar" agora chama a API
    adm.js              # painel admin: usa /api (mesmo domínio)
  img/
```
