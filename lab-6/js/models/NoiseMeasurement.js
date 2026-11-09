/**
 * Класс NoiseMeasurement: моделює одне вимірювання рівня шуму у певний момент часу.
 */
export class NoiseMeasurement {
    constructor(value, measuredAt = new Date()) {
        this.value = value;
        this.measuredAt = measuredAt;
    }

    // Перевірка коректності окремого вимірювання
    isValid() {
        return Number.isFinite(this.value) && this.value >= 0 && this.value <= 200;
    }

    toString() {
        return `${this.value} dB (${this.measuredAt.toLocaleTimeString()})`;
    }
}