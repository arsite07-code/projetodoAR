"""
Backend Flask da loja A/R.

Responsabilidades:
  - Servir o frontend (templates HTML + arquivos estáticos: css/js/img).
  - Expor a API REST em /api/* usada pelo site e pelo painel admin.
  - Persistir os dados em SQLite (arquivo banco.db).
<<<<<<< HEAD
  - Autenticar usuários do site e o administrador, com senha hasheada
    (nunca em texto puro) e sessão de servidor (cookie assinado pelo Flask).
=======
>>>>>>> 56f37798f742afa3fe8568c0af69938722492a6e

Rotas de página:
  GET /            -> index.html
  GET /sobre       -> sobre.html
  GET /loja        -> loja.html
  GET /admin       -> admin.html (painel administrativo)
<<<<<<< HEAD
  GET /login       -> redireciona para /cadastro (a mesma página faz login e cadastro)
  GET /cadastro    -> cadastro.html (login + cadastro, com abas)

Rotas de API (autenticação do site):
  POST /api/cadastro     -> cria usuário (senha vai com hash para o banco)
  POST /api/login        -> autentica usuário e abre sessão
  POST /api/logout       -> fecha a sessão do usuário
  GET  /api/me           -> retorna o usuário logado (ou null)

Rotas de API (autenticação do admin):
  POST /api/admin/login  -> autentica admin e abre sessão de admin
  POST /api/admin/logout -> fecha a sessão do admin
  GET  /api/admin/me     -> retorna se há admin logado

Rotas de API (dados, painel admin):
  GET    /api/produtos
  POST   /api/produtos            (requer admin)
  PUT    /api/produtos/<id>       (requer admin)
  DELETE /api/produtos/<id>       (requer admin)

  GET    /api/compras             (requer admin)
  POST   /api/compras
  PUT    /api/compras/<id>/status (requer admin)

  GET    /api/candidatos          (requer admin)
  POST   /api/candidatos

  GET    /api/dashboard           (requer admin)
=======

Rotas de API:
  GET    /api/produtos
  POST   /api/produtos
  PUT    /api/produtos/<id>
  DELETE /api/produtos/<id>

  GET    /api/compras
  POST   /api/compras
  PUT    /api/compras/<id>/status

  GET    /api/candidatos
  POST   /api/candidatos

  GET    /api/dashboard
>>>>>>> 56f37798f742afa3fe8568c0af69938722492a6e
"""

from __future__ import annotations

import os
import sqlite3
from datetime import datetime
<<<<<<< HEAD
from functools import wraps

from flask import Flask, jsonify, request, render_template, session, redirect
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
=======

from flask import Flask, jsonify, request, render_template
from flask_cors import CORS
>>>>>>> 56f37798f742afa3fe8568c0af69938722492a6e

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# No Railway, monte um Volume e aponte DB_DIR para ele (ex: /data) para
# persistir o banco entre deploys. Sem volume, o SQLite vive no filesystem
# efêmero do container e é resetado a cada novo deploy.
DB_DIR = os.environ.get("DB_DIR", BASE_DIR)
DB_PATH = os.path.join(DB_DIR, "banco.db")

<<<<<<< HEAD
# Senha padrão do admin, usada apenas para criar o registro inicial no banco
# na primeira execução (quando a tabela "admins" ainda está vazia). Depois
# disso, a senha real é a que está hasheada no banco — para trocá-la, use a
# tela de "Configurações" do painel (ou defina ADMIN_SENHA_INICIAL antes do
# primeiro start em produção, para não usar o valor padrão "1234").
ADMIN_USUARIO_PADRAO = os.environ.get("ADMIN_USUARIO", "admin")
ADMIN_SENHA_PADRAO = os.environ.get("ADMIN_SENHA_INICIAL", "1234")

=======
>>>>>>> 56f37798f742afa3fe8568c0af69938722492a6e

def get_conn() -> sqlite3.Connection:
    con = sqlite3.connect(DB_PATH)
    con.row_factory = sqlite3.Row
    return con


