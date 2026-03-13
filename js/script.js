/**
 * PIZZARIA AW - BANCO DE DADOS E LÓGICA COMPLETA
 */

const menuData = {
    pizzas: [
        { name: "Margherita", price: 35.00, desc: "Molho de tomate premium, mussarela, manjericão fresco e azeite." },
        { name: "Mussarela", price: 30.00, desc: "Clássica mussarela com molho de tomate artesanal e orégano." },
        { name: "Portuguesa", price: 38.00, desc: "Presunto, ovos, cebola, ervilha e mussarela selecionada." },
        { name: "Frango com Catupiry", price: 36.00, desc: "Frango desfiado temperado com o legítimo Catupiry." },
        { name: "Pepperoni", price: 40.00, desc: "Mussarela coberta com fatias de pepperoni premium." },
        { name: "Calabresa", price: 32.00, desc: "Calabresa fatiada, cebola roxa e azeitonas pretas." },
        { name: "Quatro Queijos", price: 42.00, desc: "Mussarela, provolone, parmesão e gorgonzola cremoso." },
        { name: "Vegetariana", price: 35.00, desc: "Escarola, milho, ervilha, palmito e mussarela light." },
        { name: "Rúcula com Tomate Seco", price: 45.00, desc: "Mussarela, rúcula fresca e tomates secos artesanais." },
        { name: "Atum", price: 38.00, desc: "Atum sólido premium, cebola e toque de mussarela." },
        { name: "Camarão", price: 60.00, desc: "Camarões selecionados ao molho especial e catupiry." },
        { name: "Palmito Especial", price: 42.00, desc: "Palmito macio, mussarela e raspas de parmesão." }
    ],
    doces: [
        { name: "Mousse de Chocolate", price: 12.00, desc: "Cremoso mousse de chocolate meio amargo com raspas." },
        { name: "Mousse de Maracujá", price: 10.00, desc: "Mousse aerado com calda de maracujá natural." },
        { name: "Pudim de Leite", price: 12.00, desc: "Pudim caseiro com calda de caramelo dourada." },
        { name: "Torta de Limão", price: 15.00, desc: "Massa crocante, creme de limão e merengue suíço." },
        { name: "Torta Holandesa", price: 18.00, desc: "Creme leve, cobertura de chocolate e biscoito calipso." },
        { name: "Pavê de Baunilha", price: 14.00, desc: "Camadas de biscoito champanhe com creme de baunilha." },
        { name: "Cheesecake de Frutas Vermelhas", price: 20.00, desc: "Base crocante com creme de queijo e calda de berries." },
        { name: "Brownie com Calda", price: 16.00, desc: "Brownie de chocolate belga com calda quente." }
    ],
    bebidas: [
        { name: "Coca-Cola 2L", price: 14.00, desc: "Garrafa Pet gelada" },
        { name: "Coca-Cola Lata", price: 6.00, desc: "350ml bem gelada" },
        { name: "Suco Natural", price: 10.00, desc: "Laranja ou Limão 500ml" },
        { name: "Água Mineral", price: 4.00, desc: "500ml sem gás" }
    ]
};

const sizeModifiers = { "grande": 1.0, "media": 0.8, "broto": 0.6 };
let cart = [];
let slideIndex = 0;

document.addEventListener('DOMContentLoaded', () => {
    renderMenu();
    setupCarousel();
    setupSearch();
});

// --- LÓGICA DO CARROSSEL (6 IMAGENS) ---
function setupCarousel() {
    showSlides(slideIndex);
    setInterval(() => changeSlide(1), 5000); // Muda a cada 5 segundos
}

window.changeSlide = (n) => showSlides(slideIndex += n);
window.currentSlide = (n) => showSlides(slideIndex = n);

function showSlides(n) {
    let slides = document.getElementsByClassName("carousel-slide");
    let dots = document.getElementsByClassName("dot");
    if (n >= slides.length) slideIndex = 0;
    if (n < 0) slideIndex = slides.length - 1;
    for (let i = 0; i < slides.length; i++) {
        slides[i].classList.remove("active");
        if(dots[i]) dots[i].classList.remove("active");
    }
    if (slides[slideIndex]) slides[slideIndex].classList.add("active");
    if (dots[slideIndex]) dots[slideIndex].classList.add("active");
}

