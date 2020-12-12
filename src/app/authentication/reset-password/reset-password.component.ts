import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SignupService } from '../../shared/services/user/signup.service';
import { ActivatedRoute } from '@angular/router';
import { PopupService } from '../../shared/services/popup.service';
import { MustMatch } from '../sign-up/confirm-password-validator';
import { switchMap, tap } from 'rxjs/operators';
import { RouterService } from '../../shared/services/router.service';
import { ErrorService } from '../../shared/services/error.service';

@Component({
    selector: 'app-reset-password',
    templateUrl: './reset-password.component.html',
    styleUrls: [
        '../auth-layout/auth-layout.component.scss',
        './reset-password.component.scss'
    ],
})
export class ResetPasswordComponent implements OnInit {
    resetPasswordForm: FormGroup;
    token: string;

    constructor(private formBuilder: FormBuilder,
                private signUpService: SignupService,
                private router: RouterService,
                private errorService: ErrorService,
                private popupService: PopupService,
                private route: ActivatedRoute) {

        this.resetPasswordForm = this.formBuilder.group({
            password: new FormControl('', [Validators.required, Validators.minLength(8)]),
            confirmPassword: new FormControl('', [Validators.required, Validators.minLength(8)]),
        }, {
            validator: MustMatch('password', 'confirmPassword')
        });
    }

    ngOnInit(): void {
        this.token = this.route.snapshot.queryParams.token;
    }

    onSubmitPasswordForm() {
        const newPassword = this.resetPasswordForm.get('password').value;

        return this.signUpService.resetPassword(newPassword, this.token).pipe(
            this.errorService.handleError,
            switchMap(() => this.popupService.success('Your password has been changed successfully.')),
            tap(() => this.router.navigate(['/sign_in']))
        );
    }
}
