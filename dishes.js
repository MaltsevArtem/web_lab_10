let dishes = [];

async function loadDishes() {
    const apiUrl = 'https://edu.std-900.ist.mospolytech.ru/labs/api/dishes';
    
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error('Ошибка сети');
        
        const data = await response.json();
        dishes = data.map(dish => {
            if (dish.category === 'main-course') {
                dish.category = 'main';
            }
            if (dish.category === 'salad-starter') {
                dish.category = 'salad';
            }
            return dish;
        });
        
        console.log('Данные успешно загружены и адаптированы');

        if (typeof displayAllDishes === 'function') {
            displayAllDishes();
        }
        
        if (typeof initFilters === 'function') {
            initFilters();
        }
        
    } catch (error) {
        console.error('Ошибка:', error);
    }
}

document.addEventListener('DOMContentLoaded', loadDishes);