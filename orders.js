// orders.js
const API_KEY = '3a511289-43b6-49a8-82f3-00decaa84995'; 
const BASE_URL = 'https://edu.std-900.ist.mospolytech.ru/labs/api';

let allDishes = [];
let allOrders = [];

document.addEventListener('DOMContentLoaded', async () => {
    console.log("Страница загружена, начинаем загрузку данных...");
    
    try {
        await loadDishes();
        console.log("Блюда загружены:", allDishes.length);
        
        await loadOrders();
        console.log("Заказы загружены:", allOrders.length);
        
        if (allOrders.length === 0) {
            document.getElementById('orders-tbody').innerHTML = '<tr><td colspan="6">У вас пока нет заказов.</td></tr>';
        }
        
    } catch (err) {
        console.error("Критическая ошибка инициализации:", err);
    }
    
    setupModalEvents();
});

// Инициализация
document.addEventListener('DOMContentLoaded', async () => {
    await loadDishes();
    await loadOrders();
    setupModalEvents();
});

// 1. Загрузка справочника блюд
async function loadDishes() {
    const res = await fetch(`${BASE_URL}/dishes`);
    allDishes = await res.json();
}

// 2. Загрузка заказов пользователя
async function loadOrders() {
    try {
        const res = await fetch(`${BASE_URL}/orders?api_key=${API_KEY}`);
        allOrders = await res.json();
        // Сортировка: новые сверху
        allOrders.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        renderTable();
    } catch (err) {
        showToast('Ошибка загрузки заказов', 'error');
    }
}

// 3. Отрисовка таблицы
function renderTable() {
    const tbody = document.getElementById('orders-tbody');
    tbody.innerHTML = '';

    allOrders.forEach((order, index) => {
        const date = new Date(order.created_at).toLocaleString('ru-RU', {
            day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
        });

        // Собираем состав заказа по ID
        const dishIds = [order.soup_id, order.main_course_id, order.salad_id, order.drink_id, order.dessert_id];
        const names = dishIds
            .map(id => allDishes.find(d => d.id === id)?.name)
            .filter(name => name)
            .join(', ');

        const deliveryTime = order.delivery_type === 'now' 
            ? 'Как можно скорее (с 07:00 до 23:00)' 
            : order.delivery_time;

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${index + 1}</td>
            <td>${date}</td>
            <td>${names}</td>
            <td>${calculatePrice(order)}₽</td>
            <td>${deliveryTime}</td>
            <td>
                <span class="action-btn" onclick="viewOrder(${order.id})" title="Подробнее">👁️</span>
                <span class="action-btn" onclick="editOrder(${order.id})" title="Редактировать">✏️</span>
                <span class="action-btn" onclick="deleteConfirm(${order.id})" title="Удалить">🗑️</span>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function calculatePrice(order) {
    const ids = [order.soup_id, order.main_course_id, order.salad_id, order.drink_id, order.dessert_id];
    return ids.reduce((sum, id) => sum + (allDishes.find(d => d.id === id)?.price || 0), 0);
}

// --- УПРАВЛЕНИЕ МОДАЛЬНЫМИ ОКНАМИ ---

const overlay = document.getElementById('modal-overlay');
const mTitle = document.getElementById('modal-title');
const mBody = document.getElementById('modal-body');
const mFooter = document.getElementById('modal-footer');

function setupModalEvents() {
    document.querySelector('.modal-close').onclick = closeModal;
    overlay.onclick = (e) => { if (e.target === overlay) closeModal(); };
}

function closeModal() { overlay.classList.add('hidden'); }

// ПРОСМОТР
function viewOrder(id) {
    const order = allOrders.find(o => o.id === id);
    mTitle.textContent = 'Просмотр заказа';
    mBody.innerHTML = `
        <p><strong>Дата оформления:</strong> ${new Date(order.created_at).toLocaleString()}</p>
        <p><strong>Имя получателя:</strong> ${order.full_name}</p>
        <p><strong>Адрес доставки:</strong> ${order.delivery_address}</p>
        <p><strong>Телефон:</strong> ${order.phone}</p>
        <p><strong>Email:</strong> ${order.email}</p>
        <p><strong>Комментарий:</strong> ${order.comment || 'Нет'}</p>
        <p><strong>Стоимость:</strong> ${calculatePrice(order)}₽</p>
    `;
    mFooter.innerHTML = `<button onclick="closeModal()">Ок</button>`;
    overlay.classList.remove('hidden');
}

// РЕДАКТИРОВАНИЕ
function editOrder(id) {
    const order = allOrders.find(o => o.id === id);
    mTitle.textContent = 'Редактирование заказа';
    mBody.innerHTML = `
        <form id="edit-form">
            <label>Имя: <input type="text" name="full_name" value="${order.full_name}" required></label><br>
            <label>Адрес: <input type="text" name="delivery_address" value="${order.delivery_address}" required></label><br>
            <label>Телефон: <input type="text" name="phone" value="${order.phone}" required></label><br>
            <label>Тип доставки: 
                <select name="delivery_type">
                    <option value="now" ${order.delivery_type === 'now' ? 'selected' : ''}>Как можно скорее</option>
                    <option value="by_time" ${order.delivery_type === 'by_time' ? 'selected' : ''}>Ко времени</option>
                </select>
            </label><br>
            <label>Время: <input type="time" name="delivery_time" value="${order.delivery_time || ''}"></label>
        </form>
    `;
    mFooter.innerHTML = `
        <button onclick="saveEdit(${id})">Сохранить</button>
        <button onclick="closeModal()">Отмена</button>
    `;
    overlay.classList.remove('hidden');
}

async function saveEdit(id) {
    const form = document.getElementById('edit-form');
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    try {
        const res = await fetch(`${BASE_URL}/orders/${id}?api_key=${API_KEY}`, {
            method: 'PUT',
            body: JSON.stringify(data),
            headers: { 'Content-Type': 'application/json' }
        });
        if (res.ok) {
            showToast('Заказ успешно изменен');
            closeModal();
            loadOrders();
        } else throw new Error();
    } catch (err) { showToast('Ошибка при сохранении', 'error'); }
}

// УДАЛЕНИЕ
function deleteConfirm(id) {
    mTitle.textContent = 'Удаление заказа';
    mBody.innerHTML = `<p>Вы уверены, что хотите удалить этот заказ?</p>`;
    mFooter.innerHTML = `
        <button style="background: tomato; color: white;" onclick="deleteOrder(${id})">Да</button>
        <button onclick="closeModal()">Отмена</button>
    `;
    overlay.classList.remove('hidden');
}

async function deleteOrder(id) {
    try {
        const res = await fetch(`${BASE_URL}/orders/${id}?api_key=${API_KEY}`, { method: 'DELETE' });
        if (res.ok) {
            showToast('Заказ удален');
            closeModal();
            loadOrders();
        } else throw new Error();
    } catch (err) { showToast('Ошибка при удалении', 'error'); }
}

function showToast(msg, type = 'success') {
    const container = document.getElementById('notification-container');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = msg;
    if (type === 'error') toast.style.background = 'tomato';
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}