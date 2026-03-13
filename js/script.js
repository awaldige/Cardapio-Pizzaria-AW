/**
 * PIZZARIA AW - LÓGICA COMPLETA
 * Itens, Meio a Meio, Carrinho e WhatsApp
 */

const menuData = {
    pizzas: [
        { name: "Margherita", price: 35.00, desc: "Mussarela, tomate e manjericão." },
        { name: "Mussarela", price: 30.00, desc: "Mussarela premium e orégano." },
        { name: "Portuguesa", price: 38.00, desc: "Presunto, ovos, cebola e mussarela." },
        { name: "Frango com Catupiry", price: 36.00, desc: "Frango desfiado com Catupiry." },
        { name: "Pepperoni", price: 40.00, desc: "Mussarela e fatias de pepperoni." },
        { name: "Calabresa", price: 32.00, desc: "Calabresa fatiada e cebola." },
        { name: "Quatro Queijos", price: 42.00, desc: "Mussarela, provolone, parmesão e gorgonzola." },
        { name: "Vegetariana", price: 35.00, desc: "Escarola, milho, ervilha e palmito." },
        { name: "Rúcula com Tomate Seco", price: 45.00, desc: "Mussarela, rúcula e tomate seco." },
        { name: "Atum", price: 38.00, desc: "Atum sólido e cebola." },
        { name: "Camarão", price: 60.00, desc: "Camarão selecionado e Catupiry." },
        { name: "Palmito Especial", price: 42.00, desc: "Palmito macio e mussarela." }
    ],
    doces: [
        { name: "Mousse de Chocolate", price: 12.00, desc: "Cremoso chocolate meio amargo." },
        { name: "Pudim de Leite", price: 10.00, desc: "Caseiro com calda de caramelo." },
        { name: "Torta de Limão", price: 15.00, desc: "Creme de limão e merengue." },
        { name: "Torta Holandesa", price: 18.00, desc: "Creme holandês com cobertura de ganache e biscoito." },
        { name: "Brownie com Calda", price: 16.00, desc: "Brownie de chocolate belga (aquecer 30s)." },
        { name: "Cheesecake de Frutas Vermelhas", price: 20.00, desc: "Massa crocante com creme de queijo e calda artesanal." },
        { name: "Pavê de Baunilha", price: 14.00, desc: "Camadas de biscoito maria com creme de baunilha." }
    ],
   bebidas: [
        { name: "Coca-Cola 2L", price: 14.00, desc: "Garrafa Pet bem gelada." },
        { name: "Coca-Cola Lata", price: 6.00, desc: "350ml bem gelada." },
        { name: "Guaraná Antártica 2L", price: 12.00, desc: "Garrafa Pet bem gelada." },
        { name: "Fanta Laranja 2L", price: 12.00, desc: "Garrafa Pet bem gelada." },
        { name: "Suco Natural", price: 10.00, desc: "Laranja ou Limão 500ml." },
        { name: "Água Mineral", price: 4.00, desc: "500ml sem gás." },
        { name: "Cerveja Heineken", price: 12.00, desc: "Long Neck 330ml." }
    ]
};

let cart = [];

document.addEventListener('DOMContentLoaded', () => {
    renderMenu();
    startCarousel();
    setupSearch();
});

// --- RENDERIZAÇÃO DO CARDÁPIO ---
function renderMenu() {
    const container = document.getElementById('menu-container');
    let html = '';

    // Seção de Pizzas com Meio a Meio
    html += '<h2 class="category-title">Pizzas Salgadas</h2><div class="menu-grid">';
    menuData.pizzas.forEach((p, i) => {
        html += `
        <div class="menu-card item-card" data-name="${p.name}">
            <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                <h4 style="margin:0;">${p.name}</h4>
                <strong style="color:var(--primary)">R$ ${p.price.toFixed(2)}</strong>
            </div>
            <p style="font-size:0.8rem; color:#777; margin:5px 0 12px 0;">${p.desc}</p>
            
            <div class="half-box">
                <label style="font-size:0.75rem; font-weight:600; cursor:pointer;">
                    <input type="checkbox" onchange="toggleHalf(${i})" id="is-half-${i}"> MEIO A MEIO?
                </label>
                <select id="second-flavor-${i}" style="display:none; width:100%; margin-top:8px; padding:6px; border-radius:8px; border:1px solid #ddd; font-size:0.8rem;">
                    <option value="">Escolha o 2º sabor...</option>
                    ${menuData.pizzas.map(pz => `<option value="${pz.name}">${pz.name}</option>`).join('')}
                </select>
            </div>
            <button onclick="addPizzaToCart(${i})" style="width:100%; background:var(--dark); color:white; border:none; padding:10px; border-radius:10px; cursor:pointer; font-weight:600;">Adicionar ao Pedido</button>
        </div>`;
    });
    html += '</div>';

    // Sobremesas e Bebidas
    html += renderSimpleSection("Sobremesas", menuData.doces);
    html += renderSimpleSection("Bebidas", menuData.bebidas);

    container.innerHTML = html;
}

