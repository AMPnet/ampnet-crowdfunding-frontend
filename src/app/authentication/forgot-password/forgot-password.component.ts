import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { catchError, switchMap } from 'rxjs/operators';
import { SignupService } from '../../shared/services/user/signup.service';
import { Router } from '@angular/router';
import { PopupService } from '../../shared/services/popup.service';
import { EMPTY, throwError } from 'rxjs';
import { displayBackendErrorRx } from '../../utilities/error-handler';

@Component({
    selector: 'app-forgot-password',
    templateUrl: './forgot-password.component.html',
    styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {
    forgotPasswordForm: FormGroup;

    constructor(private formBuilder: FormBuilder,
                private signUpService: SignupService,
                private router: Router,
                private popupService: PopupService) {

        this.forgotPasswordForm = this.formBuilder.group({
            email: new FormControl('', [Validators.required, Validators.email])
        });
    }

    onSubmitEmailForm() {
        const email = this.forgotPasswordForm.get('email').value;

        return this.signUpService.forgotPassword(email).pipe(
            displayBackendErrorRx(),
            catchError(err => {
                switch (err.status) {
                    case 404:
                        return this.popupService.new({
                            type: 'error',
                            title: 'Not found',
                            text: `User doesn't exist on the platform`
                        }).pipe(switchMap(() => EMPTY));

                    case 400:
                        if (err.error.err_code === '0201') {
                            return this.popupService.new({
                                type: 'error',
                                title: 'Error changing password',
                                text: `User did not use email authentication method`
                            }).pipe(switchMap(() => EMPTY));
                        }
                }
                return throwError(err);
            })).pipe(switchMap(() => this.popupService.new({
            type: 'success',
            title: 'Success',
            text: 'We have sent you an e-mail containing your password reset link.'
        }).pipe(switchMap(() => this.router.navigate([''])))));
    }
}
