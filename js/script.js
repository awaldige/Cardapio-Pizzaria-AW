// BANCO DE DADOS COMPLETO DO CARDÁPIO
const menuData = {
    pizzas: [
        { name: "Mussarela", price: 30.00, desc: "Molho de tomate, mussarela premium e orégano." },
        { name: "Calabresa", price: 32.00, desc: "Calabresa fatiada artesanal, cebola e orégano." },
        { name: "Margherita", price: 35.00, desc: "Mussarela, fatias de tomate e manjericão fresco." },
        { name: "Portuguesa", price: 38.00, desc: "Presunto, ovos, cebola, ervilha e mussarela." },
        { name: "Frango c/ Catupiry", price: 38.00, desc: "Frango desfiado temperado com Catupiry original." },
        { name: "Napolitana", price: 36.00, desc: "Mussarela, rodelas de tomate e parmesão ralado." },
        { name: "Bacon", price: 39.00, desc: "Mussarela e fatias de bacon crocante selecionado." },
        { name: "Quatro Queijos", price: 42.00, desc: "Mussarela, provolone, parmesão e gorgonzola." },
        { name: "Pepperoni", price: 45.00, desc: "Mussarela coberta com fatias de pepperoni premium." },
        { name: "Camarão", price: 60.00, desc: "Camarão selecionado ao molho especial e Catupiry." },
        { name: "Rúcula c/ Tomate Seco", price: 45.00, desc: "Mussarela, rúcula fresca e tomate seco artesanal." },
        { name: "Abobrinha", price: 38.00, desc: "Abobrinha grelhada, parmesão e alho frito." }
    ],
    doces: [
        { name: "Chocolate com Morango", price: 40.00, desc: "Chocolate ao leite cremoso e morangos frescos." },
        { name: "Romeu e Julieta", price: 35.00, desc: "Mussarela derretida com goiabada cascão." },
        { name: "Prestígio", price: 38.00, desc: "Chocolate ao leite coberto com coco ralado." }
    ],
    bebidas: [
        { name: "Coca-Cola 2L", price: 14.00, desc: "Garrafa Pet gelada." },
        { name: "Guaraná Antártica 2L", price: 12.00, desc: "Garrafa Pet gelada." },
        { name: "Suco de Laranja 500ml", price: 10.00, desc: "Suco natural feito na hora." },
        { name: "Água Mineral 500ml", price: 5.00, desc: "Com ou sem gás." },
        { name: "Cerveja Lata", price: 7.00, desc: "350ml gelada (Skol ou Brahma)." }
    ]
};

let cart = [];

// INICIALIZAÇÃO
document.addEventListener('DOMContentLoaded', () => {
    renderMenu();
    startCarousel();
    setupSearch();
});

// FUNÇÃO PARA GERAR O CARDÁPIO NA TELA
function renderMenu() {
    const container = document.getElementById('menu-container');
    if (!container) return;
    let html = '';

    // 1. Renderizar Pizzas Salgadas
    html += '<h2 class="category-title">🍕 Pizzas Salgadas</h2><div class="menu-grid">';
    menuData.pizzas.forEach((p, i) => {
        html += createCard(p, i, 'pizzas');
    });
    html += '</div>';

    // 2. Renderizar Pizzas Doces
    html += '<h2 class="category-title">🍫 Pizzas Doces</h2><div class="menu-grid">';
    menuData.doces.forEach((p, i) => {
        html += createCard(p, i + 100, 'doces'); // Offset de 100 para IDs únicos
    });
    html += '</div>';

    // 3. Renderizar Bebidas
    html += '<h2 class="category-title">🥤 Bebidas</h2><div class="menu-grid">';
    menuData.bebidas.forEach((b, i) => {
        html += `
        <div class="menu-card item-card" data-name="${b.name}">
            <div style="display:flex; justify-content:space-between">
                <h4>${b.name}</h4>
                <strong style="color:var(--primary)">R$ ${b.price.toFixed(2)}</strong>
            </div>
            <p style="font-size:0.8rem; color:#666; margin-top:5px">${b.desc}</p>
            <button class="btn-add" onclick="addSimpleToCart('${b.name}', ${b.price})">Adicionar</button>
        </div>`;
    });
    html += '</div>';

    container.innerHTML = html;
}