function renderSimpleSection(title, items) {
    let html = `<h2 class="category-title">${title}</h2><div class="menu-grid">`;
    items.forEach(item => {
        html += `
        <div class="menu-card item-card" data-name="${item.name}">
            <div style="display:flex; justify-content:space-between;">
                <h4 style="margin:0;">${item.name}</h4>
                <strong style="color:var(--primary)">R$ ${item.price.toFixed(2)}</strong>
            </div>
            <p style="font-size:0.8rem; color:#777; margin:5px 0 12px 0;">${item.desc}</p>
            <button onclick="addSimpleToCart('${item.name}', ${item.price})" style="width:100%; background:var(--dark); color:white; border:none; padding:10px; border-radius:10px; cursor:pointer; font-weight:600;">Adicionar</button>
        </div>`;
    });
    return html + '</div>';
}

// --- FUNÇÕES DE ADIÇÃO ---
window.toggleHalf = (i) => {
    const select = document.getElementById(`second-flavor-${i}`);
    select.style.display = document.getElementById(`is-half-${i}`).checked ? 'block' : 'none';
};

window.addPizzaToCart = (i) => {
    const p1 = menuData.pizzas[i];
    const isHalf = document.getElementById(`is-half-${i}`).checked;
    const flavor2Name = document.getElementById(`second-flavor-${i}`).value;

    let finalName = p1.name;
    let finalPrice = p1.price;

    if (isHalf) {
        if (!flavor2Name) {
            alert("Por favor, escolha o segundo sabor para a pizza meio a meio!");
            return;
        }
        const p2 = menuData.pizzas.find(p => p.name === flavor2Name);
        finalPrice = Math.max(p1.price, p2.price); // Regra da mais cara
        finalName = `½ ${p1.name} / ½ ${p2.name}`;
    }

    cart.push({ name: finalName, price: finalPrice });
    updateCart();
};

window.addSimpleToCart = (name, price) => {
    cart.push({ name, price });
    updateCart();
};

// --- ATUALIZAÇÃO DO CARRINHO ---
function updateCart() {
    const list = document.getElementById('order-list');
    const totalDisp = document.getElementById('total-price');
    const countDisp = document.getElementById('cart-count');

    if (cart.length === 0) {
        list.innerHTML = `<p class="empty-text" style="text-align:center; padding:20px; color:#999;">Carrinho vazio</p>`;
    } else {
        list.innerHTML = cart.map((item, idx) => `
            <div class="item-row" style="display:flex; justify-content:space-between; align-items:center; padding:10px 0; border-bottom:1px solid #f0f0f0;">
                <div style="font-size:0.85rem; font-weight:600;">${item.name}</div>
                <div style="display:flex; align-items:center; gap:10px">
                    <span style="font-size:0.9rem;">R$ ${item.price.toFixed(2)}</span>
                    <i class="fas fa-times-circle" onclick="removeItem(${idx})" style="color:#e74c3c; cursor:pointer;"></i>
                </div>
            </div>
        `).join('');
    }

    const total = cart.reduce((sum, item) => sum + item.price, 0);
    totalDisp.innerText = `R$ ${total.toFixed(2)}`;
    countDisp.innerText = cart.length;
}

window.removeItem = (idx) => {
    cart.splice(idx, 1);
    updateCart();
};

window.clearCart = () => {
    if(confirm("Limpar todo o carrinho?")) {
        cart = [];
        updateCart();
    }
};

// --- UTILITÁRIOS ---
window.scrollToElement = (id) => {
    document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
};

function setupSearch() {
    document.getElementById('search-input').addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        document.querySelectorAll('.item-card').forEach(card => {
            const name = card.getAttribute('data-name').toLowerCase();
            card.style.display = name.includes(term) ? 'block' : 'none';
        });
    });
}

function startCarousel() {
    const slides = document.querySelectorAll('.slide');
    let current = 0;
    if(slides.length === 0) return;
    setInterval(() => {
        slides[current].classList.remove('active');
        current = (current + 1) % slides.length;
        slides[current].classList.add('active');
    }, 4000);
}

// --- ENVIO WHATSAPP ---
document.getElementById('finalizar-pedido').addEventListener('click', () => {
    const nome = document.getElementById('client-name').value.trim();
    if (!nome) {
        alert("Por favor, digite seu nome!");
        document.getElementById('client-name').focus();
        return;
    }
    if (cart.length === 0) {
        alert("Seu carrinho está vazio!");
        return;
    }

    const pag = document.getElementById('payment').value;
    const total = document.getElementById('total-price').innerText;
    
    let msg = `*PIZZARIA AW - NOVO PEDIDO*%0A`;
    msg += `*Cliente:* ${nome}%0A`;
    msg += `------------------------------%0A`;
    cart.forEach(item => msg += `• ${item.name} - R$ ${item.price.toFixed(2)}%0A`);
    msg += `------------------------------%0A`;
    msg += `*Pagamento:* ${pag}%0A`;
    msg += `*TOTAL:* ${total}%0A%0A`;
    msg += `*Local:* Rua Aluísio Azevedo, 297`;

    window.open(`https://wa.me/5511985878638?text=${msg}`);
});
