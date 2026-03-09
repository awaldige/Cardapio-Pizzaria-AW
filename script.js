document.addEventListener('DOMContentLoaded', () => {
    let order = [];
    const orderList = document.getElementById('order-list');
    const totalPriceSpan = document.getElementById('total-price');

    // Adicionar Item (Delegação de Evento)
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('add-to-order')) {
            const item = e.target.closest('.menu-item');
            const name = item.dataset.name;
            const price = parseFloat(item.dataset.price);
            order.push({ name, price });
            renderOrder();
        }
    });

    // Remover Item
    orderList.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-from-order')) {
            const index = e.target.dataset.index;
            order.splice(index, 1);
            renderOrder();
        }
    });

    function renderOrder() {
        orderList.innerHTML = '';
        let total = 0;
        if (order.length === 0) {
            orderList.innerHTML = '<li>Carrinho vazio...</li>';
        } else {
            order.forEach((item, index) => {
                const li = document.createElement('li');
                li.innerHTML = `<span>${item.name}</span> <span>R$ ${item.price.toFixed(2)} <button class="remove-from-order" data-index="${index}" style="background:red; color:white; border:none; padding:2px 5px; border-radius:3px; cursor:pointer; margin-left:10px;">X</button></span>`;
                orderList.appendChild(li);
                total += item.price;
            });
        }
        totalPriceSpan.textContent = total.toFixed(2);
    }

    // Busca
    document.getElementById('search-input').addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        document.querySelectorAll('.menu-item').forEach(el => {
            const name = el.dataset.name.toLowerCase();
            el.style.display = name.includes(term) ? 'block' : 'none';
        });
    });

    // WhatsApp + Limpeza
    document.getElementById('finalizar-pedido').addEventListener('click', () => {
        if (order.length === 0) return alert("Adicione itens!");
        const payment = document.querySelector('input[name="payment-method"]:checked').value;
        let msg = `*Pedido Pizzaria AW*%0A%0A`;
        order.forEach(i => msg += `• ${i.name}%0A`);
        msg += `%0A*Total:* R$ ${totalPriceSpan.textContent}%0A*Pagamento:* ${payment}`;
        window.open(`https://wa.me/5511987654321?text=${msg}`, '_blank');

        setTimeout(() => {
            if(confirm("Deseja limpar o carrinho para um novo pedido?")) {
                order = [];
                renderOrder();
                window.scrollTo({top: 0, behavior: 'smooth'});
            }
        }, 2000);
    });

    // Carousel
    const slides = document.querySelectorAll('.carousel-item');
    let current = 0;
    function next() {
        slides[current].classList.remove('active');
        current = (current + 1) % slides.length;
        slides[current].classList.add('active');
    }
    setInterval(next, 4000);
    document.querySelector('.next').onclick = next;
    document.querySelector('.prev').onclick = () => {
        slides[current].classList.remove('active');
        current = (current - 1 + slides.length) % slides.length;
        slides[current].classList.add('active');
    };
});
