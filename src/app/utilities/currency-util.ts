import * as Autonumeric from 'autonumeric'

export function prettyCurrency(input: string) {
    if(input == "EUR") {
        return "€"
    } else if(input == "USD") {
        return "$"
    } else {
        return input
    }
}

export function autonumericCurrency(selector: string, currencySymbol: string = "€") {
    new Autonumeric(selector, {
        currencySymbol: currencySymbol,
        decimalCharacter: ',',
        digitGroupSeparator: '.',
        decimalPlaces: 0
    })
}

export function stripCurrencyData(inputValue: string, currencySymbol: string = "€") {
    return inputValue
      .replace(currencySymbol, "")
      .split(",").join("")
      .split(".").join("")
}

// export function centsToBaseCurrencyUnit(cents: number) {
//     return Math.floor(cents * 100)
// }

// export function baseCurrencyUnitToCents(base: number) {
//     return Math.floor()
// }