// 1. BANCO DE DADOS COMPLETO
const menuData = {
    pizzas: [
        { name: "Mussarela", price: 30.00, desc: "Molho de tomate, mussarela e orégano." },
        { name: "Calabresa", price: 32.00, desc: "Calabresa fatiada, cebola e orégano." },
        { name: "Margherita", price: 35.00, desc: "Mussarela, tomate fatiado e manjericão." },
        { name: "Portuguesa", price: 38.00, desc: "Presunto, ovos, cebola, ervilha e mussarela." },
        { name: "Frango c/ Catupiry", price: 38.00, desc: "Frango desfiado com Catupiry original." },
        { name: "Napolitana", price: 36.00, desc: "Mussarela, tomate e parmesão ralado." },
        { name: "Bacon", price: 39.00, desc: "Mussarela e fatias de bacon crocante." },
        { name: "Quatro Queijos", price: 42.00, desc: "Mussarela, provolone, parmesão e gorgonzola." },
        { name: "Pepperoni", price: 45.00, desc: "Mussarela e fatias de pepperoni premium." },
        { name: "Camarão", price: 60.00, desc: "Camarão ao molho especial e Catupiry." },
        { name: "Rúcula c/ Tomate Seco", price: 45.00, desc: "Mussarela, rúcula e tomate seco artesanal." },
        { name: "Abobrinha", price: 38.00, desc: "Abobrinha grelhada, parmesão e alho frito." }
    ],
    doces: [
        { name: "Chocolate com Morango", price: 40.00, desc: "Chocolate ao leite e morangos frescos." },
        { name: "Romeu e Julieta", price: 35.00, desc: "Mussarela e goiabada cremosa." },
        { name: "Prestígio", price: 38.00, desc: "Chocolate e coco ralado." }
    ],
    bebidas: [
        { name: "Coca-Cola 2L", price: 14.00, desc: "Garrafa Pet gelada." },
        { name: "Guaraná Antártica 2L", price: 12.00, desc: "Garrafa Pet gelada." },
        { name: "Suco de Laranja 500ml", price: 10.00, desc: "Suco natural da fruta." },
        { name: "Água Mineral 500ml", price: 5.00, desc: "Com ou sem gás." },
        { name: "Cerveja Lata", price: 7.00, desc: "350ml gelada." }
    ]
};

let cart = [];

// 2. INICIALIZAÇÃO
document.addEventListener('DOMContentLoaded', () => {
    renderMenu();
    startCarousel();
    setupSearch();
});

// 3. RENDERIZAÇÃO DO CARDÁPIO
function renderMenu() {
    const container = document.getElementById('menu-container');
    if (!container) return;
    let html = '';

    // Renderizar Pizzas Salgadas
    html += '<h2 class="category-title">🍕 Pizzas Salgadas</h2><div class="menu-grid">';
    menuData.pizzas.forEach((p, i) => { html += createPizzaCard(p, i, 'pizzas'); });
    html += '</div>';

    // Renderizar Pizzas Doces
    html += '<h2 class="category-title">🍫 Pizzas Doces</h2><div class="menu-grid">';
    menuData.doces.forEach((p, i) => { html += createPizzaCard(p, i + 100, 'doces'); });
    html += '</div>';

    // Renderizar Bebidas
    html += '<h2 class="category-title">🥤 Bebidas</h2><div class="menu-grid">';
    menuData.bebidas.forEach((b) => {
        html += `
        <div class="menu-card item-card" data-name="${b.name}">
            <div class="item-header">
                <h4>${b.name}</h4>
                <strong class="price-tag">R$ ${b.price.toFixed(2)}</strong>
            </div>
            <p class="item-desc">${b.desc}</p>
            <button onclick="addSimpleToCart('${b.name}', ${b.price})" class="btn-add">Adicionar</button>
        </div>`;
    });
    html += '</div>';

    container.innerHTML = html;
}

// Auxiliar para criar cards de pizza
function createPizzaCard(p, i, category) {
    const list = menuData[category];
    return `
    <div class="menu-card item-card" data-name="${p.name}">
        <div class="item-header">
            <h4>${p.name}</h4>
            <strong class="price-tag">R$ ${p.price.toFixed(2)}</strong>
        </div>
        <p class="item-desc">${p.desc}</p>
        <div class="half-box" style="background: #f9f9f9; padding: 10px; border-radius: 8px; margin-bottom: 15px;">
            <label style="font-size: 0.8rem; font-weight: bold; cursor:pointer;">
                <input type="checkbox" onchange="toggleHalf(${i})" id="is-half-${i}"> MEIO A MEIO?
            </label>
            <select id="second-flavor-${i}" style="display:none; margin-top: 8px; width: 100%; padding: 5px; border-radius: 5px;">
                <option value="">Escolha o 2º sabor...</option>
                ${list.map(pz => `<option value="${pz.name}|${pz.price}">${pz.name}</option>`).join('')}
            </select>
        </div>
        <button onclick="addPizzaToCart(${i}, '${category}')" class="btn-confirm" style="padding: 12px; font-size: 0.9rem;">Adicionar ao Pedido</button>
    </div>`;
}

