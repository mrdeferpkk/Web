import { NoiseSensor } from '../models/NoiseSensor.js';

export class MonitoringSystem {
    constructor() {
        this.sensors = [];
    }

    /**
     * Додає сенсор до системи з перевіркою дублікатів та типу
     */
    addSensor(sensor) {
        if (!(sensor instanceof NoiseSensor)) {
            throw new Error("Можна додавати лише об'єкти класу NoiseSensor");
        }
        const exists = this.sensors.some(item => item.id === sensor.id);
        if (exists) {
            throw new Error(`Датчик із ID ${sensor.id} вже існує в системі`);
        }
        this.sensors.push(sensor);
    }

    /**
     * Пошук датчика за ID
     */
    findSensorById(id) {
        return this.sensors.find(sensor => sensor.id === id) || null;
    }

    /**
     * Отримати датчики певного району
     */
    getSensorsByDistrict(district) {
        return this.sensors.filter(sensor => sensor.district === district);
    }

    /**
     * Фільтрація критичних датчиків (статус critical)
     */
    getCriticalSensors() {
        return this.sensors.filter(sensor => sensor.getStatus() === "critical");
    }

    /**
     * Розрахунок середнього рівня шуму по всій системі
     */
    getAverageNoiseLevel() {
        if (this.sensors.length === 0) return 0;
        const sum = this.sensors.reduce((acc, sensor) => acc + sensor.noiseLevel, 0);
        return Number((sum / this.sensors.length).toFixed(2));
    }
}