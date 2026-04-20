// dishes.js
let dishes = []; // Теперь массив пустой, данные придут из API

async function loadDishes() {
    const apiUrl = 'https://edu.std-900.ist.mospolytech.ru/labs/api/dishes';
    
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error('Ошибка сети');
        
        const data = await response.json();

        // НОРМАЛИЗАЦИЯ: Превращаем серверные категории в те, что понимает твой код
        dishes = data.map(dish => {
            if (dish.category === 'main-course') {
                dish.category = 'main'; // Заменяем 'main-course' на 'main'
            }
            if (dish.category === 'salad-starter') {
                dish.category = 'salad'; // Заменяем 'salad-starter' на 'salad'
            }
            return dish;
        });
        
        console.log('Данные успешно загружены и адаптированы');

        // Запускаем отображение
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

// Запускаем загрузку сразу при подключении скрипта
document.addEventListener('DOMContentLoaded', loadDishes);