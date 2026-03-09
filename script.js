document.addEventListener('DOMContentLoaded', () => {
    const menuList = document.querySelectorAll('.menu-list');
    const searchInput = document.getElementById('search-input');
    const orderList = document.getElementById('order-list');
    const totalPriceSpan = document.getElementById('total-price');
    const finalizarPedidoBtn = document.getElementById('finalizar-pedido');

    let order = [];

    // Função para adicionar item ao pedido
    function addItemToOrder(name, price) {
        order.push({ name, price: parseFloat(price) });
        renderOrder();
    }

    // Função para renderizar o pedido
    function renderOrder() {
        orderList.innerHTML = '';
        let total = 0;
        if (order.length === 0) {
            orderList.innerHTML = '<li>Nenhum item adicionado ao pedido ainda.</li>';
        } else {
            order.forEach((item, index) => {
                const listItem = document.createElement('li');
                listItem.textContent = `${item.name} - R$${item.price.toFixed(2)}`;

                const removeButton = document.createElement('button');
                removeButton.textContent = 'Remover';
                removeButton.classList.add('remove-from-order');
                removeButton.setAttribute('aria-label', `Remover ${item.name} do pedido`);
                removeButton.onclick = () => removeItemFromOrder(index);
                listItem.appendChild(removeButton);

                orderList.appendChild(listItem);
                total += item.price;
            });
        }
        totalPriceSpan.textContent = total.toFixed(2);
    }

    // Função para remover item do pedido
    function removeItemFromOrder(index) {
        order.splice(index, 1);
        renderOrder();
    }

    // Event Listeners para adicionar itens
    menuList.forEach(ul => {
        ul.addEventListener('click', (event) => {
            if (event.target.classList.contains('add-to-order')) {
                const menuItem = event.target.closest('.menu-item');
                const name = menuItem.dataset.name;
                const price = menuItem.dataset.price;
                addItemToOrder(name, price);
            }
        });
    });

    // Funcionalidade de Busca
    searchInput.addEventListener('input', (event) => {
        const searchTerm = event.target.value.toLowerCase();
        document.querySelectorAll('.menu-item').forEach(item => {
            const itemName = item.dataset.name.toLowerCase();
            if (itemName.includes(searchTerm)) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
    });

    // Funcionalidade do Carrossel de Imagens
    const carouselSlides = document.querySelector('.carousel-slides');
    const carouselItems = document.querySelectorAll('.carousel-item');
    const prevButton = document.querySelector('.carousel-button.prev');
    const nextButton = document.querySelector('.carousel-button.next');
    let currentIndex = 0;

    function showSlide(index) {
        carouselItems.forEach((item, i) => {
            item.classList.remove('active');
            if (i === index) {
                item.classList.add('active');
            }
        });
    }

    function nextSlide() {
        currentIndex = (currentIndex + 1) % carouselItems.length;
        showSlide(currentIndex);
    }

    function prevSlide() {
        currentIndex = (currentIndex - 1 + carouselItems.length) % carouselItems.length;
        showSlide(currentIndex);
    }

    prevButton.addEventListener('click', prevSlide);
    nextButton.addEventListener('click', nextSlide);

    // Carrossel automático
    let autoSlideInterval = setInterval(nextSlide, 5000);

    // Pausar carrossel ao passar o mouse e reiniciar ao sair
    carouselSlides.addEventListener('mouseover', () => clearInterval(autoSlideInterval));
    carouselSlides.addEventListener('mouseleave', () => autoSlideInterval = setInterval(nextSlide, 5000));

    // Inicializa o carrossel mostrando o primeiro slide
    showSlide(currentIndex);
    // Renderiza o pedido inicial vazio
    renderOrder();

    finalizarPedidoBtn.addEventListener('click', () => {
        if (order.length === 0) {
            alert('Seu pedido está vazio! Adicione alguns itens antes de finalizar.');
            return;
        }

        const paymentMethod = document.querySelector('input[name="payment-method"]:checked').value;
        const total = totalPriceSpan.textContent;
        const telefonePizzaria = "5511987654321"; // Coloque o número aqui (apenas números)

        // 1. Construir a mensagem de texto
        let mensagem = `*Novo Pedido - Pizzaria AW*%0A`;
        mensagem += `----------------------------%0A`;
        
        order.forEach(item => {
            mensagem += `• ${item.name} - R$${item.price.toFixed(2)}%0A`;
        });

        mensagem += `----------------------------%0A`;
        mensagem += `*Total:* R$${total}%0A`;
        mensagem += `*Pagamento:* ${paymentMethod}%0A`;

        // 2. Criar o link do WhatsApp
        // O encodeURIComponent garante que caracteres especiais não quebrem o link
        const whatsappUrl = `https://wa.me/${telefonePizzaria}?text=${mensagem}`;

        // 3. Abrir o WhatsApp
        window.open(whatsappUrl, '_blank');

        // Opcional: Limpar o pedido após enviar
        // order = [];
        // renderOrder();
    });
    


  
