/**
 * Currency Utilities
 * Funciones para formatear moneda en diferentes formatos
 */

/**
 * Formatea un número como moneda en millones
 * Ejemplo: 1000000 -> "$1,000,000.00"
 */
export const formatCurrencyMillions = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value);
};

/**
 * Formatea un número como moneda en formato corto
 * Ejemplo: 1000000 -> "$1.00M"
 */
export const formatCurrencyShort = (value: number): string => {
    const millions = value / 1000000;
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(millions) + 'M';
};