def init_db() -> None:
    os.makedirs(DB_DIR, exist_ok=True)
    with get_conn() as con:
        cur = con.cursor()

        cur.execute(
            """
            CREATE TABLE IF NOT EXISTS produtos (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nome TEXT NOT NULL,
                categoria TEXT NOT NULL DEFAULT 'Outro',
                preco REAL NOT NULL,
                estoque INTEGER NOT NULL DEFAULT 0,
                estilo TEXT,
                descricao TEXT,
                criado_em TEXT NOT NULL
            )
            """
        )

        cur.execute(
            """
            CREATE TABLE IF NOT EXISTS compras (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                cliente_nome TEXT NOT NULL,
                cliente_email TEXT NOT NULL DEFAULT '',
                produto_nome TEXT NOT NULL,
                quantidade INTEGER NOT NULL DEFAULT 1,
                total REAL NOT NULL,
                status TEXT NOT NULL DEFAULT 'pendente',
<<<<<<< HEAD
                criado_em TEXT NOT NULL,
                usuario_id INTEGER
=======
                criado_em TEXT NOT NULL
>>>>>>> 56f37798f742afa3fe8568c0af69938722492a6e
            )
            """
        )

        cur.execute(
            """
            CREATE TABLE IF NOT EXISTS candidatos (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nome TEXT NOT NULL,
                email TEXT NOT NULL,
                data_nasc TEXT,
                criado_em TEXT NOT NULL
            )
            """
        )

<<<<<<< HEAD
        cur.execute(
            """
            CREATE TABLE IF NOT EXISTS usuarios (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nome TEXT NOT NULL,
                email TEXT NOT NULL UNIQUE,
                senha_hash TEXT NOT NULL,
                criado_em TEXT NOT NULL
            )
            """
        )

        cur.execute(
            """
            CREATE TABLE IF NOT EXISTS admins (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                usuario TEXT NOT NULL UNIQUE,
                senha_hash TEXT NOT NULL,
                nome_loja TEXT NOT NULL DEFAULT 'A/R'
            )
            """
        )

        # Migração leve: bancos antigos podem ter "compras" sem a coluna
        # usuario_id.
        colunas_compras = [r["name"] for r in cur.execute("PRAGMA table_info(compras)")]
        if "usuario_id" not in colunas_compras:
            cur.execute("ALTER TABLE compras ADD COLUMN usuario_id INTEGER")

        # Cria o admin padrão apenas se ainda não existir nenhum.
        existe_admin = cur.execute("SELECT COUNT(*) AS c FROM admins").fetchone()["c"]
        if not existe_admin:
            cur.execute(
                "INSERT INTO admins (usuario, senha_hash, nome_loja) VALUES (?, ?, ?)",
                (
                    ADMIN_USUARIO_PADRAO,
                    generate_password_hash(ADMIN_SENHA_PADRAO),
                    "A/R",
                ),
            )

=======
>>>>>>> 56f37798f742afa3fe8568c0af69938722492a6e
        con.commit()


def agora() -> str:
    return datetime.now().strftime("%d/%m/%Y %H:%M")


<<<<<<< HEAD
def admin_logado() -> bool:
    return bool(session.get("admin_id"))


def login_admin_obrigatorio(view):
    """Protege rotas que só o painel admin pode chamar (criar/editar/excluir
    produtos, ver/alterar compras, ver candidatos, ver dashboard). Sem isso,
    qualquer pessoa que descobrisse a URL da API poderia alterar os dados
    direto, sem nunca passar pela tela de login."""

    @wraps(view)
    def wrapper(*args, **kwargs):
        if not admin_logado():
            return jsonify({"erro": "acesso restrito ao administrador"}), 401
        return view(*args, **kwargs)

    return wrapper


def criar_app() -> Flask:
    app = Flask(__name__)
    CORS(app, supports_credentials=True)  # supports_credentials: permite cookie de sessão em fetch()

    # Necessário para assinar o cookie de sessão (login do site e do admin).
    # Em produção, defina a variável de ambiente SECRET_KEY com um valor
    # aleatório fixo (senão, a cada reinício/deploy todo mundo é deslogado).
    app.secret_key = os.environ.get("SECRET_KEY", "troque-essa-chave-em-producao-ar-loja")
=======
def criar_app() -> Flask:
    app = Flask(__name__)
    CORS(app)  # permite chamadas do frontend via fetch, inclusive de outro domínio
>>>>>>> 56f37798f742afa3fe8568c0af69938722492a6e

    init_db()

    # ------------------------------------------------------------------
    # PÁGINAS (frontend)
    # ------------------------------------------------------------------
    @app.get("/")
    def index():
        return render_template("index.html")

    @app.get("/sobre")
    def sobre():
        return render_template("sobre.html")

    @app.get("/loja")
    def loja():
        return render_template("loja.html")

    @app.get("/admin")
    def admin():
        return render_template("admin.html")

