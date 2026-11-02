
"use strict";

/* =========================================================
   PIZZARIA AW — CARDÁPIO ITALIANO ARTESANAL
   Sistema demonstrativo de cardápio e pedidos
   ========================================================= */


/* =========================================================
   PRODUTOS
   ========================================================= */

const menuData = {
    pizzas: [
        {
            name: "Mussarela",
            price: 30,
            desc: "Molho de tomate, mussarela e orégano.",
            image: "pizza.jpg"
        },
        {
            name: "Calabresa",
            price: 32,
            desc: "Calabresa fatiada, cebola e orégano.",
            image: "pizzas.jpg"
        },
        {
            name: "Margherita",
            price: 35,
            desc: "Mussarela, tomate fatiado e manjericão.",
            image: "pizza variadas.jpg"
        },
        {
            name: "Portuguesa",
            price: 38,
            desc: "Presunto, ovos, cebola, ervilha e mussarela.",
            image: "portuguesa.jpg"
        },
        {
            name: "Frango c/ Catupiry",
            price: 38,
            desc: "Frango desfiado com Catupiry original.",
            image: "pizzas1.jpg"
        },
        {
            name: "Napolitana",
            price: 36,
            desc: "Mussarela, tomate e parmesão ralado.",
            image: "pizza.jpg"
        },
        {
            name: "Bacon",
            price: 39,
            desc: "Mussarela e fatias de bacon crocante.",
            image: "pizzas.jpg"
        },
        {
            name: "Quatro Queijos",
            price: 42,
            desc: "Mussarela, provolone, parmesão e gorgonzola.",
            image: "pizza variadas.jpg"
        },
        {
            name: "Pepperoni",
            price: 45,
            desc: "Mussarela e fatias de pepperoni premium.",
            image: "pizzas1.jpg"
        },
        {
            name: "Camarão",
            price: 60,
            desc: "Camarão ao molho especial e Catupiry.",
            image: "camarao.jpg"
        },
        {
            name: "Rúcula c/ Tomate Seco",
            price: 45,
            desc: "Mussarela, rúcula e tomate seco artesanal.",
            image: "rucula.jpg"
        },
        {
            name: "Abobrinha",
            price: 38,
            desc: "Abobrinha grelhada, parmesão e alho frito.",
            image: "pizza variadas.jpg"
        }
    ],

    doces: [
        {
            name: "Chocolate com Morango",
            price: 40,
            desc: "Chocolate ao leite e morangos frescos.",
            image: "pizza.jpg"
        },
        {
            name: "Romeu e Julieta",
            price: 35,
            desc: "Mussarela e goiabada cremosa.",
            image: "pizzas.jpg"
        },
        {
            name: "Prestígio",
            price: 38,
            desc: "Chocolate e coco ralado.",
            image: "pizza variadas.jpg"
        }
    ],

    bebidas: [
        {
            name: "Coca-Cola 2L",
            price: 14,
            desc: "Refrigerante original para compartilhar.",
            image: "bebidas/coca-cola-2l.avif"
        },
        {
            name: "Guaraná Antarctica 2L",
            price: 12,
            desc: "O sabor brasileiro que combina com pizza.",
            image: "bebidas/guarana-2l.avif"
        },
        {
            name: "Suco de Laranja 500ml",
            price: 10,
            desc: "Uma opção cítrica para acompanhar seu pedido.",
            image: "bebidas/suco-laranja.jpg"
        },
        {
            name: "Água Mineral 500ml",
            price: 5,
            desc: "Uma opção leve e refrescante.",
            image: "bebidas/agua-mineral.avif"
        },
        {
            name: "Cerveja em Lata 350ml",
            price: 7,
            desc: "Cerveja em lata, servida bem gelada.",
            image: "bebidas/cerveja-lata.webp"
        },
        {
            name: "Cerveja Long Neck 330ml",
            price: 9,
            desc: "Garrafa long neck para acompanhar sua pizza.",
            image: "bebidas/cerveja-long-neck.webp"
        }
    ]
};


/* =========================================================
   CONFIGURAÇÕES E ESTADO
   ========================================================= */

let cart = [];
let carouselTimer = null;

const formatPrice = (value) =>
    value.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

const imagePath = (filename) =>
    `assets/img/${filename
        .split("/")
        .map(encodeURIComponent)
        .join("/")}`;


