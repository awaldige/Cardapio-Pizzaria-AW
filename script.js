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

    // --- MUDANÇA AQUI: Funcionalidade do botão Finalizar Pedido ---
    finalizarPedidoBtn.addEventListener('click', () => {
        if (order.length === 0) {
            alert('Seu pedido está vazio! Adicione alguns itens antes de finalizar.');
            return;
        }

        let paymentMethod = document.querySelector('input[name="payment-method"]:checked');
        let paymentInfo = paymentMethod ? `Forma de Pagamento: ${paymentMethod.value}` : 'Forma de Pagamento: Não selecionada';

        // Aqui você pode adicionar a lógica para "finalizar" o pedido
        // Por exemplo, enviar os dados para um servidor, exibir uma mensagem, limpar o carrinho, etc.

        // Exemplo: Exibir uma mensagem de sucesso e limpar o pedido
        alert(`Pedido Finalizado com Sucesso!\n\nSeu pedido no valor de R$${totalPriceSpan.textContent} foi registrado.\n${paymentInfo}\n\nAguarde a confirmação da pizzaria.`);

        // Opcional: Limpar o pedido após a finalização
        order = []; // Esvazia o array do pedido
        renderOrder(); // Atualiza a exibição para mostrar o pedido vazio

        // Opcional: Rolagem para o topo ou para uma seção de confirmação
        // window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    // --- FIM DA MUDANÇA ---
});



  
