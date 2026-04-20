// displayDishes.js
document.addEventListener('DOMContentLoaded', function () {
     console.log('DOM загружен, начинаем отображение блюд');
    console.log('Всего блюд в массиве:', dishes.length);
    
    // Проверяем первые 3 блюда
    if (dishes.length > 0) {
        console.log('Пример блюда 1:', dishes[0]);
        console.log('Путь к изображению 1:', dishes[0].image);
        console.log('Полный путь 1:', 'images/' + dishes[0].image);
    }

    // Инициализируем фильтры
    if (typeof initFilters === 'function') {
        initFilters();
    } else {
        console.error('Функция initFilters не найдена');
        // Если фильтры не загрузились, показываем все блюда
        displayAllDishes();
    }
});

// Функция отображения всех блюд (без фильтров)
function displayAllDishes() {
    console.log('Отображение всех блюд...');

    // Сортируем блюда по алфавиту
    const sortedDishes = [...dishes].sort((a, b) => a.name.localeCompare(b.name));

    // Группируем блюда по категориям (теперь 5 категорий)
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

    // Функция для отображения блюд категории
    function displayCategoryDishes(category, dishesArray) {
        const section = document.querySelector(`section:nth-of-type(${getSectionIndex(category)})`);
        if (!section) return;

        const menuGrid = section.querySelector('.menu-grid');
        if (!menuGrid) return;

        // Очищаем существующие карточки
        menuGrid.innerHTML = '';

        // Создаем карточки для каждого блюда
        dishesArray.forEach(dish => {
            const card = createDishCard(dish);
            menuGrid.appendChild(card);
        });
    }

    // Функция для определения индекса секции
    function getSectionIndex(category) {
        switch (category) {
            case 'soup': return 1;
            case 'main': return 2;
            case 'salad': return 3;
            case 'drink': return 4;
            case 'dessert': return 5;
            default: return 1;
        }
    }

    // Функция создания карточки блюда (обновленная)
    function createDishCard(dish) {
        const card = document.createElement('div');
        card.className = 'card';
        card.setAttribute('data-dish', dish.keyword);
        card.setAttribute('data-category', dish.category); // Добавляем категорию
        card.setAttribute('data-kind', dish.kind); // Добавляем тип для фильтрации

        card.innerHTML = `
            <img src="${dish.image}" alt="${dish.name}">
            <p class="price">${dish.price}₽</p>
            <p class="title">${dish.name}</p>
            <p class="weight">${dish.count}</p>
            <button class="add-to-cart-btn" data-id="${dish.keyword}">Добавить</button>
        `;

        // Добавляем обработчик для кнопки "Добавить"
        const addButton = card.querySelector('.add-to-cart-btn');
        addButton.addEventListener('click', function(e) {
            e.stopPropagation(); // Предотвращаем всплытие
            const dishId = this.getAttribute('data-id');
            addToCart(dishId);
        });

        return card;
    }

    // Функция для обновления подсветки выбранных карточек
    function updateSelectedCards() {
        // Убираем подсветку со всех карточек
        document.querySelectorAll('.card').forEach(card => {
            card.classList.remove('selected');
        });

        // Подсвечиваем выбранные карточки
        Object.keys(selectedDishes).forEach(category => {
            if (selectedDishes[category]) {
                const selectedCard = document.querySelector(`[data-dish="${selectedDishes[category].keyword}"]`);
                if (selectedCard) {
                    selectedCard.classList.add('selected');
                }
            }
        });
    }

    // Инициализируем фильтры после загрузки блюд
    if (typeof initFilters === 'function') {
        initFilters();
    }
};

// Глобальная функция для обновления отображения блюд (для фильтров)
function displayDishes() {
    // Сортируем блюда по алфавиту
    const sortedDishes = [...dishes].sort((a, b) => a.name.localeCompare(b.name));

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

    function displayCategoryDishes(category, dishesArray) {
        const section = document.querySelector(`section:nth-of-type(${getSectionIndex(category)})`);
        if (!section) return;

        const menuGrid = section.querySelector('.menu-grid');
        if (!menuGrid) return;

        // Очищаем существующие карточки
        menuGrid.innerHTML = '';

        // Создаем карточки для каждого блюда
        dishesArray.forEach(dish => {
            const card = createDishCard(dish);
            menuGrid.appendChild(card);
        });
    }

    function getSectionIndex(category) {
        switch (category) {
            case 'soup': return 1;
            case 'main': return 2;
            case 'salad': return 3;
            case 'drink': return 4;
            case 'dessert': return 5;
            default: return 1;
        }
    }
}