/* =========================================================
   INICIALIZAÇÃO
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    renderMenu();
    startCarousel();
    setupSearch();
    setupCheckout();
    setupPayment();
    setupSocialLinks();
    updateCart();
});


/* =========================================================
   RENDERIZAÇÃO DO CARDÁPIO
   ========================================================= */

function renderMenu() {
    const container = document.getElementById("menu-container");

    if (!container) return;

    const categories = [
        {
            key: "pizzas",
            title: "Pizzas Salgadas",
            subtitle: "Receitas clássicas para compartilhar",
            icon: "fa-pizza-slice"
        },
        {
            key: "doces",
            title: "Pizzas Doces",
            subtitle: "Um toque doce para terminar bem",
            icon: "fa-heart"
        },
        {
            key: "bebidas",
            title: "Bebidas",
            subtitle: "Para acompanhar seu pedido",
            icon: "fa-glass-water"
        }
    ];

    container.innerHTML = categories.map((category) => {
        const products = menuData[category.key];

        return `
            <section
                class="menu-category"
                aria-labelledby="heading-${category.key}"
            >
                <div class="category-intro">
                    <span class="category-kicker">
                        <i
                            class="fas ${category.icon}"
                            aria-hidden="true"
                        ></i>
                        FEITO COM CARINHO
                    </span>

                    <h2
                        class="category-title"
                        id="heading-${category.key}"
                    >
                        ${category.title}
                    </h2>

                    <p>${category.subtitle}</p>
                </div>

                <div class="menu-grid">
                    ${products.map((product, index) => {
                        if (category.key === "bebidas") {
                            return createDrinkCard(product, index);
                        }

                        return createPizzaCard(
                            product,
                            index,
                            category.key
                        );
                    }).join("")}
                </div>
            </section>
        `;
    }).join("");
}


/* =========================================================
   CARD DE PIZZA
   ========================================================= */

function createPizzaCard(product, index, category) {
    const productId = `${category}-${index}`;
    const image = imagePath(product.image);

    const flavorOptions = menuData[category]
        .map((flavor, flavorIndex) => `
            <option
                value="${flavorIndex}"
                ${flavorIndex === index ? "selected" : ""}
            >
                ${flavor.name}
            </option>
        `)
        .join("");

    return `
        <article
            class="menu-card item-card"
            data-name="${product.name.toLocaleLowerCase("pt-BR")}"
        >
            <div class="product-image-wrap">
                <img
                    class="product-image"
                    src="${image}"
                    alt="Pizza ${product.name}"
                    loading="lazy"
                    onerror="this.style.display='none'"
                >

                <span class="product-tag">
                    ${category === "doces" ? "Pizzas doces" : "Da casa"}
                </span>
            </div>

            <div class="item-card-content">
                <div class="item-header">
                    <h3>${product.name}</h3>

                    <strong class="price-tag">
                        ${formatPrice(product.price)}
                    </strong>
                </div>

                <p class="item-desc">${product.desc}</p>

                <div class="half-box">
                    <label for="is-half-${productId}">
                        <input
                            type="checkbox"
                            id="is-half-${productId}"
                            onchange="toggleHalf('${productId}')"
                        >
                        <span>Quero meio a meio</span>
                    </label>

                    <select
                        id="second-flavor-${productId}"
                        aria-label="Escolha o segundo sabor"
                        style="display: none"
                    >
                        ${flavorOptions}
                    </select>
                </div>

                <button
                    type="button"
                    class="btn-add"
                    onclick="addPizzaToCart(
                        '${productId}',
                        '${category}',
                        ${index}
                    )"
                >
                    <i class="fas fa-plus" aria-hidden="true"></i>
                    Adicionar ao pedido
                </button>
            </div>
        </article>
    `;
}


/* =========================================================
   CARD DE BEBIDA COM IMAGEM
   ========================================================= */

function createDrinkCard(product, index) {
    const image = imagePath(product.image);

    return `
        <article
            class="menu-card item-card drink-card"
            data-name="${product.name.toLocaleLowerCase("pt-BR")}"
        >
            <div class="drink-image-wrap">
                <img
                    class="drink-product-image"
                    src="${image}"
                    alt="${product.name}"
                    loading="lazy"
                    onerror="this.style.display='none'"
                >

                <span class="product-tag">Para acompanhar</span>
            </div>

            <div class="item-card-content">
                <div class="item-header">
                    <h3>${product.name}</h3>

                    <strong class="price-tag">
                        ${formatPrice(product.price)}
                    </strong>
                </div>

                <p class="item-desc">${product.desc}</p>

                <button
                    type="button"
                    class="btn-add"
                    onclick="addSimpleToCart(${index})"
                >
                    <i class="fas fa-plus" aria-hidden="true"></i>
                    Adicionar ao pedido
                </button>
            </div>
        </article>
    `;
}


