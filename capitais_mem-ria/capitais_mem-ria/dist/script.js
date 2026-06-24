const telaInicial = document.getElementById("telaInicial");
const telaJogo = document.getElementById("telaJogo");
const btnIniciar = document.getElementById("btnIniciar");
const btnReiniciar = document.getElementById("btnReiniciar");
const btnJogarNovamente = document.getElementById("btnJogarNovamente");
const tabuleiro = document.getElementById("tabuleiro");
const tentativasTexto = document.getElementById("tentativas");
const mensagemVitoria = document.getElementById("mensagemVitoria");
const resultadoTentativas = document.getElementById("resultadoTentativas");

let primeiraCarta = null;
let segundaCarta = null;
let bloquearCartas = false;
let tentativas = 0;
let paresEncontrados = 0;

// Seleção de 8 pares representativos de Estados e Capitais
const listaPares = [
    { id: 1, estado: "Amazonas", capital: "Manaus" },
    { id: 2, estado: "Bahia", capital: "Salvador" },
    { id: 3, estado: "Ceará", capital: "Fortaleza" },
    { id: 4, estado: "Minas Gerais", capital: "Belo Horizonte" },
    { id: 5, estado: "Pará", capital: "Belém" },
    { id: 6, estado: "Paraná", capital: "Curitiba" },
    { id: 7, estado: "Pernambuco", capital: "Recife" },
    { id: 8, estado: "Rio de Janeiro", capital: "Rio de Janeiro" }
];

btnIniciar.addEventListener("click", iniciarJogo);
btnReiniciar.addEventListener("click", reiniciarJogo);
btnJogarNovamente.addEventListener("click", reiniciarJogo);

function iniciarJogo() {
    telaInicial.classList.add("oculto");
    telaJogo.classList.remove("oculto");
    prepararJogo();
}

function reiniciarJogo() {
    primeiraCarta = null;
    segundaCarta = null;
    bloquearCartas = false;
    tentativas = 0;
    paresEncontrados = 0;
    tentativasTexto.textContent = tentativas;
    resultadoTentativas.textContent = tentativas;
    mensagemVitoria.classList.add("oculto");
    prepararJogo();
}

function prepararJogo() {
    tabuleiro.innerHTML = "";
    const cartasOtimizadas = [];
    
    listaPares.forEach(par => {
        cartasOtimizadas.push({ parId: par.id, texto: par.estado, tipo: "Estado" });
        cartasOtimizadas.push({ parId: par.id, texto: par.capital, tipo: "Capital" });
    });

    const cartasEmbaralhadas = embaralharCartas(cartasOtimizadas);
    
    cartasEmbaralhadas.forEach((carta) => {
        const elementoCarta = criarCarta(carta);
        tabuleiro.appendChild(elementoCarta);
    });
}

function embaralharCartas(cartas) {
    return cartas.sort(() => Math.random() - 0.5);
}

function criarCarta(carta) {
    const divCarta = document.createElement("div");
    divCarta.classList.add("carta");
    divCarta.dataset.parId = carta.parId;
    
    // Vetor com o contorno lateral estilizado do mapa do Brasil (Substitui o antigo '?')
    const svgBrasil = `
        <svg class="mapa-brasil" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <path d="M25,25 C15,35 12,45 20,55 C25,62 38,58 42,68 C45,75 38,85 46,90 C52,95 58,88 65,85 C75,82 82,72 80,60 C78,48 88,38 82,28 C76,20 62,25 55,18 C48,12 38,10 32,15 Z" />
        </svg>
    `;
    
    divCarta.innerHTML = `
        <div class="conteudo-carta">
            <div class="face frente">
                ${svgBrasil}
            </div>
            <div class="face verso">
                <span class="tipo">${carta.tipo}</span>
                <span class="texto">${carta.texto}</span>
            </div>
        </div>
    `;
    
    divCarta.addEventListener("click", virarCarta);
    return divCarta;
}

function virarCarta() {
    if (bloquearCartas) return;
    if (this === primeiraCarta) return;
    if (this.classList.contains("encontrada")) return;

    this.classList.add("virada");

    if (!primeiraCarta) {
        primeiraCarta = this;
        return;
    }

    segundaCarta = this;
    tentativas++;
    tentativasTexto.textContent = tentativas;

    verificarPar();
}

function verificarPar() {
    const idPrimeira = primeiraCarta.dataset.parId;
    const idSegunda = segundaCarta.dataset.parId;

    if (idPrimeira === idSegunda) {
        marcarParEncontrado();
    } else {
        desvirarCartas();
    }
}

function marcarParEncontrado() {
    primeiraCarta.classList.add("encontrada");
    segundaCarta.classList.add("encontrada");
    
    paresEncontrados++;
    limparSelecao();

    if (paresEncontrados === listaPares.length) {
        mostrarVitoria();
    }
}

function desvirarCartas() {
    bloquearCartas = true;
    setTimeout(() => {
        primeiraCarta.classList.remove("virada");
        segundaCarta.classList.remove("virada");
        limparSelecao();
    }, 1000);
}

function limparSelecao() {
    primeiraCarta = null;
    segundaCarta = null;
    bloquearCartas = false;
}

function mostrarVitoria() {
    setTimeout(() => {
        resultadoTentativas.textContent = tentativas;
        mensagemVitoria.classList.remove("oculto");
    }, 600);
}