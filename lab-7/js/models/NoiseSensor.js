/**
 * Централізовані межі класифікації шуму (бізнес-правило)
 */
export const NOISE_LIMITS = Object.freeze({
    normalMax: 55,
    warningMax: 70,
});

export class NoiseSensor {
    constructor(id, district, location, noiseLevel) {
        this.id = id;
        this.district = district;
        this.location = location;
        this.noiseLevel = noiseLevel;
        this.measurements = []; // Історія вимірювань (композиція)
    }

    /**
     * Визначає статус датчика на основі поточного рівня шуму та конфігурації
     */
    getStatus() {
        if (this.noiseLevel <= NOISE_LIMITS.normalMax) {
            return "normal";
        } else if (this.noiseLevel > NOISE_LIMITS.normalMax && this.noiseLevel <= NOISE_LIMITS.warningMax) {
            return "warning";
        } else {
            return "critical";
        }
    }

    /**
     * Оновлює поточний рівень шуму після валідації
     */
    updateNoiseLevel(value) {
        if (!NoiseSensor.isValidNoiseLevel(value)) {
            throw new Error(`Недопустиме значення рівня шуму: ${value}`);
        }
        this.noiseLevel = value;
    }

    /**
     * Додає нове вимірювання через об'єкт NoiseMeasurement
     */
    addMeasurement(measurement) {
        if (!measurement.isValid()) {
            throw new Error("Очікується валідний об'єкт NoiseMeasurement");
        }
        this.measurements.push(measurement);
        this.noiseLevel = measurement.value; // Автоматичне оновлення поточного рівня
    }

    /**
     * Static-метод для перевірки значення (не потребує конкретного екземпляра this)
     */
    static isValidNoiseLevel(value) {
        return Number.isFinite(value) && value >= 0 && value <= 200;
    }

    /**
     * Static-метод фабрики для створення екземпляра зі звичайного об'єкта (Plain Object)
     */
    static fromObject(data) {
        if (!data.id || !data.district) {
            throw new Error("Неповні дані для створення NoiseSensor");
        }
        return new NoiseSensor(
            data.id,
            data.district,
            data.location || "Не вказано",
            data.noiseLevel || 0
        );
    }
}