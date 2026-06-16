"""
Backend Flask da loja A/R.

Responsabilidades:
  - Servir o frontend (templates HTML + arquivos estáticos: css/js/img).
  - Expor a API REST em /api/* usada pelo site e pelo painel admin.
  - Persistir os dados em SQLite (arquivo banco.db).

Rotas de página:
  GET /            -> index.html
  GET /sobre       -> sobre.html
  GET /loja        -> loja.html
  GET /admin       -> admin.html (painel administrativo)

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
"""

from __future__ import annotations

import os
import sqlite3
from datetime import datetime

from flask import Flask, jsonify, request, render_template
from flask_cors import CORS

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# No Railway, monte um Volume e aponte DB_DIR para ele (ex: /data) para
# persistir o banco entre deploys. Sem volume, o SQLite vive no filesystem
# efêmero do container e é resetado a cada novo deploy.
DB_DIR = os.environ.get("DB_DIR", BASE_DIR)
DB_PATH = os.path.join(DB_DIR, "banco.db")


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
                criado_em TEXT NOT NULL
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

        con.commit()


def agora() -> str:
    return datetime.now().strftime("%d/%m/%Y %H:%M")


def criar_app() -> Flask:
    app = Flask(__name__)
    CORS(app)  # permite chamadas do frontend via fetch, inclusive de outro domínio

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

    @app.get("/status")
    def status():
        # Endpoint simples de health-check (ex: Railway healthcheck)
        return jsonify({"status": "ok", "app": "A/R backend"})

    # ------------------------------------------------------------------
    # PRODUTOS
    # ------------------------------------------------------------------
    @app.get("/api/produtos")
    def listar_produtos():
        with get_conn() as con:
            rows = con.execute(
                "SELECT * FROM produtos ORDER BY id DESC"
            ).fetchall()
        return jsonify([dict(r) for r in rows])

    @app.post("/api/produtos")
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
    def listar_compras():
        with get_conn() as con:
            rows = con.execute(
                "SELECT * FROM compras ORDER BY id DESC"
            ).fetchall()
        return jsonify([dict(r) for r in rows])

    @app.post("/api/compras")
    def criar_compra():
        d = request.get_json(silent=True) or {}
        cliente_nome = (d.get("cliente_nome") or d.get("nome") or "").strip()
        produto_nome = (d.get("produto_nome") or d.get("produto") or "").strip()

        if not cliente_nome:
            return jsonify({"erro": "campo 'cliente_nome' é obrigatório"}), 400
        if not produto_nome:
            return jsonify({"erro": "campo 'produto_nome' é obrigatório"}), 400

        try:
            total = float(d.get("total", d.get("preco")))
        except (TypeError, ValueError):
            return jsonify({"erro": "campo 'total' deve ser numérico"}), 400

        cliente_email = (d.get("cliente_email") or "").strip()
        quantidade = int(d.get("quantidade") or 1)

        with get_conn() as con:
            cur = con.execute(
                """
                INSERT INTO compras
                    (cliente_nome, cliente_email, produto_nome, quantidade, total, status, criado_em)
                VALUES (?, ?, ?, ?, ?, 'pendente', ?)
                """,
                (cliente_nome, cliente_email, produto_nome, quantidade, total, agora()),
            )
            novo_id = cur.lastrowid
        return jsonify({"ok": True, "id": novo_id}), 201

    @app.put("/api/compras/<int:compra_id>/status")
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
    def dashboard():
        with get_conn() as con:
            produtos = con.execute("SELECT * FROM produtos").fetchall()
            compras = con.execute("SELECT * FROM compras").fetchall()
            candidatos = con.execute("SELECT * FROM candidatos").fetchall()

        total_produtos = len(produtos)
        total_estoque = sum(int(p["estoque"]) for p in produtos)
        valor_estoque = sum(float(p["preco"]) * int(p["estoque"]) for p in produtos)
        estoque_baixo = [
            {"nome": p["nome"], "categoria": p["categoria"], "estoque": p["estoque"]}
            for p in produtos
            if int(p["estoque"]) <= 3
        ]

        total_compras = len(compras)
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
                "receita_total": receita_total,
                "total_candidatos": total_candidatos,
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
