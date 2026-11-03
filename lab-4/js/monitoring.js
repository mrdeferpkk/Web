
const noiseLevels = [
    42, 55, 61, 78, 83, 67, 49, 72, 91, 58, 64, 76, 
    53, 47, 88, 69, 74, 82, 95, 51, 71, -1, 85, 63, 
    79, 39, 141, 86
];

const warningLevel = 70;
const criticalLevel = 85;
const minValidLevel = 30;
const maxValidLevel = 130;

const formatDecibels = value => `${value} dB`;

const isValidLevel = (level, min = minValidLevel, max = maxValidLevel) => 
    Number.isFinite(level) && level >= min && level <= max;


const countByCategory = function(data, warning, critical) {
    const stats = {
        totalCount: data.length,
        validCount: 0,
        invalidCount: 0,
        normalCount: 0,
        warningCount: 0,
        criticalCount: 0,
        sum: 0,
        invalidItems: []
    };

    let index = 1;
    for (const level of data) {
        if (!isValidLevel(level)) {
            stats.invalidCount++;
            stats.invalidItems.push({ position: index, value: level });
            index++;
            continue; // Пропускаємо некоректний вимір
        }

        stats.validCount++;
        stats.sum += level;

        if (level <= warning) {
            stats.normalCount++;
        } else if (level > warning && level <= critical) {
            stats.warningCount++;
        } else {
            stats.criticalCount++;
        }

        index++;
    }

    return stats;
};

// --- АНАЛІЗ СЕРЕДНЬОГО, MIN, MAX ---
function calculateMetrics(data) {
    let sum = 0;
    let count = 0;
    let min = null;
    let max = null;

    for (const level of data) {
        if (!isValidLevel(level)) continue;

        sum += level;
        count++;

        if (min === null || level < min) min = level;
        if (max === null || level > max) max = level;
    }

    const average = count > 0 ? (sum / count) : null;
    return { average, min, max };
}

// --- FUNCTION DECLARATION (Оголошення функції) ---
// Пошук першого критичного вимірювання за допомогою циклу for + break
function findFirstCritical(data, criticalThreshold) {
    for (let i = 0; i < data.length; i++) {
        const level = data[i];
        if (!isValidLevel(level)) continue;

        if (level > criticalThreshold) {
            return {
                value: level,
                position: i + 1 // Человеческий індекс (1-based)
            };
        }
    }
    return null;
}

// --- АЛГОРИТМ НА ЦИКЛІ while ---
// Пошук моменту відновлення (3 безпечних вимірювання поспіль після критичного)
function findRecovery(data, firstCriticalIndex, warningThreshold) {
    if (!firstCriticalIndex) return null;

    let currentIndex = firstCriticalIndex.position; // Починаємо після першого критичного
    let safeStreak = 0;

    while (currentIndex < data.length) {
        const level = data[currentIndex];

        if (isValidLevel(level) && level <= warningThreshold) {
            safeStreak++;
            if (safeStreak === 3) {
                return { position: currentIndex + 1, value: level };
            }
        } else if (isValidLevel(level) && level > warningThreshold) {
            safeStreak = 0; // Скидаємо лічильник при перевищенні
        }
        // При некоректному значенні лічильник також скидається
        else {
            safeStreak = 0;
        }

        currentIndex++;
    }

    return null;
}

function findFirstValidDoWhile(data) {
    if (!data || data.length === 0) return null;

    let index = 0;
    let foundValue = null;

    do {
        if (isValidLevel(data[index])) {
            foundValue = data[index];
            break;
        }
        index++;
    } while (index < data.length);

    return foundValue;
}

// --- CALLBACK ТА СИНХРОННЕ ВИКОНАННЯ ---
function processReport(data, analyzerCallback) {
    return analyzerCallback(data, warningLevel, criticalLevel);
}


function generateConsoleReport() {
    console.group('Акустична варта -- звіт моніторингу');

    console.log(`Пороги: попередження > ${formatDecibels(warningLevel)}; критичний рівень > ${formatDecibels(criticalLevel)}`);

    const stats = processReport(noiseLevels, countByCategory);
    const metrics = calculateMetrics(noiseLevels);
    const firstCritical = findFirstCritical(noiseLevels, criticalLevel);
    const recovery = findRecovery(noiseLevels, firstCritical, warningLevel);

    console.log(`Усього вимірювань: ${stats.totalCount}`);
    console.log(`Коректних: ${stats.validCount}`);
    console.log(`Некоректних: ${stats.invalidCount}`);

    // Підсумкова таблиця категорій
    const categoriesTable = [
        { 'Категорія': 'Без перевищення', 'Кількість': stats.normalCount },
        { 'Категорія': 'Попередження', 'Кількість': stats.warningCount },
        { 'Категорія': 'Критичні', 'Кількість': stats.criticalCount }
    ];
    console.table(categoriesTable);

    const avgFormatted = metrics.average ? metrics.average.toFixed(2).replace('.', ',') : 'N/A';
    console.log(`Середній рівень: ${avgFormatted} dB`);
    console.log(`Мінімальний рівень: ${formatDecibels(metrics.min)}`);
    console.log(`Максимальний рівень: ${formatDecibels(metrics.max)}`);

    if (firstCritical) {
        console.warn(`Перше критичне вимірювання: ${formatDecibels(firstCritical.value)}, позиція ${firstCritical.position}`);
    } else {
        console.log('Перше критичне вимірювання: відсутнє');
    }

    if (recovery) {
        console.log(`Відновлення -- три безпечні вимірювання поспіль: позиція ${recovery.position}`);
    } else {
        console.log('Відновлення -- три безпечні вимірювання поспіль: не знайдено');
    }

    const totalExceeded = stats.warningCount + stats.criticalCount;
    console.log(`Поріг ${warningLevel} dB перевищено у ${totalExceeded} вимірюваннях.`);

    // Діагностичне повідомлення про некоректні дані
    if (stats.invalidItems.length > 0) {
        const invalidDetails = stats.invalidItems
            .map(item => `позиція ${item.position} (${item.value} dB)`)
            .join(', ');
        console.error(`Некоректні дані: ${invalidDetails}.`);
    }

    // Текстовий висновок
    let conclusion = `Висновок: зафіксовано ${stats.criticalCount} критичні вимірювання; `;
    if (firstCritical && !recovery) {
        conclusion += 'після першого з них стійкого відновлення не виявлено.';
    } else if (firstCritical && recovery) {
        conclusion += `стійке відновлення зафіксовано на позиції ${recovery.position}.`;
    } else {
        conclusion += 'всі вимірювання в межах норми.';
    }
    console.log(conclusion);

    console.groupEnd();
}


generateConsoleReport();
