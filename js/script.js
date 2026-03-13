/**
 * BANCO DE DADOS DO CARDÁPIO
 */
const menuData = {
    pizzas: [
        { name: "Margherita", price: 35.00 },
        { name: "Mussarela", price: 30.00 },
        { name: "Portuguesa", price: 38.00 },
        { name: "Frango com Catupiry", price: 36.00 },
        { name: "Pepperoni", price: 40.00 },
        { name: "Calabresa", price: 32.00 },
        { name: "Quatro Queijos", price: 42.00 },
        { name: "Vegetariana", price: 35.00 },
        { name: "Rúcula com Tomate Seco", price: 45.00 },
        { name: "Atum", price: 38.00 },
        { name: "Camarão", price: 60.00 },
        { name: "Palmito", price: 42.00 }
    ],
    bebidas: [
        { name: "Coca-Cola 2L", price: 14.00 },
        { name: "Refrigerante Lata", price: 6.00 },
        { name: "Suco Natural 500ml", price: 9.00 },
        { name: "Água Mineral", price: 4.00 },
        { name: "Cerveja Lata", price: 8.00 }
    ],
    sobremesas: [
        { name: "Pudim de Leite", price: 12.00 },
        { name: "Pizza de Chocolate (Broto)", price: 25.00 },
        { name: "Mousse de Maracujá", price: 10.00 }
    ]
};

// Configurações de Preço por Tamanho
const sizeModifiers = { "grande": 1.0, "media": 0.8, "broto": 0.6 };

/**
 * ESTADO DO CARRINHO
 */
let cart = JSON.parse(localStorage.getItem('pizzaria_aw_cart')) || [];

/**
 * INICIALIZAÇÃO AO CARREGAR A PÁGINA
 */
document.addEventListener('DOMContentLoaded', () => {
    renderMenu();
    updateCartUI();
    setupSearch();
    setupCarousel();
});

/**
 * RENDERIZAÇÃO DO CARDÁPIO
 */
function renderMenu() {
    const container = document.getElementById('menu-container');
    let html = '';

    // 1. SEÇÃO DE PIZZAS (Com Tamanhos e Meio a Meio)
    html += '<h2 class="category-title">🍕 Pizzas</h2><div class="menu-grid">';
    menuData.pizzas.forEach((pizza, index) => {
        html += `
            <div class="menu-card item-card" data-name="${pizza.name}">
                <div class="card-info">
                    <h4>${pizza.name}</h4>
                    <p class="base-price">A partir de R$ ${(pizza.price * 0.6).toFixed(2)}</p>
                    
                    <div class="pizza-options">
                        <label>Tamanho:</label>
                        <select id="size-${index}" class="option-select">
                            <option value="grande">Grande (8 fatias)</option>
                            <option value="media">Média (6 fatias)</option>
                            <option value="broto">Broto (4 fatias)</option>
                        </select>

                        <label class="half-check">
                            <input type="checkbox" onchange="toggleMeio(${index})" id="is-meio-${index}"> Meio a Meio?
                        </label>

                        <div id="meio-select-${index}" class="meio-container" style="display:none; margin-top:10px;">
                            <label>2º Sabor:</label>
                            <select id="sabor2-${index}" class="option-select">
                                <option value="">Escolha o outro sabor...</option>
                                ${menuData.pizzas.map(p => `<option value="${p.name}">${p.name}</option>`).join('')}
                            </select>
                        </div>
                    </div>
                    
                    <button class="add-btn" onclick="addToCartPizza(${index})">
                        <i class="fas fa-plus"></i> ADICIONAR
                    </button>
                </div>
            </div>`;
    });
    html += '</div>';

    // 2. SEÇÃO DE BEBIDAS E SOBREMESAS (Simples)
    const categoriasSimples = [
        { titulo: "🥤 Bebidas", dados: menuData.bebidas },
        { titulo: "🍰 Sobremesas", dados: menuData.sobremesas }
    ];

    categoriasSimples.forEach(cat => {
        html += `<h2 class="category-title">${cat.titulo}</h2><div class="menu-grid">`;
        cat.dados.forEach(item => {
            html += `
                <div class="menu-card item-card" data-name="${item.name}">
                    <div class="card-info">
                        <h4>${item.name}</h4>
                        <p>R$ ${item.price.toFixed(2)}</p>
                        <button class="add-btn" onclick="addToCartSimple('${item.name}', ${item.price})">
                            <i class="fas fa-plus"></i> ADICIONAR
                        </button>
                    </div>
                </div>`;
        });
        html += '</div>';
    });

    container.innerHTML = html;
}

/**
 * LÓGICA DE INTERAÇÃO
 */
