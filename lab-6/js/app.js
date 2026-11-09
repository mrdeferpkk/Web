import { NoiseSensor } from './models/NoiseSensor.js';
import { MonitoringSystem } from './services/MonitoringSystem.js';

// 1. Початкові дані сенсорів (за вимогами Лаби 6)
const initialSensorsData = [
    { id: "NS-01", district: "Галицький", location: "просп. Свободи, 14", noiseLevel: 52 },
    { id: "NS-02", district: "Франківський", location: "вул. Наукова, 8", noiseLevel: 68 },
    { id: "NS-03", district: "Шевченківський", location: "просп. Чорновола, 21", noiseLevel: 83 },
    { id: "NS-04", district: "Сихівський", location: "вул. Зелена, 102", noiseLevel: 49 },
    { id: "NS-05", district: "Личаківський", location: "вул. Пасічна, 30", noiseLevel: 71 },
    { id: "NS-06", district: "Залізничний", location: "вул. Городоцька, 155", noiseLevel: 86 }
];

// Ініціалізація системи моніторингу через класи з Лаби 5
const monitoringSystem = new MonitoringSystem();
initialSensorsData.forEach(data => {
    const sensor = NoiseSensor.fromObject(data);
    monitoringSystem.addSensor(sensor);
});

// 2. Пошук DOM-елементів за вимогами Лаби 6
const sensorList = document.querySelector(".sensor-list");
const districtFilter = document.querySelector("#district-filter");
const criticalFilter = document.querySelector("#critical-filter");

// 3. Функція створення картки сенсора
function createSensorCard(sensor) {
    const status = sensor.getStatus(); // визначається через метод класу ("normal", "warning", "critical")

    const card = document.createElement("article");
    card.classList.add("sensor-card", `sensor-card--${status}`);

    const header = document.createElement("div");
    header.classList.add("sensor-card-header");

    const title = document.createElement("h3");
    title.textContent = sensor.id;

    const statusBadge = document.createElement("span");
    statusBadge.classList.add("sensor-status-badge");
    statusBadge.textContent = status;

    header.append(title, statusBadge);

    const district = document.createElement("p");
    district.classList.add("sensor-info-item");
    district.innerHTML = `📍 Район: <span class="label-val">${sensor.district} район</span>`;

    const location = document.createElement("p");
    location.classList.add("sensor-info-item");
    location.innerHTML = `🏢 Локація: <span class="label-val">${sensor.location}</span>`;

    const level = document.createElement("p");
    level.classList.add("sensor-info-item", "sensor-noise-level");
    level.innerHTML = `📊 Рівень шуму: <span class="label-val">${sensor.noiseLevel} дБ</span>`;

    card.append(header, district, location, level);
    return card;
}

// 4. Функція рендерингу (очищує список і додає актуальні картки)
function renderSensors(sensorArray) {
    if (!sensorList) return;
    sensorList.replaceChildren(); 
    
    sensorArray.forEach((sensor) => {
        const card = createSensorCard(sensor);
        sensorList.append(card);
    });
}

// 5. Функція фільтрації (за районом та чекбоксом «Тільки критичні»)
function applyFilters() {
    const selectedDistrict = districtFilter ? districtFilter.value : "all";
    const criticalOnly = criticalFilter ? criticalFilter.checked : false;

    const filteredSensors = monitoringSystem.sensors.filter((sensor) => {
        const matchesDistrict = (selectedDistrict === "all" || sensor.district === selectedDistrict);
        const matchesStatus = (!criticalOnly || sensor.getStatus() === "critical");

        return matchesDistrict && matchesStatus;
    });

    renderSensors(filteredSensors);
}

// 6. Слухачі подій для фільтрів
if (districtFilter) districtFilter.addEventListener("change", applyFilters);
if (criticalFilter) criticalFilter.addEventListener("change", applyFilters);

// 7. Початковий запуск при завантаженні сторінки
document.addEventListener('DOMContentLoaded', () => {
    renderSensors(monitoringSystem.sensors);

    // Консольні перевірки з Лаби 5 (щоб викладач бачив роботу класів)
    const testSensor = monitoringSystem.sensors[0];
    console.log("Система моніторингу на класах ініціалізована успішно.");
    console.log("Приклад перевірки методу класу getStatus():", testSensor.id, "->", testSensor.getStatus());
});