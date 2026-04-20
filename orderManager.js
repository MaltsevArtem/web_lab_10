let selectedDishes = {
    soup: null,
    main: null,
    salad: null,
    drink: null,
    dessert: null
};

const LS_KEY = 'food-construct-order';

function saveOrderToLS() {
    const ids = {};
    for (const cat in selectedDishes) {
        ids[cat] = selectedDishes[cat] ? selectedDishes[cat].id : null;
    }
    localStorage.setItem(LS_KEY, JSON.stringify(ids));
}

function addToCart(dishId) {
    const dish = dishes.find(d => d.keyword === dishId);
    if (!dish) return;

    selectedDishes[dish.category] = dish;
    updateUI();
}

function checkComboStatus() {
    const s = selectedDishes.soup;
    const m = selectedDishes.main;
    const sl = selectedDishes.salad;
    const d = selectedDishes.drink;


    const isCombo = (s && m && sl && d) || (s && m && d) || (s && sl && d) || (m && sl && d) || (m && d);
    
    const checkoutLink = document.getElementById('checkout-link');
    const panel = document.getElementById('sticky-order-panel');

    if (panel) {
        const hasAny = Object.values(selectedDishes).some(v => v !== null);
        panel.classList.toggle('hidden', !hasAny);
    }

    if (checkoutLink) {
        if (isCombo) {
            checkoutLink.classList.remove('disabled');
        } else {
            checkoutLink.classList.add('disabled');
        }
    }
}

function updateUI() {
    let total = 0;
    const categories = ['soup', 'main', 'salad', 'drink', 'dessert'];
    
    categories.forEach(cat => {
        const dish = selectedDishes[cat];
        if (dish) total += dish.price;
        
        const summaryElement = document.getElementById(`summary-${cat}`);
        if (summaryElement) {
            summaryElement.textContent = dish ? `${dish.name} ${dish.price}₽` : 'Блюдо не выбрано';
        }
    });

    const panelPrice = document.getElementById('panel-total-price');
    if (panelPrice) panelPrice.textContent = total;

    saveOrderToLS();

    checkComboStatus();

    highlightCards();
}

document.addEventListener('DOMContentLoaded', function() {
    
    const savedData = localStorage.getItem(LS_KEY);
    if (savedData) {
        const savedIds = JSON.parse(savedData);
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