// --- RENDERIZAÇÃO DO MENU ---
function renderMenu() {
    const container = document.getElementById('menu-container');
    let html = '';

    // Seção de Pizzas
    html += '<h2 class="category-title">🍕 Pizzas Salgadas</h2><div class="menu-grid">';
    menuData.pizzas.forEach((p, i) => {
        html += `
        <div class="menu-card item-card" data-name="${p.name}">
            <h4>${p.name}</h4>
            <p class="desc-text">${p.desc}</p>
            <div class="pizza-options">
                <select id="size-${i}" class="option-select">
                    <option value="grande">Grande (8 fatias)</option>
                    <option value="media">Média (6 fatias)</option>
                    <option value="broto">Broto (4 fatias)</option>
                </select>
                <label class="half-check">
                    <input type="checkbox" onchange="toggleMeio(${i})" id="chk-${i}"> Meio a meio?
                </label>
                <div id="box-meio-${i}" style="display:none; margin-top:10px;">
                    <select id="sabor2-${i}" class="option-select">
                        <option value="">Escolha o 2º sabor...</option>
                        ${menuData.pizzas.map(pizza => `<option value="${pizza.name}">${pizza.name}</option>`).join('')}
                    </select>
                </div>
            </div>
            <button onclick="addPizzaToCart(${i})" class="add-btn" style="width:100%">ADICIONAR</button>
        </div>`;
    });
    html += '</div>';

    // Seção de Doces
    html += '<h2 class="category-title">🍰 Sobremesas</h2><div class="menu-grid">';
    menuData.doces.forEach((d, i) => {
        html += `
        <div class="menu-card item-card" data-name="${d.name}">
            <h4>${d.name}</h4>
            <p class="desc-text">${d.desc}</p>
            <p><strong>R$ ${d.price.toFixed(2)}</strong></p>
            <button onclick="addSimpleToCart('${d.name}', ${d.price})" class="add-btn" style="width:100%">ADICIONAR</button>
        </div>`;
    });
    html += '</div>';

    // Seção de Bebidas
    html += '<h2 class="category-title">🥤 Bebidas</h2><div class="menu-grid">';
    menuData.bebidas.forEach((b, i) => {
        html += `
        <div class="menu-card item-card" data-name="${b.name}">
            <h4>${b.name}</h4>
            <p class="desc-text">${b.desc}</p>
            <p><strong>R$ ${b.price.toFixed(2)}</strong></p>
            <button onclick="addSimpleToCart('${b.name}', ${b.price})" class="add-btn" style="width:100%">ADICIONAR</button>
        </div>`;
    });
    html += '</div>';

    container.innerHTML = html;
}

// --- FUNÇÕES DO CARRINHO ---
window.toggleMeio = (i) => {
    const box = document.getElementById(`box-meio-${i}`);
    box.style.display = document.getElementById(`chk-${i}`).checked ? 'block' : 'none';
};

window.addPizzaToCart = (i) => {
    const p1 = menuData.pizzas[i];
    const size = document.getElementById(`size-${i}`).value;
    const isMeio = document.getElementById(`chk-${i}`).checked;
    const sabor2Name = document.getElementById(`sabor2-${i}`).value;

    let finalName = `${p1.name} (${size})`;
    let finalPrice = p1.price * sizeModifiers[size];

    if (isMeio && sabor2Name) {
        const p2 = menuData.pizzas.find(p => p.name === sabor2Name);
        finalPrice = Math.max(p1.price, p2.price) * sizeModifiers[size];
        finalName = `Meio ${p1.name} / Meio ${sabor2Name} (${size})`;
    }

    cart.push({ name: finalName, price: finalPrice });
    updateCartUI();
};

window.addSimpleToCart = (name, price) => {
    cart.push({ name, price });
    updateCartUI();
};

function updateCartUI() {
    const list = document.getElementById('order-list');
    list.innerHTML = cart.map((item, index) => `
        <div class="cart-item">
            <span>${item.name}</span>
            <span>R$ ${item.price.toFixed(2)} <i class="fas fa-trash" onclick="removeFromCart(${index})" style="color:red; cursor:pointer; margin-left:10px"></i></span>
        </div>
    `).join('');

    const total = cart.reduce((acc, item) => acc + item.price, 0);
    document.getElementById('total-price').innerText = `R$ ${total.toFixed(2).replace('.', ',')}`;
    document.getElementById('cart-count').innerText = cart.length;
    
    if(cart.length === 0) {
        list.innerHTML = '<p class="empty-msg">Seu carrinho está vazio.</p>';
    }
}

window.removeFromCart = (index) => {
    cart.splice(index, 1);
    updateCartUI();
};

// --- BUSCA ---
function setupSearch() {
    document.getElementById('search-input').addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        document.querySelectorAll('.item-card').forEach(card => {
            const name = card.getAttribute('data-name').toLowerCase();
            card.style.display = name.includes(term) ? 'block' : 'none';
        });
    });
}

// --- ENVIO WHATSAPP ---
document.getElementById('finalizar-pedido').addEventListener('click', () => {
    const nome = document.getElementById('client-name').value.trim();
    
    if (!nome) {
        alert("Por favor, digite seu nome antes de enviar!");
        document.getElementById('client-name').focus();
        return;
    }
    if (cart.length === 0) {
        alert("Adicione pelo menos um item ao carrinho!");
        return;
    }

    const pag = document.getElementById('payment').value;
    const total = document.getElementById('total-price').innerText;
    
    let msg = `*NOVO PEDIDO - PIZZARIA AW*%0A`;
    msg += `*Cliente:* ${nome}%0A`;
    msg += `------------------------------%0A`;
    cart.forEach(item => {
        msg += `• ${item.name} - R$ ${item.price.toFixed(2)}%0A`;
    });
    msg += `------------------------------%0A`;
    msg += `*Pagamento:* ${pag}%0A`;
    msg += `*TOTAL:* ${total}%0A`;
    msg += `*Endereço:* Rua Aluísio Azevedo, 297`;

    window.open(`https://wa.me/5511985878638?text=${msg}`);
});
