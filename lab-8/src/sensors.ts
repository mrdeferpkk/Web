interface Sensor {
    id: string;
    name: string;
    district: string;
    noiseLevel: number;
    status: "active" | "inactive" | "critical" | "warning"; // на випадок різних статусів
}

function renderSensors(sensors: Sensor[]): void {
    // Шукаємо контейнер за id="sensors" або за класом .sensor-list
    const container = document.querySelector<HTMLDivElement>("#sensors") || document.querySelector<HTMLDivElement>(".sensor-list");
    if (!container) {
        console.error("Контейнер для сенсорів не знайдено в HTML!");
        return;
    }
    
    container.innerHTML = "";

    sensors.forEach((sensor) => {
        const card = document.createElement("article");
        card.className = "sensor-card";
        if (sensor.status) {
            card.classList.add(`sensor-card--${sensor.status}`);
        }

        card.innerHTML = `
            <h3>${sensor.name}</h3>
            <p>📍 Район: <strong>${sensor.district}</strong></p>
            <p>📊 Рівень шуму: <strong>${sensor.noiseLevel} дБ</strong></p>
            <p>⚙️ Статус: <span>${sensor.status}</span></p>
        `;
        container.appendChild(card);
    });
}

async function loadSensors(): Promise<void> {
    try {
        const response = await fetch("https://6af1a6e542c6561ced387919.mockapi.io/api/v1/sensor");
        
        if (!response.ok) {
            throw new Error(`Помилка сервера: ${response.status}`);
        }

        const sensors: Sensor[] = await response.json();
        renderSensors(sensors);
        console.log("Дані успішно завантажено:", sensors);
    } catch (error) {
        console.error("Помилка завантаження:", error);
    }
}

// ОБОВ'ЯЗКОВО виклик функції наприкінці:
loadSensors();