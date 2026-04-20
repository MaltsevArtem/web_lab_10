// Объект для хранения текущих фильтров
let currentFilters = {
    soup: null,
    main: null,
    salad: null,
    drink: null,
    dessert: null
};

// Функция инициализации фильтров
function initFilters() {
    console.log('Инициализация фильтров...');
    
    // Находим все кнопки фильтров
    const filterButtons = document.querySelectorAll('.filter-btn');
    console.log('Найдено кнопок фильтров:', filterButtons.length);
    
    // Добавляем обработчики событий для каждой кнопки
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            const kind = this.getAttribute('data-kind');
            
            console.log(`Клик по фильтру: категория=${category}, вид=${kind}`);
            
            // Если фильтр уже активен, снимаем его
            if (currentFilters[category] === kind) {
                currentFilters[category] = null;
                this.classList.remove('active');
                console.log(`Снят фильтр для ${category}`);
            } else {
                // Снимаем активный класс со всех кнопок этой категории
                const categoryButtons = document.querySelectorAll(`.filter-btn[data-category="${category}"]`);
                categoryButtons.forEach(btn => btn.classList.remove('active'));
                
                // Устанавливаем новый фильтр
                currentFilters[category] = kind;
                this.classList.add('active');
                console.log(`Установлен фильтр для ${category}: ${kind}`);
            }
            
            // Применяем фильтры
            applyFilters();
        });
    });
    
    // Инициализируем отображение с текущими фильтрами
    applyFilters();
}

// Функция применения фильтров
function applyFilters() {
    console.log('Применение фильтров...', currentFilters);
    
    // Фильтруем блюда
    const filteredDishes = dishes.filter(dish => {
        // Если для категории блюда установлен фильтр, проверяем соответствие
        const categoryFilter = currentFilters[dish.category];
        if (categoryFilter) {
            return dish.kind === categoryFilter;
        }
        // Если фильтр не установлен, блюдо проходит
        return true;
    });
    
    console.log('Отфильтровано блюд:', filteredDishes.length);
    
    // Перерисовываем блюда
    displayFilteredDishes(filteredDishes);
}

// Функция отображения отфильтрованных блюд
function displayFilteredDishes(filteredDishesArray) {
    console.log('Перерисовка блюд...');
    
    // Сортируем блюда по алфавиту
    const sortedDishes = [...filteredDishesArray].sort((a, b) => a.name.localeCompare(b.name));

    // Группируем блюда по категориям
    const dishesByCategory = {
        soup: sortedDishes.filter(dish => dish.category === 'soup'),
        main: sortedDishes.filter(dish => dish.category === 'main'),
        salad: sortedDishes.filter(dish => dish.category === 'salad'),
        drink: sortedDishes.filter(dish => dish.category === 'drink'),
        dessert: sortedDishes.filter(dish => dish.category === 'dessert')
    };

    // Отображаем блюда в соответствующих секциях
    displayCategoryDishes('soup', dishesByCategory.soup);
    displayCategoryDishes('main', dishesByCategory.main);
    displayCategoryDishes('salad', dishesByCategory.salad);
    displayCategoryDishes('drink', dishesByCategory.drink);
    displayCategoryDishes('dessert', dishesByCategory.dessert);
}

// Функция для отображения блюд категории
function displayCategoryDishes(category, dishesArray) {
    const menuGrid = document.getElementById(`${category}-dishes`);
    if (!menuGrid) {
        console.error(`Элемент #${category}-dishes не найден`);
        return;
    }

    // Очищаем существующие карточки
    menuGrid.innerHTML = '';

    // Если нет блюд в этой категории, показываем сообщение
    if (dishesArray.length === 0) {
        const message = document.createElement('p');
        message.className = 'no-dishes-message';
        message.textContent = 'Нет блюд, соответствующих фильтру';
        menuGrid.appendChild(message);
        return;
    }

    // Создаем карточки для каждого блюда
    dishesArray.forEach(dish => {
        const card = createDishCard(dish);
        menuGrid.appendChild(card);
    });
}

// Функция создания карточки блюда
function createDishCard(dish) {
    const card = document.createElement('div');
    card.className = 'card';
    card.setAttribute('data-dish', dish.keyword);
    card.setAttribute('data-category', dish.category);
    card.setAttribute('data-kind', dish.kind);

    card.innerHTML = `
        <img src="${dish.image}" alt="${dish.name}" onerror="this.src='images/default.jpg'">
        <p class="price">${dish.price}₽</p>
        <p class="title">${dish.name}</p>
        <p class="weight">${dish.count}</p>
        <button class="add-to-cart-btn" data-id="${dish.keyword}">Добавить</button>
    `;

    // Добавляем обработчик для кнопки "Добавить"
    const addButton = card.querySelector('.add-to-cart-btn');
    addButton.addEventListener('click', function(e) {
        e.stopPropagation();
        const dishId = this.getAttribute('data-id');
        console.log('Добавление в корзину:', dishId);
        if (typeof addToCart === 'function') {
            addToCart(dishId);
        } else {
            console.error('Функция addToCart не найдена');
        }
    });

    return card;
}

// Экспортируем функцию для использования в других файлах
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { initFilters };
}