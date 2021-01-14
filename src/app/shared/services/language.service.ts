import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, EMPTY, from, Observable, of, Subject } from 'rxjs';
import { distinct, map, switchMap, tap } from 'rxjs/operators';
import { registerLocaleData } from '@angular/common';
import { AppConfigService } from './app-config.service';
import { extractLangFromConfigRE, langConfigRE } from '../regex';

@Injectable({
    providedIn: 'root'
})
export class LanguageService {
    private stockLang: LanguageConfig = {lang: 'en', displayName: 'English'};

    private supportedLanguagesSubject = new BehaviorSubject<LanguageConfig[]>(null);

    languageChange$ = new Subject<string>();

    constructor(private translate: TranslateService,
                private appConfig: AppConfigService) {
        this.appConfig.config$.pipe(
            map(cfg => cfg.config.languages),
            distinct(),
            tap(languages => {
                this.supportedLanguagesSubject.next(this.updatedLangConfigs(languages.config));
            })
        ).subscribe();


        this.supportedLanguagesSubject.asObservable().pipe(
            switchMap(val => val === null ? EMPTY : of(val)),
            tap(() => {
                const supportedLangs = this.supportedLanguages.map(l => l.lang);
                this.translate.addLangs(supportedLangs);
                this.setLanguage().subscribe();
            })
        ).subscribe();
    }

    get supportedLanguages(): LanguageConfig[] {
        return this.supportedLanguagesSubject.getValue();
    }

    setLanguage(preferredLang?: string) {
        if (preferredLang) {
            this.setPreferredLang(preferredLang);
        }

        const current = this.getCurrentLanguage();
        const currentLangRemoteURL = this.supportedLanguages.find(l => l.lang === current)?.configURL || '';

        this.setRemoteConfigURL(currentLangRemoteURL);

        this.translate.setDefaultLang(
            this.appConfig.config.config.languages.fallback ? this.stockLang.lang : current
        );

        return this.translate.use(current).pipe(
            switchMap(newLang => this.registerLocale(current).pipe(switchMap(() => of(newLang)))),
            tap(newLang => this.languageChange$.next(newLang))
        );
    }

    getCurrentLanguage(): string {
        const preferredLang = this.getPreferredLang() ||
            this.translate.getBrowserLang();

        const currentLang = this.supportedLanguages.map(l => l.lang).includes(preferredLang) ?
            preferredLang : this.supportedLanguages[0].lang;

        if (this.getPreferredLang() !== preferredLang) {
            this.setPreferredLang(preferredLang);
        }

        return currentLang;
    }

    setPreferredLang(lang: string) {
        localStorage.setItem('Language', lang);
    }

    getPreferredLang(): string {
        return localStorage.getItem('Language');
    }

    private registerLocale(lang: string): Observable<string> {
        // TODO: remove eager mode to shrink the bundle size (this will generate a file for each separate locale)
        return from(import(/* webpackMode: "eager" */`@angular/common/locales/${lang}.js`)).pipe(
            tap(locale => registerLocaleData(locale.default)),
            map(() => lang)
        );
    }

    private updatedLangConfigs(langConfigs: string): LanguageConfig[] {
        const languages = this.extractLanguages(langConfigs);

        return languages ? [this.stockLang, ...languages] : [this.stockLang];
    }

    extractLanguages(langConfigs: string): LanguageConfig[] {
        return langConfigs.match(langConfigRE)
            ?.map((langVal) => {
                const [_full, lang, name, _optionalGroup, url] = langVal.match(extractLangFromConfigRE);
                return {
                    lang: lang,
                    displayName: name,
                    configURL: url
                };
            });
    }

    private setRemoteConfigURL(url: string): void {
        localStorage.setItem('custom_translations_url', url);
    }
}

interface LanguageConfig {
    lang: string;
    displayName: string;
    configURL?: string;
}
