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
        digitGroupSeparator: '.'
    })
}

export function stripCurrencyData(inputValue: string, currencySymbol: string = "€") {
    return inputValue
      .replace(currencySymbol, "")
      .split(",").join("")
      .split(".").join("")
}