
const spreadsheetId = "1e6MBPZ3vmYdgJRHLwQIw2Ehf7TFSdWycgJ9mYnM0Ahk";
const sheetName = "Наличие";
const carList = document.getElementById("carList");
const brandFilter = document.getElementById("brandFilter");
const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");

async function fetchData() {
  const url = `https://opensheet.elk.sh/${spreadsheetId}/${sheetName}`;
  const res = await fetch(url);
  const data = await res.json();
  return data;
}

function renderCars(cars) {
  carList.innerHTML = "";
  cars.forEach((car) => {
    const card = document.createElement("div");
    card.className = "car-card";
    card.innerHTML = `
      <img src="${car["Фото"]}" alt="${car["Модель"]}" />
      <h3>${car["Марка"]} ${car["Модель"]}</h3>
      <p>Цена: ${car["Цена"]} ₽</p>
      <a href="https://t.me/newtimeauto_sales?text=Здравствуйте! Интересует: ${encodeURIComponent(car["Марка"] + ' ' + car["Модель"])}" target="_blank">
        <button>📩 Подробнее</button>
      </a>
    `;
    carList.appendChild(card);
  });
}

function applyFilters(data) {
  let filtered = data;

  const search = searchInput.value.toLowerCase();
  if (search) {
    filtered = filtered.filter((car) =>
      (car["Марка"] + " " + car["Модель"]).toLowerCase().includes(search)
    );
  }

  const brand = brandFilter.value;
  if (brand) {
    filtered = filtered.filter((car) => car["Марка"] === brand);
  }

  const sortValue = sortSelect.value;
  if (sortValue === "price-asc") {
    filtered.sort((a, b) => parseInt(a["Цена"]) - parseInt(b["Цена"]));
  } else if (sortValue === "price-desc") {
    filtered.sort((a, b) => parseInt(b["Цена"]) - parseInt(a["Цена"]));
  }

  return filtered;
}

function populateBrandFilter(data) {
  const brands = [...new Set(data.map((car) => car["Марка"]))];
  brands.forEach((brand) => {
    const option = document.createElement("option");
    option.value = brand;
    option.textContent = brand;
    brandFilter.appendChild(option);
  });
}

fetchData().then((data) => {
  populateBrandFilter(data);
  renderCars(applyFilters(data));

  searchInput.addEventListener("input", () => renderCars(applyFilters(data)));
  brandFilter.addEventListener("change", () => renderCars(applyFilters(data)));
  sortSelect.addEventListener("change", () => renderCars(applyFilters(data)));
});