/* =========================================================
   PIZZAS MEIO A MEIO
   ========================================================= */

window.toggleHalf = (productId) => {
    const checkbox = document.getElementById(
        `is-half-${productId}`
    );

    const select = document.getElementById(
        `second-flavor-${productId}`
    );

    if (!checkbox || !select) return;

    select.style.display = checkbox.checked ? "block" : "none";
};

window.addPizzaToCart = (productId, category, index) => {
    const product = menuData[category]?.[index];

    if (!product) return;

    const checkbox = document.getElementById(
        `is-half-${productId}`
    );

    const select = document.getElementById(
        `second-flavor-${productId}`
    );

    let finalName = product.name;
    let finalPrice = product.price;

    if (checkbox?.checked) {
        const secondIndex = Number(select.value);
        const secondFlavor = menuData[category]?.[secondIndex];

        if (!secondFlavor) {
            alert("Selecione o segundo sabor.");
            return;
        }

        finalName = `½ ${product.name} / ½ ${secondFlavor.name}`;

        // O preço do meio a meio considera o sabor mais caro.
        finalPrice = Math.max(
            product.price,
            secondFlavor.price
        );
    }

    cart.push({
        name: finalName,
        price: finalPrice
    });

    updateCart();

    if (checkbox) {
        checkbox.checked = false;
    }

    if (select) {
        select.style.display = "none";
    }
};


/* =========================================================
   BEBIDAS E CARRINHO
   ========================================================= */

window.addSimpleToCart = (index) => {
    const product = menuData.bebidas[index];

    if (!product) return;

    cart.push({
        name: product.name,
        price: product.price
    });

    updateCart();
};

function updateCart() {
    const list = document.getElementById("order-list");
    const totalElement = document.getElementById("total-price");
    const countElement = document.getElementById("cart-count");

    if (!list || !totalElement || !countElement) return;

    if (cart.length === 0) {
        list.innerHTML = `
            <div class="empty-cart">
                <i
                    class="fas fa-basket-shopping"
                    aria-hidden="true"
                ></i>

                <p class="empty-text">Seu carrinho está vazio.</p>

                <span>Escolha suas delícias favoritas!</span>
            </div>
        `;
    } else {
        list.innerHTML = cart.map((item, index) => `
            <div class="cart-item">
                <div class="cart-item-info">
                    <span class="cart-item-name">${item.name}</span>
                    <strong>${formatPrice(item.price)}</strong>
                </div>

                <button
                    type="button"
                    class="remove-item"
                    aria-label="Remover ${item.name}"
                    onclick="removeItem(${index})"
                >
                    <i class="fas fa-trash" aria-hidden="true"></i>
                </button>
            </div>
        `).join("");
    }

    const total = cart.reduce(
        (sum, item) => sum + item.price,
        0
    );

    totalElement.textContent = formatPrice(total);
    countElement.textContent = cart.length;
}

window.removeItem = (index) => {
    if (
        !Number.isInteger(index) ||
        index < 0 ||
        index >= cart.length
    ) {
        return;
    }

    cart.splice(index, 1);
    updateCart();
};

window.clearCart = () => {
    if (cart.length === 0) return;

    if (confirm("Deseja realmente limpar seu pedido?")) {
        cart.length = 0;
        updateCart();
    }
};


/* =========================================================
   PAGAMENTO E TROCO
   ========================================================= */

function setupPayment() {
    const payment = document.getElementById("payment");

    if (!payment) return;

    payment.addEventListener("change", window.toggleTroco);

    window.toggleTroco();
}

window.toggleTroco = () => {
    const payment = document.getElementById("payment");
    const box = document.getElementById("troco-box");
    const input = document.getElementById("troco");

    if (!payment || !box || !input) return;

    const cashPayment = payment.value === "Dinheiro";

    box.style.display = cashPayment ? "block" : "none";

    input.required = false;

    if (!cashPayment) {
        input.value = "";
    }
};


