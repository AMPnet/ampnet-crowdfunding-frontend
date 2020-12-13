import { LanguageService } from '../services/language.service';
import { LOCALE_ID, StaticClassProvider } from '@angular/core';

class LocaleID extends String {
    constructor(protected lang: LanguageService) {
        super('');
    }

    toString() {
        return this.lang.getCurrentLanguage();
    }
}

export const DynamicLocaleProvider: StaticClassProvider = {
    provide: LOCALE_ID,
    useClass: LocaleID,
    deps: [LanguageService]
};
