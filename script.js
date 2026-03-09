document.addEventListener('DOMContentLoaded', () => {
    let order = [];
    const orderList = document.getElementById('order-list');
    const totalPriceSpan = document.getElementById('total-price');
    const searchInput = document.getElementById('search-input');

    // 1. Adicionar Item
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('add-to-order')) {
            const item = e.target.closest('.menu-item');
            order.push({
                name: item.dataset.name,
                price: parseFloat(item.dataset.price)
            });
            renderOrder();
        }
    });

    // 2. Remover Item
    orderList.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-from-order')) {
            const index = e.target.dataset.index;
            order.splice(index, 1);
            renderOrder();
        }
    });

    // 3. Renderizar Pedido
    function renderOrder() {
        orderList.innerHTML = '';
        let total = 0;
        
        if (order.length === 0) {
            orderList.innerHTML = '<li>Carrinho vazio...</li>';
        } else {
            order.forEach((item, index) => {
                const li = document.createElement('li');
                li.innerHTML = `
                    ${item.name} - R$${item.price.toFixed(2)}
                    <button class="remove-from-order" data-index="${index}">x</button>
                `;
                orderList.appendChild(li);
                total += item.price;
            });
        }
        totalPriceSpan.textContent = total.toFixed(2);
    }

    // 4. Busca
    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        document.querySelectorAll('.menu-item').forEach(el => {
            const name = el.dataset.name.toLowerCase();
            el.style.display = name.includes(term) ? 'block' : 'none';
        });
    });

    // 5. WhatsApp e Limpar
    document.getElementById('finalizar-pedido').addEventListener('click', () => {
        if (order.length === 0) return alert("Adicione itens primeiro!");

        const payment = document.querySelector('input[name="payment-method"]:checked').value;
        const phone = "5511987654321"; // Ajuste seu número aqui
        
        let msg = `*Novo Pedido - Pizzaria AW*%0A%0A`;
        order.forEach(i => msg += `• ${i.name} (R$${i.price.toFixed(2)})%0A`);
        msg += `%0A*Total:* R$${totalPriceSpan.textContent}%0A*Pagamento:* ${payment}`;

        window.open(`https://wa.me/${phone}?text=${msg}`, '_blank');

        // Limpeza automática
        setTimeout(() => {
            if(confirm("Deseja limpar seu pedido atual?")) {
                order = [];
                renderOrder();
                window.scrollTo({top: 0, behavior: 'smooth'});
            }
        }, 1500);
    });

    // 6. Carrossel Simples
    const slides = document.querySelectorAll('.carousel-item');
    let current = 0;
    function next() {
        slides[current].classList.remove('active');
        current = (current + 1) % slides.length;
        slides[current].classList.add('active');
    }
    document.querySelector('.next').onclick = next;
    document.querySelector('.prev').onclick = () => {
        slides[current].classList.remove('active');
        current = (current - 1 + slides.length) % slides.length;
        slides[current].classList.add('active');
    };
    setInterval(next, 4000);
});
