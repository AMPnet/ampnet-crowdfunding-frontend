export function prettyCurrency(input: string) {
    if(input == "EUR") {
        return "€"
    } else if(input == "USD") {
        return "$"
    } else {
        return input
    }
}