<<<<<<< HEAD
    @app.get("/login")
    def login_page():
        # A própria cadastro.html já tem aba de login, então não duplicamos
        # tela: só direcionamos para lá.
        return redirect("/cadastro")

    @app.get("/cadastro")
    def cadastro_page():
        return render_template("cadastro.html")
    
    @app.get("/projetos")
    def projetos_page():
        return render_template("projetos.html")
    
    @app.get("/blog")
    def blog_page():
        return render_template("blogs.html")

=======
>>>>>>> 56f37798f742afa3fe8568c0af69938722492a6e
    @app.get("/status")
    def status():
        # Endpoint simples de health-check (ex: Railway healthcheck)
        return jsonify({"status": "ok", "app": "A/R backend"})

    # ------------------------------------------------------------------
<<<<<<< HEAD
    # AUTENTICAÇÃO (login/cadastro do site)
    # ------------------------------------------------------------------
    @app.post("/api/cadastro")
    def api_cadastro():
        d = request.get_json(silent=True) or {}
        nome = (d.get("nome") or "").strip()
        email = (d.get("email") or "").strip().lower()
        senha = d.get("senha") or ""

        if not nome:
            return jsonify({"erro": "campo 'nome' é obrigatório"}), 400
        if not email:
            return jsonify({"erro": "campo 'email' é obrigatório"}), 400
        if len(senha) < 6:
            return jsonify({"erro": "a senha deve ter pelo menos 6 caracteres"}), 400

        with get_conn() as con:
            existente = con.execute(
                "SELECT id FROM usuarios WHERE email = ?", (email,)
            ).fetchone()
            if existente:
                return jsonify({"erro": "email já cadastrado"}), 409

            cur = con.execute(
                """
                INSERT INTO usuarios (nome, email, senha_hash, criado_em)
                VALUES (?, ?, ?, ?)
                """,
                (nome, email, generate_password_hash(senha), agora()),
            )
            novo_id = cur.lastrowid

        # Loga automaticamente depois do cadastro, como em qualquer site real.
        session["usuario_id"] = novo_id
        session["usuario_nome"] = nome
        session["usuario_email"] = email

        return jsonify({"ok": True, "id": novo_id, "nome": nome, "email": email}), 201

    @app.post("/api/login")
    def api_login():
        d = request.get_json(silent=True) or {}
        email = (d.get("email") or "").strip().lower()
        senha = d.get("senha") or ""

        if not email:
            return jsonify({"erro": "campo 'email' é obrigatório"}), 400
        if not senha:
            return jsonify({"erro": "campo 'senha' é obrigatório"}), 400

        with get_conn() as con:
            u = con.execute(
                "SELECT * FROM usuarios WHERE email = ?", (email,)
            ).fetchone()

        if not u or not check_password_hash(u["senha_hash"], senha):
            return jsonify({"erro": "email ou senha incorretos"}), 401

        session["usuario_id"] = u["id"]
        session["usuario_nome"] = u["nome"]
        session["usuario_email"] = u["email"]

        return jsonify({"ok": True, "id": u["id"], "nome": u["nome"], "email": u["email"]})

    @app.post("/api/logout")
    def api_logout():
        session.pop("usuario_id", None)
        session.pop("usuario_nome", None)
        session.pop("usuario_email", None)
        return jsonify({"ok": True})

    @app.get("/api/me")
    def api_me():
        if not session.get("usuario_id"):
            return jsonify({"logado": False})
        return jsonify(
            {
                "logado": True,
                "id": session["usuario_id"],
                "nome": session["usuario_nome"],
                "email": session["usuario_email"],
            }
        )

    # ------------------------------------------------------------------
    # AUTENTICAÇÃO (login do painel admin)
    # ------------------------------------------------------------------
    @app.post("/api/admin/login")
    def api_admin_login():
        d = request.get_json(silent=True) or {}
        usuario = (d.get("usuario") or "").strip()
        senha = d.get("senha") or ""

        with get_conn() as con:
            a = con.execute(
                "SELECT * FROM admins WHERE usuario = ?", (usuario,)
            ).fetchone()

        if not a or not check_password_hash(a["senha_hash"], senha):
            return jsonify({"erro": "usuário ou senha incorretos"}), 401

        session["admin_id"] = a["id"]
        session["admin_usuario"] = a["usuario"]
        session["admin_nome_loja"] = a["nome_loja"]

        return jsonify({"ok": True, "usuario": a["usuario"], "nome_loja": a["nome_loja"]})

    @app.post("/api/admin/logout")
    def api_admin_logout():
        session.pop("admin_id", None)
        session.pop("admin_usuario", None)
        session.pop("admin_nome_loja", None)
        return jsonify({"ok": True})

    @app.get("/api/admin/me")
    def api_admin_me():
        if not admin_logado():
            return jsonify({"logado": False})
        return jsonify(
            {
                "logado": True,
                "usuario": session["admin_usuario"],
                "nome_loja": session["admin_nome_loja"],
            }
        )

    @app.put("/api/admin/config")
    @login_admin_obrigatorio
    def api_admin_config():
        """Atualiza nome da loja e/ou senha do admin logado."""
        d = request.get_json(silent=True) or {}
        nome_loja = (d.get("nome_loja") or "").strip()
        nova_senha = d.get("nova_senha") or ""

        if nova_senha and len(nova_senha) < 4:
            return jsonify({"erro": "a nova senha deve ter pelo menos 4 caracteres"}), 400

        with get_conn() as con:
            if nome_loja:
                con.execute(
                    "UPDATE admins SET nome_loja=? WHERE id=?",
                    (nome_loja, session["admin_id"]),
                )
                session["admin_nome_loja"] = nome_loja
            if nova_senha:
                con.execute(
                    "UPDATE admins SET senha_hash=? WHERE id=?",
                    (generate_password_hash(nova_senha), session["admin_id"]),
                )

        return jsonify({"ok": True})

    # ------------------------------------------------------------------
    # PRODUTOS
    # ------------------------------------------------------------------

