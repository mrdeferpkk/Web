import { NoiseSensor } from './models/NoiseSensor.js';
import { MonitoringSystem } from './services/MonitoringSystem.js';
import { NoiseMeasurement } from './models/NoiseMeasurement.js';

// Початкові дані з методички
const sensorsData = [
    { id: "NS-01", district: "Галицький", location: "просп. Свободи", noiseLevel: 58 },
    { id: "NS-02", district: "Франківський", location: "вул. Наукова", noiseLevel: 74 },
    { id: "NS-03", district: "Шевченківський", location: "просп. Чорновола", noiseLevel: 83 },
];

// Ініціалізація системи моніторингу
const monitoringSystem = new MonitoringSystem();

// Перетворення plain objects на екземпляри NoiseSensor через фабричний метод
sensorsData.forEach(data => {
    const sensor = NoiseSensor.fromObject(data);
    monitoringSystem.addSensor(sensor);
});

/**
 * Функція рендерингу картки датчика (шар представлення DOM, окремо від класу)
 */
function renderSensorCard(sensor) {
    const status = sensor.getStatus(); // "normal", "warning", або "critical"

    const card = document.createElement('div');
    card.className = `sensor-card ${status}`; // Додаємо клас для стилізації у CSS
    card.innerHTML = `
        <h3>ID: ${sensor.id}</h3>
        <p><strong>Район:</strong> ${sensor.district}</p>
        <p><strong>Локація:</strong> ${sensor.location}</p>
        <p><strong>Рівень шуму:</strong> ${sensor.noiseLevel} dB</p>
        <p><strong>Статус:</strong> <span class="badge ${status}">${status.toUpperCase()}</span></p>
    `;
    return card;
}

/**
 * Рендеринг усіх датчиків на сторінку
 */
function renderApp() {
    // Шукаємо контейнер на сторінці (або створюємо, якщо його немає)
    let container = document.getElementById('sensors-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'sensors-container';
        document.body.appendChild(container);
    }
    
    container.innerHTML = '<h2>Система моніторингу шуму (Класи)</h2>';
    
    // Вивід середнього показника
    const avgDiv = document.createElement('div');
    avgDiv.innerHTML = `<p><strong>Середній рівень шуму в системі:</strong> ${monitoringSystem.getAverageNoiseLevel()} dB</p>`;
    container.appendChild(avgDiv);

    // Рендер кожної картки датчика
    monitoringSystem.sensors.forEach(sensor => {
        const card = renderSensorCard(sensor);
        container.appendChild(card);
    });
}

// Запуск рендерингу після завантаження сторінки
document.addEventListener('DOMContentLoaded', () => {
    renderApp();

    // Консольні перевірки за вимогами лабораторної
    console.log("--- КОНСОЛЬНІ ЕКСПЕРИМЕНТИ ---");
    const sA = monitoringSystem.findSensorById("NS-01");
    const sB = monitoringSystem.findSensorById("NS-02");
    
    console.log("Методи в прототипі рівні:", sA.getStatus === sB.getStatus); // true
    console.log("noiseLevel є власною властивістю:", Object.hasOwn(sA, "noiseLevel")); // true
    console.log("getStatus є власною властивістю:", Object.hasOwn(sA, "getStatus")); // false
    console.log("Перевірка static методу:", NoiseSensor.isValidNoiseLevel(75)); // true
});