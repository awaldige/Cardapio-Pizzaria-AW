document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-input');
    const orderList = document.getElementById('order-list');
    const totalPriceSpan = document.getElementById('total-price');
    const finalizarPedidoBtn = document.getElementById('finalizar-pedido');
    
    let order = [];

    // --- LOGICA DE PEDIDOS ---

    // Delegação de evento para o botão Adicionar (funciona sempre)
    document.addEventListener('click', (event) => {
        if (event.target.classList.contains('add-to-order')) {
            const menuItem = event.target.closest('.menu-item');
            const name = menuItem.dataset.name;
            const price = menuItem.dataset.price;
            addItemToOrder(name, price);
        }
    });

    function addItemToOrder(name, price) {
        order.push({ name, price: parseFloat(price) });
        renderOrder();
    }

    function removeItemFromOrder(index) {
        order.splice(index, 1);
        renderOrder();
    }

    function renderOrder() {
        orderList.innerHTML = '';
        let total = 0;

        if (order.length === 0) {
            orderList.innerHTML = '<li>Nenhum item adicionado ao pedido ainda.</li>';
        } else {
            order.forEach((item, index) => {
                const li = document.createElement('li');
                li.innerHTML = `${item.name} - R$${item.price.toFixed(2)} <button class="remove-from-order" data-index="${index}">Remover</button>`;
                orderList.appendChild(li);
                total += item.price;
            });
        }
        totalPriceSpan.textContent = total.toFixed(2);
    }

    // Clique para remover
    orderList.addEventListener('click', (event) => {
        if (event.target.classList.contains('remove-from-order')) {
            const index = event.target.dataset.index;
            removeItemFromOrder(index);
        }
    });

    // --- BUSCA ---
    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        document.querySelectorAll('.menu-item').forEach(item => {
            const text = item.dataset.name.toLowerCase();
            item.style.display = text.includes(term) ? 'flex' : 'none';
        });
    });

    // --- CARROSSEL ---
    const slides = document.querySelectorAll('.carousel-item');
    let currentSlide = 0;

    function showSlide(index) {
        slides.forEach(s => s.classList.remove('active'));
        slides[index].classList.add('active');
    }

    document.querySelector('.next').addEventListener('click', () => {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    });

    document.querySelector('.prev').addEventListener('click', () => {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(currentSlide);
    });

    setInterval(() => {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }, 5000);

    // --- WHATSAPP ---
    finalizarPedidoBtn.addEventListener('click', () => {
        if (order.length === 0) {
            alert('Seu pedido está vazio!');
            return;
        }

        const payment = document.querySelector('input[name="payment-method"]:checked').value;
        const total = totalPriceSpan.textContent;
        const fone = "5511987654321"; // SEU NUMERO AQUI

        let msg = `*Novo Pedido - Pizzaria AW*%0A%0A`;
        order.forEach(item => {
            msg += `- ${item.name} (R$${item.price.toFixed(2)})%0A`;
        });
        msg += `%0A*Total:* R$ ${total}`;
        msg += `%0A*Pagamento:* ${payment}`;

        window.open(`https://wa.me/${fone}?text=${msg}`, '_blank');
    });
});
