import {Directive} from '@angular/core';
import {NG_VALUE_ACCESSOR, ControlValueAccessor} from '@angular/forms';

@Directive({
    // tslint:disable-next-line:directive-selector
    selector: 'input[type=file]',
    // tslint:disable-next-line:use-host-property-decorator
    host : {
        '(change)' : 'onChange($event.target.files)',
        '(blur)': 'onTouched()'
    },
    providers: [
        { provide: NG_VALUE_ACCESSOR, useExisting: FileValueAccessorDirective, multi: true }
    ]
})
export class FileValueAccessorDirective implements ControlValueAccessor {
    value: any;
    $event: any;
    onChange = (_) => {};
    onTouched = () => {};

    writeValue(value) {}
    registerOnChange(fn: any) { this.onChange = fn; }
    registerOnTouched(fn: any) { this.onTouched = fn; }
}
