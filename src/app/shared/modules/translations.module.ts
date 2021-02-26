import { HttpClient } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { NgModule } from '@angular/core';

export function translationsLoaderFactory(http: HttpClient) {
    return new TranslationsLoader(http);
}

export class TranslationsLoader implements TranslateLoader {
    constructor(private http: HttpClient) {
    }

    getTranslation(lang: string): Observable<Object> {
        return this.http.get(this.customURL ? this.customURL : `/assets/i18n/${lang}.json`);
    }

    get customURL(): string {
        return localStorage.getItem('custom_translations_url');
    }
}

@NgModule({
    imports: [
        TranslateModule.forChild({
            loader: {
                provide: TranslateLoader,
                useFactory: (translationsLoaderFactory),
                deps: [HttpClient]
            },
        })
    ],
    exports: [TranslateModule]
})
export class TranslationsModule {
}
