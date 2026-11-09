// Твоя унікальна адреса ендпоінту MockAPI
const API_URL = "https://6af1a6e542c6561ced387919.mockapi.io/api/v1/sensor";

/**
 * Функція виконує GET-запит до API та повертає масив даних
 */
export async function fetchSensorsFromAPI() {
    try {
        const response = await fetch(API_URL);

        // Перевірка успішності HTTP-відповіді (статуси 200–299)
        if (!response.ok) {
            throw new Error(`Помилка сервера: ${response.status} ${response.statusText}`);
        }

        // Перетворення відповіді у формат JSON (масив JavaScript)
        const sensors = await response.json();
        return sensors;

    } catch (error) {
        console.error("Не вдалося завантажити сенсори з API:", error);
        throw error; // Прокидаємо помилку далі для обробки в інтерфейсі
    }
}