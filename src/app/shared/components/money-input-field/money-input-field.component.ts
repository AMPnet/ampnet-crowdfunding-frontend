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
import { disable } from 'tns-core-modules/trace';

@Component({
    selector: 'app-money-input-field',
    templateUrl: './money-input-field.component.html',
    styleUrls: ['./money-input-field.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class MoneyInputFieldComponent implements AfterViewInit, OnChanges {
    @ViewChild('inputField') inputField: ElementRef;

    @Input() disable: boolean;
    @Input() placeholder: string;
    @Input() control: AbstractControl;
    @Input() inputClass = 'input-lg w-100';

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
        this.an.set(this.initialValue(this.control?.value, this.realValue));
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

    private initialValue(...values: (number | string)[]): number | '' {
        for (let i = 0; i < values.length; i++) {
            if (values[i] === '') {
                return '';
            } else if (typeof values[i] === 'number') {
                return centsToBaseCurrencyUnit(values[i] as number);
            }
        }

        return '';
    }
}
