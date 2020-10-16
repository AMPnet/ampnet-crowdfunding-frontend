import { Directive } from '@angular/core';
import { FormControl, NG_VALIDATORS, Validator } from '@angular/forms';

@Directive({
    selector: '[appRequiredFile]',
    providers: [
        {provide: NG_VALIDATORS, useExisting: URLValidator, multi: true},
    ]
})
export class URLValidator implements Validator {
    static pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator

    static validate(c: FormControl): { [key: string]: any } {
        return URLValidator.pattern.test(c.value) ? null : {invalid: true};
    }

    validate(c: FormControl): { [key: string]: any } {
        return URLValidator.validate(c);
    }
}
