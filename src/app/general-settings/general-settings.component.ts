import { Component, OnInit } from '@angular/core';
import { UserService } from '../shared/services/user/user.service';
import { User } from '../shared/services/user/signup.service';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-general-settings',
    templateUrl: './general-settings.component.html',
    styleUrls: [
        './../app.component.css',
        './general-settings.component.css'
    ]
})
export class GeneralSettingsComponent implements OnInit {
    user$: Observable<User>;
    updatingInfo = false;

    constructor(private userService: UserService) {
    }

    ngOnInit() {
        this.user$ = this.userService.user$;
    }

    updateInfoClicked() {
        this.updatingInfo = true;
    }
}
