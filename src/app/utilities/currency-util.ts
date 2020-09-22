export function centsToBaseCurrencyUnit(cents: number) {
    return Math.floor(cents / 100);
}

export function baseCurrencyUnitToCents(base: number) {
    return Math.floor(base * 100);
}