// AUXILIAR: CRIA O CARD DE PIZZA (COM OPÇÃO MEIO A MEIO)
function createCard(p, i, category) {
    const list = menuData[category];
    return `
    <div class="menu-card item-card" data-name="${p.name}">
        <div style="display:flex; justify-content:space-between">
            <h4 style="font-size:1.1rem">${p.name}</h4>
            <strong style="color:var(--primary)">R$ ${p.price.toFixed(2)}</strong>
        </div>
        <p style="font-size:0.8rem; color:#666; margin:8px 0">${p.desc}</p>
        
        <div class="half-box" style="background:#f9f9f9; padding:8px; border-radius:8px; margin-top:10px">
            <label style="font-size:0.7rem; font-weight:bold; cursor:pointer">
                <input type="checkbox" onchange="toggleHalf(${i})" id="is-half-${i}"> FAZER MEIO A MEIO?
            </label>
            <select id="second-flavor-${i}" style="display:none; width:100%; margin-top:8px; padding:5px; border-radius:5px; border:1px solid #ddd">
                <option value="">Selecione o 2º sabor...</option>
                ${list.map(pz => `<option value="${pz.name}|${pz.price}">${pz.name}</option>`).join('')}
            </select>
        </div>
        
        <button class="btn-add" onclick="addPizzaToCart(${i}, '${category}')">Adicionar ao Pedido</button>
    </div>`;
}

// LOGICA DE INTERFACE
window.toggleHalf = (i) => {
    const select = document.getElementById(`second-flavor-${i}`);
    select.style.display = document.getElementById(`is-half-${i}`).checked ? 'block' : 'none';
};

// ADICIONAR PIZZA (TRATA MEIO A MEIO)
window.addPizzaToCart = (i, category) => {
    const list = menuData[category];
    const idx = i >= 100 ? i - 100 : i;
    const p1 = list[idx];
    
    const isHalf = document.getElementById(`is-half-${i}`).checked;
    const secondData = document.getElementById(`second-flavor-${i}`).value;

    let finalName = p1.name;
    let finalPrice = p1.price;

    if (isHalf) {
        if (!secondData) return alert("Por favor, selecione o segundo sabor da sua pizza!");
        const [name2, price2] = secondData.split('|');
        finalName = `½ ${p1.name} / ½ ${name2}`;
        finalPrice = Math.max(p1.price, parseFloat(price2));
    }

    cart.push({ name: finalName, price: finalPrice });
    updateCart();
};

window.addSimpleToCart = (name, price) => {
    cart.push({ name, price });
    updateCart();
};

// ATUALIZAR CARRINHO
function updateCart() {
    const list = document.getElementById('order-list');
    const totalDisp = document.getElementById('total-price');
    const countDisp = document.getElementById('cart-count');

    if (cart.length === 0) {
        list.innerHTML = '<p class="empty-text">Seu carrinho está vazio...</p>';
    } else {
        list.innerHTML = cart.map((item, idx) => `
            <div class="item-row">
                <span>${item.name}</span>
                <span>R$ ${item.price.toFixed(2)} <i class="fas fa-trash-alt" onclick="removeItem(${idx})" style="color:#e74c3c; cursor:pointer; margin-left:10px"></i></span>
            </div>
        `).join('');
    }

    const total = cart.reduce((acc, item) => acc + item.price, 0);
    totalDisp.innerText = `R$ ${total.toFixed(2).replace('.', ',')}`;
    countDisp.innerText = cart.length;
}

window.removeItem = (idx) => { cart.splice(idx, 1); updateCart(); };
window.clearCart = () => { if(confirm("Deseja limpar seu pedido?")) { cart = []; updateCart(); } };

// BUSCA E CARROSSEL
function startCarousel() {
    const slides = document.querySelectorAll('.slide');
    let current = 0;
    if (slides.length > 0) {
        setInterval(() => {
            slides[current].classList.remove('active');
            current = (current + 1) % slides.length;
            slides[current].classList.add('active');
        }, 4000);
    }
}

function setupSearch() {
    const search = document.getElementById('search-input');
    if (!search) return;
    search.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        document.querySelectorAll('.item-card').forEach(card => {
            const name = card.dataset.name.toLowerCase();
            card.style.display = name.includes(term) ? 'flex' : 'none';
        });
    });
}

function scrollToElement(id) {
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.offsetTop - 80, behavior: 'smooth' });
}

// FINALIZAÇÃO WHATSAPP
document.getElementById('finalizar-pedido').addEventListener('click', () => {
    const nome = document.getElementById('client-name').value.trim();
    const pag = document.getElementById('payment').value;

    if (!nome) return alert("Por favor, informe seu nome!");
    if (cart.length === 0) return alert("Seu carrinho está vazio!");

    let msg = `*🍕 NOVO PEDIDO - PIZZARIA AW*%0A%0A`;
    msg += `*Cliente:* ${nome}%0A`;
    msg += `*Pagamento:* ${pag}%0A`;
    msg += `--------------------------%0A`;
    cart.forEach(item => msg += `• ${item.name} - R$ ${item.price.toFixed(2)}%0A`);
    msg += `--------------------------%0A`;
    msg += `*TOTAL: ${document.getElementById('total-price').innerText}*`;

    window.open(`https://wa.me/5511985878638?text=${msg}`);
});
