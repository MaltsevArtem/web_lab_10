// 1. ПЕРЕМЕННЫЕ И ХРАНИЛИЩЕ
let selectedDishes = {
    soup: null,
    main: null,
    salad: null,
    drink: null,
    dessert: null
};

const LS_KEY = 'food-construct-order';

// Сохранение в память браузера (только ID блюд)
function saveOrderToLS() {
    const ids = {};
    for (const cat in selectedDishes) {
        ids[cat] = selectedDishes[cat] ? selectedDishes[cat].id : null;
    }
    localStorage.setItem(LS_KEY, JSON.stringify(ids));
}

// 2. ДОБАВЛЕНИЕ БЛЮДА (вызывается из карточки)
function addToCart(dishId) {
    const dish = dishes.find(d => d.keyword === dishId);
    if (!dish) return;

    selectedDishes[dish.category] = dish;
    updateUI(); // Запускаем обновление интерфейса
}

// 3. ПРОВЕРКА КОМБО (Логика из ЛР 6 и 8)
function checkComboStatus() {
    const s = selectedDishes.soup;
    const m = selectedDishes.main;
    const sl = selectedDishes.salad;
    const d = selectedDishes.drink;

    // Варианты комбо из задания:
    // 1. Суп + Главное + Салат + Напиток
    // 2. Суп + Главное + Напиток
    // 3. Суп + Салат + Напиток
    // 4. Главное + Салат + Напиток
    // 5. Главное + Напиток
    const isCombo = (s && m && sl && d) || (s && m && d) || (s && sl && d) || (m && sl && d) || (m && d);
    
    const checkoutLink = document.getElementById('checkout-link');
    const panel = document.getElementById('sticky-order-panel');

    if (panel) {
        // Показываем панель, если выбрано хотя бы одно блюдо
        const hasAny = Object.values(selectedDishes).some(v => v !== null);
        panel.classList.toggle('hidden', !hasAny);
    }

    if (checkoutLink) {
        // Делаем кнопку активной только если собрано комбо
        if (isCombo) {
            checkoutLink.classList.remove('disabled');
        } else {
            checkoutLink.classList.add('disabled');
        }
    }
}

// 4. ГЛАВНАЯ ФУНКЦИЯ ОБНОВЛЕНИЯ (которую ты спрашивал)
function updateUI() {
    let total = 0;
    const categories = ['soup', 'main', 'salad', 'drink', 'dessert'];
    
    categories.forEach(cat => {
        const dish = selectedDishes[cat];
        if (dish) total += dish.price;
        
        // (Опционально) обновление текста в резюме, если оно есть на этой странице
        const summaryElement = document.getElementById(`summary-${cat}`);
        if (summaryElement) {
            summaryElement.textContent = dish ? `${dish.name} ${dish.price}₽` : 'Блюдо не выбрано';
        }
    });

    // Обновляем цену в липкой панели
    const panelPrice = document.getElementById('panel-total-price');
    if (panelPrice) panelPrice.textContent = total;

    // Сохраняем данные в память (localStorage)
    saveOrderToLS();

    // Запускаем проверку комбо
    checkComboStatus();

    // Подсвечиваем карточки
    highlightCards();
}

// 5. ЗАПУСК ПРИ ЗАГРУЗКЕ
document.addEventListener('DOMContentLoaded', function() {
    // Тут должен быть твой код загрузки блюд из ЛР 7 (loadDishes)
    // После загрузки блюд нужно вызвать проверку, нет ли чего в localStorage
    
    const savedData = localStorage.getItem(LS_KEY);
    if (savedData) {
        const savedIds = JSON.parse(savedData);
        // Здесь после загрузки всех dishes из API нужно будет 
        // сопоставить ID и заполнить selectedDishes
    }
});

function highlightCards() {
    document.querySelectorAll('.card').forEach(card => card.classList.remove('selected'));
    Object.values(selectedDishes).forEach(dish => {
        if (dish) {
            const card = document.querySelector(`.card[data-dish="${dish.keyword}"]`);
            if (card) card.classList.add('selected');
        }
    });
}