// 4. LÓGICA DO CARRINHO
window.toggleHalf = (i) => {
    const select = document.getElementById(`second-flavor-${i}`);
    select.style.display = document.getElementById(`is-half-${i}`).checked ? 'block' : 'none';
};

window.addPizzaToCart = (i, category) => {
    const list = menuData[category];
    const idx = i >= 100 ? i - 100 : i;
    const p1 = list[idx];
    const isHalf = document.getElementById(`is-half-${i}`).checked;
    const secondFlavorData = document.getElementById(`second-flavor-${i}`).value;

    let finalName = p1.name;
    let finalPrice = p1.price;

    if (isHalf) {
        if (!secondFlavorData) {
            alert("Por favor, selecione o segundo sabor!");
            return;
        }
        const [name2, price2] = secondFlavorData.split('|');
        finalName = `½ ${p1.name} / ½ ${name2}`;
        finalPrice = Math.max(p1.price, parseFloat(price2));
    }

    cart.push({ name: finalName, price: finalPrice });
    updateCart();
    
    // Feedback visual de adição
    const btn = event.target;
    const originalText = btn.innerText;
    btn.innerText = "✓ Adicionado";
    btn.style.background = "#27ae60";
    setTimeout(() => {
        btn.innerText = originalText;
        btn.style.background = "";
    }, 1000);
};

window.addSimpleToCart = (name, price) => {
    cart.push({ name, price });
    updateCart();
};

function updateCart() {
    const list = document.getElementById('order-list');
    const totalDisp = document.getElementById('total-price');
    const countDisp = document.getElementById('cart-count');

    list.innerHTML = cart.length === 0 ? '<p class="empty-text">Seu carrinho está vazio</p>' : 
        cart.map((item, idx) => `
            <div class="item-row" style="display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid #eee;">
                <span style="font-size: 0.9rem; font-weight: 600;">${item.name}</span>
                <span style="font-size: 0.9rem;">R$ ${item.price.toFixed(2)} 
                    <i class="fas fa-trash-alt" onclick="removeItem(${idx})" style="color:#e74c3c; cursor:pointer; margin-left:12px;"></i>
                </span>
            </div>
        `).join('');

    const total = cart.reduce((acc, item) => acc + item.price, 0);
    totalDisp.innerText = `R$ ${total.toFixed(2).replace('.', ',')}`;
    countDisp.innerText = cart.length;
}

window.removeItem = (idx) => { cart.splice(idx, 1); updateCart(); };
window.clearCart = () => { if(confirm("Deseja realmente limpar seu carrinho?")) { cart = []; updateCart(); } };

// 5. FINALIZAÇÃO E WHATSAPP
window.toggleTroco = () => {
    const pag = document.getElementById('payment').value;
    document.getElementById('troco-box').style.display = (pag === 'Dinheiro') ? 'block' : 'none';
};

document.getElementById('checkout-form').addEventListener('submit', function(e) {
    e.preventDefault();
    if (cart.length === 0) {
        alert("Adicione pelo menos um item para finalizar o pedido!");
        return;
    }

    const dados = {
        nome: document.getElementById('client-name').value,
        rua: document.getElementById('address').value,
        bairro: document.getElementById('neighborhood').value,
        ref: document.getElementById('reference').value || "Não informado",
        pag: document.getElementById('payment').value,
        troco: document.getElementById('troco').value
    };

    let msg = `*🍕 NOVO PEDIDO - PIZZARIA AW*%0A%0A`;
    msg += `*DADOS DE ENTREGA*%0A👤 *Nome:* ${dados.nome}%0A📍 *Endereço:* ${dados.rua}%0A🏘️ *Bairro:* ${dados.bairro}%0A🚩 *Ref:* ${dados.ref}%0A%0A`;
    msg += `*ITENS DO PEDIDO*%0A`;
    cart.forEach(i => msg += `• ${i.name} _(R$ ${i.price.toFixed(2)})_%0A`);
    msg += `%0A💳 *Pagamento:* ${dados.pag}${dados.troco ? ` (Troco para R$ ${dados.troco})` : ''}%0A`;
    msg += `💰 *TOTAL: ${document.getElementById('total-price').innerText}*`;

    // Substitua pelo seu número de WhatsApp com DDD
    const meuNumero = "5511985878638"; 
    window.open(`https://wa.me/${meuNumero}?text=${msg}`);
});

// 6. UTILITÁRIOS (BUSCA/CARROSSEL)
function setupSearch() {
    const searchInput = document.getElementById('search-input');
    if(!searchInput) return;
    
    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        document.querySelectorAll('.item-card').forEach(card => {
            const isMatch = card.dataset.name.toLowerCase().includes(term);
            card.style.display = isMatch ? 'flex' : 'none';
        });
    });
}

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

function scrollToElement(id) {
    const el = document.getElementById(id);
    if (el) {
        const yOffset = -100; 
        const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({top: y, behavior: 'smooth'});
    }
}
