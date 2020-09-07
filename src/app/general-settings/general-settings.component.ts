import { Component, OnInit } from '@angular/core';
import { UserService } from '../shared/services/user/user.service';
import { FormBuilder } from '@angular/forms';
import { SpinnerUtil } from '../utilities/spinner-utilities';
import { hideSpinnerAndDisplayError } from '../utilities/error-handler';
import { User } from '../shared/services/user/signup.service';

@Component({
    selector: 'app-general-settings',
    templateUrl: './general-settings.component.html',
    styleUrls: ['./general-settings.component.css']
})
export class GeneralSettingsComponent implements OnInit {

    user: User;
    updatingInfo = false;

    constructor(
        private userService: UserService,
        private fb: FormBuilder) {

    }

    ngOnInit() {
        SpinnerUtil.showSpinner();
        this.userService.getOwnProfile().subscribe((user: any)  => {
            this.user = user;
            SpinnerUtil.hideSpinner();
        }, hideSpinnerAndDisplayError);
    }

    updateInfoClicked() {
        this.updatingInfo = true;
    }

}
