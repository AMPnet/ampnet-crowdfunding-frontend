import { NgModule } from '@angular/core';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export function translationsLoaderFactory(http: HttpClient) {
    return new TranslationsLoader(http);
}

export class TranslationsLoader implements TranslateLoader {
    constructor(private http: HttpClient) {
    }

    getTranslation(lang: string): Observable<Object> {
        return this.http.get(`/assets/i18n/${lang}.json`);
    }
}

@NgModule({
    imports: [
        TranslateModule.forRoot({
            useDefaultLang: true,
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
