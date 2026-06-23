const produtos = document.querySelectorAll(".produto");
const zoom = document.getElementById("zoom");
const closeZoom = document.getElementById("closeZoom");

const zoomImg = document.getElementById("zoomImg");
const zoomTitle = document.getElementById("zoomTitle");
const zoomStatus = document.getElementById("zoomStatus");
const zoomDesc = document.getElementById("zoomDesc");
const zoomDetails = document.getElementById("zoomDetails");

produtos.forEach((produto) => {
    const botao = produto.querySelector(".btn-ver");

    botao.addEventListener("click", () => {
        const img = produto.getAttribute("data-img");
        const title = produto.getAttribute("data-title");
        const status = produto.getAttribute("data-status");
        const desc = produto.getAttribute("data-desc");
        const details = produto.getAttribute("data-details");

        zoomImg.src = img;
        zoomTitle.textContent = title;
        zoomStatus.textContent = status;
        zoomDesc.textContent = desc;
        zoomDetails.textContent = details;

        zoom.classList.add("ativo");
    });
});

closeZoom.addEventListener("click", () => {
    zoom.classList.remove("ativo");
});

zoom.addEventListener("click", (event) => {
    if (event.target === zoom) {
        zoom.classList.remove("ativo");
    }
});