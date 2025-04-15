// Подключение к Google Таблице
const SPREADSHEET_ID = '1e6MBPZ3vmYdgJRHLwQIw2Ehf7TFSdWycgJ9mYnM0Ahk'; // Ваш ID таблицы
const API_KEY = 'AIzaSyB7BDWOi1pICTSaN1SdUsdTKlgW1g-v_Vc'; // Ваш ключ API для Google

// Загрузка данных из Google Таблицы
function loadData() {
    gapi.client.init({
        apiKey: API_KEY,
        discoveryDocs: ["https://sheets.googleapis.com/$discovery/rest?version=v4"],
    }).then(function () {
        return gapi.client.sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: 'Наличие!A2:J',  // Пример диапазона
        });
    }).then(function (response) {
        const data = response.result.values;
        if (data && data.length > 0) {
            const cars = data.map(row => ({
                photo: row[0],
                brand: row[1],
                model: row[2],
                year: row[3],
                engine: row[4],
                drive: row[5],
                transmission: row[6],
                price: row[7],
                description: row[8],
            }));
            displayCars(cars);
        }
    });
}

// Функция для создания карточки автомобиля
function createCarCard(car) {
    const carCard = document.createElement("div");
    carCard.classList.add("card", "mb-6");

    carCard.innerHTML = `
        <img src="${car.photo}" alt="${car.brand} ${car.model}">
        <div class="card-body">
            <h3>${car.brand} ${car.model} (${car.year})</h3>
            <p>${car.description}</p>
            <p class="price">${car.price} руб.</p>
            <a href="https://t.me/newtimeauto_sales?text=${encodeURIComponent('Здравствуйте, интересует ' + car.brand + ' ' + car.model + ' (арт. ' + car.id + ') ')}" class="button">Задать вопрос в Telegram</a>
        </div>
    `;

    return carCard;
}

// Функция для отображения всех автомобилей
function displayCars(carsList) {
    const carsContainer = document.getElementById("cars-container");
    carsContainer.innerHTML = ""; // Очищаем контейнер
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
            car.brand.toLowerCase().includes(searchInput) ||
            car.model.toLowerCase().includes(searchInput) ||
            (yearInput && car.year == yearInput) ||
            (priceInput && car.price <= priceInput)
        );
    });

    displayCars(filteredCars);
}

// Инициализация загрузки данных
gapi.load("client", loadData);