=======
    # PRODUTOS
    # ------------------------------------------------------------------
>>>>>>> 56f37798f742afa3fe8568c0af69938722492a6e
    @app.get("/api/produtos")
    def listar_produtos():
        with get_conn() as con:
            rows = con.execute(
                "SELECT * FROM produtos ORDER BY id DESC"
            ).fetchall()
        return jsonify([dict(r) for r in rows])

    @app.post("/api/produtos")
<<<<<<< HEAD
    @login_admin_obrigatorio
=======
>>>>>>> 56f37798f742afa3fe8568c0af69938722492a6e
    def criar_produto():
        d = request.get_json(silent=True) or {}
        nome = (d.get("nome") or "").strip()
        if not nome:
            return jsonify({"erro": "campo 'nome' é obrigatório"}), 400
        try:
            preco = float(d.get("preco"))
        except (TypeError, ValueError):
            return jsonify({"erro": "campo 'preco' deve ser numérico"}), 400

        categoria = (d.get("categoria") or "Outro").strip()
        estoque = int(d.get("estoque") or 0)
        estilo = (d.get("estilo") or "").strip()
        descricao = (d.get("descricao") or "").strip()

        with get_conn() as con:
            cur = con.execute(
                """
                INSERT INTO produtos (nome, categoria, preco, estoque, estilo, descricao, criado_em)
                VALUES (?, ?, ?, ?, ?, ?, ?)
                """,
                (nome, categoria, preco, estoque, estilo, descricao, agora()),
            )
            novo_id = cur.lastrowid
        return jsonify({"ok": True, "id": novo_id}), 201

    @app.put("/api/produtos/<int:produto_id>")
<<<<<<< HEAD
    @login_admin_obrigatorio
=======
>>>>>>> 56f37798f742afa3fe8568c0af69938722492a6e
    def atualizar_produto(produto_id: int):
        d = request.get_json(silent=True) or {}
        with get_conn() as con:
            existente = con.execute(
                "SELECT * FROM produtos WHERE id = ?", (produto_id,)
            ).fetchone()
            if not existente:
                return jsonify({"erro": "produto não encontrado"}), 404

            nome = (d.get("nome") or existente["nome"]).strip()
            categoria = (d.get("categoria") or existente["categoria"]).strip()
            try:
                preco = float(d.get("preco", existente["preco"]))
            except (TypeError, ValueError):
                return jsonify({"erro": "campo 'preco' deve ser numérico"}), 400
            estoque = int(d.get("estoque", existente["estoque"]) or 0)
            estilo = d.get("estilo", existente["estilo"])
            descricao = d.get("descricao", existente["descricao"])

            con.execute(
                """
                UPDATE produtos
                   SET nome=?, categoria=?, preco=?, estoque=?, estilo=?, descricao=?
                 WHERE id=?
                """,
                (nome, categoria, preco, estoque, estilo, descricao, produto_id),
            )
        return jsonify({"ok": True})

    @app.delete("/api/produtos/<int:produto_id>")
