// Подключение к Google Таблице
const SPREADSHEET_ID = '1e6MBPZ3vmYdgJRHLwQIw2Ehf7TFSdWycgJ9mYnM0Ahk'; // Ваш ID таблицы
const API_KEY = 'AIzaSyB7BDWOi1pICTSaN1SdUsdTKlgW1g-v_Vc'; // Ваш ключ API для Google

let cars = []; // Массив автомобилей

// Загрузка данных из Google Таблицы
function loadData() {
    gapi.client.init({
        apiKey: API_KEY,
        discoveryDocs: ["https://sheets.googleapis.com/$discovery/rest?version=v4"],
    }).then(function () {
        return gapi.client.sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: 'Наличие!A2:K',  // Убедитесь, что диапазон правильный
        });
    }).then(function (response) {
        const data = response.result.values;
        console.log(data); // Добавим консоль для отладки
        if (data && data.length > 0) {
            cars = data.map(row => ({
                photo: row[0],
                brand: row[1],
                model: row[2],
                year: row[3],
                engine: row[4],
                drive: row[5],
                transmission: row[6],
                price: row[7],
                description: row[8],
                carid: row[9],
            }));
            displayCars(cars); // Отображаем автомобили
        } else {
            console.log('Нет данных в таблице');
        }
    }).catch(function (error) {
        console.error('Ошибка загрузки данных из Google Sheets:', error);
    });
}

// Функция для создания карточки автомобиля
function createCarCard(car) {
    const carCard = document.createElement("div");
    carCard.classList.add("card");

    carCard.innerHTML = `
        <img src="${car.photo}" alt="${car.brand} ${car.model}">
        <div class="card-body">
            <h3>${car.brand} ${car.model} (${car.year})</h3>
            <p>${car.description}</p>
            <p class="price">${car.price} руб.</p>
            <a href="https://t.me/newtimeauto_sales?text=${encodeURIComponent('Здравствуйте, интересует ' + car.brand + ' ' + car.model)}" class="button">Задать вопрос в Telegram</a>
        </div>
    `;

    return carCard;
}

// Функция для отображения всех автомобилей
function displayCars(carsList) {
    const carsContainer = document.getElementById("cars-container");
    carsContainer.innerHTML = ""; // Очищаем контейнер

    if (carsList.length === 0) {
        carsContainer.innerHTML = '<p>Нет автомобилей, подходящих по фильтрам.</p>';
    }

    carsList.forEach(car => {
        const carCard = createCarCard(car);
        carsContainer.appendChild(carCard);
    });
}

// Функция фильтрации автомобилей
function filterCars() {
    const searchInput = document.getElementById("search-input").value.toLowerCase();
    const yearInput = document.getElementById("year-input").value;
    const priceInput = document.getElementById("price-input").value;

    const filteredCars = cars.filter(car => {
        return (
            (searchInput === "" || car.brand.toLowerCase().includes(searchInput) || car.model.toLowerCase().includes(searchInput)) &&
            (yearInput === "" || car.year == yearInput) &&
            (priceInput === "" || car.price <= priceInput)
        );
    });

    displayCars(filteredCars); // Обновляем список автомобилей
}

// Инициализация загрузки данных
function init() {
    gapi.load("client", loadData);
}

// Запуск функции загрузки данных при загрузке страницы
window.onload = init;

// Добавляем обработчик фильтров
document.getElementById("filter-btn").addEventListener("click", filterCars);
