import { Component, OnInit } from '@angular/core';
import { UserService } from '../shared/services/user/user.service';
import { FormBuilder } from '@angular/forms';
import { SpinnerUtil } from '../utilities/spinner-utilities';
import { hideSpinnerAndDisplayError } from '../utilities/error-handler';
import { User } from '../shared/services/user/signup.service';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-general-settings',
    templateUrl: './general-settings.component.html',
    styleUrls: ['./general-settings.component.css']
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
