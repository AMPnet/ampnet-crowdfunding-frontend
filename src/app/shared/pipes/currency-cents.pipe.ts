import { CurrencyPipe } from '@angular/common';
import { Injectable, Pipe, PipeTransform } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
@Pipe({
    name: 'currencyCents'
})
export class CurrencyCentsPipe implements PipeTransform {
    constructor(private currencyPipe: CurrencyPipe) {
    }

    transform(
        value: number,
        code = 'EUR',
        display = 'symbol',
        digitsInfo = '1.2-2',
        locale = 'en'
    ) {
        return this.currencyPipe.transform(value / 100, code, display, digitsInfo, locale);
    }
}
