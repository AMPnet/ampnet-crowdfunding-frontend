import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SignupService } from '../../shared/services/user/signup.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PopupService } from '../../shared/services/popup.service';
import { MustMatch } from '../sign-up/confirm-password-validator';
import { SpinnerUtil } from '../../utilities/spinner-utilities';
import { displayBackendErrorRx } from '../../utilities/error-handler';
import { finalize, switchMap } from 'rxjs/operators';

@Component({
    selector: 'app-reset-password',
    templateUrl: './reset-password.component.html',
    styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent {
    resetPasswordForm: FormGroup;

    constructor(private formBuilder: FormBuilder,
                private signUpService: SignupService,
                private router: Router,
                private popupService: PopupService,
                private route: ActivatedRoute) {

        this.resetPasswordForm = this.formBuilder.group({
            password: new FormControl('', [Validators.required, Validators.minLength(8)]),
            confirmPassword: new FormControl('', [Validators.required, Validators.minLength(8)]),
        }, {
            validator: MustMatch('password', 'confirmPassword')
        });
    }

    onSubmitPasswordForm() {
        SpinnerUtil.showSpinner();
        const controls = this.resetPasswordForm.controls;
        const token = this.route.snapshot.params.token;
        const newPassword = controls['password'].value;

        this.signUpService.resetPassword(newPassword, token).pipe(
            displayBackendErrorRx(),
            switchMap(() => this.popupService.new({
                type: 'success',
                title: 'Success',
                text: 'Your password has been changed successfully.'
            })),
            switchMap(() => this.router.navigate([''])),
            finalize(() => SpinnerUtil.hideSpinner())
        ).subscribe();
    }
}
