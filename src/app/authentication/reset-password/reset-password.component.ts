import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SignupService } from '../../shared/services/user/signup.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PopupService } from '../../shared/services/popup.service';
import { MustMatch } from '../sign-up/confirm-password-validator';
import { displayBackendErrorRx } from '../../utilities/error-handler';
import { switchMap } from 'rxjs/operators';

@Component({
    selector: 'app-reset-password',
    templateUrl: './reset-password.component.html',
    styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
    resetPasswordForm: FormGroup;
    token: string;

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

    ngOnInit(): void {
        this.token = this.route.snapshot.queryParams.token;
    }

    onSubmitPasswordForm() {
        const newPassword = this.resetPasswordForm.get('password').value;

        return this.signUpService.resetPassword(newPassword, this.token).pipe(
            displayBackendErrorRx(),
            switchMap(() => this.popupService.new({
                type: 'success',
                title: 'Success',
                text: 'Your password has been changed successfully.'
            })),
            switchMap(() => this.router.navigate(['']))
        );
    }
}
