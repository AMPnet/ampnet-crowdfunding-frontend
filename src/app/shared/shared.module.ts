import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { ActionButtonComponent } from './components/action-button/action-button.component';
import { CaptchaNoticeComponent } from './components/captcha-notice/captcha-notice.component';
import { LazyLoadComponent } from './components/lazy-load/lazy-load.component';
import { MoneyInputFieldComponent } from './components/money-input-field/money-input-field.component';
import { NewBankAccountComponent } from './components/new-bank-account/new-bank-account.component';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { UploadAreaComponent } from './components/upload-area/upload-area.component';
import { BackNavigationDirective } from './directives/back-navigation.directive';
import { FileValueAccessorDirective } from './directives/file-value-accessor.directive';
import { CoopPathPipe } from './pipes/coop-path.pipe';
import { CurrencyCentsPipe } from './pipes/currency-cents.pipe';
import { CurrencyDefaultPipe } from './pipes/currency-default.pipe';
import { InterpolatePipe } from './pipes/interpolate.pipe';
import { SafePipe } from './pipes/safe.pipe';
import { SplitPartPipe } from './pipes/split-part.pipe';
import { FileValidator } from './validators/file.validator';
import { URLValidator } from './validators/url.validator';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslationsModule } from './modules/translations.module';
import { QuillModule } from 'ngx-quill';
import { HeaderComponent } from './components/header/header.component';
import { RouterModule } from '@angular/router';
import { BankTransferComponent } from './components/bank-transfer/bank-transfer.component';
import { PictureComponent } from './components/picture/picture.component';

const components = [
    ActionButtonComponent,
    CaptchaNoticeComponent,
    LazyLoadComponent,
    MoneyInputFieldComponent,
    NewBankAccountComponent,
    SpinnerComponent,
    UploadAreaComponent,
    HeaderComponent,
    BankTransferComponent,
    PictureComponent
];

const directives = [
    BackNavigationDirective,
    FileValueAccessorDirective
];

const pipes = [
    CoopPathPipe,
    CurrencyCentsPipe,
    CurrencyDefaultPipe,
    InterpolatePipe,
    SafePipe,
    SplitPartPipe
];

const validators = [
    FileValidator,
    URLValidator
];

const importExportModules = [
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    TranslationsModule,
    QuillModule
];

@NgModule({
    imports: [
        CommonModule,
        ...importExportModules
    ],
    declarations: [
        ...components,
        ...directives,
        ...pipes,
        ...validators,
    ],
    providers: [
        ...pipes,
        // pipes to be used as DI
        CurrencyPipe,
        DatePipe,
    ],
    exports: [
        ...components,
        ...directives,
        ...pipes,
        ...validators,
        ...importExportModules
    ]
})
export class SharedModule {
}
