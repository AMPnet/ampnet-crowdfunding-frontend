import { Component, OnInit } from '@angular/core';
import { UserService } from '../shared/services/user/user.service';
import { FormBuilder } from '@angular/forms';
import { SpinnerUtil } from '../utilities/spinner-utilities';
import { hideSpinnerAndDisplayError } from '../utilities/error-handler';
import { UserModel } from '../models/user-model';

@Component({
    selector: 'app-general-settings',
    templateUrl: './general-settings.component.html',
    styleUrls: ['./general-settings.component.css']
})
export class GeneralSettingsComponent implements OnInit {

    user: UserModel;
    updatingInfo = false;

    constructor(
        private userService: UserService,
        private fb: FormBuilder) {

    }

    ngOnInit() {
        SpinnerUtil.showSpinner();
        this.userService.getOwnProfile().subscribe(res => {
            this.user = res;
            SpinnerUtil.hideSpinner();
        }, hideSpinnerAndDisplayError);
    }

    updateInfoClicked() {
        this.updatingInfo = true;
    }

}
