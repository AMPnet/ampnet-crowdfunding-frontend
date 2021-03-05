// tslint:disable:max-line-length
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NoAuthGuard } from './no-auth.guard';
import { SignInAutoComponent } from './sign-in-auto/sign-in-auto.component';
import { AuthLayoutComponent } from './auth-layout/auth-layout.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { NewInstanceComponent } from './new-instance/new-instance.component';

const routes: Routes = [
    {
        path: '', canActivate: [NoAuthGuard], children: [
            {path: 'sign_in_auto/:email/:password', component: SignInAutoComponent},
        ]
    },
    {
        path: '', canActivate: [NoAuthGuard], component: AuthLayoutComponent, children: [
            {path: 'sign_up', component: SignUpComponent},
            {path: 'sign_in', component: SignInComponent},
            {path: 'forgot_password', component: ForgotPasswordComponent},
            {path: 'reset_password', component: ResetPasswordComponent},
            {path: 'new_instance', component: NewInstanceComponent},
        ]
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AuthRoutingModule {
}
