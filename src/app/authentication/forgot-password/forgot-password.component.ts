import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { SignupService } from '../../shared/services/user/signup.service';
import { PopupService } from '../../shared/services/popup.service';
import { EMPTY, throwError } from 'rxjs';
import { RouterService } from '../../shared/services/router.service';
import { ErrorService } from '../../shared/services/error.service';

@Component({
    selector: 'app-forgot-password',
    templateUrl: './forgot-password.component.html',
    styleUrls: [
        '../auth-layout/auth-layout.component.scss',
        './forgot-password.component.scss'
    ]
})
export class ForgotPasswordComponent {
    forgotPasswordForm: FormGroup;

    constructor(private formBuilder: FormBuilder,
                private signUpService: SignupService,
                private router: RouterService,
                private errorService: ErrorService,
                private popupService: PopupService) {

        this.forgotPasswordForm = this.formBuilder.group({
            email: new FormControl('', [Validators.required, Validators.email])
        });
    }

    onSubmitEmailForm() {
        const email = this.forgotPasswordForm.get('email').value;

        return this.signUpService.forgotPassword(email).pipe(
            this.errorService.handleError,
            catchError(err => {
                return err.status === 404 ?
                    this.popupService.error(`User doesn't exist on the platform`).pipe(switchMap(() => EMPTY))
                    : throwError(err);
            }),
            switchMap(() => this.popupService.success('We have sent you an e-mail containing your password reset link.')),
            tap(() => this.router.navigate(['/'])),
        );
    }
}
