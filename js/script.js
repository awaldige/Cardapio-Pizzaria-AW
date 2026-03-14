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
        { name: "Cerveja Lata", price: 7.00, desc: "350ml." }
    ]
};

let cart = [];

document.addEventListener('DOMContentLoaded', () => {
    renderMenu();
    startCarousel();
    setupSearch();
});

function renderMenu() {
    const container = document.getElementById('menu-container');
    if (!container) return;
    let html = '';

    // Pizzas Salgadas
    html += '<h2 class="category-title">🍕 Pizzas Salgadas</h2><div class="menu-grid">';
    menuData.pizzas.forEach((p, i) => { html += createProductCard(p, i, true); });
    html += '</div>';

    // Pizzas Doces
    html += '<h2 class="category-title">🍫 Pizzas Doces</h2><div class="menu-grid">';
    menuData.doces.forEach((p, i) => { html += createProductCard(p, i + 100, false); });
    html += '</div>';

    // Bebidas
    html += '<h2 class="category-title">🥤 Bebidas</h2><div class="menu-grid">';
    menuData.bebidas.forEach((b) => {
        html += `
        <div class="menu-card item-card" data-name="${b.name}">
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <h4>${b.name}</h4>
                <strong style="color:var(--primary)">R$ ${b.price.toFixed(2)}</strong>
            </div>
            <p style="font-size:0.8rem; color:#666; margin:5px 0;">${b.desc}</p>
            <button onclick="addSimpleToCart('${b.name}', ${b.price})" class="btn-add">Adicionar</button>
        </div>`;
    });
    html += '</div>';

    container.innerHTML = html;
}

function createProductCard(p, i, isSavory) {
    const list = isSavory ? menuData.pizzas : menuData.doces;
    const category = isSavory ? 'pizzas' : 'doces';
    
    return `
    <div class="menu-card item-card" data-name="${p.name}">
        <div>
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <h4>${p.name}</h4>
                <strong style="color:var(--primary)">R$ ${p.price.toFixed(2)}</strong>
            </div>
            <p style="font-size:0.8rem; color:#666; margin:8px 0;">${p.desc}</p>
            <div class="half-box">
                <label style="font-size:0.7rem; font-weight:bold;">
                    <input type="checkbox" onchange="toggleHalf(${i})" id="is-half-${i}"> MEIO A MEIO?
                </label>
                <select id="second-flavor-${i}" style="display:none; width:100%; margin-top:5px; padding:5px; border-radius:5px;">
                    <option value="">Escolha o 2º sabor...</option>
                    ${list.map(pz => `<option value="${pz.name}|${pz.price}">${pz.name}</option>`).join('')}
                </select>
            </div>
        </div>
        <button onclick="addPizzaToCart(${i}, ${isSavory})" class="btn-add">Adicionar</button>
    </div>`;
}

window.toggleHalf = (i) => {
    const select = document.getElementById(`second-flavor-${i}`);
    if (select) select.style.display = document.getElementById(`is-half-${i}`).checked ? 'block' : 'none';
};

window.addPizzaToCart = (i, isSavory) => {
    const list = isSavory ? menuData.pizzas : menuData.doces;
    const idx = i >= 100 ? i - 100 : i;
    const p1 = list[idx];
    const isHalf = document.getElementById(`is-half-${i}`).checked;
    const secondFlavorData = document.getElementById(`second-flavor-${i}`).value;

    let finalName = p1.name;
    let finalPrice = p1.price;

    if (isHalf) {
        if (!secondFlavorData) return alert("Selecione o segundo sabor!");
        const [name2, price2] = secondFlavorData.split('|');
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

function updateCart() {
    const list = document.getElementById('order-list');
    const totalDisp = document.getElementById('total-price');
    const countDisp = document.getElementById('cart-count');

    if (cart.length === 0) {
        list.innerHTML = '<p class="empty-text">Adicione itens para começar seu pedido</p>';
    } else {
        list.innerHTML = cart.map((item, idx) => `
            <div class="item-row" style="display:flex; justify-content:space-between; padding:8px 0; border-bottom:1px dashed #eee;">
                <span style="font-size:0.9rem;">${item.name}</span>
                <span style="font-weight:bold;">R$ ${item.price.toFixed(2)} 
                    <i class="fas fa-trash-alt" onclick="removeItem(${idx})" style="color:red; cursor:pointer; margin-left:10px;"></i>
                </span>
            </div>
        `).join('');
    }

    const total = cart.reduce((acc, item) => acc + item.price, 0);
    totalDisp.innerText = `R$ ${total.toFixed(2).replace('.', ',')}`;
    countDisp.innerText = cart.length;
}

window.removeItem = (idx) => { cart.splice(idx, 1); updateCart(); };

window.clearCart = () => { if (confirm("Limpar o carrinho?")) { cart = []; updateCart(); } };

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

document.getElementById('finalizar-pedido').addEventListener('click', () => {
    const nome = document.getElementById('client-name').value.trim();
    const pagamento = document.getElementById('payment').value;
    if (!nome) return alert("Por favor, digite seu nome!");
    if (cart.length === 0) return alert("Seu carrinho está vazio!");

    let msg = `*🍕 NOVO PEDIDO - PIZZARIA AW*%0A%0A*Cliente:* ${nome}%0A*Pagamento:* ${pagamento}%0A--------------------------%0A`;
    cart.forEach(i => msg += `• ${i.name} - R$ ${i.price.toFixed(2)}%0A`);
    msg += `--------------------------%0A*TOTAL: ${document.getElementById('total-price').innerText}*`;
    window.open(`https://wa.me/5511985878638?text=${msg}`);
});
