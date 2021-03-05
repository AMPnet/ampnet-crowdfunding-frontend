import { Component } from '@angular/core';
import { UserService } from '../../shared/services/user/user.service';
import { LanguageService } from '../../shared/services/language.service';
import { tap } from 'rxjs/operators';

@Component({
    selector: 'app-settings-user',
    templateUrl: './settings-user.component.html',
    styleUrls: ['./settings-user.component.scss']
})
export class SettingsUserComponent {
    user$ = this.userService.user$;

    constructor(private userService: UserService,
                public languageService: LanguageService) {
    }

    changeLanguage(lang: string) {
        return this.languageService.setLanguage(lang).pipe(
            tap(() => this.userService.updateBackendLanguage.subscribe())
        );
    }
}
