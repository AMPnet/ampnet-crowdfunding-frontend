import * as Autonumeric from 'autonumeric';

export function prettyCurrency(input: string) {
    if (input === 'EUR') {
        return '€';
    } else if (input === 'USD') {
        return '$';
    } else {
        return input;
    }
}

export function centsToBaseCurrencyUnit(cents: number) {
    return Math.floor(cents / 100);
}

export function baseCurrencyUnitToCents(base: number) {
    return Math.floor(base * 100);
}
