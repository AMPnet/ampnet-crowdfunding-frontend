import { Component } from '@angular/core';
import { UserService } from '../../shared/services/user/user.service';
import { WalletCooperativeOwnershipService } from '../../shared/services/wallet/wallet-cooperative/wallet-cooperative-ownership.service';
import { User, UserRole } from '../../shared/services/user/signup.service';
import { combineLatest, EMPTY, interval, Observable, of } from 'rxjs';
import { filter, map, switchMap, take, tap } from 'rxjs/operators';
import { ArkaneService } from '../../shared/services/arkane.service';
import { PopupService } from '../../shared/services/popup.service';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InterpolatePipe } from '../../shared/pipes/interpolate.pipe';

@Component({
    selector: 'app-ownership',
    templateUrl: './ownership.component.html',
    styleUrls: ['./ownership.component.scss']
})
export class OwnershipComponent {
    userRole = UserRole;

    user$ = this.userService.user$;

    platformManagerForm: FormGroup;
    tokenIssuerForm: FormGroup;

    constructor(private userService: UserService,
                private ownershipService: WalletCooperativeOwnershipService,
                private arkaneService: ArkaneService,
                private fb: FormBuilder,
                private translate: TranslateService,
                private interpolatePipe: InterpolatePipe,
                private popupService: PopupService) {
        this.platformManagerForm = fb.group({
            email: ['', [Validators.required, Validators.email]]
        });
        this.tokenIssuerForm = fb.group({
            email: ['', [Validators.required, Validators.email]]
        });
    }

    transferOwnership(form: FormGroup, role: UserRole.PLATFORM_MANAGER | UserRole.TOKEN_ISSUER) {
        return () => {
            return this.userService.getUserByEmail(form.get('email').value).pipe(
                switchMap(user => user ? this.askForConfirmation(user, role) : this.popupService.error(
                    this.translate.instant('admin.platform_roles.user_not_found')
                ).pipe(switchMap(() => EMPTY))),
                switchMap(user => this.ownershipService.executeOwnershipChangeTransaction(user.uuid, role)),
                switchMap(txInfo => this.arkaneService.signAndBroadcastTx(txInfo)),
                switchMap(() => this.waitForRoleChange(role)),
                switchMap(() => this.popupService.success(
                    this.translate.instant('admin.platform_roles.change_confirmation.success')
                ))
            );
        };
    }

    private askForConfirmation(user: User, transferRole: UserRole.PLATFORM_MANAGER | UserRole.TOKEN_ISSUER): Observable<User> {
        const question = this.interpolatePipe.transform(
            this.translate.instant('admin.platform_roles.change_confirmation.question'),
            ['role', this.translate.instant(`admin.platform_roles.roles.${transferRole.toLowerCase()}`)]
        );

        const userData = this.interpolatePipe.transform(
            this.translate.instant('admin.platform_roles.change_confirmation.user_data'),
            ['first_name', user.first_name],
            ['last_name', user.last_name],
            ['email', user.email],
        );

        return this.popupService.new({
            text: question,
            footer: userData,
            confirmButtonText: this.translate.instant('admin.platform_roles.change_confirmation.yes'),
            showCancelButton: true,
            cancelButtonText: this.translate.instant('admin.platform_roles.change_confirmation.no')
        }).pipe(
            switchMap(res => res.value === true ? of(user) : EMPTY)
        );
    }

    private waitForRoleChange(currentRole: UserRole) {
        return combineLatest([
            interval(3000).pipe(tap(() => this.userService.refreshUser())),
            this.userService.user$
        ]).pipe(
            map(([_, user]) => user),
            filter(user => ![currentRole, UserRole.ADMIN].includes(user.role)),
            take(1),
        );
    }
}
