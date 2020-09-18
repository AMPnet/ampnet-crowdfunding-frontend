import {
    AfterViewInit,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnChanges,
    Output,
    SimpleChanges,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';
import { baseCurrencyUnitToCents, centsToBaseCurrencyUnit } from '../../../utilities/currency-util';
import * as Autonumeric from 'autonumeric';
import { AbstractControl } from '@angular/forms';

@Component({
    selector: 'app-money-input-field',
    templateUrl: './money-input-field.component.html',
    styleUrls: ['./money-input-field.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class MoneyInputFieldComponent implements AfterViewInit, OnChanges {
    @ViewChild('inputField') inputField: ElementRef;

    @Input() placeholder: string;
    @Input() control: AbstractControl;

    @Input() realValue = 0;
    @Output() realValueChange = new EventEmitter<number>();

    an: Autonumeric;

    constructor() {
    }

    ngOnChanges(changes: SimpleChanges) {
        if (this.inputField) {
            this.an.set(centsToBaseCurrencyUnit(changes.realValue.currentValue));
        }
    }

    ngAfterViewInit() {
        this.an = this.autonumericCurrency(this.inputField.nativeElement);
        this.an.set(centsToBaseCurrencyUnit(this.realValue));
    }

    onHTMLInputElementChange() {
        this.realValue = baseCurrencyUnitToCents(Number(this.stripCurrencyData(this.inputField.nativeElement.value)));
        this.realValueChange.next(this.realValue);
        if (this.control !== undefined) {
            this.control.setValue(this.realValue);
            this.control.markAsDirty();
            this.control.markAsTouched();
        }
    }

    autonumericCurrency(domElement: any, currencySymbol: string = '€') {
        return new Autonumeric(domElement, {
            currencySymbol: currencySymbol,
            decimalCharacter: ',',
            digitGroupSeparator: '.',
            decimalPlaces: 0,
            modifyValueOnWheel: false,
            minimumValue: '0'
        });
    }

    stripCurrencyData(inputValue: string, currencySymbol: string = '€') {
        return inputValue
            .replace(currencySymbol, '')
            .split(',').join('')
            .split('.').join('');
    }
}