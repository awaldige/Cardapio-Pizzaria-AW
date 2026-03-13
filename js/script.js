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
        { name: "Brownie com Calda", price: 16.00, desc: "Brownie de chocolate belga acompanhado de calda quente." }
    ],
    bebidas: [
        { name: "Coca-Cola 2L", price: 14.00, desc: "Garrafa Pet gelada" },
        { name: "Coca-Cola Lata", price: 6.00, desc: "350ml bem gelada" },
        { name: "Suco Natural", price: 10.00, desc: "Laranja ou Limão 500ml" },
        { name: "Água Mineral", price: 4.00, desc: "500ml sem gás" }
    ]
};

const sizeModifiers = { "grande": 1.0, "media": 0.8, "broto": 0.6 };
let cart = JSON.parse(localStorage.getItem('pizzaria_aw_cart')) || [];
let slideIndex = 0;

document.addEventListener('DOMContentLoaded', () => {
    renderMenu();
    updateCartUI();
    setupCarousel();
    setupSearch();
});

// --- CARROSSEL ---
function setupCarousel() {
    showSlides(slideIndex);
    setInterval(() => changeSlide(1), 5000);
}
window.changeSlide = (n) => { showSlides(slideIndex += n); };
window.currentSlide = (n) => { showSlides(slideIndex = n); };
function showSlides(n) {
    let slides = document.getElementsByClassName("carousel-slide");
    let dots = document.getElementsByClassName("dot");
    if (n >= slides.length) slideIndex = 0;
    if (n < 0) slideIndex = slides.length - 1;
    for (let i = 0; i < slides.length; i++) slides[i].classList.remove("active");
    for (let i = 0; i < dots.length; i++) dots[i].classList.remove("active");
    if (slides[slideIndex]) slides[slideIndex].classList.add("active");
    if (dots[slideIndex]) dots[slideIndex].classList.add("active");
}

// --- MENU ---
function renderMenu() {
    const container = document.getElementById('menu-container');
    let html = generateSection("🍕 Pizzas Salgadas", menuData.pizzas, true);
    html += generateSection("🍰 Sobremesas & Doces", menuData.doces, false);
    html += generateSection("🥤 Bebidas", menuData.bebidas, false);
    container.innerHTML = html;
}

function generateSection(title, items, isPizza) {
    let html = `<h2 class="category-title">${title}</h2><div class="menu-grid">`;
    items.forEach((item, i) => {
        html += `
            <div class="menu-card item-card" data-name="${item.name}">
                <h4>${item.name}</h4>
                <p class="desc-text">${item.desc}</p>
                ${isPizza ? `
                    <div class="pizza-options">
                        <select id="size-${title}-${i}" class="option-select">
                            <option value="grande">Grande</option>
                            <option value="media">Média</option>
                            <option value="broto">Broto</option>
                        </select>
                        <label class="half-check"><input type="checkbox" onchange="toggleMeio('${title}', ${i})" id="chk-${title}-${i}"> Meio a Meio?</label>
                        <div id="box-meio-${title}-${i}" style="display:none">
                            <select id="sabor2-${title}-${i}" class="option-select">
                                <option value="">2º Sabor...</option>
                                ${menuData.pizzas.map(p => `<option value="${p.name}">${p.name}</option>`).join('')}
                            </select>
                        </div>
                    </div>` : `<p class="price-simple">R$ ${item.price.toFixed(2)}</p>`}
                <button onclick="${isPizza ? `addPizza('${title}', ${i})` : `addSimple('${item.name}', ${item.price})`}" class="add-btn">ADICIONAR</button>
            </div>`;
    });
    return html + '</div>';
}

window.toggleMeio = (title, i) => {
    const box = document.getElementById(`box-meio-${title}-${i}`);
    box.style.display = document.getElementById(`chk-${title}-${i}`).checked ? 'block' : 'none';
};

window.addPizza = (title, i) => {
    const p1 = (title === "🍕 Pizzas Salgadas") ? menuData.pizzas[i] : menuData.doces[i];
    const size = document.getElementById(`size-${title}-${i}`).value;
    const isMeio = document.getElementById(`chk-${title}-${i}`).checked;
    const s2 = document.getElementById(`sabor2-${title}-${i}`).value;
    let price = p1.price * sizeModifiers[size];
    let name = `${p1.name} (${size})`;
    if(isMeio && s2){
        const p2 = menuData.pizzas.find(x => x.name === s2);
        price = Math.max(price, p2.price * sizeModifiers[size]);
        name = `Meio ${p1.name} / ${s2} (${size})`;
    }
    cart.push({ id: Date.now(), name, price });
    updateCartUI();
};

window.addSimple = (name, price) => {
    cart.push({ id: Date.now(), name, price });
    updateCartUI();
};

// --- CARRINHO ---
function updateCartUI() {
    const list = document.getElementById('order-list');
    list.innerHTML = cart.length === 0 ? '<p class="empty-msg">Nenhum item adicionado.</p>' : 
        cart.map((it, idx) => `<div class="cart-item"><span>${it.name}</span><span>R$ ${it.price.toFixed(2)} <i class="fas fa-trash" onclick="remove(${idx})"></i></span></div>`).join('');
    const total = cart.reduce((acc, i) => acc + i.price, 0);
    document.getElementById('total-price').innerText = `R$ ${total.toFixed(2)}`;
    document.getElementById('cart-count').innerText = cart.length;
    localStorage.setItem('pizzaria_aw_cart', JSON.stringify(cart));
}

window.remove = (idx) => { cart.splice(idx, 1); updateCartUI(); };

function setupSearch() {
    document.getElementById('search-input').addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        document.querySelectorAll('.item-card').forEach(card => {
            card.style.display = card.dataset.name.toLowerCase().includes(term) ? 'block' : 'none';
        });
    });
}

// --- WHATSAPP ---
document.getElementById('finalizar-pedido').addEventListener('click', () => {
    const nome = document.getElementById('client-name').value.trim();
    if (!nome) { alert("Por favor, digite seu nome!"); return; }
    if (cart.length === 0) { alert("Carrinho vazio!"); return; }

    const pag = document.getElementById('payment').value;
    let msg = `*PEDIDO PIZZARIA AW*%0A*Cliente:* ${nome}%0A--------------------%0A`;
    cart.forEach(i => msg += `• ${i.name} - R$ ${i.price.toFixed(2)}%0A`);
    msg += `--------------------%0A*Pagamento:* ${pag}%0A*TOTAL:* ${document.getElementById('total-price').innerText}`;
    
    window.open(`https://wa.me/5511985878638?text=${msg}`);
});