window.toggleMeio = (idx) => {
    const isChecked = document.getElementById(`is-meio-${idx}`).checked;
    document.getElementById(`meio-select-${idx}`).style.display = isChecked ? 'block' : 'none';
};

window.addToCartPizza = (idx) => {
    const p1 = menuData.pizzas[idx];
    const size = document.getElementById(`size-${idx}`).value;
    const isMeio = document.getElementById(`is-meio-${idx}`).checked;
    const sabor2Name = document.getElementById(`sabor2-${idx}`).value;

    let price = p1.price * sizeModifiers[size];
    let name = `Pizza ${p1.name} (${size})`;

    if (isMeio && sabor2Name) {
        const p2 = menuData.pizzas.find(p => p.name === sabor2Name);
        const price2 = p2.price * sizeModifiers[size];
        // Regra: Cobra o sabor de maior valor
        price = Math.max(price, price2);
        name = `Meio ${p1.name} / ${sabor2Name} (${size})`;
    }

    cart.push({ id: Date.now() + Math.random(), name, price });
    updateCartUI();
};

window.addToCartSimple = (name, price) => {
    cart.push({ id: Date.now() + Math.random(), name, price });
    updateCartUI();
};

/**
 * ATUALIZAÇÃO DA INTERFACE E LOCALSTORAGE
 */
function updateCartUI() {
    const list = document.getElementById('order-list');
    const count = document.getElementById('cart-count');
    const totalDisplay = document.getElementById('total-price');

    if (cart.length === 0) {
        list.innerHTML = '<p style="text-align: center; color: #999; padding: 20px;">Seu carrinho está vazio.</p>';
        count.innerText = '0';
        totalDisplay.innerText = 'R$ 0,00';
    } else {
        list.innerHTML = cart.map(item => `
            <div class="cart-item">
                <span>${item.name}</span>
                <div>
                    <strong>R$ ${item.price.toFixed(2)}</strong>
                    <button onclick="removeItem(${item.id})" class="remove-btn"><i class="fas fa-times"></i></button>
                </div>
            </div>`).join('');

        const total = cart.reduce((acc, item) => acc + item.price, 0);
        totalDisplay.innerText = `R$ ${total.toFixed(2).replace('.', ',')}`;
        count.innerText = cart.length;
    }
    localStorage.setItem('pizzaria_aw_cart', JSON.stringify(cart));
}

window.removeItem = (id) => {
    cart = cart.filter(item => item.id !== id);
    updateCartUI();
};

/**
 * BUSCA DINÂMICA
 */
function setupSearch() {
    document.getElementById('search-input').addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        document.querySelectorAll('.item-card').forEach(card => {
            const name = card.dataset.name.toLowerCase();
            card.style.display = name.includes(term) ? 'block' : 'none';
        });
    });
}

/**
 * FINALIZAÇÃO DO PEDIDO (WHATSAPP + LIMPEZA)
 */
document.getElementById('finalizar-pedido').addEventListener('click', () => {
    const nome = document.getElementById('client-name').value;
    
    if (!nome) {
        alert("Por favor, informe seu nome para o pedido.");
        document.getElementById('client-name').focus();
        return;
    }

    if (cart.length === 0) {
        alert("Seu carrinho está vazio.");
        return;
    }

    const total = document.getElementById('total-price').innerText;
    let msg = `*🍕 NOVO PEDIDO - PIZZARIA AW*%0A`;
    msg += `*Cliente:* ${nome}%0A`;
    msg += `--------------------------%0A`;
    
    cart.forEach(item => {
        msg += `• ${item.name} - R$ ${item.price.toFixed(2)}%0A`;
    });
    
    msg += `--------------------------%0A`;
    msg += `*TOTAL:* ${total}`;

    // Abre o WhatsApp
    window.open(`https://wa.me/5511985878638?text=${msg}`);

    // LIMPEZA PÓS-PEDIDO
    cart = [];
    document.getElementById('client-name').value = "";
    updateCartUI();
    alert("Pedido enviado! Seu carrinho foi limpo.");
});

/**
 * LÓGICA DO CARROSSEL
 */
function setupCarousel() {
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.dot');
    let currentSlide = 0;

    function showSlide(index) {
        slides.forEach(s => s.classList.remove('active'));
        dots.forEach(d => d.classList.remove('active'));
        
        currentSlide = (index + slides.length) % slides.length;
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    }

    document.querySelector('.carousel-next')?.addEventListener('click', () => showSlide(currentSlide + 1));
    document.querySelector('.carousel-prev')?.addEventListener('click', () => showSlide(currentSlide - 1));

    // Auto-play opcional
    setInterval(() => showSlide(currentSlide + 1), 5000);
}
