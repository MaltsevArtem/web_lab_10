let currentFilters = {
    soup: null,
    main: null,
    salad: null,
    drink: null,
    dessert: null
};

function initFilters() {
    console.log('Инициализация фильтров...');
    
    const filterButtons = document.querySelectorAll('.filter-btn');
    console.log('Найдено кнопок фильтров:', filterButtons.length);
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            const kind = this.getAttribute('data-kind');
            
            console.log(`Клик по фильтру: категория=${category}, вид=${kind}`);
            
            if (currentFilters[category] === kind) {
                currentFilters[category] = null;
                this.classList.remove('active');
                console.log(`Снят фильтр для ${category}`);
            } else {
                const categoryButtons = document.querySelectorAll(`.filter-btn[data-category="${category}"]`);
                categoryButtons.forEach(btn => btn.classList.remove('active'));
                
                currentFilters[category] = kind;
                this.classList.add('active');
                console.log(`Установлен фильтр для ${category}: ${kind}`);
            }
            
            applyFilters();
        });
    });
    
    applyFilters();
}

function applyFilters() {
    console.log('Применение фильтров...', currentFilters);
    
    const filteredDishes = dishes.filter(dish => {
        const categoryFilter = currentFilters[dish.category];
        if (categoryFilter) {
            return dish.kind === categoryFilter;
        }
        return true;
    });
    
    console.log('Отфильтровано блюд:', filteredDishes.length);
    
    displayFilteredDishes(filteredDishes);
}

function displayFilteredDishes(filteredDishesArray) {
    console.log('Перерисовка блюд...');
    
    const sortedDishes = [...filteredDishesArray].sort((a, b) => a.name.localeCompare(b.name));

    const dishesByCategory = {
        soup: sortedDishes.filter(dish => dish.category === 'soup'),
        main: sortedDishes.filter(dish => dish.category === 'main'),
        salad: sortedDishes.filter(dish => dish.category === 'salad'),
        drink: sortedDishes.filter(dish => dish.category === 'drink'),
        dessert: sortedDishes.filter(dish => dish.category === 'dessert')
    };

    displayCategoryDishes('soup', dishesByCategory.soup);
    displayCategoryDishes('main', dishesByCategory.main);
    displayCategoryDishes('salad', dishesByCategory.salad);
    displayCategoryDishes('drink', dishesByCategory.drink);
    displayCategoryDishes('dessert', dishesByCategory.dessert);
}

function displayCategoryDishes(category, dishesArray) {
    const menuGrid = document.getElementById(`${category}-dishes`);
    if (!menuGrid) {
        console.error(`Элемент #${category}-dishes не найден`);
        return;
    }

    menuGrid.innerHTML = '';

    if (dishesArray.length === 0) {
        const message = document.createElement('p');
        message.className = 'no-dishes-message';
        message.textContent = 'Нет блюд, соответствующих фильтру';
        menuGrid.appendChild(message);
        return;
    }

    dishesArray.forEach(dish => {
        const card = createDishCard(dish);
        menuGrid.appendChild(card);
    });
}

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

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { initFilters };
}