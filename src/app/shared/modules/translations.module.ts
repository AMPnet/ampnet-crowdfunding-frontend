import { HttpClient } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { from, Observable } from 'rxjs';
import { NgModule } from '@angular/core';
import { map } from 'rxjs/operators';

export function translationsLoaderFactory(http: HttpClient) {
    return new TranslationsLoader(http);
}

export class TranslationsLoader implements TranslateLoader {
    constructor(private http: HttpClient) {
    }

    getTranslation(lang: string): Observable<Object> {
        return this.customURL ? this.http.get(this.customURL) :
            from(import(`../../../assets/i18n/${lang}.json`)).pipe(map(res => res.default));
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
