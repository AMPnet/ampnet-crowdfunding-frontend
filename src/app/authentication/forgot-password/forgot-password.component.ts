import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SpinnerUtil } from '../../utilities/spinner-utilities';
import { finalize, switchMap } from 'rxjs/operators';
import { displayBackendErrorRx } from '../../utilities/error-handler';
import { SignupService } from '../../shared/services/user/signup.service';
import { Router } from '@angular/router';
import { PopupService } from '../../shared/services/popup.service';

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
        SpinnerUtil.showSpinner();
        const controls = this.forgotPasswordForm.controls;
        const email = controls['email'].value;

        this.signUpService.forgotPassword(email).pipe(
            displayBackendErrorRx(),
            switchMap(() => this.popupService.new({
                type: 'success',
                title: 'Success',
                text: 'We have sent you an e-mail containing your password reset link.'
            })),
            switchMap(() => this.router.navigate([''])),
            finalize(() => SpinnerUtil.hideSpinner())
        ).subscribe();
    }
}
