document.addEventListener('DOMContentLoaded', () => {
    let order = [];
    const cartCount = document.getElementById('cart-count');
    const totalPriceSpan = document.getElementById('total-price');

    // Adicionar Item
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('.add-to-order');
        if (btn) {
            const card = btn.closest('.menu-card');
            order.push({
                name: card.dataset.name,
                price: parseFloat(card.dataset.price)
            });
            updateUI();
            
            // Efeito visual no botão
            btn.style.background = '#25D366';
            btn.style.color = '#fff';
            setTimeout(() => { btn.style.background = ''; btn.style.color = ''; }, 500);
        }
    });

    function updateUI() {
        const orderList = document.getElementById('order-list');
        orderList.innerHTML = '';
        let total = 0;

        order.forEach((item, index) => {
            const div = document.createElement('div');
            div.style.display = 'flex';
            div.style.justifyContent = 'space-between';
            div.style.padding = '10px 0';
            div.style.borderBottom = '1px solid #f9f9f9';
            div.innerHTML = `
                <span>${item.name}</span>
                <span><b>R$ ${item.price.toFixed(2)}</b> <i class="fas fa-trash" onclick="removeItem(${index})" style="color:red; margin-left:10px"></i></span>
            `;
            orderList.appendChild(div);
            total += item.price;
        });

        totalPriceSpan.textContent = `R$ ${total.toFixed(2)}`;
        cartCount.textContent = order.length;
    }

    window.removeItem = (index) => {
        order.splice(index, 1);
        updateUI();
    };

    // Busca
    document.getElementById('search-input').addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        document.querySelectorAll('.menu-card').forEach(card => {
            const name = card.dataset.name.toLowerCase();
            card.style.display = name.includes(term) ? 'flex' : 'none';
        });
    });

    // Finalizar Pedido via WhatsApp e Limpar
    document.getElementById('finalizar-pedido').addEventListener('click', () => {
        if (order.length === 0) return alert("Adicione itens ao carrinho!");

        const payment = document.querySelector('input[name="payment-method"]:checked').value;
        const phone = "5511985878638"; 
        
        let msg = `*Pedido Pizzaria AW*%0A%0A`;
        order.forEach(i => msg += `• ${i.name} (R$${i.price.toFixed(2)})%0A`);
        msg += `%0A*Total:* ${totalPriceSpan.textContent}%0A*Pagamento:* ${payment}`;

        window.open(`https://wa.me/${phone}?text=${msg}`, '_blank');

        // Limpeza Automática com Delay
        setTimeout(() => {
            if(confirm("Deseja limpar seu carrinho para uma nova compra?")) {
                order = [];
                updateUI();
                window.scrollTo({top: 0, behavior: 'smooth'});
            }
        }, 1500);
    });

    // Slideshow
    const slides = document.querySelectorAll('.carousel-item');
    let current = 0;
    setInterval(() => {
        slides[current].classList.remove('active');
        current = (current + 1) % slides.length;
        slides[current].classList.add('active');
    }, 3000);
});
