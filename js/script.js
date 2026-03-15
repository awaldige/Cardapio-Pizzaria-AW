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

document.addEventListener('DOMContentLoaded', () => {
    renderMenu();
    startCarousel();
    setupSearch();
});

function renderMenu() {
    const container = document.getElementById('menu-container');
    let html = '';

    html += '<h2 class="category-title">🍕 Pizzas Salgadas</h2><div class="menu-grid">';
    menuData.pizzas.forEach((p, i) => { html += createPizzaCard(p, i, 'pizzas'); });
    html += '</div>';

    html += '<h2 class="category-title">🍫 Pizzas Doces</h2><div class="menu-grid">';
    menuData.doces.forEach((p, i) => { html += createPizzaCard(p, i + 100, 'doces'); });
    html += '</div>';

    html += '<h2 class="category-title">🥤 Bebidas</h2><div class="menu-grid">';
    menuData.bebidas.forEach((b) => {
        html += `
        <div class="menu-card item-card" data-name="${b.name}">
            <div class="item-header"><h4>${b.name}</h4><strong class="price-tag">R$ ${b.price.toFixed(2)}</strong></div>
            <p class="item-desc">${b.desc}</p>
            <button onclick="addSimpleToCart('${b.name}', ${b.price})" class="btn-add">Adicionar</button>
        </div>`;
    });
    html += '</div>';
    container.innerHTML = html;
}

function createPizzaCard(p, i, category) {
    const list = menuData[category];
    return `
    <div class="menu-card item-card" data-name="${p.name}">
        <div class="item-header"><h4>${p.name}</h4><strong class="price-tag">R$ ${p.price.toFixed(2)}</strong></div>
        <p class="item-desc">${p.desc}</p>
        <div class="half-box" style="margin: 10px 0; font-size: 0.8rem; background: #f0f0f0; padding: 8px; border-radius: 5px;">
            <label><input type="checkbox" onchange="toggleHalf(${i})" id="is-half-${i}"> MEIO A MEIO?</label>
            <select id="second-flavor-${i}" style="display:none; margin-top:5px; width:100%">${list.map(pz => `<option value="${pz.name}|${pz.price}">${pz.name}</option>`).join('')}</select>
        </div>
        <button onclick="addPizzaToCart(${i}, '${category}')" class="btn-add">Adicionar</button>
    </div>`;
}

window.toggleHalf = (i) => {
    document.getElementById(`second-flavor-${i}`).style.display = document.getElementById(`is-half-${i}`).checked ? 'block' : 'none';
};

window.addPizzaToCart = (i, category) => {
    const list = menuData[category];
    const idx = i >= 100 ? i - 100 : i;
    const p1 = list[idx];
    const isHalf = document.getElementById(`is-half-${i}`).checked;
    let finalName = p1.name, finalPrice = p1.price;

    if (isHalf) {
        const val = document.getElementById(`second-flavor-${i}`).value.split('|');
        finalName = `½ ${p1.name} / ½ ${val[0]}`;
        finalPrice = Math.max(p1.price, parseFloat(val[1]));
    }
    cart.push({ name: finalName, price: finalPrice });
    updateCart();
};

window.addSimpleToCart = (name, price) => { cart.push({ name, price }); updateCart(); };

function updateCart() {
    const list = document.getElementById('order-list');
    list.innerHTML = cart.length === 0 ? '<p>Carrinho vazio</p>' : cart.map((item, idx) => `
        <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
            <span>${item.name}</span>
            <span>R$ ${item.price.toFixed(2)} <i class="fas fa-trash" onclick="removeItem(${idx})" style="color:red; cursor:pointer;"></i></span>
        </div>`).join('');
    
    const total = cart.reduce((acc, i) => acc + i.price, 0);
    document.getElementById('total-price').innerText = `R$ ${total.toFixed(2).replace('.', ',')}`;
    document.getElementById('cart-count').innerText = cart.length;
}

window.removeItem = (idx) => { cart.splice(idx, 1); updateCart(); };
window.clearCart = () => { cart = []; updateCart(); };

document.getElementById('checkout-form').addEventListener('submit', function(e) {
    e.preventDefault();
    if(cart.length === 0) return alert("Carrinho vazio!");
    
    const dados = `*PEDIDO PIZZARIA AW*%0A*Nome:* ${document.getElementById('client-name').value}%0A*Endereço:* ${document.getElementById('address').value}, ${document.getElementById('neighborhood').value}%0A*Pagamento:* ${document.getElementById('payment').value}%0A%0A*ITENS:*%0A${cart.map(i => `- ${i.name}`).join('%0A')}%0A%0A*TOTAL: ${document.getElementById('total-price').innerText}*`;
    window.open(`https://wa.me/5511985878638?text=${dados}`);
});

function setupSearch() {
    document.getElementById('search-input').addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        document.querySelectorAll('.item-card').forEach(card => {
            card.style.display = card.dataset.name.toLowerCase().includes(term) ? 'flex' : 'none';
        });
    });
}

function startCarousel() {
    const slides = document.querySelectorAll('.slide');
    let cur = 0;
    setInterval(() => {
        slides[cur].classList.remove('active');
        cur = (cur + 1) % slides.length;
        slides[cur].classList.add('active');
    }, 3000);
}

function scrollToElement(id) { document.getElementById(id).scrollIntoView({ behavior: 'smooth' }); }
