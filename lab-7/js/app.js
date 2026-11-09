import { NoiseSensor } from './models/NoiseSensor.js';
import { MonitoringSystem } from './services/MonitoringSystem.js';
import { fetchSensorsFromAPI } from './services/api.js';

// Пошук DOM-елементів
const sensorList = document.querySelector("#sensors-list") || document.querySelector(".sensor-list");
const districtFilter = document.querySelector("#district-filter");
const criticalFilter = document.querySelector("#critical-filter");

const monitoringSystem = new MonitoringSystem();

// Головна функція ініціалізації та завантаження даних
async function initApp() {
    try {
        // Отримуємо дані з MockAPI
        const rawData = await fetchSensorsFromAPI();

        // Очищаємо систему та додаємо об'єкти через класи (Лаба 5)
        monitoringSystem.sensors = [];
        rawData.forEach(item => {
            const sensor = NoiseSensor.fromObject(item);
            monitoringSystem.addSensor(sensor);
        });

        // Відображаємо завантажені дані на сторінці
        renderSensors(monitoringSystem.sensors);
        console.log("Дані успішно завантажено з API та додано в систему.");

    } catch (error) {
        if (sensorList) {
            sensorList.innerHTML = `<p style="color: red; text-align: center; grid-column: 1 / -1;">Не вдалося завантажити дані з сервера. Перевірте з'єднання.</p>`;
        }
    }
}

// Функція створення картки сенсора
function createSensorCard(sensor) {
    const status = sensor.getStatus ? sensor.getStatus() : (sensor.status || "normal");

    const card = document.createElement("article");
    card.classList.add("sensor-card", `sensor-card--${status}`);

    const header = document.createElement("div");
    header.classList.add("sensor-card-header");

    const title = document.createElement("h3");
    title.textContent = sensor.name || sensor.id;

    const statusBadge = document.createElement("span");
    statusBadge.classList.add("sensor-status-badge");
    statusBadge.textContent = status;

    header.append(title, statusBadge);

    const district = document.createElement("p");
    district.classList.add("sensor-info-item");
    district.innerHTML = `📍 Район: <span class="label-val">${sensor.district} район</span>`;

    const location = document.createElement("p");
    location.classList.add("sensor-info-item");
    location.innerHTML = `🏢 Локація: <span class="label-val">${sensor.location || "Не вказано"}</span>`;

    const level = document.createElement("p");
    level.classList.add("sensor-info-item", "sensor-noise-level");
    level.innerHTML = `📊 Рівень шуму: <span class="label-val">${sensor.noiseLevel} дБ</span>`;

    card.append(header, district, location, level);
    return card;
}

// Функція рендерингу списку
function renderSensors(sensorArray) {
    if (!sensorList) return;
    sensorList.replaceChildren(); // Очищує контейнер перед виводом

    if (sensorArray.length === 0) {
        sensorList.innerHTML = `<p style="grid-column: 1 / -1; text-align: center;">Сенсорів за такими критеріями не знайдено.</p>`;
        return;
    }

    sensorArray.forEach((sensor) => {
        const card = createSensorCard(sensor);
        sensorList.append(card);
    });
}

// Функція фільтрації (район + чекбокс критичних)
function applyFilters() {
    const selectedDistrict = districtFilter ? districtFilter.value : "all";
    const criticalOnly = criticalFilter ? criticalFilter.checked : false;

    const filteredSensors = monitoringSystem.sensors.filter((sensor) => {
        const matchesDistrict = (selectedDistrict === "all" || sensor.district === selectedDistrict);
        
        const status = sensor.getStatus ? sensor.getStatus() : sensor.status;
        const matchesStatus = (!criticalOnly || status === "critical");

        return matchesDistrict && matchesStatus;
    });

    renderSensors(filteredSensors);
}

// Слухачі подій для фільтрів
if (districtFilter) districtFilter.addEventListener("change", applyFilters);
if (criticalFilter) criticalFilter.addEventListener("change", applyFilters);

// Запуск програми при завантаженні сторінки
document.addEventListener("DOMContentLoaded", () => {
    initApp();
});