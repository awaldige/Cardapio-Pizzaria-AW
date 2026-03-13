/**
 * PIZZARIA AW - BANCO DE DATOS E LÓGICA DE NEGÓCIO
 */

const menuData = {
    pizzas: [
        { name: "Margherita", price: 35.00, desc: "Mussarela, tomate fatiado e manjericão fresco." },
        { name: "Mussarela", price: 30.00, desc: "Mussarela premium com orégano e azeitonas." },
        { name: "Portuguesa", price: 38.00, desc: "Presunto, ovos, cebola, ervilha e mussarela." },
        { name: "Frango com Catupiry", price: 36.00, desc: "Frango desfiado com o autêntico Catupiry." },
        { name: "Pepperoni", price: 40.00, desc: "Mussarela coberta com fatias de pepperoni." },
        { name: "Calabresa", price: 32.00, desc: "Calabresa fatiada, cebola e azeitonas." },
        { name: "Quatro Queijos", price: 42.00, desc: "Mussarela, provolone, parmesão e gorgonzola." },
        { name: "Vegetariana", price: 35.00, desc: "Escarola, milho, ervilha e palmito." },
        { name: "Rúcula com Tomate Seco", price: 45.00, desc: "Mussarela, rúcula e tomate seco artesanal." },
        { name: "Atum", price: 38.00, desc: "Atum sólido premium, cebola e mussarela." },
        { name: "Camarão", price: 60.00, desc: "Camarões selecionados e Catupiry." },
        { name: "Palmito Especial", price: 42.00, desc: "Palmito macio com toque de mussarela." }
    ],
    doces: [
        { name: "Mousse de Chocolate", price: 12.00, desc: "Chocolate meio amargo cremoso." },
        { name: "Mousse de Maracujá", price: 10.00, desc: "Mousse natural com calda da fruta." },
        { name: "Pudim de Leite", price: 12.00, desc: "Receita caseira com calda de caramelo." },
        { name: "Torta de Limão", price: 15.00, desc: "Creme de limão siciliano com merengue." },
        { name: "Torta Holandesa", price: 18.00, desc: "Creme holandês com cobertura de ganache." },
        { name: "Pavê de Baunilha", price: 14.00, desc: "Camadas de biscoito e creme de baunilha." },
        { name: "Cheesecake", price: 20.00, desc: "Com calda de frutas vermelhas." },
        { name: "Brownie", price: 16.00, desc: "Chocolate belga com calda quente." }
    ],
    bebidas: [
        { name: "Coca-Cola 2L", price: 14.00, desc: "Garrafa gelada." },
        { name: "Coca-Cola Lata", price: 6.00, desc: "350ml gelada." },
        { name: "Suco Natural", price: 10.00, desc: "Laranja ou Limão 500ml." },
        { name: "Água Mineral", price: 4.00, desc: "500ml sem gás." }
    ]
};

let cart = [];
let slideIndex = 0;

document.addEventListener('DOMContentLoaded', () => {
    renderMenu();
    startCarousel();
    setupSearch();
});

// --- RENDERIZAÇÃO DO CARDÁPIO ---
function renderMenu() {
    const container = document.getElementById('menu-container');
    let html = '';

    // PIZZAS
    html += '<h2 class="category-title">Pizzas Artesanais</h2><div class="menu-grid">';
    menuData.pizzas.forEach((p, i) => {
        html += `
        <div class="menu-card item-card" data-name="${p.name}">
            <div style="display:flex; justify-content:space-between;">
                <h4 style="margin:0;">${p.name}</h4>
                <strong style="color:var(--primary)">R$ ${p.price.toFixed(2)}</strong>
            </div>
            <p style="font-size:0.8rem; color:#666; margin:5px 0 15px 0;">${p.desc}</p>
            
            <div class="half-box">
                <label style="font-size:0.75rem; font-weight:700;">
                    <input type="checkbox" onchange="toggleHalf(${i})" id="is-half-${i}"> MEIO A MEIO?
                </label>
                <select id="second-flavor-${i}" style="display:none; width:100%; margin-top:8px; padding:5px; border-radius:8px; border:1px solid #ddd;">
                    <option value="">Escolha o 2º sabor...</option>
                    ${menuData.pizzas.map(pz => `<option value="${pz.name}">${pz.name}</option>`).join('')}
                </select>
            </div>
            <button onclick="addPizzaToCart(${i})" class="btn-confirm" style="padding:10px; font-size:0.9rem; background:var(--dark)">Adicionar</button>
        </div>`;
    });
    html += '</div>';

    // DOCES E BEBIDAS
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
            <p style="font-size:0.8rem; color:#666; margin:5px 0 15px 0;">${item.desc}</p>
            <button onclick="addSimpleToCart('${item.name}', ${item.price})" class="btn-confirm" style="padding:10px; font-size:0.9rem; background:var(--dark)">Adicionar</button>
        </div>`;
    });
    return html + '</div>';
}

// --- LÓGICA DO CARRINHO ---
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
            alert("Por favor, selecione o segundo sabor!");
            return;
        }
        const p2 = menuData.pizzas.find(p => p.name === flavor2Name);
        // Regra da pizza mais cara
        finalPrice = Math.max(p1.price, p2.price);
        finalName = `½ ${p1.name} / ½ ${p2.name}`;
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
        list.innerHTML = `<p class="empty-text" style="text-align:center; color:#999; padding:20px;">Seu carrinho está vazio.</p>`;
    } else {
        list.innerHTML = cart.map((item, idx) => `
            <div class="item-row" style="display:flex; justify-content:space-between; align-items:center; padding:10px 0; border-bottom:1px solid #f0f0f0;">
                <div style="font-size:0.9rem;"><strong>${item.name}</strong></div>
                <div style="display:flex; align-items:center; gap:12px;">
                    <span style="font-weight:600;">R$ ${item.price.toFixed(2)}</span>
                    <button class="btn-del" onclick="removeItem(${idx})" style="color:#e74c3c; border:none; background:none; cursor:pointer; font-size:1.1rem;"><i class="fas fa-times-circle"></i></button>
                </div>
            </div>
        `).join('');
    }

    const total = cart.reduce((sum, i) => sum + i.price, 0);
    totalDisp.innerText = `R$ ${total.toFixed(2)}`;
    countDisp.innerText = cart.length;
}

window.removeItem = (idx) => {
    cart.splice(idx, 1);
    updateCart();
};

window.clearCart = () => {
    if(confirm("Deseja limpar todo o carrinho?")) {
        cart = [];
        updateCart();
    }
};

// --- BUSCA E UTILITÁRIOS ---
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
    if(slides.length === 0) return;
    setInterval(() => {
        slides[slideIndex].classList.remove('active');
        slideIndex = (slideIndex + 1) % slides.length;
        slides[slideIndex].classList.add('active');
    }, 4000);
}

window.scrollToElement = (id) => {
    document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
};

// --- FINALIZAR WHATSAPP ---
document.getElementById('finalizar-pedido').addEventListener('click', () => {
    const nome = document.getElementById('client-name').value.trim();
    if (!nome) {
        alert("Por favor, informe seu nome antes de finalizar!");
        document.getElementById('client-name').focus();
        return;
    }
    if (cart.length === 0) {
        alert("Seu carrinho está vazio!");
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
    msg += `*TOTAL:* ${total}%0A%0A`;
    msg += `*Endereço:* Rua Aluísio Azevedo, 297`;

    window.open(`https://wa.me/5511985878638?text=${msg}`);
});
