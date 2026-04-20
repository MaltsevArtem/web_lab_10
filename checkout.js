const API_KEY = '3a511289-43b6-49a8-82f3-00decaa84995'; // ЗАМЕНИ НА СВОЙ КЛЮЧ
const LS_KEY = 'food-construct-order';

document.addEventListener('DOMContentLoaded', async () => {
    const savedIds = JSON.parse(localStorage.getItem(LS_KEY)) || {};
    const response = await fetch('https://edu.std-900.ist.mospolytech.ru/labs/api/dishes');
    const allDishes = await response.json();
    
    renderOrder(savedIds, allDishes);
});

function renderOrder(ids, allDishes) {
    const container = document.getElementById('order-items-container');
    const categories = ['soup', 'main', 'salad', 'drink', 'dessert'];
    let total = 0;
    let hasItems = false;

    categories.forEach(cat => {
        const dishId = ids[cat];
        const summaryText = document.getElementById(`summary-${cat}`);
        
        if (dishId) {
            hasItems = true;
            const dish = allDishes.find(d => d.id == dishId);
            if (dish) {
                total += dish.price;
                summaryText.textContent = `${dish.name} ${dish.price}₽`;
                
                // Создаем карточку с кнопкой "Удалить"
                const card = document.createElement('div');
                card.className = 'card';
                card.innerHTML = `
                    <img src="${dish.image}" alt="${dish.name}">
                    <p class="price">${dish.price}₽</p>
                    <p class="title">${dish.name}</p>
                    <button onclick="removeFromOrder('${cat}')">Удалить</button>
                `;
                container.appendChild(card);
            }
        } else {
            summaryText.textContent = 'Не выбрано';
        }
    });

    if (hasItems) document.getElementById('empty-msg').style.display = 'none';
    document.getElementById('total-price').textContent = total + ' ₽';
}

function removeFromOrder(category) {
    const ids = JSON.parse(localStorage.getItem(LS_KEY));
    ids[category] = null;
    localStorage.setItem(LS_KEY, JSON.stringify(ids));
    location.reload(); // Перезагружаем, чтобы обновить список
}

// ОТПРАВКА ЗАКАЗА
document.getElementById('final-order-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const ids = JSON.parse(localStorage.getItem(LS_KEY));
    const formData = new FormData(e.target);

    // Проверка комбо перед отправкой (ЛР 6/8)
    if (!( (ids.soup && ids.main && ids.drink) || (ids.main && ids.drink) )) {
        alert('Ваш заказ не соответствует ни одному комбо. Пожалуйста, соберите комбо!');
        return;
    }

    const orderData = new FormData();
    orderData.append('full_name', formData.get('name'));
    orderData.append('email', formData.get('email'));
    orderData.append('phone', formData.get('phone'));
    orderData.append('delivery_address', formData.get('address'));
    orderData.append('delivery_type', formData.get('delivery'));
    orderData.append('delivery_time', formData.get('time'));
    orderData.append('comment', formData.get('comment'));
    
    // Добавляем ID блюд
    if (ids.soup) orderData.append('soup_id', ids.soup);
    if (ids.main) orderData.append('main_course_id', ids.main);
    if (ids.salad) orderData.append('salad_id', ids.salad);
    if (ids.drink) orderData.append('drink_id', ids.drink);
    if (ids.dessert) orderData.append('dessert_id', ids.dessert);

    try {
        const res = await fetch(`https://edu.std-900.ist.mospolytech.ru/labs/api/orders?api_key=${API_KEY}`, {
            method: 'POST',
            body: orderData
        });

        if (res.ok) {
            alert('Заказ успешно отправлен!');
            localStorage.removeItem(LS_KEY); // Очищаем корзину
            window.location.href = 'index.html';
        } else {
            const data = await res.json();
            alert('Ошибка: ' + (data.error || 'Что-то пошло не так'));
        }
    } catch (err) {
        alert('Ошибка связи с сервером');
    }
});