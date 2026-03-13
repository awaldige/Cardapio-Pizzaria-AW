// ==========================================
// PAINEL DE CONTROLE DO CARDÁPIO
// ==========================================
const DATA = [
    {
        categoria: "Pizzas",
        icone: "fa-pizza-slice",
        itens: [
            { nome: "Margherita", preco: 25.00, desc: "Molho, mussarela e manjericão" },
            { nome: "Mussarela", preco: 30.00, desc: "Mussarela premium e orégano" },
            { nome: "Portuguesa", preco: 32.00, desc: "Ovo, presunto, cebola e ervilha" },
            { nome: "Frango com Catupiry", preco: 30.00, desc: "Frango desfiado com catupiry" },
            { nome: "Pepperoni", preco: 30.00, desc: "Mussarela e fatias de pepperoni" },
            { nome: "Calabresa", preco: 32.00, desc: "Calabresa fatiada e cebola" },
            { nome: "Quatro Queijos", preco: 35.00, desc: "Mussarela, provolone, parmesão e gorgonzola" },
            { nome: "Vegetariana", preco: 28.00, desc: "Mix de legumes selecionados" },
            { nome: "Rúcula", preco: 40.00, desc: "Rúcula fresca e tomate seco" },
            { nome: "Atum", preco: 30.00, desc: "Atum sólido e cebola" },
            { nome: "Camarão", preco: 50.00, desc: "Camarão médio e molho especial" },
            { nome: "Palmito", preco: 35.00, desc: "Palmito macio e mussarela" }
        ]
    },
    {
        categoria: "Bebidas",
        icone: "fa-wine-glass",
        itens: [
            { nome: "Água Mineral", preco: 3.00, desc: "500ml" },
            { nome: "Refrigerante Lata", preco: 5.00, desc: "350ml" },
            { nome: "Cerveja Lata", preco: 8.00, desc: "Heineken/Brahma" },
            { nome: "Suco de Uva", preco: 6.00, desc: "Natural 300ml" },
            { nome: "Suco de Morango", preco: 7.50, desc: "Natural 300ml" },
            { nome: "Suco de Maracujá", preco: 6.80, desc: "Natural 300ml" },
            { nome: "Suco de Laranja", preco: 5.50, desc: "Natural 300ml" },
            { nome: "Suco de Limão", preco: 5.50, desc: "Natural 300ml" },
            { nome: "Suco de Abacaxi", preco: 7.00, desc: "Natural 300ml" }
        ]
    },
    {
        categoria: "Sobremesas",
        icone: "fa-cookie",
        itens: [
            { nome: "Pudim", preco: 10.00, desc: "Fatia artesanal" },
            { nome: "Torta de Morango", preco: 12.00, desc: "Massa crocante" },
            { nome: "Torta de Limão", preco: 12.00, desc: "Creme de limão siciliano" },
            { nome: "Bolo de Chocolate", preco: 15.00, desc: "Cacau 70%" },
            { nome: "Pavê", preco: 12.00, desc: "Receita da casa" },
            { nome: "Mousse de Maracujá", preco: 10.00, desc: "Aerado e azedinho" },
            { nome: "Gelatina", preco: 5.00, desc: "Frutas variadas" }
        ]
    }
];

// ==========================================
// LÓGICA DO SISTEMA 
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    let order = [];
    const menuContainer = document.getElementById('menu-container');

    // --- LÓGICA DO CARROSSEL ---
    let currentSlide = 0;
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');

    function showSlide(index) {
        slides.forEach(s => s.classList.remove('active'));
        dots.forEach(d => d.classList.remove('active'));

        currentSlide = (index + slides.length) % slides.length;

        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    }

    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => showSlide(currentSlide - 1));
        nextBtn.addEventListener('click', () => showSlide(currentSlide + 1));
    }

    dots.forEach((dot, i) => {
        dot.addEventListener('click', () => showSlide(i));
    });

    // Auto-play do carrossel (4 segundos)
    setInterval(() => showSlide(currentSlide + 1), 4000);

    // --- LÓGICA DO CARDÁPIO ---
    function renderMenu() {
        if(!menuContainer) return;
        menuContainer.innerHTML = DATA.map(cat => `
            <div class="category-group">
                <h3 class="category-title"><i class="fas ${cat.icone}"></i> ${cat.categoria}</h3>
                <div class="items-grid">
                    ${cat.itens.map(item => `
                        <div class="menu-card" data-name="${item.nome}" data-price="${item.preco}">
                            <div class="card-info">
                                <h4>${item.nome}</h4>
                                <small>${item.desc}</small>
                                <span class="price">R$ ${item.preco.toFixed(2)}</span>
                            </div>
                            <button class="add-btn add-to-order"><i class="fas fa-plus"></i></button>
                        </div>
                    `).join('')}
                </div>
            </div>
        `).join('');
    }

    renderMenu();

    // Eventos de adicionar
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('.add-to-order');
        if (btn) {
            const card = btn.closest('.menu-card');
            order.push({
                name: card.dataset.name,
                price: parseFloat(card.dataset.price)
            });
            updateCart();
            
            // Feedback visual de sucesso
            const originalIcon = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-check"></i>';
            btn.style.background = '#2ecc71';
            btn.style.color = 'white';
            setTimeout(() => { 
                btn.innerHTML = originalIcon; 
                btn.style.background = ''; 
                btn.style.color = '';
            }, 800);
        }
    });

    function updateCart() {
        const list = document.getElementById('order-list');
        const totalDisp = document.getElementById('total-price');
        const countDisp = document.getElementById('cart-count');
        
        let total = 0;
        list.innerHTML = order.map((item, i) => {
            total += item.price;
            return `<div class="order-item" style="display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid #eee;">
                <span>${item.name}</span>
                <div style="display: flex; align-items: center; gap: 10px;">
                    <b>R$ ${item.price.toFixed(2)}</b>
                    <i class="fas fa-trash-alt" style="color: #e74c3c; cursor: pointer;" onclick="removeItem(${i})"></i>
                </div>
            </div>`;
        }).join('');

        totalDisp.textContent = `R$ ${total.toFixed(2)}`;
        countDisp.textContent = order.length;
    }

    // Expor removeItem globalmente para o atributo onclick
    window.removeItem = (i) => { 
        order.splice(i, 1); 
        updateCart(); 
    };

    // Busca inteligente
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            document.querySelectorAll('.menu-card').forEach(card => {
                const name = card.dataset.name.toLowerCase();
                const isVisible = name.includes(term);
                card.style.display = isVisible ? 'flex' : 'none';
            });
            
            // Esconde títulos de categoria vazios
            document.querySelectorAll('.category-group').forEach(group => {
                const hasVisibleItems = [...group.querySelectorAll('.menu-card')].some(card => card.style.display !== 'none');
                group.style.display = hasVisibleItems ? 'block' : 'none';
            });
        });
    }

    // Envio WhatsApp
    const btnFinalizar = document.getElementById('finalizar-pedido');
    if (btnFinalizar) {
        btnFinalizar.addEventListener('click', () => {
            if (order.length === 0) return alert("Seu carrinho está vazio!");
            
            let msg = `*🍕 Pedido Pizzaria AW*%0A%0A`;
            msg += order.map(i => `• 1x ${i.name} - _R$ ${i.price.toFixed(2)}_`).join('%0A');
            msg += `%0A%0A*💰 Total:* ${document.getElementById('total-price').textContent}`;
            msg += `%0A%0A_Pedido realizado via Painel Web_`;
            
            window.open(`https://wa.me/5511985878638?text=${msg}`);
        });
    }
});