<<<<<<< HEAD
    @login_admin_obrigatorio
=======
>>>>>>> 56f37798f742afa3fe8568c0af69938722492a6e
    def deletar_produto(produto_id: int):
        with get_conn() as con:
            cur = con.execute("DELETE FROM produtos WHERE id = ?", (produto_id,))
            if cur.rowcount == 0:
                return jsonify({"erro": "produto não encontrado"}), 404
        return jsonify({"ok": True})

    # ------------------------------------------------------------------
    # COMPRAS
    # ------------------------------------------------------------------
    @app.get("/api/compras")
<<<<<<< HEAD
    @login_admin_obrigatorio
=======
>>>>>>> 56f37798f742afa3fe8568c0af69938722492a6e
    def listar_compras():
        with get_conn() as con:
            rows = con.execute(
                "SELECT * FROM compras ORDER BY id DESC"
            ).fetchall()
        return jsonify([dict(r) for r in rows])

    @app.post("/api/compras")
    def criar_compra():
        d = request.get_json(silent=True) or {}
<<<<<<< HEAD

        usuario_id = session.get("usuario_id")

        # Se há usuário logado no site, a compra é dele de verdade (nome e
        # email reais, vindos da sessão) — o front não pode mais "inventar"
        # outro nome/email no body para uma compra autenticada.
        if usuario_id:
            cliente_nome = session.get("usuario_nome") or ""
            cliente_email = session.get("usuario_email") or ""
        else:
            cliente_nome = (d.get("cliente_nome") or d.get("nome") or "Cliente Site").strip()
            cliente_email = (d.get("cliente_email") or "").strip()

        produto_nome = (d.get("produto_nome") or d.get("produto") or "").strip()
=======
        cliente_nome = (d.get("cliente_nome") or d.get("nome") or "").strip()
        produto_nome = (d.get("produto_nome") or d.get("produto") or "").strip()

        if not cliente_nome:
            return jsonify({"erro": "campo 'cliente_nome' é obrigatório"}), 400
>>>>>>> 56f37798f742afa3fe8568c0af69938722492a6e
        if not produto_nome:
            return jsonify({"erro": "campo 'produto_nome' é obrigatório"}), 400

        try:
            total = float(d.get("total", d.get("preco")))
        except (TypeError, ValueError):
            return jsonify({"erro": "campo 'total' deve ser numérico"}), 400

<<<<<<< HEAD
=======
        cliente_email = (d.get("cliente_email") or "").strip()
