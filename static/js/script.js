// ===== MODAL ZOOM =====
const zoom = document.getElementById('zoom');
const zoomImg = document.getElementById('zoomImg');
const zoomTitle = document.getElementById('zoomTitle');
const zoomDesc = document.getElementById('zoomDesc');
const zoomPrice = document.getElementById('zoomPrice');
const closeZoom = document.getElementById('closeZoom');

document.querySelectorAll('.produto').forEach(produto => {

    // Abrir zoom ao clicar no card (mas não no botão comprar)
    produto.addEventListener('click', function(e) {
        if (e.target.classList.contains('btn-comprar')) return;

        zoomImg.src = this.dataset.img;
        zoomTitle.textContent = this.dataset.title;
        zoomDesc.textContent = this.dataset.desc;
        zoomPrice.textContent = this.dataset.price;
        zoom.classList.add('ativo');
    });
});

closeZoom.addEventListener('click', () => zoom.classList.remove('ativo'));
zoom.addEventListener('click', (e) => { if (e.target === zoom) zoom.classList.remove('ativo'); });

// ===== BOTÃO COMPRAR =====
// API fica no mesmo domínio (backend Flask serve o front), então usamos caminho relativo
const API_BASE = '/api';

document.querySelectorAll('.btn-comprar').forEach(btn => {
    btn.addEventListener('click', async function(e) {
        e.stopPropagation(); // não abre o zoom

        const produto = this.closest('.produto');
        const nome = produto.dataset.title;
        const precoTexto = produto.dataset.price || 'R$ 0';
        const preco = parseFloat(
            precoTexto.replace('R$', '').trim().replace('.', '').replace(',', '.')
        ) || 0;

        // Já comprado? Ignora
        if (this.classList.contains('comprado')) return;

        // Muda visual do botão
        this.classList.add('comprado');
        this.textContent = '✅ Comprado!';

        // Registra a compra no backend (rota /api/compras).
        // Se o cliente estiver logado (sessão ativa em /cadastro), o
        // backend usa o nome/email reais da conta automaticamente —
        // os valores abaixo só são usados quando não há login.
        try {
            await fetch(API_BASE + '/compras', {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    cliente_nome: 'Cliente Site',
                    cliente_email: 'visitante@site.com',
                    produto_nome: nome,
                    quantidade: 1,
                    total: preco
                })
            });
        } catch (err) {
            console.error('Erro ao registrar compra:', err);
        }

        // Cria notificação
        mostrarNotificacao(nome);

        // Volta ao normal depois de 3s
        setTimeout(() => {
            this.classList.remove('comprado');
            this.textContent = ' Comprar Agora';
        }, 3000);
    });
});

// ===== NOTIFICAÇÃO =====
function mostrarNotificacao(nome) {
    // Remove notificação anterior se existir
    const antiga = document.querySelector('.notificacao');
    if (antiga) antiga.remove();

    const notif = document.createElement('div');
    notif.classList.add('notificacao');
    notif.innerHTML = `
        <span class="notif-icon">✅</span>
        <div>
            <strong>${nome}</strong>
            <p>adicionado ao pedido!</p>
        </div>
    `;
    document.body.appendChild(notif);

    // Aparece
    setTimeout(() => notif.classList.add('visivel'), 50);

    // Some após 3s
    setTimeout(() => {
        notif.classList.remove('visivel');
        setTimeout(() => notif.remove(), 400);
    }, 3000);
}