/* =========================================================
   FINALIZAÇÃO DEMONSTRATIVA
   Não envia mensagens nem abre o WhatsApp.
   ========================================================= */

function setupCheckout() {
    const form = document.getElementById("checkout-form");

    if (!form) return;

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        if (cart.length === 0) {
            alert("Adicione pelo menos um item ao pedido.");
            return;
        }

        const nome = document
            .getElementById("client-name")
            .value.trim();

        const endereco = document
            .getElementById("address")
            .value.trim();

        const bairro = document
            .getElementById("neighborhood")
            .value.trim();

        const referencia = document
            .getElementById("reference")
            .value.trim();

        const pagamento = document
            .getElementById("payment")
            .value;

        const troco = document
            .getElementById("troco")
            .value.trim();

        // Guardamos o resumo antes de limpar o carrinho.
        const total = cart.reduce(
            (sum, item) => sum + item.price,
            0
        );

        const itens = cart
            .map(item => (
                `• ${item.name} — ${formatPrice(item.price)}`
            ))
            .join("\n");

        const mensagem = [
            "PEDIDO DEMONSTRATIVO — PIZZARIA AW",
            "",
            `Cliente: ${nome}`,
            `Endereço: ${endereco}, ${bairro}`,
            referencia ? `Referência: ${referencia}` : "",
            `Pagamento selecionado: ${pagamento}`,
            pagamento === "Dinheiro" && troco
                ? `Troco para: R$ ${troco}`
                : "",
            "",
            "ITENS DO PEDIDO",
            itens,
            "",
            `TOTAL: ${formatPrice(total)}`,
            "",
            "Simulação para demonstração do sistema.",
            "Nenhum pedido real foi enviado."
        ].filter(Boolean).join("\n");

        // A confirmação aparece antes de zerar o carrinho.
        alert(mensagem);

        // Limpa todos os itens e atualiza o total e o contador.
        cart.length = 0;
        updateCart();

        // Prepara o formulário para um novo teste.
        form.reset();

        // Atualiza a exibição do campo de troco.
        if (typeof window.toggleTroco === "function") {
            window.toggleTroco();
        }
    });
}


/* =========================================================
   REDES SOCIAIS DEMONSTRATIVAS
   ========================================================= */

function setupSocialLinks() {
    document
        .querySelectorAll(".footer-social a[data-social]")
        .forEach(link => {
            link.addEventListener("click", (event) => {
                event.preventDefault();

                const rede = link.dataset.social;

                alert(
                    `${rede} — Pizzaria AW\n\n` +
                    "Este link é demonstrativo e não está " +
                    "conectado a uma conta real."
                );
            });
        });
}


/* =========================================================
   BUSCA DE PRODUTOS
   ========================================================= */

function setupSearch() {
    const searchInput = document.getElementById("search-input");

    if (!searchInput) return;

    searchInput.addEventListener("input", (event) => {
        const term = event.target.value
            .trim()
            .toLocaleLowerCase("pt-BR");

        document.querySelectorAll(".item-card").forEach(card => {
            const name = card.dataset.name || "";

            const description =
                card.querySelector(".item-desc")?.textContent || "";

            const content = `${name} ${description}`
                .toLocaleLowerCase("pt-BR");

            card.style.display = content.includes(term)
                ? ""
                : "none";
        });

        document.querySelectorAll(".menu-category").forEach(section => {
            const visibleCards = [
                ...section.querySelectorAll(".item-card")
            ].some(card => card.style.display !== "none");

            section.style.display = visibleCards ? "" : "none";
        });
    });
}


/* =========================================================
   CARROSSEL DE IMAGENS
   ========================================================= */

function startCarousel() {
    const slides = [
        ...document.querySelectorAll(".slide")
    ];

    if (slides.length < 2) return;

    if (carouselTimer) {
        window.clearInterval(carouselTimer);
    }

    let current = slides.findIndex(slide =>
        slide.classList.contains("active")
    );

    if (current < 0) {
        current = 0;
    }

    slides.forEach((slide, index) => {
        slide.classList.toggle("active", index === current);
    });

    carouselTimer = window.setInterval(() => {
        slides[current].classList.remove("active");

        current = (current + 1) % slides.length;

        slides[current].classList.add("active");
    }, 4500);
}


/* =========================================================
   NAVEGAÇÃO SUAVE
   ========================================================= */

window.scrollToElement = (id) => {
    const element = document.getElementById(id);

    if (!element) return;

    element.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
};
