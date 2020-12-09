import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { registerLocaleData } from '@angular/common';
import localeHr from '@angular/common/locales/hr';

@Injectable({
    providedIn: 'root'
})
export class LanguageService {
    supportedLanguages: string[] = ['en', 'hr'];

    languageChange$ = new Subject<string>();

    constructor(private translate: TranslateService) {
    }

    setupLanguages() {
        registerLocaleData(localeHr, 'hr');

        this.translate.addLangs(this.supportedLanguages);
        this.translate.setDefaultLang(this.supportedLanguages[0]);

        this.setLanguage(this.getCurrentLanguage());
    }

    setLanguage(lang: string) {
        this.setPreferredLang(lang);
        this.translate.use(this.getCurrentLanguage()).pipe(
            tap(newLang => {
                console.log('new lang', newLang, lang);
            }),
            tap(newLang => this.languageChange$.next(newLang))
        ).subscribe();
    }

    getCurrentLanguage(): string {
        const preferredLang = this.getPreferredLang() ||
            this.translate.getDefaultLang() ||
            this.translate.getBrowserLang() ||
            this.supportedLanguages[0];

        const currentLang = this.supportedLanguages.includes(preferredLang) ?
            preferredLang : this.supportedLanguages[0];

        if (this.getPreferredLang() !== currentLang) {
            this.setPreferredLang(currentLang);
        }

        return currentLang;
    }

    setPreferredLang(lang: string) {
        localStorage.setItem('Language', lang);
    }

    getPreferredLang(): string {
        return localStorage.getItem('Language');
    }
}