>>>>>>> 56f37798f742afa3fe8568c0af69938722492a6e
        quantidade = int(d.get("quantidade") or 1)

        with get_conn() as con:
            cur = con.execute(
                """
                INSERT INTO compras
<<<<<<< HEAD
                    (cliente_nome, cliente_email, produto_nome, quantidade, total, status, criado_em, usuario_id)
                VALUES (?, ?, ?, ?, ?, 'pendente', ?, ?)
                """,
                (cliente_nome, cliente_email, produto_nome, quantidade, total, agora(), usuario_id),
=======
                    (cliente_nome, cliente_email, produto_nome, quantidade, total, status, criado_em)
                VALUES (?, ?, ?, ?, ?, 'pendente', ?)
                """,
                (cliente_nome, cliente_email, produto_nome, quantidade, total, agora()),
>>>>>>> 56f37798f742afa3fe8568c0af69938722492a6e
            )
            novo_id = cur.lastrowid
        return jsonify({"ok": True, "id": novo_id}), 201

    @app.put("/api/compras/<int:compra_id>/status")
<<<<<<< HEAD
    @login_admin_obrigatorio
=======
>>>>>>> 56f37798f742afa3fe8568c0af69938722492a6e
    def atualizar_status_compra(compra_id: int):
        d = request.get_json(silent=True) or {}
        status_novo = (d.get("status") or "").strip()
        if status_novo not in ("pendente", "pago", "cancelado"):
            return jsonify({"erro": "status inválido"}), 400

        with get_conn() as con:
            cur = con.execute(
                "UPDATE compras SET status=? WHERE id=?", (status_novo, compra_id)
            )
            if cur.rowcount == 0:
                return jsonify({"erro": "compra não encontrada"}), 404
        return jsonify({"ok": True})

    # ------------------------------------------------------------------
    # CANDIDATOS
    # ------------------------------------------------------------------
    @app.get("/api/candidatos")
<<<<<<< HEAD
    @login_admin_obrigatorio
=======
>>>>>>> 56f37798f742afa3fe8568c0af69938722492a6e
    def listar_candidatos():
        with get_conn() as con:
            rows = con.execute(
                "SELECT * FROM candidatos ORDER BY id DESC"
            ).fetchall()
        return jsonify([dict(r) for r in rows])

    @app.post("/api/candidatos")
    def criar_candidato():
        d = request.get_json(silent=True) or {}
        nome = (d.get("nome") or "").strip()
        email = (d.get("email") or "").strip()
        if not nome:
            return jsonify({"erro": "campo 'nome' é obrigatório"}), 400
        if not email:
            return jsonify({"erro": "campo 'email' é obrigatório"}), 400

        data_nasc = (d.get("data_nasc") or "").strip()

        with get_conn() as con:
            cur = con.execute(
                """
                INSERT INTO candidatos (nome, email, data_nasc, criado_em)
                VALUES (?, ?, ?, ?)
                """,
                (nome, email, data_nasc, agora()),
            )
            novo_id = cur.lastrowid
        return jsonify({"ok": True, "id": novo_id}), 201

    # ------------------------------------------------------------------
    # DASHBOARD
    # ------------------------------------------------------------------
    @app.get("/api/dashboard")
<<<<<<< HEAD
    @login_admin_obrigatorio
=======
>>>>>>> 56f37798f742afa3fe8568c0af69938722492a6e
    def dashboard():
        with get_conn() as con:
            produtos = con.execute("SELECT * FROM produtos").fetchall()
            compras = con.execute("SELECT * FROM compras").fetchall()
            candidatos = con.execute("SELECT * FROM candidatos").fetchall()
<<<<<<< HEAD
            total_usuarios = con.execute("SELECT COUNT(*) AS c FROM usuarios").fetchone()["c"]
=======
>>>>>>> 56f37798f742afa3fe8568c0af69938722492a6e

        total_produtos = len(produtos)
        total_estoque = sum(int(p["estoque"]) for p in produtos)
        valor_estoque = sum(float(p["preco"]) * int(p["estoque"]) for p in produtos)
        estoque_baixo = [
            {"nome": p["nome"], "categoria": p["categoria"], "estoque": p["estoque"]}
            for p in produtos
            if int(p["estoque"]) <= 3
        ]

        total_compras = len(compras)
<<<<<<< HEAD

        # Quantas pessoas diferentes já compraram (clientes únicos, pelo
        # email quando existe; senão pelo nome) — métrica pedida para o
        # dashboard do admin ("quantas pessoas fizeram seu pedido").
        chaves_clientes = {
            (c["cliente_email"] or c["cliente_nome"]).strip().lower()
            for c in compras
            if (c["cliente_email"] or c["cliente_nome"])
        }
        total_clientes = len(chaves_clientes)

        # Total de unidades (ex: camisas) já compradas, somando a
        # quantidade de cada pedido — métrica pedida ("o tanto de camisas
        # que foram compradas").
        total_itens_comprados = sum(int(c["quantidade"]) for c in compras)

=======
>>>>>>> 56f37798f742afa3fe8568c0af69938722492a6e
        receita_total = sum(
            float(c["total"]) for c in compras if c["status"] == "pago"
        )

        total_candidatos = len(candidatos)

        return jsonify(
            {
                "total_produtos": total_produtos,
                "total_estoque": total_estoque,
                "valor_estoque": valor_estoque,
                "estoque_baixo": estoque_baixo,
                "total_compras": total_compras,
<<<<<<< HEAD
                "total_itens_comprados": total_itens_comprados,
                "total_clientes": total_clientes,
                "receita_total": receita_total,
                "total_candidatos": total_candidatos,
                "total_usuarios": total_usuarios,
=======
                "receita_total": receita_total,
                "total_candidatos": total_candidatos,
>>>>>>> 56f37798f742afa3fe8568c0af69938722492a6e
            }
        )

    return app


app = criar_app()

if __name__ == "__main__":
    # Local: http://127.0.0.1:5000
    # No Railway, o PORT é injetado via variável de ambiente.
    port = int(os.environ.get("PORT", 5000))
    debug = os.environ.get("FLASK_DEBUG", "0") == "1"
    app.run(host="0.0.0.0", port=port, debug=debug)
