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
        { name: "Pudim de Leite", price: 12.00, desc: "Pudim caseiro com calda de caramelo dourada." },
        { name: "Brownie com Calda", price: 16.00, desc: "Brownie de chocolate belga acompanhado de calda quente." }
    ],
    bebidas: [
        { name: "Coca-Cola 2L", price: 14.00, desc: "Garrafa Pet gelada" },
        { name: "Suco Natural", price: 10.00, desc: "Laranja ou Limão 500ml" },
        { name: "Cerveja", price: 6.00, desc: "Heineken" }
        
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
window.changeSlide = (n) => showSlides(slideIndex += n);
window.currentSlide = (n) => showSlides(slideIndex = n);
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
    html += generateSection("🍰 Sobremesas", menuData.doces, false);
    html += generateSection("🥤 Bebidas", menuData.bebidas, false);
    container.innerHTML = html;
}

function generateSection(title, items, isPizza) {
    let html = `<h2 class="category-title">${title}</h2><div class="menu-grid">`;
    items.forEach((item, i) => {
        html += `<div class="menu-card item-card" data-name="${item.name}">
            <h4>${item.name}</h4>
            <p class="desc-text">${item.desc}</p>
            ${isPizza ? `<select id="size-${i}" class="option-select">
                <option value="grande">Grande</option><option value="media">Média</option><option value="broto">Broto</option>
            </select>` : `<p>R$ ${item.price.toFixed(2)}</p>`}
            <button onclick="${isPizza ? `addPizza(${i})` : `addSimple('${item.name}', ${item.price})`}" class="add-btn">ADICIONAR</button>
        </div>`;
    });
    return html + '</div>';
}

window.addPizza = (i) => {
    const p = menuData.pizzas[i];
    const size = document.getElementById(`size-${i}`).value;
    const price = p.price * sizeModifiers[size];
    cart.push({ name: `${p.name} (${size})`, price });
    updateCartUI();
};

window.addSimple = (name, price) => {
    cart.push({ name, price });
    updateCartUI();
};

function updateCartUI() {
    const list = document.getElementById('order-list');
    list.innerHTML = cart.map((it, idx) => `<div class="cart-item"><span>${it.name}</span><span>R$ ${it.price.toFixed(2)} <i class="fas fa-trash" onclick="remove(${idx})"></i></span></div>`).join('');
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
    if (!nome || cart.length === 0) return alert("Por favor, digite seu nome e adicione itens!");
    const pag = document.getElementById('payment').value;
    let msg = `*PEDIDO PIZZARIA AW*%0A*Cliente:* ${nome}%0A--------------------%0A`;
    cart.forEach(i => msg += `• ${i.name} - R$ ${i.price.toFixed(2)}%0A`);
    msg += `--------------------%0A*Total:* ${document.getElementById('total-price').innerText}%0A*Pagamento:* ${pag}`;
    window.open(`https://wa.me/5511985878638?text=${msg}`);
});
