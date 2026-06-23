const botoesCategoria = document.querySelectorAll(".categorias-lista button");
const posts = document.querySelectorAll(".post-card");
const linksPost = document.querySelectorAll(".link-post");
const botaoDestaque = document.querySelector(".btn-ler");

/* FILTRO DE CATEGORIAS */

botoesCategoria.forEach((botao) => {
    botao.addEventListener("click", () => {
        botoesCategoria.forEach((btn) => {
            btn.classList.remove("ativo");
        });

        botao.classList.add("ativo");

        const categoriaSelecionada = botao.textContent.trim().toLowerCase();

        posts.forEach((post) => {
            const categoriaPost = post.querySelector(".categoria").textContent.trim().toLowerCase();

            if (categoriaSelecionada === "todos" || categoriaSelecionada === categoriaPost) {
                post.classList.remove("oculto");
            } else {
                post.classList.add("oculto");
            }
        });
    });
});

/* MODAL DO BLOG */

const modalBlog = document.createElement("div");
modalBlog.classList.add("modal-blog");

modalBlog.innerHTML = `
    <div class="modal-blog-box">
        <button class="fechar-modal-blog" type="button">&times;</button>
        <img id="modalBlogImg" src="" alt="Imagem da publicação">
        <span id="modalBlogCategoria" class="categoria"></span>
        <h2 id="modalBlogTitulo"></h2>
        <p id="modalBlogTexto"></p>
    </div>
`;

document.body.appendChild(modalBlog);

const fecharModalBlog = document.querySelector(".fechar-modal-blog");
const modalBlogImg = document.getElementById("modalBlogImg");
const modalBlogCategoria = document.getElementById("modalBlogCategoria");
const modalBlogTitulo = document.getElementById("modalBlogTitulo");
const modalBlogTexto = document.getElementById("modalBlogTexto");

function abrirModalBlog(card) {
    const imagem = card.querySelector("img").src;
    const categoria = card.querySelector(".categoria").textContent;
    const titulo = card.querySelector("h2").textContent;
    const texto = card.querySelector("p").textContent;

    modalBlogImg.src = imagem;
    modalBlogCategoria.textContent = categoria;
    modalBlogTitulo.textContent = titulo;
    modalBlogTexto.textContent = texto + " Essa publicação faz parte do blog da loja A/R, criado para mostrar novidades, bastidores e ideias da marca.";

    modalBlog.classList.add("ativo");
}

linksPost.forEach((link) => {
    link.addEventListener("click", (event) => {
        event.preventDefault();

        const card = link.closest(".post-card");
        abrirModalBlog(card);
    });
});

if (botaoDestaque) {
    botaoDestaque.addEventListener("click", (event) => {
        event.preventDefault();

        const destaque = document.querySelector(".post-destaque");

        const imagem = destaque.querySelector("img").src;
        const categoria = destaque.querySelector(".categoria").textContent;
        const titulo = destaque.querySelector("h2").textContent;
        const texto = destaque.querySelector("p").textContent;

        modalBlogImg.src = imagem;
        modalBlogCategoria.textContent = categoria;
        modalBlogTitulo.textContent = titulo;
        modalBlogTexto.textContent = texto + " Essa publicação apresenta melhor a identidade da loja A/R e o início da marca.";

        modalBlog.classList.add("ativo");
    });
}

fecharModalBlog.addEventListener("click", () => {
    modalBlog.classList.remove("ativo");
});

modalBlog.addEventListener("click", (event) => {
    if (event.target === modalBlog) {
        modalBlog.classList.remove("ativo");
    }
});